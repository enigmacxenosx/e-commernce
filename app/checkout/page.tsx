"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCartStore } from "@/lib/cart-store"
import { supabase } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Loader2, MapPin } from "lucide-react"
import { sendEmail, emailTemplates } from "@/lib/email"

const KENYAN_REGIONS = {
  Nairobi: ["Nairobi City"],
  Central: ["Kiambu", "Murang'a", "Nyeri", "Kirinyaga", "Nyandarua"],
  Coast: ["Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta"],
  Eastern: ["Machakos", "Kitui", "Makueni", "Embu", "Tharaka-Nithi", "Meru", "Isiolo"],
  "North Eastern": ["Garissa", "Wajir", "Mandera"],
  Nyanza: ["Kisumu", "Siaya", "Kisii", "Nyamira", "Homa Bay", "Migori"],
  "Rift Valley": [
    "Nakuru",
    "Uasin Gishu",
    "Trans Nzoia",
    "Turkana",
    "West Pokot",
    "Samburu",
    "Laikipia",
    "Nandi",
    "Baringo",
    "Kericho",
    "Bomet",
    "Kakamega",
    "Vihiga",
    "Bungoma",
    "Busia",
  ],
  Western: ["Kakamega", "Vihiga", "Bungoma", "Busia"],
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    deliveryAddress: "",
    region: "",
    county: "",
    notes: "",
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegionChange = (region: string) => {
    setFormData({
      ...formData,
      region,
      county: "", // Reset county when region changes
    })
  }

  const handleCountyChange = (county: string) => {
    setFormData({
      ...formData,
      county,
    })
  }

  const getAvailableCounties = () => {
    if (!formData.region) return []
    return KENYAN_REGIONS[formData.region as keyof typeof KENYAN_REGIONS] || []
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          total_amount: getTotalPrice(),
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_phone: formData.customerPhone,
          delivery_address: formData.deliveryAddress,
          delivery_region: formData.region,
          delivery_county: formData.county,
          notes: formData.notes,
          status: "pending",
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        platform: item.platform,
        external_product_url: item.externalUrl,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      try {
        const adminEmailTemplate = emailTemplates.newOrderAdmin(order)
        await sendEmail({
          to: "proenosx@gmail.com",
          subject: adminEmailTemplate.subject,
          html: adminEmailTemplate.html,
          text: adminEmailTemplate.text,
        })
        console.log("[enosx] Admin notification email sent successfully")
      } catch (emailError) {
        console.error("[enosx] Failed to send admin notification email:", emailError)
        // Don't fail the order if email fails
      }

      // Clear cart and redirect
      clearCart()
      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.order_number} has been submitted for admin approval.`,
      })

      router.push(`/orders/${order.id}`)
    } catch (error) {
      console.error("Order submission error:", error)
      toast({
        title: "Error placing order",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">Email *</Label>
                      <Input
                        id="customerEmail"
                        name="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customerPhone">Phone Number</Label>
                    <Input
                      id="customerPhone"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      placeholder="e.g., 0798303978"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="region">Region *</Label>
                      <Select value={formData.region} onValueChange={handleRegionChange} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(KENYAN_REGIONS).map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="county">County *</Label>
                      <Select
                        value={formData.county}
                        onValueChange={handleCountyChange}
                        disabled={!formData.region}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={formData.region ? "Select county" : "Select region first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableCounties().map((county) => (
                            <SelectItem key={county} value={county}>
                              {county}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deliveryAddress">Detailed Address *</Label>
                    <Textarea
                      id="deliveryAddress"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      placeholder="Street address, building name, apartment number, landmarks..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Special delivery instructions, preferred delivery time, etc."
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.platform} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-blue-800">
                    <strong>Delivery Process:</strong>
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Order reviewed by admin team</li>
                    <li>• Approved orders redirected to respective platforms</li>
                    <li>• Delivery handled by platform partners</li>
                    <li>• Regional delivery options may vary</li>
                  </ul>
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
