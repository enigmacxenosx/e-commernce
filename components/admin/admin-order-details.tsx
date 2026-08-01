"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, X, ExternalLink, ArrowLeft, Mail, Zap } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { sendEmail, emailTemplates } from "@/lib/email"

interface AdminOrderDetailsProps {
  order: any
}

export function AdminOrderDetails({ order: initialOrder }: AdminOrderDetailsProps) {
  const [order, setOrder] = useState(initialOrder)
  const [loading, setLoading] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [placingOrder, setPlacingOrder] = useState(false)

  const formatPrice = (price: number, currency = "KES") => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: currency,
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
      case "partially_placed":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleApproveAndPlaceOrder = async () => {
    setLoading(true)
    setPlacingOrder(true)

    try {
      // First approve the order
      const { error: approveError } = await supabase
        .from("orders")
        .update({
          admin_approved: true,
          admin_approved_at: new Date().toISOString(),
          status: "approved",
        })
        .eq("id", order.id)

      if (approveError) throw approveError

      // Send customer approval email
      try {
        const customerEmailTemplate = emailTemplates.orderApproved(order)
        await sendEmail({
          to: order.customer_email,
          subject: customerEmailTemplate.subject,
          html: customerEmailTemplate.html,
          text: customerEmailTemplate.text,
        })
        console.log("[enosx] Customer approval email sent successfully")
      } catch (emailError) {
        console.error("[enosx] Failed to send customer approval email:", emailError)
      }

      // Automatically place order on external platforms
      const response = await fetch("/api/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: order.id }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to place order automatically")
      }

      setOrder({
        ...order,
        admin_approved: true,
        status: result.status,
        platform_order_ids: result.placementResults,
        platform_redirect_urls: result.redirectUrls,
        auto_placed_at: new Date().toISOString(),
      })

      toast({
        title: "Order approved and placed!",
        description: "The order has been automatically placed on external platforms and customer notified.",
      })
    } catch (error) {
      console.error("Error in approve and place order:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setPlacingOrder(false)
    }
  }

  const handleApproveOrder = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          admin_approved: true,
          admin_approved_at: new Date().toISOString(),
          status: "approved",
        })
        .eq("id", order.id)

      if (error) throw error

      setOrder({ ...order, admin_approved: true, status: "approved" })

      try {
        const customerEmailTemplate = emailTemplates.orderApproved(order)
        await sendEmail({
          to: order.customer_email,
          subject: customerEmailTemplate.subject,
          html: customerEmailTemplate.html,
          text: customerEmailTemplate.text,
        })
        console.log("[enosx] Customer approval email sent successfully")
      } catch (emailError) {
        console.error("[enosx] Failed to send customer approval email:", emailError)
      }

      toast({
        title: "Order approved",
        description: "The order has been approved and customer will be notified.",
      })
    } catch (error) {
      console.error("Error approving order:", error)
      toast({
        title: "Error",
        description: "Failed to approve order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRejectOrder = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: "cancelled",
        })
        .eq("id", order.id)

      if (error) throw error

      setOrder({ ...order, status: "cancelled" })

      try {
        const customerEmailTemplate = emailTemplates.orderRejected(order)
        await sendEmail({
          to: order.customer_email,
          subject: customerEmailTemplate.subject,
          html: customerEmailTemplate.html,
          text: customerEmailTemplate.text,
        })
        console.log("[enosx] Customer rejection email sent successfully")
      } catch (emailError) {
        console.error("[enosx] Failed to send customer rejection email:", emailError)
      }

      toast({
        title: "Order rejected",
        description: "The order has been cancelled and customer will be notified.",
      })
    } catch (error) {
      console.error("Error rejecting order:", error)
      toast({
        title: "Error",
        description: "Failed to reject order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (newStatus: string) => {
    setLoading(true)
    try {
      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", order.id)

      if (error) throw error

      setOrder({ ...order, status: newStatus })

      toast({
        title: "Status updated",
        description: `Order status has been updated to ${newStatus}.`,
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendCustomEmail = async () => {
    if (!adminNotes.trim()) {
      toast({
        title: "Error",
        description: "Please add a message before sending email.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await sendEmail({
        to: order.customer_email,
        subject: `Update on Order #${order.order_number} - Enosx Technologies`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
              <h1>Order Update</h1>
            </div>
            <div style="padding: 20px;">
              <p>Dear ${order.customer_name},</p>
              <p>We have an update regarding your order #${order.order_number}:</p>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                ${adminNotes.replace(/\n/g, "<br>")}
              </div>
              <p>If you have any questions, please contact us at proenosx@gmail.com or 0798303978</p>
              <p>Best regards,<br>Enosx Technologies Team</p>
            </div>
          </div>
        `,
        text: `Order #${order.order_number} Update: ${adminNotes}`,
      })

      toast({
        title: "Email sent",
        description: "Custom email has been sent to the customer.",
      })

      setAdminNotes("")
    } catch (error) {
      console.error("Error sending custom email:", error)
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order #{order.order_number}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <Badge className={getStatusColor(order.status, order.admin_approved)}>
                {order.admin_approved ? "Approved" : order.status}
              </Badge>
              <span className="text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {order.status === "pending" && !order.admin_approved && (
          <div className="flex space-x-2">
            <Button
              onClick={handleApproveAndPlaceOrder}
              disabled={loading || placingOrder}
              className="bg-green-600 hover:bg-green-700"
            >
              {placingOrder ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  Placing Order...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Approve & Auto-Place
                </>
              )}
            </Button>
            <Button onClick={handleApproveOrder} disabled={loading} variant="outline">
              <Check className="h-4 w-4 mr-2" />
              Approve Only
            </Button>
            <Button onClick={handleRejectOrder} disabled={loading} variant="destructive">
              <X className="h-4 w-4 mr-2" />
              Reject Order
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
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

          {/* Platform Order Links */}
          {order.platform_redirect_urls && Object.keys(order.platform_redirect_urls).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Platform Order Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(order.platform_redirect_urls).map(([platform, url]: [string, any]) => (
                  <div key={platform} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium capitalize">{platform}</span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Order
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Update Status</Label>
                <Select value={order.status} onValueChange={handleUpdateStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="redirected">Redirected</SelectItem>
                    <SelectItem value="partially_placed">Partially Placed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="adminNotes">Send Custom Email to Customer</Label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Type your message to the customer..."
                  rows={3}
                />
              </div>

              <Button onClick={handleSendCustomEmail} className="w-full" disabled={loading || !adminNotes.trim()}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email to Customer
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Customer Info */}
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
              <CardTitle>Customer Information</CardTitle>
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
                <span className="font-medium">Region:</span> {order.delivery_region || "Not specified"}
              </div>
              <div>
                <span className="font-medium">County:</span> {order.delivery_county || "Not specified"}
              </div>
              <div>
                <span className="font-medium">Address:</span>
                <p className="mt-1 text-gray-600">{order.delivery_address}</p>
              </div>
              {order.notes && (
                <div>
                  <span className="font-medium">Customer Notes:</span>
                  <p className="mt-1 text-gray-600">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Order placed - {new Date(order.created_at).toLocaleString()}</span>
                </div>
                {order.admin_approved && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">
                      Admin approved - {new Date(order.admin_approved_at).toLocaleString()}
                    </span>
                  </div>
                )}
                {order.auto_placed_at && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">
                      Auto-placed on platforms - {new Date(order.auto_placed_at).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
