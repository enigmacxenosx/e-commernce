"use client"

import { useEffect, useState } from "react"

export function useComparison() {
  const [isHydrated, setIsHydrated] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    setIsHydrated(true)
    try {
      const raw = localStorage.getItem("enosx-comparison")
      const items = raw ? JSON.parse(raw) : []
      setCount(Array.isArray(items) ? items.length : 0)
    } catch (e) {
      setCount(0)
    }
  }, [])

  return { count, isHydrated }
}
