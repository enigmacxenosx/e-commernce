"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
// <CHANGE> Use enhanced product card with multiple images support
import { EnhancedProductCard } from "@/components/enhanced-product-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Filter, Grid, List } from 'lucide-react'
import type { Product } from "@/lib/api/platforms"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("relevance")
  // <CHANGE> Add view mode toggle and filter states
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const query = searchParams.get("q") || ""
  const category = searchParams.get("category") || ""
  const platform = searchParams.get("platform") || ""

  useEffect(() => {
    const searchProducts = async () => {
      if (!query) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          q: query,
          ...(category && { category }),
          ...(platform && { platform }),
        })

        console.log("[enosx] Fetching search results for:", query)

        const response = await fetch(`/api/search?${params.toString()}`)
        const data = await response.json()

        if (data.success) {
          setProducts(data.data)
          console.log("[enosx] Found", data.data.length, "products")
        } else {
          setError(data.error || "Failed to search products")
        }
      } catch (err) {
        console.error("[enosx] Search error:", err)
        setError("Failed to search products. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    searchProducts()
  }, [query, category, platform])

  // <CHANGE> Enhanced filtering and sorting logic
  const filteredAndSortedProducts = [...products]
    .filter((product) => {
      // Price range filter
      if (priceRange.min && product.price < parseInt(priceRange.min)) return false
      if (priceRange.max && product.price > parseInt(priceRange.max)) return false
      
      // Brand filter
      if (selectedBrands.length > 0 && product.brand && !selectedBrands.includes(product.brand)) return false
      
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "reviews":
          return (b.reviewCount || 0) - (a.reviewCount || 0)
        default:
          return 0 // relevance (original order)
      }
    })

  // <CHANGE> Get unique brands for filter
  const availableBrands = [...new Set(products.map(p => p.brand).filter(Boolean))] as string[]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // <CHANGE> Enhanced product card props with multiple images
  const getEnhancedProductProps = (product: Product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    images: product.images || [product.image],
    platform: product.platform,
    rating: product.rating,
    reviews: product.reviewCount,
    inStock: product.inStock > 0,
    externalUrl: product.externalUrl
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="w-full px-4 sm:px-6 py-6 sm:py-8">
        {/* Search Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">Search Results {query && `for "${query}"`}</h1>
          <div className="flex flex-col gap-4 sm:gap-3">
            <div className="text-sm sm:text-base text-muted-foreground">
              {loading
                ? "Searching..."
                : `${filteredAndSortedProducts.length} of ${products.length} products found${platform ? ` on ${platform}` : " across all platforms"}${category ? ` in ${category}` : ""}`}
            </div>

            {!loading && products.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between flex-wrap">
                {/* <CHANGE> View mode toggle */}
                <div className="flex items-center border rounded-lg flex-shrink-0">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* <CHANGE> Filter toggle - Full width on mobile */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full sm:w-auto"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                {/* <CHANGE> Enhanced sort options - Full width on mobile */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-auto sm:min-w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* <CHANGE> Advanced Filters Panel - Mobile Optimized */}
        {showFilters && !loading && products.length > 0 && (
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-muted/50 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Filters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Price Range */}
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">Price Range (KES)</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="text-sm"
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Brands */}
              <div className="sm:col-span-1 md:col-span-2">
                <label className="text-xs sm:text-sm font-medium mb-2 block">Brands</label>
                <div className="flex flex-wrap gap-2">
                  {availableBrands.map((brand) => (
                    <Badge
                      key={brand}
                      variant={selectedBrands.includes(brand) ? "default" : "outline"}
                      className="cursor-pointer text-xs sm:text-sm"
                      onClick={() => {
                        setSelectedBrands(prev =>
                          prev.includes(brand)
                            ? prev.filter(b => b !== brand)
                            : [...prev, brand]
                        )
                      }}
                    >
                      {brand}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end col-span-1 sm:col-span-2 md:col-span-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPriceRange({ min: "", max: "" })
                    setSelectedBrands([])
                  }}
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-muted-foreground">Searching across multiple platforms...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a few seconds</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-destructive mb-2">Search Error</h3>
              <p className="text-destructive/80 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && products.length === 0 && query && (
          <div className="text-center py-16">
            <Search className="h-24 w-24 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search terms or browse our featured products</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        )}

        {/* Results Grid/List - Mobile Optimized */}
        {!loading && !error && filteredAndSortedProducts.length > 0 && (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
              : "space-y-3 sm:space-y-4"
          }>
            {filteredAndSortedProducts.map((product) => (
              <EnhancedProductCard 
                key={`${product.platform}-${product.id}`} 
                product={getEnhancedProductProps(product)}
              />
            ))}
          </div>
        )}

        {/* <CHANGE> Enhanced Platform Performance Info - Mobile Optimized */}
        {!loading && products.length > 0 && (
          <div className="mt-8 sm:mt-12 bg-primary/5 rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Search Results by Platform</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {["jumia", "kilimall", "jiji"].map((platformName) => {
                const platformProducts = filteredAndSortedProducts.filter((p) => p.platform === platformName)
                const avgPrice =
                  platformProducts.length > 0
                    ? platformProducts.reduce((sum, p) => sum + p.price, 0) / platformProducts.length
                    : 0
                const avgRating = platformProducts.length > 0
                  ? platformProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / platformProducts.length
                  : 0

                return (
                  <div key={platformName} className="bg-background rounded-lg p-3 sm:p-4 border">
                    <h4 className="font-semibold capitalize mb-2 text-sm sm:text-base">{platformName}</h4>
                    <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                      <p>{platformProducts.length} products found</p>
                      {avgPrice > 0 && <p>Avg price: {formatPrice(avgPrice)}</p>}
                      {avgRating > 0 && <p>Avg rating: {avgRating.toFixed(1)}/5</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
