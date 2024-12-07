import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string | null | undefined): number {
  if (typeof price === 'number') {
    return price
  }
  if (typeof price === 'string') {
    const parsedPrice = parseFloat(price)
    return isNaN(parsedPrice) ? 0 : parsedPrice
  }
  return 0
}

export function convertPrismaItem<T extends { price: any }>(item: T): Omit<T, 'price'> & { price: number } {
  return {
    ...item,
    price: formatPrice(item.price)
  }
}

