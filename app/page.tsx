import { ArrowRight, BarChart3, CheckCircle2, SearchCheck, ShieldCheck } from "lucide-react"
import { Header } from "@/components/header"
import { EnhancedSearchSection } from "@/components/enhanced-search-section"
import { FeaturedProducts } from "@/components/featured-products"
import { PlatformLogos } from "@/components/platform-logos"
import { StatsSection } from "@/components/ui/stats-section"
import { FloatingCart } from "@/components/ui/floating-cart"
import { ScrollToTop } from "@/components/ui/scroll-to-top"
import { Footer } from "@/components/footer"

const steps = [
  { number: "01", icon: SearchCheck, title: "Name the thing", copy: "Search the product, category, or brand you already have in mind." },
  { number: "02", icon: BarChart3, title: "Read the spread", copy: "Compare live-looking listings across the marketplaces that matter." },
  { number: "03", icon: ShieldCheck, title: "Make the move", copy: "Save, compare, or jump out to the seller with confidence." },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <EnhancedSearchSection />
        <PlatformLogos />
        <FeaturedProducts />
        <section className="bg-[#f8f3e9] py-16 dark:bg-[#132437] sm:py-24">
          <div className="site-shell">
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3677ff]">The Enosx method</p>
                <h2 className="display-heading mt-4 max-w-md text-4xl font-black text-[#102235] dark:text-[#f5f0e6] sm:text-5xl">A sharper way to shop tech.</h2>
                <p className="mt-5 max-w-md text-sm leading-7 text-[#617083] dark:text-[#b9c7d3]">No endless tabs. No guesswork. Just the useful part of the buying journey, designed for a Kenyan market.</p>
                <a href="/search?q=electronics" className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#102235] dark:text-[#dfff5b]">Start exploring <ArrowRight className="h-4 w-4" /></a>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {steps.map((step) => (
                  <div key={step.number} className="paper-panel rounded-[1.5rem] p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6">
                    <div className="flex items-center justify-between"><span className="text-[10px] font-black tracking-[0.2em] text-[#3677ff]">{step.number}</span><step.icon className="h-5 w-5 text-[#3677ff]" /></div>
                    <h3 className="mt-10 text-lg font-black text-[#102235] dark:text-[#f5f0e6]">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#617083] dark:text-[#b9c7d3]">{step.copy}</p>
                    <CheckCircle2 className="mt-6 h-5 w-5 text-[#43c78b]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <StatsSection />
      </main>
      <Footer />
      <FloatingCart />
      <ScrollToTop />
    </div>
  )
}
