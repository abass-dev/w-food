import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getFeaturedDishes } from '@/lib/api'

export default async function FeaturedDishes() {
    const featuredDishes = await getFeaturedDishes()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDishes.map((dish) => (
                <Card key={dish.id} className="overflow-hidden">
                    <Image
                        src={dish.image}
                        alt={dish.name}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-4">
                        <h3 className="text-xl font-semibold mb-2">{dish.name}</h3>
                        <p className="text-muted-foreground mb-4">{dish.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold">${dish.price.toFixed(2)}</span>
                            <Button asChild>
                                <Link href={`/menu/${dish.id}`}>View Details</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

