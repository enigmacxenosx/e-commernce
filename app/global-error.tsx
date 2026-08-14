"use client"

import { useEffect } from "react"

export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => { console.error("Unhandled storefront error", error) }, [error])
  return <html lang="en"><body className="grid min-h-screen place-items-center bg-slate-50 p-6 text-slate-950"><main className="max-w-md rounded-2xl border bg-white p-8 text-center shadow-xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Enosx Technologies</p><h1 className="mt-3 text-2xl font-bold">We could not load this page.</h1><p className="mt-3 text-sm leading-6 text-slate-600">Your cart and saved products remain available on this device. Please try again or return to the storefront.</p><div className="mt-6 flex justify-center gap-3"><button onClick={retry} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Try again</button><a href="/" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">Storefront</a></div></main></body></html>
}
