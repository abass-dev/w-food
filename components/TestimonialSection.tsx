"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const testimonials = [
    {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Food Critic',
        image: '/images/main-course1.jpg',
        quote: 'Wajabatt Food offers an unparalleled dining experience. The flavors are exquisite, and the atmosphere is simply enchanting.',
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Regular Customer',
        image: '/images/main-course1.jpg',
        quote: 'I have been coming to Wajabatt Food for years, and they never fail to impress.The quality and consistency are remarkable.',
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        role: 'Local Food Blogger',
        image: '/images/main-course1.jpg',
        quote: 'From the innovative menu to the impeccable service, Wajabatt Food sets the standard for fine dining in our city.',
    },
]

export default function TestimonialSection() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
    }

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }

    return (
        <section className="bg-secondary py-12 md:py-24">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Customers Say</h2>
                <div className="relative max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center text-center"
                        >
                            <Image
                                src={testimonials[currentIndex].image}
                                alt={testimonials[currentIndex].name}
                                width={100}
                                height={100}
                                className="rounded-full mb-6"
                            />
                            <p className="text-xl md:text-2xl italic mb-6">&ldquo;{testimonials[currentIndex].quote}&rdquo;</p>
                            <h3 className="text-lg font-semibold">{testimonials[currentIndex].name}</h3>
                            <p className="text-muted-foreground">{testimonials[currentIndex].role}</p>
                        </motion.div>
                    </AnimatePresence>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-0 top-1/2 transform -translate-y-1/2"
                        onClick={handlePrev}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2"
                        onClick={handleNext}
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </section>
    )
}

