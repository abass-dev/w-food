import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.id) {
            console.error('Unauthorized access attempt')
            return NextResponse.json({ error: 'Unauthorized or invalid session' }, { status: 401 })
        }

        console.log('Fetching orders for user:', session.user.id)

        const orders = await prisma.order.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                orderItems: {
                    include: {
                        menuItem: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        console.log('Orders fetched:', JSON.stringify(orders, null, 2))

        if (!orders || orders.length === 0) {
            console.log('No orders found for user:', session.user.id)
            return NextResponse.json({ orders: [] })
        }

        const formattedOrders = orders.map(order => ({
            id: order.id,
            createdAt: order.createdAt.toISOString(),
            status: order.status,
            total: order.total.toNumber(),
            items: order.orderItems.map(item => ({
                name: item.menuItem.name,
                quantity: item.quantity,
                price: item.price.toNumber(),
            })),
        }))

        console.log('Formatted orders:', JSON.stringify(formattedOrders, null, 2))

        return NextResponse.json({ orders: formattedOrders })
    } catch (error) {
        console.error('Error in GET /api/user/orders:', error)
        if (error instanceof Error) {
            return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 })
        }
        return NextResponse.json({ error: 'Unknown server error' }, { status: 500 })
    }
}

