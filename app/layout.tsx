import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AuthProvider from '@/components/AuthProvider'
import { CartProvider } from '@/contexts/CartContext'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from '@/components/Providers'
import { store, persistor } from '@/lib/redux/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

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
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Providers>
              <AuthProvider>
                <CartProvider>
                  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <Header />
                    <main className="min-h-screen">{children}</main>
                    <Footer />
                    <Toaster />
                  </ThemeProvider>
                </CartProvider>
              </AuthProvider>
            </Providers>
          </PersistGate>
        </Provider>
      </body>
    </html>
  )
}

