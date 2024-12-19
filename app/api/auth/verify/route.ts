import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token')

    if (!token) {
        return NextResponse.redirect(new URL(`/auth/verify-email?status=error&message=${encodeURIComponent('Missing verification token')}`, req.url))
    }

    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        })

        if (!verificationToken) {
            return NextResponse.redirect(new URL(`/auth/verify-email?status=error&message=${encodeURIComponent('Invalid token')}`, req.url))
        }

        if (verificationToken.expires < new Date()) {
            return NextResponse.redirect(new URL(`/auth/verify-email?status=expired&message=${encodeURIComponent('Token expired')}`, req.url))
        }

        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { isVerified: true, emailVerified: new Date() },
        })

        console.log(`User ${verificationToken.identifier} email verified successfully`)

        // Clear the user profile cache
        await fetch(`${process.env.NEXTAUTH_URL}/api/user/clear-cache`, { method: 'POST' })

        await prisma.verificationToken.delete({
            where: { token },
        })

        return NextResponse.redirect(new URL(`/auth/verify-email?status=success&message=${encodeURIComponent('Email verified successfully')}`, req.url))
    } catch (error) {
        console.error('Error verifying email:', error)
        return NextResponse.redirect(new URL(`/auth/verify-email?status=error&message=${encodeURIComponent('Error verifying email')}`, req.url))
    }
}

