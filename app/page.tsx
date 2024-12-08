"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MenuCarousel } from '@/components/MenuCarousel'
import { MenuItem } from '@/types/menu'

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([])

  useEffect(() => {
    async function fetchFeaturedItems() {
      try {
        const response = await fetch('/api/featured-menu')
        const data = await response.json()
        setFeaturedItems(data)
      } catch (error) {
        console.error('Error fetching featured items:', error)
      }
    }
    fetchFeaturedItems()
  }, [])

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <Link href={`/menu/${item.id}`} key={item.id}>
              <motion.div 
                className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image src={item.image} alt={item.name} width={300} height={200} className="w-full" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                  <p className="mt-2 font-bold">${item.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground mt-1">Category: {item.category.name}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Featured Menu Items</h2>
        <MenuCarousel items={featuredItems} />
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
    </div>
  )
}

