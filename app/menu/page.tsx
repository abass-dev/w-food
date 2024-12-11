"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCart } from '@/contexts/CartContext'
import { toast } from '@/components/ui/use-toast'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: {
    id: string
    name: string
  }
}

interface Category {
  id: string
  name: string
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filter, setFilter] = useState('all')

  const router = useRouter()
  const { data: session } = useSession()
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchData() {
      const menuResponse = await fetch('/api/menu')
      const menuData = await menuResponse.json()
      setMenuItems(menuData)

      const categoriesResponse = await fetch('/api/categories')
      const categoriesData = await categoriesResponse.json()
      setCategories([{ id: 'all', name: 'All' }, ...categoriesData])
    }
    fetchData()
  }, [])

  const filteredItems = filter === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category.id === filter)

  const handleAddToCart = (item: MenuItem) => {
    if (!session) {
      router.push('/login?redirect=/menu')
      return
    }
    
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1
    })
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
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
            <Image src={item.image} alt={item.name} width={300} height={200} className="w-full object-cover h-48" />
            <div className="p-4 flex-grow">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-muted-foreground mb-2">{item.description}</p>
              <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
            </div>
            <div className="p-4">
              <Button onClick={() => handleAddToCart(item)} className="w-full">Add to Cart</Button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

