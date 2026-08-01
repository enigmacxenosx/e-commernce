"use client"

import Image from "next/image"
import { Minus, Plus, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCartStore, type CartItem as CartItemType } from "@/lib/cart-store"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

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

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Product Image */}
          <div className="relative">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              width={100}
              height={100}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <Badge className={`absolute -top-1 -right-1 text-xs ${getPlatformColor(item.platform)}`}>
              {item.platform}
            </Badge>
          </div>

          {/* Product Details */}
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.category}</p>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-blue-600">{formatPrice(item.price, item.currency)}</span>
              <Button variant="ghost" size="sm" onClick={() => window.open(item.externalUrl, "_blank")}>
                <ExternalLink className="h-3 w-3 mr-1" />
                View on {item.platform}
              </Button>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Total Price */}
          <div className="text-right">
            <div className="font-bold text-lg">{formatPrice(item.price * item.quantity, item.currency)}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
