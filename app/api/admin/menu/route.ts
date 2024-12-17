import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const menuItems = await prisma.menuItem.findMany({
            include: {
                category: true,
            },
        })
        return NextResponse.json(menuItems)
    } catch (error) {
        console.error('Error fetching menu items:', error)
        return NextResponse.json({ error: 'Error fetching menu items' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { name, description, price, categoryId, image } = await req.json()
        const menuItem = await prisma.menuItem.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                categoryId,
                image,
            },
        })
        return NextResponse.json(menuItem)
    } catch (error) {
        console.error('Error creating menu item:', error)
        return NextResponse.json({ error: 'Error creating menu item' }, { status: 500 })
    }
}

