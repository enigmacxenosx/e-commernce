import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, ExternalLink } from "lucide-react"
import { notFound } from "next/navigation"

interface OrderPageProps {
  params: {
    id: string
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const supabase = createClient()

  // Fetch order details
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

  const formatPrice = (price: number, currency = "KES") => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "redirected":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order #{order.order_number}</h1>
          <div className="flex items-center space-x-4">
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
            <span className="text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.order_items.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.products?.name || "Product"}</h3>
                      <p className="text-sm text-gray-500">
                        Platform: {item.platform} • Quantity: {item.quantity}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="font-medium">{formatPrice(item.total_price)}</span>
                        {item.external_product_url && (
                          <a
                            href={item.external_product_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Product
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Status */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Amount</span>
                  <span className="font-bold">{formatPrice(order.total_amount)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Final Total</span>
                    <span>{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium">Name:</span> {order.customer_name}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {order.customer_email}
                </div>
                {order.customer_phone && (
                  <div>
                    <span className="font-medium">Phone:</span> {order.customer_phone}
                  </div>
                )}
                <div>
                  <span className="font-medium">Address:</span>
                  <p className="mt-1 text-gray-600">{order.delivery_address}</p>
                </div>
                {order.notes && (
                  <div>
                    <span className="font-medium">Notes:</span>
                    <p className="mt-1 text-gray-600">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Order Placed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {order.admin_approved ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                    <span>Admin Review</span>
                  </div>
                  {order.status === "pending" && (
                    <p className="text-sm text-gray-600 mt-4">
                      Your order is being reviewed by our admin team. You'll receive an email notification once it's
                      approved.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
