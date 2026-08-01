import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

const POPULAR_SEARCHES = [
  "iPhone",
  "Samsung Galaxy",
  "Laptops",
  "Headphones",
  "Tablets",
  "Smartwatch",
  "Camera",
  "Power bank",
  "SSD",
  "RAM",
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase() || ""

    if (!query || query.length < 2) {
      // Return popular searches if no query
      return NextResponse.json({
        success: true,
        suggestions: POPULAR_SEARCHES.map((search) => ({
          type: "popular",
          text: search,
          value: search,
        })),
      })
    }

    const supabase = createClient()

    // Get matching brands and products from database
    const { data: products, error } = await supabase
      .from("products")
      .select("name, brand, category")
      .or(`name.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(20)

    if (error) {
      console.error("[enosx] Error fetching suggestions:", error)
      // Fall back to popular searches
      return NextResponse.json({
        success: true,
        suggestions: POPULAR_SEARCHES.filter((s) => s.toLowerCase().includes(query)).map((search) => ({
          type: "popular",
          text: search,
          value: search,
        })),
      })
    }

    const suggestions: any[] = []
    const seenValues = new Set<string>()

    // Add matching product names
    if (products) {
      products.forEach((product) => {
        if (product.name && !seenValues.has(product.name.toLowerCase())) {
          suggestions.push({
            type: "product",
            text: product.name,
            value: product.name,
          })
          seenValues.add(product.name.toLowerCase())
        }

        if (product.brand && !seenValues.has(product.brand.toLowerCase())) {
          suggestions.push({
            type: "brand",
            text: product.brand,
            value: product.brand,
          })
          seenValues.add(product.brand.toLowerCase())
        }

        if (product.category && !seenValues.has(product.category.toLowerCase())) {
          suggestions.push({
            type: "category",
            text: product.category,
            value: product.category,
          })
          seenValues.add(product.category.toLowerCase())
        }
      })
    }

    // Add popular searches that match
    POPULAR_SEARCHES.forEach((search) => {
      if (search.toLowerCase().includes(query) && !seenValues.has(search.toLowerCase())) {
        suggestions.push({
          type: "popular",
          text: search,
          value: search,
        })
        seenValues.add(search.toLowerCase())
      }
    })

    return NextResponse.json({
      success: true,
      suggestions: suggestions.slice(0, 10), // Limit to 10 suggestions
    })
  } catch (error) {
    console.error("[enosx] Suggestions API error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch suggestions", suggestions: [] },
      { status: 500 }
    )
  }
}
