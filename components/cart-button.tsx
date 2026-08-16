"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import Link from "next/link"

export function CartButton() {
  const totalItems = useCartStore((state) => state.getTotalItems())

  return (
    <Link href="/cart">
      <Button variant="ghost" size="sm" className="relative rounded-full px-3 font-bold text-[#102235] hover:bg-black/5 dark:text-[#f5f0e6] dark:hover:bg-white/10">
        <ShoppingCart className="mr-1.5 h-4 w-4" />
        <span className="hidden sm:inline">Cart</span>
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#dfff5b] text-xs font-black text-[#102235]">
            {totalItems}
          </span>
        )}
      </Button>
    </Link>
  )
}
