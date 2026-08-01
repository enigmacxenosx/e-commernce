"use client"

import { useEffect, useState } from "react"
import type { Product } from "@/lib/api/platforms"

interface ComparisonItem extends Product {
  comparisonId: string
}

const STORAGE_KEY = "enosx_comparison"
const MAX_ITEMS = 5

export function useComparison() {
  const [items, setItems] = useState<ComparisonItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setItems(parsed)
      }
    } catch (error) {
      console.error("[enosx] Error loading comparison items:", error)
    }
    setIsHydrated(true)
  }, [])

  // Save to localStorage when items change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isHydrated])

  const addItem = (product: Product) => {
    if (items.length >= MAX_ITEMS) {
      return false
    }

    const comparisonId = `${product.platform}-${product.id}`
    const exists = items.some((item) => item.comparisonId === comparisonId)

    if (!exists) {
      setItems([...items, { ...product, comparisonId }])
      return true
    }
    return false
  }

  const removeItem = (comparisonId: string) => {
    setItems(items.filter((item) => item.comparisonId !== comparisonId))
  }

  const clearAll = () => {
    setItems([])
  }

  const isInComparison = (product: Product) => {
    return items.some((item) => item.comparisonId === `${product.platform}-${product.id}`)
  }

  return {
    items,
    addItem,
    removeItem,
    clearAll,
    isInComparison,
    count: items.length,
    isFull: items.length >= MAX_ITEMS,
    isHydrated,
  }
}
