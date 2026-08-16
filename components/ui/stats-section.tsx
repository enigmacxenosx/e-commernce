"use client"

import { useEffect, useState } from "react"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { ArrowUpRight, Package, Star, TrendingUp, Users } from "lucide-react"

export function StatsSection() {
  const [stats, setStats] = useState([
    { icon: Package, value: 0, suffix: "+", label: "products tracked", color: "text-[#3677ff]" },
    { icon: Users, value: 0, suffix: "+", label: "happy customers", color: "text-[#ff7d4d]" },
    { icon: TrendingUp, value: 98, suffix: "%", label: "search success rate", color: "text-[#7c9c00]" },
    { icon: Star, value: 4.9, suffix: "/5", label: "customer rating", color: "text-[#b96eff]" },
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")
        if (response.ok) {
          const data = await response.json()
          setStats((prev) => [
            { ...prev[0], value: data.totalProducts || 0 },
            { ...prev[1], value: data.totalCustomers || 0 },
            prev[2],
            prev[3],
          ])
        }
      } catch (error) {
        console.error("[enosx] Error fetching stats:", error)
      }
    }
    fetchStats()
  }, [])

  return (
    <section className="bg-[#102235] py-16 text-[#f5f0e6] sm:py-20">
      <div className="site-shell">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#dfff5b]">Why Enosx exists</p>
            <h2 className="display-heading mt-4 max-w-md text-4xl font-black sm:text-5xl">Less noise. More signal.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#b9c7d3]">A good marketplace helps you buy. A great one helps you decide. Enosx makes the comparison step feel clear, fast, and grounded.</p>
            <a href="/search?q=electronics" className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#dfff5b] hover:underline">Explore the market <ArrowUpRight className="h-4 w-4" /></a>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/10 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-[#162c42] p-5 sm:p-6">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <div className="mt-8 text-3xl font-black tracking-[-0.06em] text-[#f5f0e6] sm:text-4xl"><AnimatedCounter end={stat.value} suffix={stat.suffix} /></div>
                <p className="mt-2 text-xs font-semibold leading-5 text-[#aebdca]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
