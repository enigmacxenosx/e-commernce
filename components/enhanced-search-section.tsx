"use client"

import type React from "react"
import { useState } from "react"
import { ArrowRight, ChevronDown, Search, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

const quickSearches = ["iPhone 15", "MacBook Pro", "Samsung Galaxy", "AirPods"]

export function EnhancedSearchSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("")
  const [platform, setPlatform] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setTimeout(() => {
      const params = new URLSearchParams()
      params.set("q", searchQuery)
      if (category) params.set("category", category)
      if (platform) params.set("platform", platform)
      router.push(`/search?${params.toString()}`)
      setIsSearching(false)
    }, 450)
  }

  return (
    <section className="relative overflow-hidden bg-[#102235] py-12 text-[#f5f0e6] sm:py-20 lg:py-24">
      <div className="absolute inset-0 market-grid opacity-20" />
      <div className="hero-glow absolute -right-24 -top-24 h-96 w-96 opacity-70" />
      <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full border-[40px] border-[#3677ff]/30 blur-sm" />

      <div className="site-shell relative z-10">
        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <div className="eyebrow border-[#dfff5b]/40 bg-[#dfff5b]/10 text-[#dfff5b]">
              <Sparkles className="h-3.5 w-3.5" /> Price intelligence for real life
            </div>
            <h1 className="display-heading mt-7 max-w-4xl text-5xl font-black sm:text-7xl lg:text-[6.8rem]">
              Better tech.
              <span className="block text-[#dfff5b]">Less hunting.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#c5d0da] sm:text-lg">
              One clean search across Jumia, Kilimall, and Jiji. See what is available, compare the real price, and move with confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.14em] text-[#aebdca]">
              <span className="rounded-full border border-white/15 px-3 py-2">3 marketplaces</span>
              <span className="rounded-full border border-white/15 px-3 py-2">Kenya-first</span>
              <span className="rounded-full border border-white/15 px-3 py-2">Built for comparison</span>
            </div>
          </div>

          <div className="relative lg:pb-3">
            <div className="mb-4 flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-[#9eafbd]">
              <span>Start a discovery session</span>
              <span className="text-[#dfff5b]">01 / 03</span>
            </div>
            <form onSubmit={handleSearch} className="paper-panel rounded-[2rem] p-3 text-[#102235] sm:p-4">
              <div className="flex items-center gap-3 rounded-[1.4rem] border border-[#102235]/10 bg-white/70 px-4 py-1 shadow-inner">
                <Search className="h-5 w-5 shrink-0 text-[#3677ff]" />
                <Input
                  type="text"
                  placeholder="Try “wireless headphones”"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 border-0 bg-transparent px-0 text-base font-semibold shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 rounded-[1.1rem] border-[#102235]/10 bg-white/70 font-semibold">
                    <SelectValue placeholder="Every category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smartphones">Smartphones</SelectItem>
                    <SelectItem value="laptops">Laptops</SelectItem>
                    <SelectItem value="headphones">Headphones</SelectItem>
                    <SelectItem value="tablets">Tablets</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="h-12 rounded-[1.1rem] border-[#102235]/10 bg-white/70 font-semibold">
                    <SelectValue placeholder="Every marketplace" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jumia">Jumia</SelectItem>
                    <SelectItem value="kilimall">Kilimall</SelectItem>
                    <SelectItem value="jiji">Jiji</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isSearching} className="pressable mt-3 h-14 w-full rounded-[1.1rem] bg-[#3677ff] text-base font-black text-white shadow-[5px_5px_0_#dfff5b] hover:bg-[#2c65dc]">
                {isSearching ? <><div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Searching the market</> : <><Zap className="mr-2 h-5 w-5" /> Search all platforms <ArrowRight className="ml-auto h-5 w-5" /></>}
              </Button>
            </form>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8fa0ae]">Popular now</span>
              {quickSearches.map((term) => (
                <button key={term} onClick={() => setSearchQuery(term)} className="pressable rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-[#d2dce5] transition-colors hover:border-[#dfff5b]/60 hover:text-[#dfff5b]">
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex items-center gap-3 border-t border-white/10 pt-5 text-xs text-[#aebdca] sm:mt-20">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#dfff5b] text-[#102235]"><ChevronDown className="h-4 w-4" /></span>
          <span>Scroll to see the latest signals from Kenya&apos;s tech market</span>
        </div>
      </div>
    </section>
  )
}
