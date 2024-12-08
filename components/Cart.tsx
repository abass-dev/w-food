"use client"

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import { removeFromCart, updateQuantity, clearCart } from '@/lib/redux/cartSlice'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function Cart() {
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const dispatch = useDispatch()

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id))
  }

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id, quantity: newQuantity }))
    } else {
      dispatch(removeFromCart(id))
    }
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  if (cartItems.length === 0) {
    return <div className="text-center py-4">Your cart is empty</div>
  }

  return (
    <div className="p-4">
      {cartItems.map((item) => (
        <div key={item.id} className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-md mr-4" />
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
            >
              -
            </Button>
            <span className="mx-2">{item.quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
            >
              +
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveItem(item.id)}
              className="ml-2"
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
      <div className="mt-4 flex justify-between items-center">
        <p className="font-semibold">Total: ${totalPrice.toFixed(2)}</p>
        <div>
          <Button variant="outline" onClick={handleClearCart} className="mr-2">
            Clear Cart
          </Button>
          <Button>Checkout</Button>
        </div>
      </div>
    </div>
  )
}

