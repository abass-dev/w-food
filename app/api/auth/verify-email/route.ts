import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { sendVerificationEmail } from '@/lib/email'

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.redirect(new URL(`/auth/verify-email?status=error&message=${encodeURIComponent('Unauthorized')}`, req.url))
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        })

        if (!user) {
            return NextResponse.redirect(new URL(`/auth/verify-email?status=error&message=${encodeURIComponent('User not found')}`, req.url))
        }

        if (user.isVerified) {
            return NextResponse.redirect(new URL(`/auth/verify-email?status=success&message=${encodeURIComponent('Email already verified')}`, req.url))
        }

        // Delete any existing verification tokens for this user
        await prisma.verificationToken.deleteMany({
            where: { identifier: user.email },
        })

        // Create a new verification token
        const verificationToken = await prisma.verificationToken.create({
            data: {
                identifier: user.email,
                token: uuidv4(),
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
            },
        })

        // Send the verification email
        await sendVerificationEmail(user.email, verificationToken.token)

        return NextResponse.redirect(new URL(`/auth/verify-email?status=success&message=${encodeURIComponent('Verification email sent')}`, req.url))
    } catch (error) {
        console.error('Error sending verification email:', error)
        return NextResponse.redirect(new URL(`/auth/verify-email?status=error&message=${encodeURIComponent('Error sending verification email')}`, req.url))
    }
}

