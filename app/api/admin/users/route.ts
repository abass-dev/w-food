import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const users = await prisma.user.findMany({
            include: {
                orders: {
                    include: {
                        orderItems: {
                            include: {
                                menuItem: true
                            }
                        }
                    }
                },
                reviews: {
                    include: {
                        menuItem: true
                    }
                },
                favoriteDishes: {
                    include: {
                        menuItem: true
                    }
                },
            },
        })

        const formattedUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            createdAt: user.createdAt,
            emailVerified: user.emailVerified,
            image: user.image,
            orders: user.orders.map(order => ({
                id: order.id,
                createdAt: order.createdAt,
                total: order.total,
                status: order.status,
                items: order.orderItems.map(item => ({
                    name: item.menuItem.name,
                    quantity: item.quantity,
                    price: item.price,
                }))
            })),
            reviews: user.reviews.map(review => ({
                id: review.id,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt,
                menuItemName: review.menuItem.name,
            })),
            favoriteDishes: user.favoriteDishes.map(fav => ({
                id: fav.id,
                name: fav.menuItem.name,
            })),
        }))

        return NextResponse.json(formattedUsers)
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id, name, email, role, phoneNumber, image } = await req.json()

        if (!id || !name || !email || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { name, email, role, phoneNumber, image },
        })

        return NextResponse.json({ success: true, user: updatedUser })
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Error updating user'
        }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        await prisma.user.delete({
            where: { id },
        })

        return NextResponse.json({ success: true, message: 'User deleted successfully' })
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Error deleting user'
        }, { status: 500 })
    }
}

