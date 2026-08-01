"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ExternalLink, Heart, Star, Eye, Scale } from 'lucide-react'
import { useCartStore } from "@/lib/cart-store"
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

export function EnhancedProductCard({ product }: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addItem } = useCartStore()
  const { addItem: addToComparison, isInComparison, isFull } = useComparison()

  // <CHANGE> Use multiple images if available, fallback to single image
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)

    // Simulate API delay
    setTimeout(() => {
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

      setIsAdding(false)
    }, 500)
  }

  // <CHANGE> Auto-cycle through images on hover
  const handleMouseEnter = () => {
    setIsHovered(true)
    if (productImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
      }, 1000)
      
      // Store interval ID to clear it later
      ;(document as any).imageInterval = interval
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setCurrentImageIndex(0)
    if ((document as any).imageInterval) {
      clearInterval((document as any).imageInterval)
    }
  }

  const handleAddToComparison = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      currency: "KES",
      image: product.image,
      images: product.images || [product.image],
      platform: product.platform,
      category: "",
      availability: product.inStock,
      externalUrl: product.externalUrl,
      description: "",
      brand: "",
      specifications: {},
      rating: product.rating || 0,
      reviewCount: product.reviews || 0,
      inStock: product.inStock,
    }

    if (isInComparison(productData)) {
      toast({
        title: "Already in comparison",
        description: `${product.name} is already in your comparison.`,
      })
      return
    }

    if (isFull) {
      toast({
        title: "Comparison limit reached",
        description: "You can compare up to 5 products. Remove one to add another.",
        variant: "destructive",
      })
      return
    }

    const added = addToComparison(productData)
    if (added) {
      toast({
        title: "Added to comparison!",
        description: `${product.name} has been added to your comparison.`,
      })
    }
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  // <CHANGE> Platform trust and seller information
  const platformInfo: Record<string, { color: string; bgColor: string; trustScore: string; badge: string }> = {
    jumia: { 
      color: "bg-yellow-100 text-yellow-800", 
      bgColor: "bg-yellow-500", 
      trustScore: "4.5/5",
      badge: "Verified Seller"
    },
    kilimall: { 
      color: "bg-blue-100 text-blue-800", 
      bgColor: "bg-blue-500", 
      trustScore: "4.3/5",
      badge: "Trusted Store"
    },
    jiji: { 
      color: "bg-purple-100 text-purple-800", 
      bgColor: "bg-purple-500", 
      trustScore: "4.2/5",
      badge: "Quality Assured"
    },
  }

  const currentPlatform = platformInfo[product.platform.toLowerCase()] || platformInfo.jumia

  return (
    <Link href={`/product/${product.id}`}>
      <Card
        className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={productImages[currentImageIndex] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Overlay on hover */}
          <div
            className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
          />

          {/* <CHANGE> Enhanced Badges with Platform Trust Info */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">-{discountPercentage}%</Badge>
            )}
            <Badge className={`${currentPlatform.color} text-xs font-semibold capitalize`}>
              {product.platform}
            </Badge>
            <Badge className="bg-green-100 text-green-800 text-xs flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-green-600 rounded-full"></span>
              Verified
            </Badge>
          </div>

          {/* <CHANGE> Image counter for multiple images */}
          {productImages.length > 1 && (
            <div className="absolute top-2 right-12 bg-black/50 text-white px-2 py-1 rounded text-xs">
              {currentImageIndex + 1}/{productImages.length}
            </div>
          )}

          {/* Like button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsLiked(!isLiked)
            }}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${
              isLiked ? "bg-red-500 text-white" : "bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white"
            } ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          </button>

          {/* Quick actions */}
          <div
            className={`absolute bottom-2 left-2 right-2 flex gap-2 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isAdding ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add
                </>
              )}
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={handleAddToComparison}
              disabled={isFull && !isInComparison({ id: product.id, platform: product.platform } as any)}
              className={`bg-white/90 hover:bg-white ${
                isInComparison({ id: product.id, platform: product.platform } as any)
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : ""
              }`}
              title={isFull && !isInComparison({ id: product.id, platform: product.platform } as any) ? "Comparison limit reached" : "Add to comparison"}
            >
              <Scale className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.open(product.externalUrl, "_blank")
              }}
              className="bg-white/90 hover:bg-white"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-3 sm:p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* <CHANGE> Platform Trust Info */}
          <div className="mb-2 p-2 bg-muted/50 rounded text-xs">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-muted-foreground font-medium">{product.platform}</span>
              <span className="text-green-600 font-semibold">{currentPlatform.badge}</span>
            </div>
            <div className="text-muted-foreground">Trust Score: {currentPlatform.trustScore}</div>
          </div>

          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating!) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.reviews || 0})</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <Badge variant={product.inStock ? "default" : "destructive"} className="text-xs w-fit">
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
