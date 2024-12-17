"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

export default function NewsletterSignup() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            if (!response.ok) {
                throw new Error('Failed to subscribe')
            }

            toast({
                title: "Subscribed!",
                description: "Thank you for subscribing to our newsletter.",
            })
            setEmail('')
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to subscribe. Please try again later.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="bg-primary text-primary-foreground py-12 md:py-24">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Stay Updated</h2>
                <p className="text-center mb-8 max-w-2xl mx-auto">
                    Subscribe to our newsletter for exclusive offers, new menu items, and special events.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-md mx-auto">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full md:w-auto flex-grow"
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Subscribing...' : 'Subscribe'}
                    </Button>
                </form>
            </div>
        </section>
    )
}

