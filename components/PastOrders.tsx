"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'

interface OrderItem {
    id: string
    menuItem: {
        name: string
    }
    quantity: number
    price: number
}

interface Order {
    id: string
    createdAt: string
    status: string
    total: number
    items: OrderItem[]
}

export default function PastOrders() {
    const { data: session } = useSession()
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (session?.user?.id) {
            fetchOrders()
        } else {
            setIsLoading(false)
        }
    }, [session])

    async function fetchOrders() {
        try {
            const response = await fetch('/api/user/orders')
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`)
            }
            const data = await response.json()
            console.log('Received data:', data)
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format received from the server')
            }
            setOrders(data)
            setError(null)
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error fetching orders:', error.message)
                setError(error.message)
            } else {
                console.error('Unknown error fetching orders')
                setError('Unknown error fetching orders')
            }
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <Loader2 className="h-8 w-8 animate-spin" />
    }

    if (error) {
        return <p>Error: {error}</p>
    }

    if (orders.length === 0) {
        return <p>You haven't placed any orders yet.</p>
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <Card key={order.id}>
                    <CardHeader>
                        <CardTitle>Order #{order.id.slice(-6)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <p>Status: {order.status}</p>
                        <p>Total: ${order.total.toFixed(2)}</p>
                        <ul className="mt-2">
                            {order.items.map((item) => (
                                <li key={item.id}>
                                    {item.menuItem.name} x{item.quantity} - ${item.price.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

