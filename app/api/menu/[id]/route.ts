import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { convertPrismaItem } from '@/lib/utils'
import { getFromCache, setCache } from '@/lib/cache'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Menu item ID is required' }, { status: 400 })
  }

  try {
    // Try to get menu item from cache
    const cachedMenuItem = getFromCache<any>(`menuItem:${id}`)

    if (cachedMenuItem) {
      return NextResponse.json(cachedMenuItem)
    }

    // If not in cache, fetch from database
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: { category: true },
    })

    if (!menuItem) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 })
    }

    const formattedItem = convertPrismaItem(menuItem)

    // Set the fetched item in cache
    setCache(`menuItem:${id}`, formattedItem)

    return NextResponse.json(formattedItem)
  } catch (error) {
    console.error('Error fetching menu item:', error)
    return NextResponse.json({ error: 'Error fetching menu item' }, { status: 500 })
  }
}

