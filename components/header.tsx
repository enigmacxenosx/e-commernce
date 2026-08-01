"use client"

import Link from "next/link"
import { Search, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CartButton } from "@/components/cart-button"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchSuggestions } from "@/components/search-suggestions"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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
    <header className="border-b bg-background shadow-sm">
      <div className="w-full px-4 py-3 sm:px-6 sm:py-4">
        {/* Mobile Layout - Single Row Compact */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo - Compact on Mobile */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="hidden sm:inline text-lg sm:text-xl font-bold text-foreground">Enosx</span>
          </Link>

          {/* Search Bar - Hidden on Mobile, Full Width on Tablet+ */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <SearchSuggestions className="w-full" />
          </div>

          {/* Navigation - Compact on Mobile */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            {user ? (
              <>
                <span className="hidden sm:inline text-xs sm:text-sm text-muted-foreground">
                  {user.email?.split("@")[0]}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="text-xs sm:text-sm"
                >
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
                className="text-xs sm:text-sm"
              >
                <Link href="/auth/login">
                  <User className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              </Button>
            )}
            <CartButton />
          </div>
        </div>

        {/* Mobile Search Bar - Shown Below on Mobile Screens */}
        <div className="md:hidden mt-3">
          <SearchSuggestions className="w-full" />
        </div>
      </div>
    </header>
  )
}
