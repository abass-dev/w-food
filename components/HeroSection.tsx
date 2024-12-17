"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false)

    useEffect(() => {
        const video = document.querySelector('video')
        if (video) {
            video.addEventListener('loadeddata', () => setIsVideoLoaded(true))
        }
        return () => {
            if (video) {
                video.removeEventListener('loadeddata', () => setIsVideoLoaded(true))
            }
        }
    }, [])

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <video
                autoPlay
                loop
                muted
                playsInline
                className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
            >
                <source src="/videos/restaurant-ambience.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <div className="relative z-10 text-center text-white">
                <motion.h1
                    className="text-4xl md:text-6xl font-bold mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    Welcome to Wajabatt Food
                </motion.h1>
                <motion.p
                    className="text-xl md:text-2xl mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    Experience exquisite cuisine in a warm, inviting atmosphere
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                >
                    <Button asChild size="lg" className="mr-4">
                        <Link href="/menu">View Menu</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/reservations">Make a Reservation</Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}

