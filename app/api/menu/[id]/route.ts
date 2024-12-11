import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { convertPrismaItem } from '@/lib/utils'

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params

  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: { category: true },
    })

    if (!menuItem) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 })
    }

    const formattedItem = convertPrismaItem(menuItem)
    return NextResponse.json(formattedItem)
  } catch (error) {
    console.error('Error fetching menu item:', error)
    return NextResponse.json({ error: 'Error fetching menu item' }, { status: 500 })
  }
}

