import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface WatchlistItem {
  id: string
  name: string
  price: number
  currency: string
  image: string
  platform: string
  externalUrl: string
  inStock: boolean
  addedAt: string
  targetPrice?: number
}

interface WatchlistStore {
  items: WatchlistItem[]
  addItem: (item: Omit<WatchlistItem, "addedAt">) => void
  removeItem: (id: string) => void
  setTargetPrice: (id: string, targetPrice?: number) => void
  isWatched: (id: string) => boolean
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (get().items.some((saved) => saved.id === item.id)) return
        set({ items: [...get().items, { ...item, addedAt: new Date().toISOString() }] })
      },
      removeItem: (id) => set({ items: get().items.filter((item) => item.id !== id) }),
      setTargetPrice: (id, targetPrice) => set({ items: get().items.map((item) => item.id === id ? { ...item, targetPrice } : item) }),
      isWatched: (id) => get().items.some((item) => item.id === id),
    }),
    { name: "enosx-watchlist-storage" },
  ),
)
