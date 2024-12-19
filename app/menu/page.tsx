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
import { Heart, Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { createWhatsAppOrder } from '@/lib/orderUtils'
import { signIn } from 'next-auth/react'

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filter, setFilter] = useState('all')
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredItems = menuItems
    .filter(item => filter === 'all' || item.category.id === filter)
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item)

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  const handleWhatsAppOrder = (item: MenuItem) => {
    if (session) {
      router.push(`/order?id=${item.id}&quantity=1`);
    } else {
      setSelectedItem(item)
      setIsLoginDialogOpen(true)
    }
  }

  const handleLoginSuccess = () => {
    setIsLoginDialogOpen(false);
    if (selectedItem) {
      router.push(`/order?id=${selectedItem.id}&quantity=1`);
    }
  };

  const handleLoginSubmit = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      handleLoginSuccess();
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    }
  };

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

      setMenuItems(prevItems =>
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

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Menu</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex flex-wrap justify-center gap-4 mb-4 md:mb-0">
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
        <div className="relative w-full md:w-64">
          <Input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
              <div className="flex justify-between items-center">
                <Button onClick={() => handleAddToCart(item)} className="flex-grow mr-2">Add to Cart</Button>
                <Button
                  onClick={() => handleToggleFavorite(item)}
                  variant="outline"
                  className="p-2"
                  aria-label={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`h-5 w-5 ${item.isFavorite ? 'fill-current text-red-500' : ''}`} />
                </Button>
              </div>
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
              Please log in or create an account to add favorites or order via WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <LoginForm
            onSubmit={handleLoginSubmit}
            isLoading={false}
            onSuccess={handleLoginSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

