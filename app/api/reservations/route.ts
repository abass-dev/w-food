import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        console.log('Unauthorized access attempt')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { restaurantId, dateTime, partySize } = await req.json()

        console.log('Received reservation data:', { restaurantId, dateTime, partySize, userId: session.user.id })

        if (!restaurantId || !dateTime || !partySize) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const reservation = await prisma.reservation.create({
            data: {
                userId: session.user.id,
                restaurantId,
                dateTime: new Date(dateTime),
                partySize: parseInt(partySize, 10),
                status: 'PENDING',
            },
        })

        console.log('Reservation created:', JSON.stringify(reservation, null, 2))

        return NextResponse.json({ success: true, reservation })
    } catch (error) {
        console.error('Error creating reservation:', error)
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Error creating reservation'
        }, { status: 500 })
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const reservations = await prisma.reservation.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                restaurant: true,
            },
        })

        const formattedReservations = reservations.map(reservation => ({
            ...reservation,
            dateTime: reservation.dateTime.toISOString(),
        }))

        return NextResponse.json(formattedReservations)
    } catch (error) {
        console.error('Error fetching reservations:', error)
        return NextResponse.json({ error: 'Error fetching reservations' }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 })
        }

        const reservation = await prisma.reservation.findUnique({
            where: { id },
        })

        if (!reservation) {
            return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
        }

        if (reservation.userId !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized to delete this reservation' }, { status: 403 })
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

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id, dateTime, partySize } = await req.json()

        if (!id || !dateTime || !partySize) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const existingReservation = await prisma.reservation.findUnique({
            where: { id },
        })

        if (!existingReservation) {
            return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
        }

        if (existingReservation.userId !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized to edit this reservation' }, { status: 403 })
        }

        const updatedReservation = await prisma.reservation.update({
            where: { id },
            data: {
                dateTime: new Date(dateTime),
                partySize: parseInt(partySize, 10),
            },
        })

        return NextResponse.json({ success: true, reservation: updatedReservation })
    } catch (error) {
        console.error('Error updating reservation:', error)
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Error updating reservation'
        }, { status: 500 })
    }
}

