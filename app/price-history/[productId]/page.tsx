"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, TrendingDown, TrendingUp, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { analyzeHistory, getAllPriceHistories, getPriceHistory, clearPriceHistory } from "@/lib/price-history-store"
import PriceHistoryChart from "@/components/price-history-chart"

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(price)

export default function PriceHistoryPage({ params }: { params: { productId: string } }) {
  const [histories, setHistories] = useState(getAllPriceHistories())

  const target = getPriceHistory(params.productId)
  const analysis = analyzeHistory(target)

  useEffect(() => {
    setHistories(getAllPriceHistories())
  }, [])

  if (histories.length === 0) {
    return (
      <div className="min-h-[60vh] mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-lg font-bold text-[#102235] dark:text-[#f5f0e6]">No tracked prices yet</p>
        <p className="mt-2 text-sm text-[#718092]">Browse products on Jumia, Kilimall and Jiji to start building price history.</p>
        <Button asChild className="mt-6">
          <Link href="/search">Start browsing</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight text-[#102235] dark:text-[#f5f0e6]">Price history</h1>
        <Button variant="outline" size="sm" onClick={() => { clearPriceHistory(); setHistories([]) }} className="text-[#b74f62]">
          <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Clear
        </Button>
      </div>
      <p className="mt-1 text-sm text-[#718092]">Prices observed while browsing Enosx Tech Hub — tracked locally on your device.</p>

      <div className="mt-8 space-y-6">
        {histories.map((h) => {
          const a = analyzeHistory(h)
          const isTarget = h.productId === params.productId
          const trendIcon =
            a?.trend === "down" ? <TrendingDown className="h-4 w-4 text-green-500" /> : a?.trend === "up" ? <TrendingUp className="h-4 w-4 text-red-500" /> : <Minus className="h-4 w-4 text-slate-400" />
          return (
            <section
              key={h.productId}
              id={isTarget ? "tracked" : undefined}
              className={`rounded-2xl border bg-white/70 p-5 dark:bg-[#182b40] ${isTarget ? "border-[#3677ff]/50 ring-2 ring-[#3677ff]/30" : "border-[#102235]/10 dark:border-white/10"}`}
            >
              <div className="flex items-start gap-4">
                <Image src={h.image} alt={h.productName} width={64} height={64} className="h-16 w-16 rounded-xl object-cover" unoptimized />
                <div className="flex-1">
                  <h2 className="line-clamp-1 text-sm font-black text-[#102235] dark:text-[#f5f0e6]">{h.productName}</h2>
                  <p className="mt-0.5 text-xs text-[#718092]">{h.platform}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs font-bold text-[#102235] dark:text-[#f5f0e6]">
                    <span>Latest {formatPrice(h.points[h.points.length - 1].price)}</span>
                    <span className="text-[#718092]">Low {formatPrice(a?.lowest ?? h.points[h.points.length - 1].price)}</span>
                    <span className="flex items-center gap-1">
                      {trendIcon}
                      <span className={a?.trend === "down" ? "text-green-500" : a?.trend === "up" ? "text-red-500" : "text-slate-400"}>{a?.trend ?? "new"}</span>
                    </span>
                  </div>
                </div>
              </div>
              <PriceHistoryChart productId={h.productId} />
            </section>
          )
        })}
      </div>

      {target ? (
        <Button asChild className="mt-8">
          <Link href={`/product/${params.productId}`}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to product
          </Link>
        </Button>
      ) : null}
    </div>
  )
}
