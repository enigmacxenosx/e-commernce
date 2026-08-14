import { createBrowserClient } from "@supabase/ssr"

// Defensive factory: returns a real Supabase browser client when env vars are present,
// otherwise returns a safe no-op stub that won't throw during module import or page load.
export function createSupabaseClient() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (SUPABASE_URL && SUPABASE_KEY) {
    return createBrowserClient(SUPABASE_URL, SUPABASE_KEY)
  }

  // No-op stub client for environments where Supabase isn't configured (prevents client-side crashes)
  const noopResult = async () => ({ data: null, error: new Error("Supabase not configured") })

  const stub = {
    from: (_: string) => ({
      upsert: noopResult,
      insert: noopResult,
      select: noopResult,
      update: noopResult,
      delete: noopResult,
      // allow chaining `.select().single()` patterns by returning the same noopResult where applicable
      single: noopResult,
      maybeSingle: noopResult,
    }),
    rpc: async (): Promise<any> => ({ data: null, error: new Error("Supabase not configured") }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithOtp: noopResult,
      signInWithPassword: noopResult,
      signOut: noopResult,
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => undefined } } }),
      // Other auth methods can be added as needed
    },
    storage: {
      from: (_: string) => ({
        upload: noopResult,
        download: noopResult,
        list: noopResult,
        remove: noopResult,
      }),
    },
  }

  return stub as any
}

// Backwards-compatible export name some modules may import
export const createClient = createSupabaseClient

// Compatibility singleton for pre-existing client components. The factory remains the preferred
// path for server work and for code that requires an explicitly fresh browser client.
export const supabase = createSupabaseClient()

// Do NOT create a singleton client at module load — call createSupabaseClient() at runtime.
