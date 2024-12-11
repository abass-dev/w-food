"use client"

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import { Menu, X } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/reservations', label: 'Reservations' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const { data: session } = useSession()

  return (
    <header className="bg-background shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-foreground">
            Wajabatt Food
          </Link>
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-foreground hover:text-foreground/80">
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <span className="mr-2">Welcome, {session.user?.name || 'User'}</span>
                <Button variant="outline" onClick={() => signOut()}>Logout</Button>
              </>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <div className="hidden md:block">
              <Button variant="outline">Order Now</Button>
              <Button className="ml-2">Reserve</Button>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </nav>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-foreground hover:text-foreground/80"
                  onClick={toggleMenu}
                >
                  {item.label}
                </Link>
              ))}
              {session ? (
                <>
                  <Button variant="outline" onClick={() => signOut()} className="w-full">Logout</Button>
                </>
              ) : (
                <Button variant="outline" asChild className="w-full">
                  <Link href="/login">Login</Link>
                </Button>
              )}
              <Button variant="outline" className="w-full">Order Now</Button>
              <Button className="w-full">Reserve</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

