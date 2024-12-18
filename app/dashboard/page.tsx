"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import PastOrders from '@/components/PastOrders'
import Preferences from '@/components/Preferences'
import FavoriteDishes from '@/components/FavoriteDishes'
import Reservations from '@/components/Reservations'

export default function Dashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            setIsLoading(false)
        }
    }, [status, router])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
        >
            <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
            <Tabs defaultValue="orders">
                <TabsList className="mb-4">
                    <TabsTrigger value="orders">Past Orders</TabsTrigger>
                    <TabsTrigger value="reservations">Reservations</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    <TabsTrigger value="favorites">Favorite Dishes</TabsTrigger>
                </TabsList>
                <TabsContent value="orders">
                    <Card>
                        <CardHeader>
                            <CardTitle>Past Orders</CardTitle>
                            <CardDescription>View your order history</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PastOrders />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="reservations">
                    <Card>
                        <CardHeader>
                            <CardTitle>Reservations</CardTitle>
                            <CardDescription>Manage your reservations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Reservations />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="preferences">
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferences</CardTitle>
                            <CardDescription>Manage your dietary preferences and restrictions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Preferences />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="favorites">
                    <Card>
                        <CardHeader>
                            <CardTitle>Favorite Dishes</CardTitle>
                            <CardDescription>Your favorite menu items</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FavoriteDishes />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </motion.div>
    )
}

