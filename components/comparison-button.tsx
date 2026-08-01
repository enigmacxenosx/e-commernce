"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Scale } from "lucide-react"
import { useComparison } from "@/hooks/useComparison"

export function ComparisonButton() {
  const { count, isHydrated } = useComparison()

  if (!isHydrated || count === 0) {
    return null
  }

  return (
    <Link href="/compare">
      <Button
        className="fixed bottom-6 right-6 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full h-14 w-14 flex items-center justify-center z-40"
        size="icon"
      >
        <div className="relative">
          <Scale className="h-6 w-6" />
          {count > 0 && (
            <Badge
              className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-red-500 hover:bg-red-600"
              variant="destructive"
            >
              {count}
            </Badge>
          )}
        </div>
      </Button>
    </Link>
  )
}
