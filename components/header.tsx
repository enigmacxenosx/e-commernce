"use client"

import Link from "next/link"
import { ArrowUpRight, LogOut, Menu, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartButton } from "@/components/cart-button"
import { WatchlistButton } from "@/components/watchlist-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchSuggestions } from "@/components/search-suggestions"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { AuthChangeEvent, Session, User as SupabaseUser } from "@supabase/supabase-js"

const navItems = [
  { label: "Discover", href: "/search?q=electronics" },
  { label: "Compare", href: "/compare" },
  { label: "Saved", href: "/watchlist" },
]

export function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: { data: { user: SupabaseUser | null } }) => {
      setUser(user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#102235]/10 bg-[#f8f3e9]/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#102235]/95">
      <div className="hidden bg-[#102235] px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-[#f5f0e6] sm:block">
        <span className="text-[#dfff5b]">New:</span> compare prices across Kenya&apos;s fastest-growing marketplaces
      </div>

      <div className="site-shell">
        <div className="flex min-h-[76px] items-center justify-between gap-3">
          <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="Enosx home">
            <span className="grid h-11 w-11 place-items-center rounded-[1.1rem] bg-[#102235] text-[#dfff5b] shadow-[5px_5px_0_#dfff5b] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:bg-[#f5f0e6] dark:text-[#102235]">
              <span className="text-xl font-black tracking-[-0.08em]">EX</span>
            </span>
            <span className="hidden sm:block">
              <span className="block text-base font-black tracking-[-0.04em] text-[#102235] dark:text-[#f5f0e6]">enosx</span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.22em] text-[#667483]">tech marketplace</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-[#506071] transition-colors hover:text-[#102235] dark:text-[#b9c3ce] dark:hover:text-[#dfff5b]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden min-w-0 flex-1 justify-center px-4 md:flex">
            <SearchSuggestions className="w-full max-w-[440px]" />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden sm:block"><ThemeToggle /></div>
            {user ? (
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden gap-2 rounded-full text-xs font-bold text-[#102235] hover:bg-black/5 sm:flex dark:text-[#f5f0e6] dark:hover:bg-white/10">
                <LogOut className="h-4 w-4" />
                <span className="max-w-20 truncate">{user.email?.split("@")[0]}</span>
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild className="hidden rounded-full border-[#102235]/20 bg-transparent px-4 text-xs font-bold text-[#102235] sm:flex dark:border-white/20 dark:text-[#f5f0e6]">
                <Link href="/auth/login"><UserRound className="mr-2 h-4 w-4" /> Sign in</Link>
              </Button>
            )}
            <WatchlistButton />
            <CartButton />
            <Button variant="ghost" size="icon" className="rounded-full lg:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="pb-3 md:hidden">
          <SearchSuggestions className="w-full" />
        </div>

        {menuOpen && (
          <div className="border-t border-[#102235]/10 pb-4 pt-4 dark:border-white/10 lg:hidden">
            <nav className="grid gap-1" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold text-[#102235] hover:bg-black/5 dark:text-[#f5f0e6] dark:hover:bg-white/10">
                  {item.label}<ArrowUpRight className="h-4 w-4" />
                </Link>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-[#102235]/10 pt-3 dark:border-white/10">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#667483]">Theme</span>
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
