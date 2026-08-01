import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { DynamicBackground } from "@/components/dynamic-background"
import { ComparisonButton } from "@/components/comparison-button"
import "./globals.css"

export const metadata: Metadata = {
  title: "Enosx Technologies - Electronics Aggregator",
  description: "Find and order electronics from Jumia, Kilimall, and Jiji all in one place",
  generator: "enosx made",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <DynamicBackground />
        <ThemeProvider defaultTheme="system" storageKey="enosx-ui-theme">
          {children}
          <ComparisonButton />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
