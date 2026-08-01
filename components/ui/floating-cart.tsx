"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export function FloatingCart() {
  const { items, getTotalItems } = useCartStore()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const totalItems = getTotalItems()

  useEffect(() => {
    setIsVisible(totalItems > 0)
    if (totalItems > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [totalItems])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => router.push("/cart")}
        className={`
          h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl
          transition-all duration-300 transform hover:scale-110
          ${isAnimating ? "animate-bounce" : ""}
        `}
        size="lg"
      >
        <div className="relative">
          <ShoppingCart className="h-6 w-6 text-white" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </div>
      </Button>
    </div>
  )
}
