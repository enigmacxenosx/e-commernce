"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Check, X } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  total_amount: number
  status: string
  admin_approved: boolean
  created_at: string
  order_items: any[]
}

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders: initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [loading, setLoading] = useState<string | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string, approved: boolean) => {
    if (status === "pending" && !approved) {
      return "bg-yellow-100 text-yellow-800"
    }
    if (approved) {
      return "bg-green-100 text-green-800"
    }
    switch (status) {
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

  const handleApproveOrder = async (orderId: string) => {
    setLoading(orderId)
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          admin_approved: true,
          admin_approved_at: new Date().toISOString(),
          status: "approved",
        })
        .eq("id", orderId)

      if (error) throw error

      // Update local state
      setOrders(
        orders.map((order) => (order.id === orderId ? { ...order, admin_approved: true, status: "approved" } : order)),
      )

      toast({
        title: "Order approved",
        description: "The order has been approved successfully.",
      })
    } catch (error) {
      console.error("Error approving order:", error)
      toast({
        title: "Error",
        description: "Failed to approve order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const handleRejectOrder = async (orderId: string) => {
    setLoading(orderId)
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: "cancelled",
        })
        .eq("id", orderId)

      if (error) throw error

      // Update local state
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "cancelled" } : order)))

      toast({
        title: "Order rejected",
        description: "The order has been cancelled.",
      })
    } catch (error) {
      console.error("Error rejecting order:", error)
      toast({
        title: "Error",
        description: "Failed to reject order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.order_number}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="text-sm text-gray-500">{order.customer_email}</div>
                  </div>
                </TableCell>
                <TableCell>{order.order_items?.length || 0} items</TableCell>
                <TableCell className="font-medium">{formatPrice(order.total_amount)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status, order.admin_approved)}>
                    {order.admin_approved ? "Approved" : order.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    {order.status === "pending" && !order.admin_approved && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApproveOrder(order.id)}
                          disabled={loading === order.id}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRejectOrder(order.id)}
                          disabled={loading === order.id}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {orders.length === 0 && <div className="text-center py-8 text-gray-500">No orders found</div>}
      </CardContent>
    </Card>
  )
}
