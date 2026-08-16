"use client"

import { useEffect, useState } from "react"
import { ArrowRight, LoaderCircle, Sparkles } from "lucide-react"
import { EnhancedProductCard } from "@/components/enhanced-product-card"
import type { Product } from "@/lib/api/platforms"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/search?q=smartphone&limit=8")
        if (!response.ok) throw new Error(`API error: ${response.status}`)
        const data = await response.json()
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProducts(data.data.slice(0, 8))
        }
      } catch (error) {
        console.error("[enosx] Error fetching featured products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedProducts()
  }, [])

  return (
    <section className="bg-[#f8f3e9] py-16 dark:bg-[#132437] sm:py-24">
      <div className="site-shell">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="eyebrow border-[#3677ff]/20 bg-[#3677ff]/10 text-[#3677ff]"><Sparkles className="h-3.5 w-3.5" /> Fresh from the market</div>
            <h2 className="display-heading mt-5 max-w-xl text-4xl font-black text-[#102235] dark:text-[#f5f0e6] sm:text-6xl">The shortlist.</h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-[#617083] dark:text-[#b9c7d3]">A rotating edit of products worth a closer look, with the marketplace context already attached.</p>
          </div>
          <a href="/search?q=electronics" className="group inline-flex items-center gap-2 text-sm font-black text-[#102235] dark:text-[#dfff5b]">View all products <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => <div key={index} className="aspect-[0.82] animate-pulse rounded-[1.6rem] bg-[#102235]/10 dark:bg-white/10" />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
        ) : (
          <div className="rounded-[1.6rem] border border-dashed border-[#102235]/20 p-12 text-center dark:border-white/20"><LoaderCircle className="mx-auto h-6 w-6 text-[#3677ff]" /><p className="mt-3 text-sm font-semibold text-[#617083] dark:text-[#b9c7d3]">No products found right now. Try another search.</p></div>
        )}
      </div>
    </section>
  )
}
