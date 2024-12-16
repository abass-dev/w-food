import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token')

    if (!token) {
        return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }

    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        })

        if (!verificationToken) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
        }

        if (verificationToken.expires < new Date()) {
            return NextResponse.json({ error: 'Token expired' }, { status: 400 })
        }

        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { isVerified: true, emailVerified: new Date() },
        })

        await prisma.verificationToken.delete({
            where: { token },
        })

        return NextResponse.json({ message: 'Email verified successfully' })
    } catch (error) {
        console.error('Error verifying email:', error)
        return NextResponse.json({ error: 'Error verifying email' }, { status: 500 })
    }
}

