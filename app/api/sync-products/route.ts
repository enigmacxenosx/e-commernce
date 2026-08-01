import { NextResponse } from "next/server"
import { PlatformAPI } from "@/lib/api/platforms"
import { supabase } from "@/lib/supabase/client"

// Background job to sync products from all platforms
export async function POST() {
  try {
    console.log("[enosx] Starting product sync job...")

    const categories = ["smartphones", "laptops", "headphones", "tablets", "accessories"]
    let totalSynced = 0

    for (const category of categories) {
      try {
        const products = await PlatformAPI.searchAllPlatforms({
          query: "",
          category,
          limit: 50,
        })

        // Batch insert/update products
        if (products.length > 0) {
          const { error } = await supabase.from("products").upsert(
            products.map((product) => ({
              external_id: product.id,
              platform: product.platform,
              name: product.name,
              description: product.description,
              price: product.price,
              currency: product.currency,
              image_url: product.image,
              category: product.category,
              brand: product.brand,
              availability: product.availability,
              external_url: product.externalUrl,
              last_updated: new Date().toISOString(),
            })),
            { onConflict: "external_id,platform" },
          )

          if (error) {
            console.error(`[enosx] Error syncing ${category}:`, error)
          } else {
            totalSynced += products.length
            console.log(`[enosx] Synced ${products.length} ${category} products`)
          }
        }
      } catch (categoryError) {
        console.error(`[enosx] Error processing category ${category}:`, categoryError)
      }
    }

    console.log(`[enosx] Product sync completed. Total synced: ${totalSynced}`)

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${totalSynced} products`,
      totalSynced,
    })
  } catch (error) {
    console.error("[enosx] Product sync error:", error)
    return NextResponse.json({ success: false, error: "Failed to sync products" }, { status: 500 })
  }
}
