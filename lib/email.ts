// Email service utility for sending notifications
interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(data: EmailData) {
  try {
    // In production, you would use a service like Resend, SendGrid, or Nodemailer
    // For demo purposes, we'll log the email and simulate sending
    console.log("[enosx] Email would be sent:", {
      to: data.to,
      subject: data.subject,
      preview: data.text?.substring(0, 100) || data.html.substring(0, 100),
    })

    // Simulate API call to email service
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to send email")
    }

    return { success: true }
  } catch (error) {
    console.error("Email sending error:", error)
    return { success: false, error }
  }
}

// Email templates
export const emailTemplates = {
  newOrderAdmin: (order: any) => ({
    subject: `New Order #${order.order_number} - Enosx Technologies`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
          <h1>New Order Received</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2>Order #${order.order_number}</h2>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Customer Information:</h3>
            <p><strong>Name:</strong> ${order.customer_name}</p>
            <p><strong>Email:</strong> ${order.customer_email}</p>
            <p><strong>Phone:</strong> ${order.customer_phone || "Not provided"}</p>
            <p><strong>Address:</strong> ${order.delivery_address}</p>
            ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ""}
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details:</h3>
            <p><strong>Total Amount:</strong> KES ${order.total_amount.toLocaleString()}</p>
            <p><strong>Status:</strong> Pending Approval</p>
            <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/orders/${order.id}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Review Order in Admin Dashboard
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            Please review and approve this order in the admin dashboard to proceed with processing.
          </p>
        </div>
      </div>
    `,
    text: `New Order #${order.order_number} received from ${order.customer_name} (${order.customer_email}). Total: KES ${order.total_amount.toLocaleString()}. Please review in admin dashboard.`,
  }),

  orderApproved: (order: any) => ({
    subject: `Order #${order.order_number} Approved - Enosx Technologies`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #16a34a; color: white; padding: 20px; text-align: center;">
          <h1>Order Approved!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${order.customer_name},</p>
          
          <p>Great news! Your order #${order.order_number} has been approved and is ready for processing.</p>
          
          <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin: 20px 0;">
            <h3>What happens next?</h3>
            <p>Our team will now redirect your order to the respective e-commerce platforms for fulfillment. You will receive separate confirmation emails from each platform with tracking information.</p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Summary:</h3>
            <p><strong>Order Number:</strong> ${order.order_number}</p>
            <p><strong>Total Amount:</strong> KES ${order.total_amount.toLocaleString()}</p>
            <p><strong>Delivery Address:</strong> ${order.delivery_address}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/orders/${order.id}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Order Details
            </a>
          </div>
          
          <p>Thank you for choosing Enosx Technologies!</p>
          
          <p style="color: #6b7280; font-size: 14px;">
            If you have any questions, please contact us at proenosx@gmail.com
          </p>
        </div>
      </div>
    `,
    text: `Your order #${order.order_number} has been approved! Total: KES ${order.total_amount.toLocaleString()}. You will receive tracking information from the respective platforms soon.`,
  }),

  orderRejected: (order: any) => ({
    subject: `Order #${order.order_number} Update - Enosx Technologies`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1>Order Update</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${order.customer_name},</p>
          
          <p>We regret to inform you that your order #${order.order_number} could not be processed at this time.</p>
          
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
            <h3>Possible reasons:</h3>
            <ul>
              <li>Product availability issues</li>
              <li>Delivery location restrictions</li>
              <li>Payment verification required</li>
            </ul>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details:</h3>
            <p><strong>Order Number:</strong> ${order.order_number}</p>
            <p><strong>Total Amount:</strong> KES ${order.total_amount.toLocaleString()}</p>
          </div>
          
          <p>Please contact us at proenosx@gmail.com for more information or to place a new order.</p>
          
          <p>We apologize for any inconvenience and appreciate your understanding.</p>
          
          <p>Best regards,<br>Enosx Technologies Team</p>
        </div>
      </div>
    `,
    text: `Your order #${order.order_number} could not be processed. Please contact proenosx@gmail.com for more information.`,
  }),
}
