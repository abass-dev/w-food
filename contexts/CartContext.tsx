'use client'

import React, { createContext, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/lib/redux/store'
import { addToCart, removeFromCart, updateQuantity, clearCart } from '@/lib/redux/cartSlice'
import { MenuItem } from '@/types/menu'

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: MenuItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
}

interface CartItem extends MenuItem {
  quantity: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>()
  const cart = useSelector((state: RootState) => state.cart.items)

  const addToCartHandler = (item: MenuItem) => {
    dispatch(addToCart(item))
  }

  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart(id))
  }

  const updateQuantityHandler = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }))
  }

  const clearCartHandler = () => {
    dispatch(clearCart())
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart: addToCartHandler,
        removeFromCart: removeFromCartHandler,
        updateQuantity: updateQuantityHandler,
        clearCart: clearCartHandler,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

