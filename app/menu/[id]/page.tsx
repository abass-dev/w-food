"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MenuItem, CartItem } from '@/types/menu'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/lib/redux/cartSlice'
import { AppDispatch } from '@/lib/redux/store'
import { toast } from '@/hooks/use-toast'
import { MenuItemSkeleton } from '@/components/MenuItemSkeleton'
import { useSession } from 'next-auth/react'
import LoginForm from '@/components/LoginForm'
import { ReviewsRatings } from '@/components/ReviewsRatings'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { signIn } from 'next-auth/react';

export default function MenuItemPage() {
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { data: session } = useSession()
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchMenuItem() {
      try {
        const id = params.id as string
        const response = await fetch(`/api/menu/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch menu item')
        }
        const data = await response.json()
        setMenuItem(data)
      } catch (error) {
        console.error('Error fetching menu item:', error)
        toast({
          title: "Error",
          description: "Failed to load menu item. Please try again later.",
          variant: "destructive",
        })
        router.push('/menu')
      } finally {
        setIsLoading(false)
      }
    }
    fetchMenuItem()
  }, [params.id, router])

  const handleAddToCart = () => {
    if (menuItem) {
      const cartItem: CartItem = { ...menuItem, quantity }
      dispatch(addToCart(cartItem))
      toast({
        title: "Added to cart",
        description: `${quantity} ${menuItem.name} added to your cart.`,
      })
    }
  }

  const handleWhatsAppOrder = async () => {
    if (session && menuItem) {
      try {
        setIsLoading(true);
        const orderData = {
          menuItemId: menuItem.id,
          quantity: quantity,
          total: menuItem.price * quantity,
        };
        console.log('Sending order data:', orderData);
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create order');
        }

        const order = await response.json();
        console.log('Received order:', order);

        const message = encodeURIComponent(
          `Hello, I'd like to confirm my order:

Order #${order.id}
Item: ${quantity} x ${menuItem.name}
Total: $${order.total}

Customer: ${order.customerName}
Email: ${order.customerEmail}
Phone: ${order.customerPhone}

Please confirm my order. Thank you!`
        );
        const whatsappUrl = `https://wa.me/22798241163?text=${message}`;
        window.open(whatsappUrl, '_blank');

        toast({
          title: "Order Created",
          description: "Your order has been created and sent via WhatsApp.",
        });
      } catch (error) {
        console.error('Error creating order:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create order. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoginDialogOpen(true);
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
      setIsLoginDialogOpen(false);
      handleWhatsAppOrder(); // Attempt to create the order after successful login
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <MenuItemSkeleton />
  }

  if (!menuItem) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Menu Item Not Found</h1>
        <p className="mb-4">Sorry, we couldn't find the menu item you're looking for.</p>
        <Button onClick={() => router.push('/menu')}>Return to Menu</Button>
      </div>
    )
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
              aria-label="Decrease quantity"
            >
              -
            </Button>
            <span className="text-xl">{quantity}</span>
            <Button
              variant="outline"
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
            >
              +
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            <Button onClick={handleAddToCart} className="w-full">
              Add to Cart
            </Button>
            <Button onClick={handleWhatsAppOrder} className="w-full" variant="secondary">
              Order on WhatsApp
            </Button>
          </div>
        </div>
      </motion.div>
      <ReviewsRatings menuItemId={menuItem.id} />
      <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              Please log in or create an account to order via WhatsApp.
            </DialogDescription>
          </DialogHeader>
          <LoginForm onSubmit={handleLoginSubmit} isLoading={isLoading} onSuccess={() => { }} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

