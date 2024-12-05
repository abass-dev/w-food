import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">Wajabatt Food</h2>
            <p className="mt-2">Exquisite cuisine for every palate</p>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <Link href="/menu" className="hover:text-secondary-foreground/80">Menu</Link>
            <Link href="/reservations" className="hover:text-secondary-foreground/80">Reservations</Link>
            <Link href="/about" className="hover:text-secondary-foreground/80">About Us</Link>
            <Link href="/contact" className="hover:text-secondary-foreground/80">Contact</Link>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2023 Wajabatt Food Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

