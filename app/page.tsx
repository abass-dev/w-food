"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MenuCarousel } from '@/components/MenuCarousel'
import { MenuItem } from '@/types/menu'
import { MenuItemSkeleton } from '@/components/MenuItemSkeleton'
import { useSession } from 'next-auth/react'
import { Heart } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import LoginForm from '@/components/LoginForm'

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    async function fetchFeaturedItems() {
      try {
        const response = await fetch('/api/featured-menu')
        const data = await response.json()
        setFeaturedItems(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching featured items:', error)
        setIsLoading(false)
      }
    }
    fetchFeaturedItems()
  }, [])

  const handleToggleFavorite = async (item: MenuItem) => {
    if (!session) {
      setSelectedItem(item)
      setIsLoginDialogOpen(true)
      return
    }

    try {
      const response = await fetch(`/api/user/favorites/${item.id}`, {
        method: item.isFavorite ? 'DELETE' : 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update favorite')
      }

      setFeaturedItems(prevItems =>
        prevItems.map(prevItem =>
          prevItem.id === item.id
            ? { ...prevItem, isFavorite: !prevItem.isFavorite }
            : prevItem
        )
      )

      toast({
        title: item.isFavorite ? "Removed from favorites" : "Added to favorites",
        description: `${item.name} has been ${item.isFavorite ? 'removed from' : 'added to'} your favorites.`,
      })
    } catch (error) {
      console.error('Error updating favorite:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update favorite. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLoginSuccess = () => {
    setIsLoginDialogOpen(false)
    if (selectedItem) {
      handleToggleFavorite(selectedItem)
    }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <motion.section
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Wajabatt Food</h1>
        <p className="text-xl text-muted-foreground mb-8">Experience exquisite cuisine in a warm, inviting atmosphere</p>
        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link href="/reservations">Reserve a Table</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/menu">View Menu</Link>
          </Button>
        </div>
      </motion.section>

      <motion.section
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Our Specialties</h2>
        {isLoading ? <MenuItemSkeleton /> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <motion.div
                key={item.id}
                className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={`/menu/${item.id}`}>
                  <Image src={item.image} alt={item.name} width={300} height={200} className="w-full" />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                    <p className="mt-2 font-bold">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground mt-1">Category: {item.category.name}</p>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      handleToggleFavorite(item)
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <Heart className={`mr-2 h-4 w-4 ${item.isFavorite ? 'fill-current text-red-500' : ''}`} />
                    {item.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      <motion.section
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Featured Menu Items</h2>
        {isLoading ? <MenuItemSkeleton /> : <MenuCarousel items={featuredItems} />}
      </motion.section>

      <motion.section
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6">Hours & Location</h2>
        <p className="text-xl mb-4">123 Foodie Street, Culinary City</p>
        <p className="text-lg mb-2">Monday - Friday: 11am - 10pm</p>
        <p className="text-lg mb-4">Saturday - Sunday: 10am - 11pm</p>
        <Button asChild variant="outline">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </motion.section>

      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              Please log in or create an account to add favorites.
            </DialogDescription>
          </DialogHeader>
          <LoginForm onSuccess={handleLoginSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

