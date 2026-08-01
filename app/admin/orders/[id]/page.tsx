import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminOrderDetails } from "@/components/admin/admin-order-details"
import { notFound } from "next/navigation"

interface AdminOrderPageProps {
  params: {
    id: string
  }
}

export default async function AdminOrderPage({ params }: AdminOrderPageProps) {
  const supabase = createClient()

  // Fetch order details with items
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        products (*)
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !order) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <AdminOrderDetails order={order} />
      </main>
    </div>
  )
}
