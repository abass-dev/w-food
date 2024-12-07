"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MenuItem, Category } from '@/types/menu'

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    async function fetchData() {
      try {
        const [menuResponse, categoriesResponse] = await Promise.all([
          fetch('/api/menu'),
          fetch('/api/categories')
        ])
        const menuData = await menuResponse.json()
        const categoriesData = await categoriesResponse.json()
        
        setMenuItems(menuData)
        setCategories([{ id: 'all', name: 'All' }, ...categoriesData])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const filteredItems = filter === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category.id === filter)

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
            className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden flex"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Image src={item.image} alt={item.name} width={150} height={150} className="w-1/3 object-cover" />
            <div className="p-4 w-2/3">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-muted-foreground mb-2">{item.description}</p>
              <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

