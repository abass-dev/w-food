"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MenuItem } from '@/types/menu'

export default function MenuItemPage() {
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null)
  const [quantity, setQuantity] = useState(1)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    async function fetchMenuItem() {
      try {
        const response = await fetch(`/api/menu/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch menu item')
        }
        const data = await response.json()
        setMenuItem(data)
      } catch (error) {
        console.error('Error fetching menu item:', error)
        // Redirect to menu page if item not found
        router.push('/menu')
      }
    }
    fetchMenuItem()
  }, [params.id, router])

  const handleAddToCart = () => {
    // TODO: Implement actual cart functionality
    console.log(`Added ${quantity} ${menuItem?.name} to cart`)
    alert(`Added ${quantity} ${menuItem?.name} to cart`)
  }

  if (!menuItem) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row gap-8"
      >
        <div className="md:w-1/2">
          <Image
            src={menuItem.image}
            alt={menuItem.name}
            width={600}
            height={400}
            className="rounded-lg object-cover w-full h-[400px]"
          />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold mb-4">{menuItem.name}</h1>
          <p className="text-xl text-muted-foreground mb-4">{menuItem.description}</p>
          <p className="text-2xl font-bold mb-6">${menuItem.price.toFixed(2)}</p>
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <span className="text-xl">{quantity}</span>
            <Button
              variant="outline"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
          <Button onClick={handleAddToCart} className="w-full">
            Add to Cart
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

