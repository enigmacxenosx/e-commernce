import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { OrderPlacementService } from "@/lib/api/order-placement"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Fetch order with items
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq("id", orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (!order.admin_approved) {
      return NextResponse.json({ error: "Order not approved" }, { status: 400 })
    }

    // Prepare order items for placement
    const orderItems = order.order_items.map((item: any) => ({
      id: item.id,
      name: item.products?.name || "Product",
      platform: item.platform,
      external_product_url: item.external_product_url,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }))

    // Prepare customer info
    const customer = {
      name: order.customer_name,
      email: order.customer_email,
      phone: order.customer_phone,
      address: order.delivery_address,
      region: order.delivery_region,
      county: order.delivery_county,
    }

    console.log(`[enosx] Starting automatic order placement for order #${order.order_number}`)

    // Place orders on external platforms
    const placementResults = await OrderPlacementService.placeMultiPlatformOrder(
      orderItems,
      customer,
      order.order_number,
    )

    // Update order status and store platform order IDs
    const platformOrderIds = Object.entries(placementResults)
      .filter(([_, result]) => result.success)
      .reduce(
        (acc, [platform, result]) => {
          acc[platform] = result.platformOrderId
          return acc
        },
        {} as { [platform: string]: string },
      )

    const redirectUrls = Object.entries(placementResults)
      .filter(([_, result]) => result.success && result.redirectUrl)
      .reduce(
        (acc, [platform, result]) => {
          acc[platform] = result.redirectUrl!
          return acc
        },
        {} as { [platform: string]: string },
      )

    // Check if all placements were successful
    const allSuccessful = Object.values(placementResults).every((result) => result.success)
    const newStatus = allSuccessful ? "redirected" : "partially_placed"

    // Update order in database
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        platform_order_ids: platformOrderIds,
        platform_redirect_urls: redirectUrls,
        auto_placed_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (updateError) {
      console.error("[enosx] Error updating order:", updateError)
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }

    // Send customer notification with redirect links
    try {
      const customerEmailTemplate = {
        subject: `Order #${order.order_number} Ready for Completion - Enosx Technologies`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
              <h1>Order Ready for Completion!</h1>
            </div>
            
            <div style="padding: 20px;">
              <p>Dear ${order.customer_name},</p>
              
              <p>Great news! Your order #${order.order_number} has been automatically placed on the respective platforms. Please complete your purchase using the links below:</p>
              
              <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin: 20px 0;">
                <h3>Complete Your Purchase:</h3>
                ${Object.entries(redirectUrls)
                  .map(
                    ([platform, url]) => `
                  <p style="margin: 10px 0;">
                    <strong>${platform.charAt(0).toUpperCase() + platform.slice(1)}:</strong><br>
                    <a href="${url}" style="background-color: #2563eb; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 5px;">
                      Complete on ${platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </a>
                  </p>
                `,
                  )
                  .join("")}
              </div>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                <h3>Important:</h3>
                <ul>
                  <li>Complete your purchase within 24 hours to secure your items</li>
                  <li>Use the same delivery address you provided: ${order.delivery_address}</li>
                  <li>Contact us if you encounter any issues during checkout</li>
                </ul>
              </div>
              
              <p>Thank you for choosing Enosx Technologies!</p>
              
              <p style="color: #6b7280; font-size: 14px;">
                If you have any questions, please contact us at proenosx@gmail.com or 0798303978
              </p>
            </div>
          </div>
        `,
        text: `Your order #${order.order_number} is ready! Complete your purchase: ${Object.values(redirectUrls).join(", ")}`,
      }

      await sendEmail({
        to: order.customer_email,
        subject: customerEmailTemplate.subject,
        html: customerEmailTemplate.html,
        text: customerEmailTemplate.text,
      })

      console.log("[enosx] Customer redirect notification sent successfully")
    } catch (emailError) {
      console.error("[enosx] Failed to send customer redirect notification:", emailError)
    }

    return NextResponse.json({
      success: true,
      placementResults,
      redirectUrls,
      status: newStatus,
    })
  } catch (error) {
    console.error("[enosx] Error in automatic order placement:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
