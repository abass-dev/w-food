import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { convertPrismaItem } from '@/lib/utils'
import { getFromCache, setCache } from '@/lib/cache'

export async function GET() {
  try {
    // Try to get menu items from cache
    const cachedMenuItems = getFromCache<any[]>('menuItems')

    if (cachedMenuItems) {
      return NextResponse.json(cachedMenuItems)
    }

    // If not in cache, fetch from database
    const menuItems = await prisma.menuItem.findMany({
      include: {
        category: true,
      },
    })

    const formattedItems = menuItems.map(convertPrismaItem)

    // Set the fetched items in cache
    setCache('menuItems', formattedItems)

    return NextResponse.json(formattedItems)
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return NextResponse.json({ error: 'Error fetching menu items' }, { status: 500 })
  }
}

