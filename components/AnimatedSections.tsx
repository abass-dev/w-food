"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AnimatedTitle({ children }: { children: React.ReactNode }) {
    return (
        <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            {children}
        </motion.h2>
    )
}

export function AnimatedText({ children }: { children: React.ReactNode }) {
    return (
        <motion.p
            className="text-center text-lg mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            {children}
        </motion.p>
    )
}

export function AnimatedExperienceSection() {
    return (
        <section className="bg-primary/5 py-12 md:py-24">
            <div className="container mx-auto px-4">
                <AnimatedTitle>Experience Wajabatt Food</AnimatedTitle>
                <AnimatedText>
                    Immerse yourself in a world of exquisite flavors and unforgettable dining experiences.
                    From our carefully crafted menu to our warm, inviting atmosphere, every detail is
                    designed to delight your senses.
                </AnimatedText>
                <div className="flex justify-center space-x-4">
                    <Button asChild>
                        <Link href="/menu">Explore Our Menu</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/reservations">Make a Reservation</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

