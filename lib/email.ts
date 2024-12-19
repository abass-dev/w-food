import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    secure: false,
    tls: {
        ciphers: 'SSLv3',
    },
})

export async function sendVerificationEmail(to: string, token: string) {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject: 'Verify your email address',
        html: `
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `,
    })
}

export async function sendOrderConfirmationEmail(orderDetails: any) {
    const { id, customerName, customerEmail, customerPhone, total, items, description } = orderDetails

    const itemsList = items.map((item: any) =>
        `${item.quantity}x ${item.menuItem.name} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n')

    const emailContent = `
    New Order Received!

    Order ID: ${id}
    Customer Name: ${customerName}
    Customer Email: ${customerEmail}
    Customer Phone: ${customerPhone}
    Total: $${total}

    Items:
    ${itemsList}

    ${description ? `Additional Instructions: ${description}` : ''}

    Please process this order as soon as possible.
  `

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.NEXT_PUBLIC_MANAGER_EMAIL,
        subject: `New Order #${id} from ${customerName}`,
        text: emailContent,
    })
}

