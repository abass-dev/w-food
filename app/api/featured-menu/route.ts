import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { convertPrismaItem } from '@/lib/utils'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    const featuredItems = await prisma.menuItem.findMany({
      take: 3,
      orderBy: {
        id: 'asc',
      },
      include: {
        category: true,
        favoriteDishes: userId ? {
          where: {
            userId: userId
          }
        } : false
      },
    })

    const formattedItems = featuredItems.map(item => ({
      ...convertPrismaItem(item),
      isFavorite: userId ? item.favoriteDishes && item.favoriteDishes.length > 0 : false,
      category: {
        id: item.category.id,
        name: item.category.name,
      }
    }))

    return NextResponse.json(formattedItems)
  } catch (error) {
    console.error('Error fetching featured menu items:', error)
    return NextResponse.json({ error: 'Error fetching featured menu items' }, { status: 500 })
  }
}

