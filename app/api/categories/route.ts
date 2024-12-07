import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { convertPrismaItem } from '@/lib/utils'

export async function GET() {
  try {
    const categories = await prisma.menuCategory.findMany()

    const categoriesItems = categories.map(convertPrismaItem)

    return NextResponse.json(categoriesItems)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 })
  }
}

