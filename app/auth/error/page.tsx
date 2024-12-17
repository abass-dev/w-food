'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthError() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
            <p className="mb-4">
                {error === 'OAuthAccountNotLinked'
                    ? "It looks like you've already signed up with a different method. Please try signing in with the method you used originally."
                    : "An error occurred during authentication. Please try again."}
            </p>
            <Button asChild>
                <Link href="/login">Return to Login</Link>
            </Button>
        </div>
    )
}

