"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { Cart } from '@/components/Cart'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { VisuallyHidden } from './ui/visually-hidden'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/reservations', label: 'Reservations' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session, status } = useSession()
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header className="bg-background shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Wajabatt Food
            </Link>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-foreground hover:text-foreground/80 px-3 py-2 rounded-md text-sm font-medium ${pathname === item.href ? 'bg-primary/10' : ''
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <Cart />
            <ModeToggle />
            {status === 'authenticated' ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {session.user.name} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => signOut()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
            <Button variant="outline">Order Now</Button>
            <Button>Reserve</Button>
          </div>
          <div className="flex lg:hidden items-center space-x-2">
            <Cart />
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-foreground hover:text-foreground/80 px-3 py-2 rounded-md text-sm font-medium ${pathname === item.href ? 'bg-primary/10' : ''
                        }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {status === 'authenticated' ? (
                    <>
                      <span className="px-3 py-2 text-sm font-medium">Welcome, {session.user.name}</span>
                      <Button variant="outline" onClick={() => signOut()} className="w-full">
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login">
                        Login
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" className="w-full">
                    Order Now
                  </Button>
                  <Button className="w-full">
                    Reserve
                  </Button>
                </nav>
                <VisuallyHidden>
                  <SheetTitle>Menu</SheetTitle>
                </VisuallyHidden>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}

