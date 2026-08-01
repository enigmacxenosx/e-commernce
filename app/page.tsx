import { Header } from "@/components/header"
import { EnhancedSearchSection } from "@/components/enhanced-search-section"
import { FeaturedProducts } from "@/components/featured-products"
import { PlatformLogos } from "@/components/platform-logos"
import { StatsSection } from "@/components/ui/stats-section"
import { FloatingCart } from "@/components/ui/floating-cart"
import { ScrollToTop } from "@/components/ui/scroll-to-top"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <EnhancedSearchSection />
        <PlatformLogos />
        <StatsSection />
        <FeaturedProducts />
      </main>
      <Footer />
      <FloatingCart />
      <ScrollToTop />
    </div>
  )
}
