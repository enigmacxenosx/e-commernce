import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Default response we'll return unless we need to modify cookies/redirect
  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      // Env vars are missing — log and skip Supabase middleware logic to avoid a runtime crash
      console.warn("[enosx] Supabase env vars missing in middleware; skipping auth checks.")
      return supabaseResponse
    }

    const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          try {
            // Try to set cookies on the incoming request (no-op in many runtimes)
            cookiesToSet.forEach(({ name, value, options }) => {
              try {
                // Some runtimes' RequestCookieStore is read-only; guard against errors
                // @ts-ignore
                if (typeof request.cookies.set === "function") {
                  // @ts-ignore
                  request.cookies.set(name, value)
                }
              } catch (e) {
                // ignore
              }
            })

            // Create a fresh response and copy cookies onto it
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) => {
              try {
                supabaseResponse.cookies.set(name, value, options)
              } catch (e) {
                // ignore cookie set errors
              }
            })
          } catch (e) {
            // If anything goes wrong with cookie handling, ignore and continue
            console.warn("[enosx] Warning: failed to set cookies in middleware", e)
          }
        },
      },
    })

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protect checkout, orders, cart, admin, and comparison routes
    const protectedRoutes = ["/checkout", "/orders", "/cart", "/admin", "/compare"]
    const currentPath = request.nextUrl.pathname

    if (!user && protectedRoutes.some((route) => currentPath.startsWith(route))) {
      // no user, redirect to login page
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      url.searchParams.set("redirectTo", currentPath)
      return NextResponse.redirect(url)
    }

    // Redirect authenticated users away from auth pages (except profile setup)
    if (
      user &&
      (currentPath.startsWith("/auth/login") || currentPath.startsWith("/auth/signup")) &&
      !currentPath.startsWith("/auth/profile-setup")
    ) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object here instead of the supabaseResponse object

    return supabaseResponse
  } catch (err) {
    // Catch any unexpected errors in the middleware (including Supabase client creation
    // or auth calls) and allow the request to continue instead of failing with 500.
    console.error("[enosx] Middleware error creating supabase client or auth:", err)
    return NextResponse.next({ request })
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
