"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ExternalLink, ShoppingCart, Trash2, BellRing } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/lib/cart-store"
import { useWatchlistStore } from "@/lib/watchlist-store"
import { toast } from "@/hooks/use-toast"

const formatPrice = (price: number) => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", minimumFractionDigits: 0 }).format(price)

export default function WatchlistPage() {
  const { items, removeItem, setTargetPrice } = useWatchlistStore()
  const { addItem } = useCartStore()
  return <div className="min-h-screen bg-background"><Header /><main className="container mx-auto px-4 py-8"><div className="mb-8 max-w-2xl"><div className="flex items-center gap-3"><div className="rounded-xl bg-rose-500/10 p-2.5"><Heart className="h-5 w-5 fill-rose-500 text-rose-500" /></div><div><h1 className="text-3xl font-bold">Saved products</h1><p className="mt-1 text-sm text-muted-foreground">Set a target price and keep a short list of products worth revisiting.</p></div></div></div>{items.length === 0 ? <div className="rounded-2xl border border-dashed p-12 text-center"><Heart className="mx-auto h-10 w-10 text-muted-foreground"/><h2 className="mt-4 text-xl font-semibold">No saved products yet</h2><p className="mt-2 text-sm text-muted-foreground">Use the heart on any product to save it for later.</p><Button asChild className="mt-6"><Link href="/">Browse products</Link></Button></div> : <div className="grid gap-4">{items.map((item) => <article key={item.id} className="grid gap-4 rounded-2xl border bg-card p-4 sm:grid-cols-[112px_1fr_auto] sm:items-center"><div className="relative h-28 overflow-hidden rounded-xl bg-muted"><Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" /></div><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{item.platform}</p><h2 className="mt-1 truncate font-semibold">{item.name}</h2><p className="mt-1 text-lg font-bold">{formatPrice(item.price)}</p><div className="mt-3 flex flex-wrap items-center gap-2"><BellRing className="h-4 w-4 text-blue-600"/><label className="text-sm text-muted-foreground">Notify below</label><Input aria-label={`Target price for ${item.name}`} type="number" min="0" value={item.targetPrice ?? ""} onChange={(event) => setTargetPrice(item.id, event.target.value ? Number(event.target.value) : undefined)} placeholder="Target KES" className="h-8 w-32" /></div>{item.targetPrice && item.price <= item.targetPrice && <p className="mt-2 text-xs font-semibold text-emerald-600">This item is at or below your target price.</p>}</div><div className="flex flex-row gap-2 sm:flex-col"><Button size="sm" onClick={() => { addItem({ id: item.id, name: item.name, price: item.price, image: item.image, platform: item.platform, externalUrl: item.externalUrl, currency: item.currency, category: "" }); toast({ title: "Added to cart", description: `${item.name} is ready for checkout.` }) }} disabled={!item.inStock}><ShoppingCart className="mr-2 h-4 w-4"/>Add</Button><Button size="sm" variant="outline" asChild><a href={item.externalUrl} target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-4 w-4"/>Store</a></Button><Button size="icon" variant="ghost" aria-label={`Remove ${item.name}`} onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4 text-muted-foreground"/></Button></div></article>)}</div>}<aside className="mt-8 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">Price targets are stored on this device. Production price alerts require the scheduled product-sync job and an authenticated notification channel.</aside></main><Footer /></div>
}
