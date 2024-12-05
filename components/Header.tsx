import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'

export default function Header() {
  return (
    <header className="bg-background shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-foreground">
          Wajabatt Food
        </Link>
        <div className="hidden md:flex space-x-4">
          <Link href="/" className="text-foreground hover:text-foreground/80">Home</Link>
          <Link href="/menu" className="text-foreground hover:text-foreground/80">Menu</Link>
          <Link href="/reservations" className="text-foreground hover:text-foreground/80">Reservations</Link>
          <Link href="/about" className="text-foreground hover:text-foreground/80">About Us</Link>
          <Link href="/contact" className="text-foreground hover:text-foreground/80">Contact</Link>
        </div>
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <Button variant="outline">Order Now</Button>
          <Button>Reserve</Button>
        </div>
      </nav>
    </header>
  )
}

