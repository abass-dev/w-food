'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import LoginForm from '@/components/LoginForm'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role === 'ADMIN' && callbackUrl?.startsWith('/admin')) {
        router.push(callbackUrl)
      } else {
        router.push('/')
      }
    }
  }, [status, router, callbackUrl, session])

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        if (result.error === 'Please verify your email before logging in.') {
          toast({
            title: "Email Verification Required",
            description: "Please check your email and verify your account before logging in.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        })
        // The router.push is handled in the useEffect hook
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (status === 'authenticated') {
    return null
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
      <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}

