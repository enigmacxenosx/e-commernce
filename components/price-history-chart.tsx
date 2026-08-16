"use client"

import { useEffect, useState } from "react"
import {
  analyzeHistory,
  getPriceHistory,
  type PriceHistoryEntry,
} from "@/lib/price-history-store"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(price)

export default function PriceHistoryChart({ productId }: { productId: string }) {
  const [entry, setEntry] = useState<PriceHistoryEntry | null>(null)

  useEffect(() => {
    setEntry(getPriceHistory(productId))
  }, [productId])

  if (!entry || entry.points.length < 2) return null

  const analysis = analyzeHistory(entry)
  if (!analysis) return null

  const prices = entry.points.map((p) => p.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1
  const w = 260
  const h = 64
  const pts = prices.map((p, i) => ({
    x: (i / (prices.length - 1)) * w,
    y: h - ((p - min) / range) * (h - 8) - 4,
  }))
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")
  const area = `${path} L${w},${h} L0,${h} Z`

  const trendIcon =
    analysis.trend === "down" ? (
      <TrendingDown className="w-4 h-4 text-green-500" />
    ) : analysis.trend === "up" ? (
      <TrendingUp className="w-4 h-4 text-red-500" />
    ) : (
      <Minus className="w-4 h-4 text-slate-400" />
    )

  const trendLabel =
    analysis.trend === "down"
      ? `Down ${analysis.dropPercent}% since first tracked`
      : analysis.trend === "up"
        ? `Up ${analysis.dropPercent}% since first tracked`
        : "Stable since first tracked"

  return (
    <div className="mt-3 border border-border rounded-lg p-3 bg-muted/30">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Price history
        </span>
        <span className="flex items-center gap-1 text-xs font-medium">
          {trendIcon}
          <span
            className={
              analysis.trend === "down"
                ? "text-green-500"
                : analysis.trend === "up"
                  ? "text-red-500"
                  : "text-slate-400"
            }
          >
            {trendLabel}
          </span>
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ph-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#ph-area)" />
        <path d={path} fill="none" stroke="#0ea5e9" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#0ea5e9" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
        <span>
          Lowest {formatPrice(analysis.lowest)} · Highest {formatPrice(analysis.highest)}
        </span>
        <span>{analysis.samples} price samples</span>
      </div>
    </div>
  )
}
