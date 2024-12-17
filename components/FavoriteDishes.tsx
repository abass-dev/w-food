"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Heart } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { MenuItem } from '@/types/menu'

export default function FavoriteDishes() {
    const { data: session } = useSession()
    const [favorites, setFavorites] = useState<MenuItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchFavorites() {
            try {
                const response = await fetch('/api/user/favorites')
                if (!response.ok) {
                    throw new Error('Failed to fetch favorite dishes')
                }
                const data = await response.json()
                console.log('Fetched favorites:', data)
                setFavorites(data)
            } catch (error) {
                console.error('Error fetching favorite dishes:', error)
                toast({
                    title: "Error",
                    description: "Failed to load favorite dishes. Please try again later.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (session) {
            fetchFavorites()
        }
    }, [session])

    const removeFavorite = async (id: string) => {
        try {
            setIsLoading(true)
            console.log(`Attempting to remove favorite dish with id: ${id}`)
            const response = await fetch(`/api/user/favorites/${id}`, {
                method: 'DELETE',
            })
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.error || 'Failed to remove favorite dish')
            }
            console.log(`Successfully removed favorite dish with id: ${id}`)
            setFavorites(favorites.filter(dish => dish.id !== id))
            toast({
                title: "Favorite removed",
                description: "The dish has been removed from your favorites.",
            })
        } catch (error) {
            console.error('Error removing favorite dish:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to remove favorite dish. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <Loader2 className="h-8 w-8 animate-spin" />
    }

    if (favorites.length === 0) {
        return <p>You haven't added any favorite dishes yet.</p>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((dish) => (
                <Card key={dish.id}>
                    <CardHeader>
                        <CardTitle>{dish.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Image src={dish.image} alt={dish.name} width={300} height={200} className="rounded-md mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">{dish.description}</p>
                        <p className="font-bold mb-2">${dish.price}</p>
                        <Button
                            variant="outline"
                            onClick={() => removeFavorite(dish.id)}
                            disabled={isLoading}
                            className="w-full"
                        >
                            <Heart className="mr-2 h-4 w-4 fill-current text-red-500" />
                            Remove from Favorites
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

