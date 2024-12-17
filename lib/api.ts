import prisma from '@/lib/prisma'
import { MenuItem } from '@/types/menu'

export async function getFeaturedDishes(): Promise<MenuItem[]> {
    try {
        const featuredDishes = await prisma.menuItem.findMany({
            where: {
                // You can add a 'featured' field to your MenuItem model and filter by it
                // featured: true,
            },
            include: {
                category: true,
            },
            take: 3, // Limit to 3 featured dishes
        })

        return featuredDishes.map(dish => ({
            id: dish.id,
            name: dish.name,
            description: dish.description,
            price: dish.price.toNumber(),
            image: dish.image,
            category: {
                id: dish.category.id,
                name: dish.category.name,
            },
            isFavorite: false, // This would need to be set based on user session
        }))
    } catch (error) {
        console.error('Error fetching featured dishes:', error)
        return []
    }
}

