"use client"

import { useEffect, useState } from "react"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { TrendingUp, Users, Package, Star } from "lucide-react"

export function StatsSection() {
  const [stats, setStats] = useState([
    {
      icon: Package,
      value: 0,
      suffix: "+",
      label: "Products Available",
      color: "text-blue-600",
    },
    {
      icon: Users,
      value: 0,
      suffix: "+",
      label: "Happy Customers",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      value: 98,
      suffix: "%",
      label: "Success Rate",
      color: "text-purple-600",
    },
    {
      icon: Star,
      value: 4.9,
      suffix: "/5",
      label: "Customer Rating",
      color: "text-yellow-600",
    },
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch product count from database
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
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Enosx Technologies?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're Kenya's leading electronics aggregator, bringing you the best deals from top platforms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-muted mb-4 ${stat.color}`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
