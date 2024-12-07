import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { convertPrismaItem } from '@/lib/utils'

export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      include: {
        category: true,
      },
    })
    
    const formattedItems = menuItems.map(convertPrismaItem)
    
    return NextResponse.json(formattedItems)
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return NextResponse.json({ error: 'Error fetching menu items' }, { status: 500 })
  }
}

