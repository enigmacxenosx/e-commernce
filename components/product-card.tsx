"use client"

import Image from "next/image"
import { ShoppingCart, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/lib/cart-store"
import { toast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  currency: string
  image: string
  platform: string
  category: string
  availability: boolean
  externalUrl?: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "jumia":
        return "bg-orange-100 text-orange-800"
      case "kilimall":
        return "bg-red-100 text-red-800"
      case "jiji":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      image: product.image,
      platform: product.platform,
      category: product.category,
      externalUrl: product.externalUrl || `https://${product.platform}.com/product/${product.id}`,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="relative mb-4">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-48 object-cover rounded-lg"
          />
          <Badge className={`absolute top-2 right-2 ${getPlatformColor(product.platform)}`}>{product.platform}</Badge>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">{product.category}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">{formatPrice(product.price, product.currency)}</span>
            {product.availability && <span className="text-sm text-green-600 font-medium">In Stock</span>}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 space-y-2">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={handleAddToCart}
          disabled={!product.availability}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
        <Button variant="outline" className="w-full bg-transparent">
          <ExternalLink className="h-4 w-4 mr-2" />
          View on {product.platform}
        </Button>
      </CardFooter>
    </Card>
  )
}
