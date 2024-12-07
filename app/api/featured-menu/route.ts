import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { convertPrismaItem } from '@/lib/utils'

export async function GET() {
  try {
    const featuredItems = await prisma.menuItem.findMany({
      take: 3,
      orderBy: {
        id: 'asc',
      },
    })
    
    const formattedItems = featuredItems.map(convertPrismaItem)

    return NextResponse.json(formattedItems)
  } catch (error) {
    console.error('Error fetching featured menu items:', error)
    return NextResponse.json({ error: 'Error fetching featured menu items' }, { status: 500 })
  }
}

