import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const preferences = await prisma.userPreference.findUnique({
            where: {
                userId: session.user.id,
            },
        })

        return NextResponse.json(preferences || {
            dietaryRestrictions: [],
            allergies: [],
            spicePreference: '',
        })
    } catch (error) {
        console.error('Error fetching preferences:', error)
        return NextResponse.json({ error: 'Error fetching preferences' }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { dietaryRestrictions, allergies, spicePreference } = await req.json()

        const updatedPreferences = await prisma.userPreference.upsert({
            where: {
                userId: session.user.id,
            },
            update: {
                dietaryRestrictions,
                allergies,
                spicePreference,
            },
            create: {
                userId: session.user.id,
                dietaryRestrictions,
                allergies,
                spicePreference,
            },
        })

        return NextResponse.json(updatedPreferences)
    } catch (error) {
        console.error('Error updating preferences:', error)
        return NextResponse.json({ error: 'Error updating preferences' }, { status: 500 })
    }
}

