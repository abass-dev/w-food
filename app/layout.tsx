import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Wajabatt Food Restaurant',
  description: 'Experience exquisite cuisine at Wajabatt Food Restaurant',
  keywords: ['restaurant', 'fine dining', 'cuisine', 'reservations', 'menu'],
  openGraph: {
    title: 'Wajabatt Food Restaurant',
    description: 'Experience exquisite cuisine at Wajabatt Food Restaurant',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

