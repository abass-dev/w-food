'use client'

import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShoppingCart, Plus, Minus, X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = getCartTotal();

  const handleQuantityChange = (id: string, value: string) => {
    const quantity = parseInt(value, 10)
    if (!isNaN(quantity) && quantity >= 0) {
      updateQuantity(id, quantity)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <ShoppingCart className="mr-2 h-4 w-4" />
          <span>{totalItems} items</span>
          <span className="ml-2">${totalPrice.toFixed(2)}</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            You have {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-4">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  className="w-16 text-center"
                />
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="font-semibold">Total:</span>
          <span className="font-semibold">${totalPrice.toFixed(2)}</span>
        </div>
        <Button className="w-full mt-8">Proceed to Checkout</Button>
      </SheetContent>
    </Sheet>
  )
}

