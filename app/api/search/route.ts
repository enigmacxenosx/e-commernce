import { type NextRequest, NextResponse } from "next/server"
import { PlatformAPI, type SearchParams } from "@/lib/api/platforms"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const params: SearchParams = {
      query: searchParams.get("q") || "",
      category: searchParams.get("category") || undefined,
      platform: searchParams.get("platform") || undefined,
      page: Number.parseInt(searchParams.get("page") || "1"),
      limit: Number.parseInt(searchParams.get("limit") || "20"),
    }

    console.log("[enosx] Search API called with params:", params)

    let results = []

    // Search based on platform filter
    if (params.platform && params.platform !== "all") {
      switch (params.platform) {
        case "jumia":
          results = await PlatformAPI.searchJumia(params)
          break
        case "kilimall":
          results = await PlatformAPI.searchKilimall(params)
          break
        case "jiji":
          results = await PlatformAPI.searchJiji(params)
          break
        default:
          results = await PlatformAPI.searchAllPlatforms(params)
      }
    } else {
      // Search all platforms
      results = await PlatformAPI.searchAllPlatforms(params)
    }

    // Sanitize results to ensure JSON serialization
    const sanitizedResults = (results || []).map((product) => ({
      id: String(product?.id || ""),
      name: String(product?.name || ""),
      price: typeof product?.price === "number" ? product.price : 0,
      currency: String(product?.currency || "KES"),
      image: String(product?.image || ""),
      images: Array.isArray(product?.images) ? product.images.map(String) : [String(product?.image || "")],
      platform: String(product?.platform || ""),
      category: String(product?.category || ""),
      availability: Boolean(product?.availability),
      externalUrl: String(product?.externalUrl || ""),
      description: product?.description ? String(product.description) : "",
      brand: product?.brand ? String(product.brand) : "",
      specifications: typeof product?.specifications === "object" ? product.specifications : {},
      rating: typeof product?.rating === "number" ? product.rating : 0,
      reviewCount: typeof product?.reviewCount === "number" ? product.reviewCount : 0,
      inStock: typeof product?.inStock === "number" ? product.inStock : 0,
    }))

    // Cache results in database for future reference (non-blocking)
    if (sanitizedResults.length > 0) {
      try {
        const supabase = createClient()
        for (const product of sanitizedResults) {
          try {
            await supabase.from("products").upsert(
              {
                external_id: product.id,
                platform: product.platform,
                name: product.name,
                description: product.description,
                price: product.price,
                currency: product.currency,
                image_url: product.image,
                images: product.images,
                specifications: product.specifications,
                rating: product.rating,
                review_count: product.reviewCount,
                in_stock: product.inStock,
                category: product.category,
                brand: product.brand,
                availability: product.availability,
                external_url: product.externalUrl,
                last_updated: new Date().toISOString(),
              },
              {
                onConflict: "external_id,platform",
              },
            )
          } catch (productError) {
            console.error("[enosx] Error upserting product:", productError)
            // Continue without failing the request
          }
        }
        console.log("[enosx] Cached", sanitizedResults.length, "products in database")
      } catch (cacheError) {
        console.error("[enosx] Error caching products:", cacheError)
        // Don't fail the request if caching fails
      }
    }

    return NextResponse.json({
      success: true,
      data: sanitizedResults,
      total: sanitizedResults.length,
      page: params.page,
      limit: params.limit,
    })
  } catch (error) {
    console.error("[enosx] Search API error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to search products", data: [] },
      { status: 500 }
    )
  }
}
