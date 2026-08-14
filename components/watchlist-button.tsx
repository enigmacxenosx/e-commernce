"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWatchlistStore } from "@/lib/watchlist-store"

export function WatchlistButton() {
  const count = useWatchlistStore((state) => state.items.length)
  return <Button variant="ghost" size="icon" className="relative" asChild><Link href="/watchlist" aria-label="Open saved products"><Heart className="h-4 w-4" />{count > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{count > 9 ? "9+" : count}</span>}</Link></Button>
}
