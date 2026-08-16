import Link from "next/link"
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react"

const links = [
  { label: "Discover products", href: "/search?q=electronics" },
  { label: "Compare shortlist", href: "/compare" },
  { label: "Saved products", href: "/watchlist" },
  { label: "My orders", href: "/orders" },
]

export function Footer() {
  return (
    <footer className="bg-[#f8f3e9] pb-8 pt-16 dark:bg-[#0d1b2b] sm:pt-24">
      <div className="site-shell">
        <div className="grid gap-12 border-b border-[#102235]/10 pb-14 dark:border-white/10 lg:grid-cols-[1.1fr_0.9fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[1.1rem] bg-[#102235] text-sm font-black text-[#dfff5b] dark:bg-[#dfff5b] dark:text-[#102235]">EX</span>
              <div><p className="text-lg font-black tracking-[-0.04em] text-[#102235] dark:text-[#f5f0e6]">enosx</p><p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#718092]">tech marketplace</p></div>
            </div>
            <h2 className="display-heading mt-8 max-w-md text-4xl font-black text-[#102235] dark:text-[#f5f0e6] sm:text-5xl">Shop less blindly.</h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#617083] dark:text-[#b9c7d3]">Enosx brings Kenya&apos;s tech market into one clear, useful view—so the next purchase feels like a decision, not a gamble.</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3677ff]">Navigate</p>
            <div className="mt-5 grid gap-3">
              {links.map((link) => <Link key={link.href} href={link.href} className="group flex items-center justify-between text-sm font-bold text-[#536476] transition-colors hover:text-[#102235] dark:text-[#b9c7d3] dark:hover:text-[#dfff5b]">{link.label}<ArrowUpRight className="h-4 w-4 opacity-40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>)}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3677ff]">Talk to us</p>
            <div className="mt-5 grid gap-4 text-sm font-semibold text-[#536476] dark:text-[#b9c7d3]">
              <a href="mailto:Enosxtech@gmail.com" className="flex items-center gap-3 hover:text-[#102235] dark:hover:text-[#dfff5b]"><Mail className="h-4 w-4 text-[#3677ff]" /> Enosxtech@gmail.com</a>
              <a href="tel:0798303978" className="flex items-center gap-3 hover:text-[#102235] dark:hover:text-[#dfff5b]"><Phone className="h-4 w-4 text-[#3677ff]" /> 0798 303 978</a>
              <span className="flex items-center gap-3"><MapPin className="h-4 w-4 text-[#3677ff]" /> Nairobi, Kenya</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-3 pt-6 text-[11px] font-semibold text-[#8190a0] sm:flex-row"><span>© 2026 Enosx Technologies. Built for better decisions.</span><span>Jumia · Kilimall · Jiji</span></div>
      </div>
    </footer>
  )
}
