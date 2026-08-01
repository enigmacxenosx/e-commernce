"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ShoppingCart, ExternalLink, X, TrendingDown, TrendingUp } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { toast } from "@/hooks/use-toast"
import type { Product } from "@/lib/api/platforms"

interface ComparisonTableProps {
  products: Product[]
  onRemove: (comparisonId: string) => void
}

export function ComparisonTable({ products, onRemove }: ComparisonTableProps) {
  const { addItem } = useCartStore()

  const formatPrice = (price: number, currency: string = "KES") => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "jumia":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
      case "kilimall":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      case "jiji":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      platform: product.platform,
      externalUrl: product.externalUrl,
      quantity: 1,
    })

    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const minPrice = Math.min(...products.map((p) => p.price))
  const maxPrice = Math.max(...products.map((p) => p.price))
  const priceRange = maxPrice - minPrice

  // Get all unique keys from products
  const allKeys = new Set<string>()
  products.forEach((product) => {
    if (product.specifications) {
      Object.keys(product.specifications).forEach((key) => {
        allKeys.add(key)
      })
    }
  })

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted/50 border-b-2 border-border">
            <th className="sticky left-0 z-10 bg-muted/50 p-4 text-left font-semibold text-foreground min-w-[200px]">
              Product Details
            </th>
            {products.map((product) => (
              <th
                key={`${product.platform}-${product.id}`}
                className="p-4 text-center font-semibold text-foreground min-w-[280px] border-l border-border"
              >
                <div className="space-y-2">
                  <button
                    onClick={() => onRemove(`${product.platform}-${product.id}`)}
                    className="float-right p-1 hover:bg-destructive/10 rounded"
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </button>
                  <div className="clear-both"></div>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Images Row */}
          <tr className="border-b border-border hover:bg-muted/20">
            <td className="sticky left-0 z-10 bg-background p-4 font-medium text-foreground">Images</td>
            {products.map((product) => (
              <td key={`image-${product.platform}-${product.id}`} className="p-4 border-l border-border text-center">
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </td>
            ))}
          </tr>

          {/* Name Row */}
          <tr className="border-b border-border hover:bg-muted/20">
            <td className="sticky left-0 z-10 bg-background p-4 font-medium text-foreground">Product Name</td>
            {products.map((product) => (
              <td key={`name-${product.platform}-${product.id}`} className="p-4 border-l border-border">
                <div className="space-y-2">
                  <p className="font-semibold text-foreground text-sm line-clamp-2">{product.name}</p>
                  <Badge className={getPlatformColor(product.platform)}>{product.platform}</Badge>
                </div>
              </td>
            ))}
          </tr>

          {/* Price Row */}
          <tr className="border-b border-border bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/30">
            <td className="sticky left-0 z-10 bg-blue-50/50 dark:bg-blue-950/20 p-4 font-semibold text-foreground">
              Price
            </td>
            {products.map((product) => {
              const isLowest = product.price === minPrice && priceRange > 0
              const isPriceHigh = product.price === maxPrice && priceRange > 0

              return (
                <td
                  key={`price-${product.platform}-${product.id}`}
                  className="p-4 border-l border-border text-center"
                >
                  <div className="space-y-2">
                    <div className="text-lg font-bold text-foreground">
                      {formatPrice(product.price, product.currency)}
                    </div>
                    {isLowest && priceRange > 0 && (
                      <Badge variant="outline" className="bg-green-50 dark:bg-green-950/20 border-green-200 text-green-700 dark:text-green-400">
                        <TrendingDown className="h-3 w-3 mr-1" /> Lowest
                      </Badge>
                    )}
                    {isPriceHigh && priceRange > 0 && (
                      <Badge variant="outline" className="bg-red-50 dark:bg-red-950/20 border-red-200 text-red-700 dark:text-red-400">
                        <TrendingUp className="h-3 w-3 mr-1" /> Highest
                      </Badge>
                    )}
                  </div>
                </td>
              )
            })}
          </tr>

          {/* Rating Row */}
          <tr className="border-b border-border hover:bg-muted/20">
            <td className="sticky left-0 z-10 bg-background p-4 font-medium text-foreground">Rating</td>
            {products.map((product) => (
              <td key={`rating-${product.platform}-${product.id}`} className="p-4 border-l border-border text-center">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-foreground">
                    {product.rating ? `${product.rating.toFixed(1)}/5` : "N/A"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ({product.reviewCount || 0} reviews)
                  </div>
                </div>
              </td>
            ))}
          </tr>

          {/* Availability Row */}
          <tr className="border-b border-border hover:bg-muted/20">
            <td className="sticky left-0 z-10 bg-background p-4 font-medium text-foreground">Availability</td>
            {products.map((product) => (
              <td key={`stock-${product.platform}-${product.id}`} className="p-4 border-l border-border text-center">
                <Badge
                  variant={product.inStock ? "default" : "destructive"}
                  className={product.inStock ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </td>
            ))}
          </tr>

          {/* Category Row */}
          <tr className="border-b border-border hover:bg-muted/20">
            <td className="sticky left-0 z-10 bg-background p-4 font-medium text-foreground">Category</td>
            {products.map((product) => (
              <td key={`category-${product.platform}-${product.id}`} className="p-4 border-l border-border text-center">
                <p className="text-sm text-foreground">{product.category || "N/A"}</p>
              </td>
            ))}
          </tr>

          {/* Specifications */}
          {Array.from(allKeys).map((key) => (
            <tr key={`spec-${key}`} className="border-b border-border hover:bg-muted/20">
              <td className="sticky left-0 z-10 bg-background p-4 font-medium text-foreground text-sm capitalize">
                {key.replace(/_/g, " ")}
              </td>
              {products.map((product) => (
                <td
                  key={`spec-${key}-${product.platform}-${product.id}`}
                  className="p-4 border-l border-border text-center text-sm text-foreground"
                >
                  {product.specifications?.[key] ? String(product.specifications[key]) : "—"}
                </td>
              ))}
            </tr>
          ))}

          {/* Actions Row */}
          <tr className="bg-muted/30">
            <td className="sticky left-0 z-10 bg-muted/30 p-4 font-medium text-foreground">Actions</td>
            {products.map((product) => (
              <td
                key={`action-${product.platform}-${product.id}`}
                className="p-4 border-l border-border"
              >
                <div className="flex gap-2 flex-col">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full"
                  >
                    <a href={product.externalUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on {product.platform}
                    </a>
                  </Button>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
