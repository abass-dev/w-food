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
        const favorites = await prisma.favoriteDish.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                menuItem: {
                    include: {
                        category: true,
                    },
                },
            },
        })

        const formattedFavorites = favorites.map(favorite => ({
            id: favorite.menuItem.id,
            name: favorite.menuItem.name,
            description: favorite.menuItem.description,
            price: favorite.menuItem.price,
            image: favorite.menuItem.image,
            category: favorite.menuItem.category,
            isFavorite: true,
        }))

        return NextResponse.json(formattedFavorites)
    } catch (error) {
        console.error('Error fetching favorite dishes:', error)
        return NextResponse.json({ error: 'Error fetching favorite dishes' }, { status: 500 })
    }
}

