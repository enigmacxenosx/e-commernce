"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ComparisonTable } from "@/components/comparison-table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useComparison } from "@/hooks/useComparison"
import { ArrowLeft, Trash2, Plus } from "lucide-react"

export default function ComparePage() {
  const { items, removeItem, clearAll, isHydrated } = useComparison()

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading comparison...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="w-full px-4 sm:px-6 py-8 sm:py-12">
          {/* Header Section */}
          <div className="mb-8">
            <Link href="/search">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
            </Link>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  Compare Products
                </h1>
                <p className="text-muted-foreground">
                  {items.length === 0
                    ? "No products selected for comparison"
                    : `Comparing ${items.length} product${items.length !== 1 ? "s" : ""}`}
                </p>
              </div>

              {items.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={clearAll}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Empty State */}
          {items.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    No products to compare
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Add products to comparison by clicking the "Add to Compare" button on product cards.
                  </p>
                </div>
                <Link href="/search">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <>
              {/* Comparison Table */}
              <Card className="overflow-hidden">
                <ComparisonTable
                  products={items}
                  onRemove={removeItem}
                />
              </Card>

              {/* Info Section */}
              <Card className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                <h3 className="font-semibold text-foreground mb-3">Comparison Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Compare up to 5 products at once</li>
                  <li>• Prices are displayed in the platform's currency</li>
                  <li>• Green highlight shows the lowest price</li>
                  <li>• Red highlight shows the highest price</li>
                  <li>• Click "View on [Platform]" to visit the seller's page</li>
                </ul>
              </Card>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
