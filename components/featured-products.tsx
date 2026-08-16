"use client"

import { useEffect, useState } from "react"
import { EnhancedProductCard } from "@/components/enhanced-product-card"
import type { Product } from "@/lib/api/platforms"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Fetch some popular products as featured items
        const response = await fetch("/api/search?q=smartphone&limit=8")
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        
        const data = await response.json()

        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProducts(data.data.slice(0, 8)) // Take first 8 products for better variety
        }
      } catch (error) {
        console.error("[enosx] Error fetching featured products:", error)
        setProducts([]) // Set empty array on error
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="w-full px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Featured Electronics</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the latest and most popular electronics from our partner platforms
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-card rounded-lg p-3 sm:p-4 animate-pulse border border-muted">
                <div className="bg-muted h-40 sm:h-48 rounded-lg mb-4"></div>
                <div className="bg-muted h-4 rounded mb-2"></div>
                <div className="bg-muted h-4 rounded w-2/3 mb-3"></div>
                <div className="bg-muted h-6 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="w-full px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">Featured Electronics</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the latest and most popular electronics from our partner platforms
          </p>
        </div>

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
              {products.map((product) => (
                <EnhancedProductCard
                  key={`${product.platform}-${product.id}`}
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    images: product.images,
                    platform: product.platform,
                    rating: product.rating,
                    reviews: product.reviewCount,
                    inStock: (product.inStock ?? 0) > 0,
                    externalUrl: product.externalUrl,
                  }}
                />
              ))}
            </div>

            <div className="text-center">
              <button
                className="gradient-button text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02]"
                onClick={() => (window.location.href = "/search?q=electronics")}
              >
                View All Products
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found. Try searching with different keywords.</p>
          </div>
        )}
      </div>
    </section>
  )
}
