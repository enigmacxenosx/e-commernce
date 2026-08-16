module.exports=[54161,a=>{"use strict";var b=a.i(87924),c=a.i(11011),d=a.i(187),e=a.i(97895);let f=(0,d.cva)("inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",secondary:"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",destructive:"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"}},defaultVariants:{variant:"default"}});a.s(["Badge",0,function({className:a,variant:d,asChild:g=!1,...h}){let i=g?c.Slot:"span";return(0,b.jsx)(i,{"data-slot":"badge",className:(0,e.cn)(f({variant:d}),a),...h})}])},3130,a=>{"use strict";var b=a.i(87924),c=a.i(97895);a.s(["Card",0,function({className:a,...d}){return(0,b.jsx)("div",{"data-slot":"card",className:(0,c.cn)("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",a),...d})},"CardContent",0,function({className:a,...d}){return(0,b.jsx)("div",{"data-slot":"card-content",className:(0,c.cn)("px-6",a),...d})},"CardHeader",0,function({className:a,...d}){return(0,b.jsx)("div",{"data-slot":"card-header",className:(0,c.cn)("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",a),...d})},"CardTitle",0,function({className:a,...d}){return(0,b.jsx)("div",{"data-slot":"card-title",className:(0,c.cn)("leading-none font-semibold",a),...d})}])},17171,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(30553),e=c.forwardRef((a,c)=>(0,b.jsx)(d.Primitive.label,{...a,ref:c,onMouseDown:b=>{b.target.closest("button, input, select, textarea")||(a.onMouseDown?.(b),!b.defaultPrevented&&b.detail>1&&b.preventDefault())}}));e.displayName="Label";var f=a.i(97895);a.s(["Label",0,function({className:a,...c}){return(0,b.jsx)(e,{"data-slot":"label",className:(0,f.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",a),...c})}],17171)},46893,9759,a=>{"use strict";var b=a.i(87924),c=a.i(97895);async function d(a){try{if(console.log("[enosx] Email would be sent:",{to:a.to,subject:a.subject,preview:a.text?.substring(0,100)||a.html.substring(0,100)}),!(await fetch("/api/send-email",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})).ok)throw Error("Failed to send email");return{success:!0}}catch(a){return console.error("Email sending error:",a),{success:!1,error:a}}}a.s(["Textarea",0,function({className:a,...d}){return(0,b.jsx)("textarea",{"data-slot":"textarea",className:(0,c.cn)("border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",a),...d})}],46893),a.s(["emailTemplates",0,{newOrderAdmin:a=>({subject:`New Order #${a.order_number} - Enosx Technologies`,html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
          <h1>New Order Received</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2>Order #${a.order_number}</h2>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Customer Information:</h3>
            <p><strong>Name:</strong> ${a.customer_name}</p>
            <p><strong>Email:</strong> ${a.customer_email}</p>
            <p><strong>Phone:</strong> ${a.customer_phone||"Not provided"}</p>
            <p><strong>Address:</strong> ${a.delivery_address}</p>
            ${a.notes?`<p><strong>Notes:</strong> ${a.notes}</p>`:""}
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details:</h3>
            <p><strong>Total Amount:</strong> KES ${a.total_amount.toLocaleString()}</p>
            <p><strong>Status:</strong> Pending Approval</p>
            <p><strong>Order Date:</strong> ${new Date(a.created_at).toLocaleString()}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000"}/admin/orders/${a.id}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Review Order in Admin Dashboard
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            Please review and approve this order in the admin dashboard to proceed with processing.
          </p>
        </div>
      </div>
    `,text:`New Order #${a.order_number} received from ${a.customer_name} (${a.customer_email}). Total: KES ${a.total_amount.toLocaleString()}. Please review in admin dashboard.`}),orderApproved:a=>({subject:`Order #${a.order_number} Approved - Enosx Technologies`,html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #16a34a; color: white; padding: 20px; text-align: center;">
          <h1>Order Approved!</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${a.customer_name},</p>
          
          <p>Great news! Your order #${a.order_number} has been approved and is ready for processing.</p>
          
          <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin: 20px 0;">
            <h3>What happens next?</h3>
            <p>Our team will now redirect your order to the respective e-commerce platforms for fulfillment. You will receive separate confirmation emails from each platform with tracking information.</p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Summary:</h3>
            <p><strong>Order Number:</strong> ${a.order_number}</p>
            <p><strong>Total Amount:</strong> KES ${a.total_amount.toLocaleString()}</p>
            <p><strong>Delivery Address:</strong> ${a.delivery_address}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000"}/orders/${a.id}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Order Details
            </a>
          </div>
          
          <p>Thank you for choosing Enosx Technologies!</p>
          
          <p style="color: #6b7280; font-size: 14px;">
            If you have any questions, please contact us at Enosxtech@gmail.com
          </p>
        </div>
      </div>
    `,text:`Your order #${a.order_number} has been approved! Total: KES ${a.total_amount.toLocaleString()}. You will receive tracking information from the respective platforms soon.`}),orderRejected:a=>({subject:`Order #${a.order_number} Update - Enosx Technologies`,html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1>Order Update</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${a.customer_name},</p>
          
          <p>We regret to inform you that your order #${a.order_number} could not be processed at this time.</p>
          
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
            <p><strong>Order Number:</strong> ${a.order_number}</p>
            <p><strong>Total Amount:</strong> KES ${a.total_amount.toLocaleString()}</p>
          </div>
          
          <p>Please contact us at Enosxtech@gmail.com for more information or to place a new order.</p>
          
          <p>We apologize for any inconvenience and appreciate your understanding.</p>
          
          <p>Best regards,<br>Enosx Technologies Team</p>
        </div>
      </div>
    `,text:`Your order #${a.order_number} could not be processed. Please contact Enosxtech@gmail.com for more information.`})},"sendEmail",0,d],9759)},210,a=>{"use strict";let b=(0,a.i(70106).default)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);a.s(["ArrowLeft",0,b],210)},34157,a=>{"use strict";let b=(0,a.i(70106).default)("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);a.s(["default",0,b])},33441,a=>{"use strict";var b=a.i(34157);a.s(["Check",()=>b.default])},52495,a=>{"use strict";let b=(0,a.i(70106).default)("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);a.s(["ExternalLink",0,b],52495)},92258,a=>{"use strict";let b=(0,a.i(70106).default)("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);a.s(["Mail",0,b],92258)}];

//# sourceMappingURL=_0k0-2j3._.js.map