"use client"

import type React from "react"

import { useState } from "react"
import { Search, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

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

    // Simulate search delay for better UX
    setTimeout(() => {
      const params = new URLSearchParams()
      params.set("q", searchQuery)
      if (category) params.set("category", category)
      if (platform) params.set("platform", platform)

      router.push(`/search?${params.toString()}`)
      setIsSearching(false)
    }, 800)
  }

  return (
    <section className="relative py-12 sm:py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-background dark:via-background dark:to-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full blur-xl opacity-30 animate-pulse delay-1000"></div>

      <div className="w-full px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Sparkles className="h-4 w-4" />
            Kenya's #1 Electronics Aggregator
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            Find Electronics from
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Multiple Platforms
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-12">
            Search across Jumia, Kilimall, and Jiji simultaneously. Compare prices and find the best deals.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="bg-background/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border p-4 sm:p-6 space-y-3 sm:space-y-4"
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for electronics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 h-12 sm:h-14 text-sm sm:text-lg border-0 bg-muted/50 focus:bg-background transition-colors rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 sm:flex gap-3 sm:gap-4">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 sm:h-14 border-0 bg-muted/50 text-sm sm:text-base rounded-lg">
                    <SelectValue placeholder="Category" />
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
                  <SelectTrigger className="h-12 sm:h-14 border-0 bg-muted/50 text-sm sm:text-base rounded-lg">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jumia">Jumia</SelectItem>
                    <SelectItem value="kilimall">Kilimall</SelectItem>
                    <SelectItem value="jiji">Jiji</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-12 sm:h-14 text-sm sm:text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] rounded-lg"
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Zap className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                  Search All Platforms
                </>
              )}
            </Button>
          </form>

          <div className="flex flex-wrap justify-center gap-2 mt-6 sm:mt-8">
            {["iPhone 15", "MacBook Pro", "Samsung Galaxy", "Dell Laptop", "AirPods"].map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-3 sm:px-4 py-2 bg-muted hover:bg-muted/80 rounded-full text-xs sm:text-sm transition-colors hover:scale-105 transform duration-200"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
