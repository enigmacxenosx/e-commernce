"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Heart, LineChart, Scale, ShoppingBag, Star } from "lucide-react"
import { recordPrice } from "@/lib/price-history-store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import { useWatchlistStore } from "@/lib/watchlist-store"
import { useComparison } from "@/hooks/useComparison"
import { toast } from "@/hooks/use-toast"

interface EnhancedProductCardProps {
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    images?: string[]
    platform: string
    rating?: number
    reviews?: number
    inStock: boolean
    externalUrl: string
  }
}

const platformStyles: Record<string, { label: string; className: string }> = {
  jumia: { label: "Jumia", className: "bg-[#fff0e5] text-[#bf5a20]" },
  kilimall: { label: "Kilimall", className: "bg-[#ffe8ed] text-[#b93753]" },
  jiji: { label: "Jiji", className: "bg-[#e3f8ed] text-[#197b52]" },
}

export function EnhancedProductCard({ product }: EnhancedProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCartStore()
  const { addItem: addToWatchlist, removeItem: removeFromWatchlist, isWatched } = useWatchlistStore()
  const { addItem: addToComparison, isInComparison, isFull } = useComparison()
  const watched = isWatched(product.id)
  recordPrice({ id: product.id, name: product.name, price: product.price, currency: product.currency || "KES", image: product.image, images: [], platform: product.platform, category: "", availability: product.inStock, externalUrl: product.externalUrl })
  const productImages = product.images?.length ? product.images : [product.image]
  const platform = platformStyles[product.platform.toLowerCase()] || { label: product.platform, className: "bg-[#e7efff] text-[#3677ff]" }
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0
  const lookup = { id: product.id, platform: product.platform } as any
  const compared = isInComparison(lookup)

  const formatPrice = (price: number) => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", minimumFractionDigits: 0 }).format(price)

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsAdding(true)
    window.setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        currency: "KES",
        category: "",
        image: product.image,
        platform: product.platform,
        externalUrl: product.externalUrl,
      })
      toast({ title: "Added to cart", description: `${product.name} is ready in your cart.` })
      setIsAdding(false)
    }, 250)
  }

  const handleAddToComparison = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      currency: "KES",
      image: product.image,
      images: productImages,
      platform: product.platform,
      category: "",
      availability: product.inStock,
      externalUrl: product.externalUrl,
      description: "",
      brand: "",
      specifications: {},
      rating: product.rating || 0,
      reviewCount: product.reviews || 0,
      inStock: product.inStock ? 1 : 0,
    }

    if (compared) {
      toast({ title: "Already in compare", description: `${product.name} is already on your shortlist.` })
      return
    }
    if (isFull) {
      toast({ title: "Compare list is full", description: "Remove one product before adding another.", variant: "destructive" })
      return
    }
    if (addToComparison(productData)) toast({ title: "Added to compare", description: `${product.name} joined your shortlist.` })
  }

  return (
    <Card className="group relative overflow-hidden rounded-[1.6rem] border-[#102235]/10 bg-white/70 shadow-[0_16px_40px_-28px_rgba(16,34,53,0.65)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#3677ff]/40 hover:shadow-[0_22px_50px_-26px_rgba(16,34,53,0.5)] dark:border-white/10 dark:bg-[#182b40]">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#eae8df] dark:bg-[#20364b]">
          <Image src={productImages[0] || "/placeholder.svg"} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${platform.className}`}>{platform.label}</span>
            {discount > 0 && <span className="rounded-full bg-[#dfff5b] px-2.5 py-1 text-[10px] font-black text-[#102235]">-{discount}%</span>}
          </div>
          <button
            type="button"
            aria-label={watched ? "Remove from saved products" : "Save product"}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              if (watched) {
                removeFromWatchlist(product.id)
                toast({ title: "Removed from saved products" })
              } else {
                addToWatchlist({ id: product.id, name: product.name, price: product.price, currency: "KES", image: product.image, platform: product.platform, externalUrl: product.externalUrl, inStock: product.inStock })
                toast({ title: "Saved for later", description: "Find it anytime in your saved products." })
              }
            }}
            className={`absolute right-3 top-12 grid h-9 w-9 place-items-center rounded-full border border-white/50 bg-white/85 backdrop-blur transition-colors dark:bg-[#102235]/85 ${watched ? "text-[#e0526d]" : "text-[#5e6c7b] hover:text-[#e0526d]"}`}
          >
            <Heart className={`h-4 w-4 ${watched ? "fill-current" : ""}`} />
          </button>
          <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100">
            <Button type="button" size="sm" onClick={handleAddToCart} disabled={!product.inStock || isAdding} className="pressable flex-1 rounded-xl bg-[#102235] text-xs font-black text-white hover:bg-[#1d3852] dark:bg-[#dfff5b] dark:text-[#102235] dark:hover:bg-[#cbed4b]">
              <ShoppingBag className="mr-1.5 h-3.5 w-3.5" /> {isAdding ? "Adding" : "Add to cart"}
            </Button>
            <Button type="button" size="icon" variant="secondary" onClick={handleAddToComparison} aria-label="Add to compare" className={`rounded-xl ${compared ? "bg-[#dfff5b] text-[#102235]" : "bg-white/90 text-[#102235]"}`}>
              <Scale className="h-4 w-4" />
            </Button>
            <Button type="button" size="icon" variant="secondary" asChild aria-label="View price history" className="rounded-xl bg-white/90 text-[#102235]">
              <Link href={`/price-history/${product.id}`}>
                <LineChart className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#718092]">Verified listing</span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-[#a87800]"><Star className="h-3 w-3 fill-current" /> {product.rating || "New"}</span>
          </div>
          <h3 className="mt-3 line-clamp-2 min-h-10 text-sm font-black leading-5 text-[#102235] transition-colors group-hover:text-[#3677ff] dark:text-[#f5f0e6]">{product.name}</h3>
          <div className="mt-5 flex items-end justify-between gap-2">
            <div>
              <p className="text-lg font-black tracking-[-0.04em] text-[#102235] dark:text-[#f5f0e6]">{formatPrice(product.price)}</p>
              {product.originalPrice && <p className="text-xs text-[#8491a0] line-through">{formatPrice(product.originalPrice)}</p>}
            </div>
            <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.12em] ${product.inStock ? "text-[#198455]" : "text-[#b74f62]"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${product.inStock ? "bg-[#43c78b]" : "bg-[#e0526d]"}`} /> {product.inStock ? "In stock" : "Sold out"}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#102235]/10 pt-3 text-[11px] font-semibold text-[#718092] dark:border-white/10 dark:text-[#aebdca]">
            <span>{product.reviews || 0} reviews</span>
            <span className="inline-flex items-center gap-1">View details <ArrowUpRight className="h-3.5 w-3.5" /></span>
          </div>
        </div>
      </Link>
    </Card>
  )
}
