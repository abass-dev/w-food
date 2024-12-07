import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { convertPrismaItem } from '@/lib/utils'

export async function GET() {
  try {
    const featuredItems = await prisma.menuItem.findMany({
      take: 3,
      orderBy: { id: 'asc' },
      include: { category: true },
    })
    
    if (featuredItems.length === 0) {
      return NextResponse.json([])
    }

    const formattedItems = featuredItems.map(convertPrismaItem)

    console.log('Formatted items:', formattedItems) // Add this line for debugging

    return NextResponse.json(formattedItems)
  } catch (error) {
    console.error('Error fetching featured menu items:', error)
    return NextResponse.json({ error: 'Error fetching featured menu items' }, { status: 500 })
  }
}

