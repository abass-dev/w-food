import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Prisma } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: Prisma.Decimal | number | string | null | undefined): number {
  if (typeof price === 'object' && price !== null && 'toNumber' in price) {
    return price.toNumber()
  }
  if (typeof price === 'number') {
    return price
  }
  if (typeof price === 'string') {
    return parseFloat(price)
  }
  return 0
}

export function convertPrismaItem<T extends { price: Prisma.Decimal }>(item: T): Omit<T, 'price'> & { price: number } {
  return {
    ...item,
    price: formatPrice(item.price)
  }
}

