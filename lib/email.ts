import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
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

