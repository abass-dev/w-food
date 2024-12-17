import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { convertPrismaItem } from '@/lib/utils'
import { getFromCache, setCache, clearCache } from '@/lib/cache'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // Fetch menu items from cache or database
    let menuItems = getFromCache<any[]>('menuItems')

    if (!menuItems) {
      menuItems = await prisma.menuItem.findMany({
        include: {
          category: true,
        },
      })
      setCache('menuItems', menuItems)
    }

    // If user is logged in, fetch their favorites separately
    let userFavorites: Set<string> = new Set()
    if (userId) {
      const favorites = await prisma.favoriteDish.findMany({
        where: { userId },
        select: { menuItemId: true },
      })
      userFavorites = new Set(favorites.map(f => f.menuItemId))
    }

    // Combine menu items with favorite status
    const formattedItems = menuItems.map(item => ({
      ...convertPrismaItem(item),
      isFavorite: userId ? userFavorites.has(item.id) : false
    }))

    return NextResponse.json(formattedItems)
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return NextResponse.json({ error: 'Error fetching menu items' }, { status: 500 })
  }
}

export async function POST() {
  // Clear the cache when menu items are updated
  clearCache('menuItems')
  return NextResponse.json({ message: 'Menu cache cleared' })
}

