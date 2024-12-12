"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Minus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCart } from '@/contexts/CartContext'
import { toast } from '@/hooks/use-toast'
import { MenuItem } from '@/types/menu'

interface Category {
  id: string
  name: string
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filter, setFilter] = useState('all')
  const [itemQuantities, setItemQuantities] = useState<{[key: string]: number}>({})

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
      router.push('/login?redirect=/menu');
      return;
    }
    
    const quantity = itemQuantities[item.id] || 1;
    addToCart({...item, quantity});
    
    toast({
      title: "Added to cart",
      description: `${quantity} ${quantity > 1 ? 'items' : 'item'} of ${item.name} ${quantity > 1 ? 'have' : 'has'} been added to your cart.`,
    });

    // Reset the quantity after adding to cart
    setItemQuantities(prev => ({ ...prev, [item.id]: 1 }));
  }

  const incrementQuantity = (itemId: string) => {
    setItemQuantities(prev => ({ ...prev, [itemId]: (prev[itemId] || 1) + 1 }))
  }

  const decrementQuantity = (itemId: string) => {
    setItemQuantities(prev => ({ ...prev, [itemId]: Math.max((prev[itemId] || 1) - 1, 1) }))
  }

  const handleQuantityChange = (itemId: string, value: string) => {
    const quantity = parseInt(value, 10)
    if (!isNaN(quantity) && quantity > 0) {
      setItemQuantities(prev => ({ ...prev, [itemId]: quantity }))
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
            <Image src={item.image} alt={item.name} width={300} height={200} className="w-full object-cover h-48" />
            <div className="p-4 flex-grow">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-muted-foreground mb-2">{item.description}</p>
              <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Button variant="outline" size="icon" onClick={() => decrementQuantity(item.id)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={itemQuantities[item.id] || 1}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    className="w-16 mx-2 text-center"
                  />
                  <Button variant="outline" size="icon" onClick={() => incrementQuantity(item.id)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={() => handleAddToCart(item)}>Add to Cart</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

