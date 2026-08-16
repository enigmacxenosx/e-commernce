import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const SUPABASE_NOT_CONFIGURED =
  "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable account and persistence features."

type QueryResult = {
  data: null
  error: Error
  count: null
}

function createNoopQuery(): any {
  const result: QueryResult = {
    data: null,
    error: new Error(SUPABASE_NOT_CONFIGURED),
    count: null,
  }

  const query: any = {
    select: () => query,
    insert: () => query,
    update: () => query,
    delete: () => query,
    upsert: () => query,
    eq: () => query,
    neq: () => query,
    gt: () => query,
    gte: () => query,
    lt: () => query,
    lte: () => query,
    in: () => query,
    ilike: () => query,
    order: () => query,
    limit: () => query,
    range: () => query,
    single: async () => result,
    maybeSingle: async () => result,
    then: (resolve: (value: QueryResult) => unknown, reject?: (reason: unknown) => unknown) =>
      Promise.resolve(result).then(resolve, reject),
  }

  return query
}

function createNoopClient() {
  const getError = () => new Error(SUPABASE_NOT_CONFIGURED)

  return {
    from: () => createNoopQuery(),
    rpc: async () => ({ data: null, error: getError() }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: getError() }),
      getSession: async () => ({ data: { session: null }, error: getError() }),
      exchangeCodeForSession: async () => ({ data: { session: null }, error: getError() }),
      setSession: async () => ({ data: { session: null, user: null }, error: getError() }),
      signOut: async () => ({ error: getError() }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => undefined } },
        error: getError(),
      }),
    },
  }
}

export function createClient(): any {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return createNoopClient()
  }

  const cookieStore = cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // The setAll method may be called from a Server Component. The
          // middleware is responsible for refreshing user sessions there.
        }
      },
    },
  })
}
