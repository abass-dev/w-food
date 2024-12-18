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
        const reservations = await prisma.reservation.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                restaurant: true,
            },
            orderBy: {
                dateTime: 'desc',
            },
        })

        return NextResponse.json(reservations)
    } catch (error) {
        console.error('Error fetching reservations:', error)
        return NextResponse.json({ error: 'Error fetching reservations' }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id, status } = await req.json()

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const updatedReservation = await prisma.reservation.update({
            where: { id },
            data: { status },
        })

        return NextResponse.json({ success: true, reservation: updatedReservation })
    } catch (error) {
        console.error('Error updating reservation:', error)
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Error updating reservation'
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
            return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 })
        }

        await prisma.reservation.delete({
            where: { id },
        })

        return NextResponse.json({ success: true, message: 'Reservation deleted successfully' })
    } catch (error) {
        console.error('Error deleting reservation:', error)
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Error deleting reservation'
        }, { status: 500 })
    }
}

