import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { OrdersTable } from "@/components/admin/orders-table"
import { StatsCards } from "@/components/admin/stats-cards"

export default async function AdminDashboard() {
  const supabase = createClient()

  // For demo purposes, we'll skip authentication
  // In production, you'd want proper admin authentication here

  // Fetch orders with items
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return <div>Error loading dashboard</div>
  }

  // Calculate stats
  const totalOrders = orders?.length || 0
  const pendingOrders = orders?.filter((order) => order.status === "pending").length || 0
  const approvedOrders = orders?.filter((order) => order.admin_approved).length || 0
  const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0

  const stats = {
    totalOrders,
    pendingOrders,
    approvedOrders,
    totalRevenue,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage orders and monitor system performance</p>
        </div>

        <StatsCards stats={stats} />

        <div className="mt-8">
          <OrdersTable orders={orders || []} />
        </div>
      </main>
    </div>
  )
}
