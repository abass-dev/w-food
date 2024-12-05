"use client"

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const menuItems = [
  { name: 'Appetizer 1', description: 'Delicious appetizer description', price: '$10', category: 'appetizer', image: '/images/appetizer1.jpg' },
  { name: 'Main Course 1', description: 'Mouth-watering main course description', price: '$25', category: 'main', image: '/images/main-course1.jpg' },
  { name: 'Dessert 1', description: 'Sweet dessert description', price: '$8', category: 'dessert', image: '/images/dessert1.jpg' },
  { name: 'Appetizer 2', description: 'Another tasty appetizer', price: '$12', category: 'appetizer', image: '/images/appetizer1.jpg' },
  { name: 'Main Course 2', description: 'Savory main course option', price: '$22', category: 'main', image: '/images/main-course1.jpg' },
  { name: 'Dessert 2', description: 'Indulgent dessert choice', price: '$9', category: 'dessert', image: '/images/dessert1.jpg' },
]

export default function MenuPage() {
  const [filter, setFilter] = useState('all')

  const filteredItems = filter === 'all' ? menuItems : menuItems.filter(item => item.category === filter)

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Menu</h1>
      <div className="flex justify-center space-x-4 mb-8">
        <Button onClick={() => setFilter('all')} variant={filter === 'all' ? 'default' : 'outline'}>All</Button>
        <Button onClick={() => setFilter('appetizer')} variant={filter === 'appetizer' ? 'default' : 'outline'}>Appetizers</Button>
        <Button onClick={() => setFilter('main')} variant={filter === 'main' ? 'default' : 'outline'}>Main Courses</Button>
        <Button onClick={() => setFilter('dessert')} variant={filter === 'dessert' ? 'default' : 'outline'}>Desserts</Button>
      </div>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filteredItems.map((item, index) => (
          <motion.div 
            key={index} 
            className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden flex"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Image src={item.image} alt={item.name} width={150} height={150} className="w-1/3 object-cover" />
            <div className="p-4 w-2/3">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-muted-foreground mb-2">{item.description}</p>
              <p className="text-lg font-bold">{item.price}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

