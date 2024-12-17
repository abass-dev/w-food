import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
            where: { email },
        })

        if (existingSubscriber) {
            return NextResponse.json({ message: 'You are already subscribed' }, { status: 200 })
        }

        await prisma.newsletterSubscriber.create({
            data: { email },
        })

        return NextResponse.json({ message: 'Successfully subscribed to the newsletter' }, { status: 201 })
    } catch (error) {
        console.error('Error subscribing to newsletter:', error)
        return NextResponse.json({ error: 'Failed to subscribe to the newsletter' }, { status: 500 })
    }
}

