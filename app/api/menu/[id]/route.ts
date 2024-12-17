import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { convertPrismaItem } from '@/lib/utils'
import { getFromCache, setCache, clearCache } from '@/lib/cache'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  if (!id) {
    return NextResponse.json({ error: 'Menu item ID is required' }, { status: 400 })
  }

  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // Try to get menu item from cache
    let menuItem = getFromCache<any>(`menuItem:${id}`)

    if (!menuItem) {
      // If not in cache, fetch from database
      menuItem = await prisma.menuItem.findUnique({
        where: { id },
        include: { category: true },
      })

      if (!menuItem) {
        return NextResponse.json({ error: 'Menu item not found' }, { status: 404 })
      }

      // Set the fetched item in cache
      setCache(`menuItem:${id}`, menuItem)
    }

    const formattedItem = convertPrismaItem(menuItem)

    // If user is logged in, fetch their favorite status separately
    if (userId) {
      const favorite = await prisma.favoriteDish.findFirst({
        where: {
          userId: userId,
          menuItemId: id,
        },
      })
      formattedItem.isFavorite = !!favorite
    } else {
      formattedItem.isFavorite = false
    }

    return NextResponse.json(formattedItem)
  } catch (error) {
    console.error('Error fetching menu item:', error)
    return NextResponse.json({ error: 'Error fetching menu item' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  if (!id) {
    return NextResponse.json({ error: 'Menu item ID is required' }, { status: 400 })
  }

  // Clear the cache for this specific menu item
  clearCache(`menuItem:${id}`)

  return NextResponse.json({ message: `Menu item ${id} cache cleared` })
}

