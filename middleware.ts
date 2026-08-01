import { NextResponse, type NextRequest } from "next/server"

// Temporary no-op middleware to avoid Supabase-related runtime errors during debugging.
// This intentionally skips any auth or cookie handling until Supabase is re-enabled.
export function middleware(request: NextRequest) {
  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
