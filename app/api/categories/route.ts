import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getFromCache, setCache } from '@/lib/cache'

export async function GET() {
  try {
    // Try to get categories from cache
    const cachedCategories = getFromCache<any[]>('categories')

    if (cachedCategories) {
      return NextResponse.json(cachedCategories)
    }

    // If not in cache, fetch from database
    const categories = await prisma.menuCategory.findMany()

    // Set the fetched categories in cache
    setCache('categories', categories)

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 })
  }
}

