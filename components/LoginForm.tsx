"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visually-hidden"

interface LoginFormProps {
    onSuccess: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            })
            if (result?.error) {
                if (result.error === 'Please verify your email before logging in.') {
                    setError('Please check your email and verify your account before logging in.')
                } else {
                    setError('Invalid email or password')
                }
            } else {
                onSuccess()
            }
        } catch (error) {
            console.error('Login error:', error)
            setError('An unexpected error occurred. Please try again.')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <DialogTitle asChild>
                <VisuallyHidden>Login to your account</VisuallyHidden>
            </DialogTitle>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full">Login</Button>
            <p className="text-center">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline">
                    Sign up
                </Link>
            </p>
        </form>
    )
}

