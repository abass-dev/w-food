'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type VerificationStatus = 'success' | 'error' | 'expired' | 'loading'

export default function VerifyEmailPage() {
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<VerificationStatus>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const status = searchParams.get('status') as VerificationStatus
        const message = searchParams.get('message')

        if (status && message) {
            setStatus(status)
            setMessage(decodeURIComponent(message))
        } else {
            setStatus('error')
            setMessage('Invalid verification link')
        }
    }, [searchParams])

    const renderIcon = () => {
        const iconProps = { className: 'w-16 h-16 mb-4' }
        switch (status) {
            case 'success':
                return (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    >
                        <CheckCircle {...iconProps} className={`${iconProps.className} text-green-500`} />
                    </motion.div>
                )
            case 'error':
                return <XCircle {...iconProps} className={`${iconProps.className} text-red-500`} />
            case 'expired':
                return <AlertCircle {...iconProps} className={`${iconProps.className} text-yellow-500`} />
            default:
                return null
        }
    }

    const renderMessage = () => {
        switch (status) {
            case 'success':
                return (
                    <>
                        <h1 className="text-2xl font-bold mb-2">Email Verified Successfully!</h1>
                        <p className="mb-4">{message}</p>
                        <Button asChild>
                            <Link href="/login">Proceed to Login</Link>
                        </Button>
                    </>
                )
            case 'error':
                return (
                    <>
                        <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
                        <p className="mb-4">{message}</p>
                        <Button asChild>
                            <Link href="/signup">Back to Sign Up</Link>
                        </Button>
                    </>
                )
            case 'expired':
                return (
                    <>
                        <h1 className="text-2xl font-bold mb-2">Verification Link Expired</h1>
                        <p className="mb-4">{message}</p>
                        <Button asChild>
                            <Link href="/api/auth/verify-email">Resend Verification Email</Link>
                        </Button>
                    </>
                )
            default:
                return <p>Verifying your email...</p>
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                {renderIcon()}
                {renderMessage()}
            </div>
        </div>
    )
}

