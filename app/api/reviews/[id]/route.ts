import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id: menuItemId } = await params
        const { rating, comment } = await req.json()

        if (!rating || !comment) {
            return NextResponse.json({ error: 'Rating and comment are required' }, { status: 400 })
        }

        const review = await prisma.review.create({
            data: {
                userId: session.user.id,
                menuItemId,
                rating,
                comment,
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        })

        return NextResponse.json({
            id: review.id,
            userId: review.userId,
            userName: review.user.name,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
        })
    } catch (error) {
        console.error('Error adding review:', error)
        return NextResponse.json({ error: 'Error adding review' }, { status: 500 })
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id: menuItemId } = await params

        if (!menuItemId) {
            return NextResponse.json({ error: 'Menu item ID is required' }, { status: 400 })
        }

        const reviews = await prisma.review.findMany({
            where: {
                menuItemId,
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        const formattedReviews = reviews.map(review => ({
            id: review.id,
            userId: review.userId,
            userName: review.user.name,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
        }))

        return NextResponse.json(formattedReviews)
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return NextResponse.json({ error: 'Error fetching reviews' }, { status: 500 })
    }
}

