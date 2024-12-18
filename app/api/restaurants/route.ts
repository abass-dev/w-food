import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const restaurants = await prisma.restaurant.findMany({
            select: {
                id: true,
                name: true,
            },
        })
        return NextResponse.json(restaurants)
    } catch (error) {
        console.error('Error fetching restaurants:', error)
        return NextResponse.json({ error: 'Error fetching restaurants' }, { status: 500 })
    }
}

