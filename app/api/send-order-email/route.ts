import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { sendOrderConfirmationEmail } from '@/lib/email'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const orderDetails = await req.json()
        await sendOrderConfirmationEmail(orderDetails)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error sending order confirmation email:', error)
        return NextResponse.json({ error: 'Failed to send order confirmation email' }, { status: 500 })
    }
}

