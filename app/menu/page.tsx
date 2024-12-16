"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { toast } from '@/hooks/use-toast'
import { MenuItem, Category } from '@/types/menu'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import LoginForm from '@/components/LoginForm'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filter, setFilter] = useState('all')
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const router = useRouter()
  const { addToCart } = useCart()
  const { data: session } = useSession()

  useEffect(() => {
    async function fetchData() {
      try {
        const [menuResponse, categoriesResponse] = await Promise.all([
          fetch('/api/menu'),
          fetch('/api/categories')
        ])

        if (!menuResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const menuData = await menuResponse.json()
        const categoriesData = await categoriesResponse.json()

        setMenuItems(menuData)
        setCategories([{ id: 'all', name: 'All' }, ...categoriesData])
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: "Error",
          description: "Failed to load menu data. Please try again later.",
          variant: "destructive",
        })
      }
    }
    fetchData()
  }, [])

  const filteredItems = filter === 'all'
    ? menuItems
    : menuItems.filter(item => item.category.id === filter)

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item)

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  const handleWhatsAppOrder = (item: MenuItem) => {
    if (session) {
      const message = encodeURIComponent(
        `Hello, I'd like to order:\n\n` +
        `Item: ${item.name}\n` +
        `Price: $${item.price.toFixed(2)}\n` +
        `Category: ${item.category.name}\n` +
        `Image: ${window.location.origin}${item.image}\n` +
        `Full URL: ${window.location.origin}/menu/${item.id}\n\n` +
        `Total: $${item.price.toFixed(2)}`
      )
      const whatsappUrl = `https://wa.me/22798241163?text=${message}`
      window.open(whatsappUrl, '_blank')
    } else {
      setSelectedItem(item)
      setIsLoginDialogOpen(true)
    }
  }

  const handleLoginSuccess = () => {
    setIsLoginDialogOpen(false)
    if (selectedItem) {
      handleWhatsAppOrder(selectedItem)
    }
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Menu</h1>
      <div className="flex justify-center space-x-4 mb-8">
        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setFilter(category.id)}
            variant={filter === category.id ? 'default' : 'outline'}
          >
            {category.name}
          </Button>
        ))}
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link href={`/menu/${item.id}`} className="flex flex-col h-full">
              <Image src={item.image} alt={item.name} width={300} height={200} className="w-full object-cover h-48" />
              <div className="p-4 flex-grow">
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-muted-foreground mb-2">{item.description}</p>
                <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
              </div>
            </Link>
            <div className="p-4 space-y-2">
              <Button onClick={() => handleAddToCart(item)} className="w-full">Add to Cart</Button>
              <Button onClick={() => handleWhatsAppOrder(item)} className="w-full" variant="secondary">
                Order on WhatsApp
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              Please log in or create an account to order via WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <LoginForm onSuccess={handleLoginSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

