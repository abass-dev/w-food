import prisma from '@/lib/prisma'
import { MenuItem } from '@/types/menu'

export async function getFeaturedDishes(): Promise<MenuItem[]> {
    try {
        const featuredItems = await prisma.menuItem.findMany({
            take: 3,
            orderBy: {
                id: 'asc',
            },
            include: {
                category: true,
            },
        })

        return featuredItems.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price.toNumber(),
            image: item.image,
            category: {
                id: item.category.id,
                name: item.category.name,
            },
            isFavorite: false, // This will be set on the client side based on user session
        }))
    } catch (error) {
        console.error('Error fetching featured dishes:', error)
        throw error // Re-throw the error to be handled by the caller
    }
}

