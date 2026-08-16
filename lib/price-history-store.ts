// Price History store — tracks observed prices per product over time.
// Persists to localStorage so shoppers can see price trends for watched products.
import { Product } from "@/lib/api/platforms"

export interface PricePoint {
  price: number
  currency: string
  date: string // ISO date, YYYY-MM-DD
  platform: string
}

const STORAGE_KEY = "enosx-price-history-v1"

export interface PriceHistoryEntry {
  productId: string
  productName: string
  image: string
  platform: string
  points: PricePoint[]
}

function loadAll(): Record<string, PriceHistoryEntry> {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveAll(all: Record<string, PriceHistoryEntry>) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    }
  } catch {
    // storage unavailable — ignore
  }
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Record today's price for a product (idempotent per day). */
export function recordPrice(product: Product): PriceHistoryEntry {
  const all = loadAll()
  const existing = all[product.id]
  const point: PricePoint = {
    price: product.price,
    currency: product.currency,
    date: todayISO(),
    platform: product.platform,
  }
  const entry: PriceHistoryEntry = existing
    ? {
        ...existing,
        points: existing.points.some((p) => p.date === point.date)
          ? existing.points.map((p) => (p.date === point.date ? point : p))
          : [...existing.points, point],
      }
    : {
        productId: product.id,
        productName: product.name,
        image: product.image,
        platform: product.platform,
        points: [point],
      }
  all[product.id] = entry
  saveAll(all)
  return entry
}

export function getPriceHistory(productId: string): PriceHistoryEntry | null {
  const all = loadAll()
  return all[productId] ?? null
}

export function getAllPriceHistories(): PriceHistoryEntry[] {
  return Object.values(loadAll()).sort((a, b) => {
    const la = a.points[a.points.length - 1]?.date ?? ""
    const lb = b.points[b.points.length - 1]?.date ?? ""
    return lb.localeCompare(la)
  })
}

export function clearPriceHistory(productId?: string) {
  const all = loadAll()
  if (productId) {
    delete all[productId]
  } else {
    for (const key of Object.keys(all)) delete all[key]
  }
  saveAll(all)
}

/** Analyze a price history entry for trend insights. */
export function analyzeHistory(entry: PriceHistoryEntry | null) {
  if (!entry || entry.points.length < 2) return null
  const prices = entry.points.map((p) => p.price)
  const latest = prices[prices.length - 1]
  const lowest = Math.min(...prices)
  const highest = Math.max(...prices)
  const first = prices[0]
  const trend =
    latest < first ? "down" : latest > first ? "up" : "stable"
  const dropPercent = first > 0 ? Math.round(((first - latest) / first) * 100) : 0
  return { latest, lowest, highest, trend, dropPercent, samples: prices.length }
}
