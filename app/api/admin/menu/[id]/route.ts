import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = params
        const { name, description, price, categoryId, image } = await req.json()
        const updatedMenuItem = await prisma.menuItem.update({
            where: { id },
            data: {
                name,
                description,
                price: parseFloat(price),
                categoryId,
                image,
            },
        })
        return NextResponse.json(updatedMenuItem)
    } catch (error) {
        console.error('Error updating menu item:', error)
        return NextResponse.json({ error: 'Error updating menu item' }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = params
        await prisma.menuItem.delete({
            where: { id },
        })
        return NextResponse.json({ message: 'Menu item deleted successfully' })
    } catch (error) {
        console.error('Error deleting menu item:', error)
        return NextResponse.json({ error: 'Error deleting menu item' }, { status: 500 })
    }
}

