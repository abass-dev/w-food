"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from '@/hooks/use-toast'
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
    customerName: string
    customerEmail: string
    customerPhone: string
    items: OrderItem[]
    customer: {
        id: string
        name: string
        email: string
        phone: string | null
    } | null
}

export default function AdminOrders() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/admin/orders')
        } else if (status === 'authenticated' && session.user.role !== 'ADMIN') {
            router.push('/')
        } else if (status === 'authenticated' && session.user.role === 'ADMIN') {
            fetchOrders()
        }
    }, [status, session, router])

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/admin/orders')
            if (!response.ok) {
                throw new Error('Failed to fetch orders')
            }
            const data = await response.json()
            setOrders(data)
        } catch (error) {
            console.error('Error fetching orders:', error)
            toast({
                title: "Error",
                description: "Failed to load orders. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            })
            if (!response.ok) {
                throw new Error('Failed to update order status')
            }
            const updatedOrder = await response.json()
            setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order))
            toast({
                title: "Success",
                description: "Order status updated successfully.",
            })
        } catch (error) {
            console.error('Error updating order status:', error)
            toast({
                title: "Error",
                description: "Failed to update order status. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return <Loader2 className="h-8 w-8 animate-spin" />
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order.id}>
                        <CardHeader>
                            <CardTitle>Order #{order.id.slice(-6)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                            <p>Customer: {order.customer ? order.customer.name : order.customerName}</p>
                            <p>Email: {order.customer ? order.customer.email : order.customerEmail}</p>
                            <p>Phone: {order.customer ? order.customer.phone : order.customerPhone}</p>
                            <p>Total: ${order.total}</p>
                            <h3 className="font-semibold mt-2">Items:</h3>
                            <ul>
                                {order.items.map((item) => (
                                    <li key={item.id}>
                                        {item.menuItem.name} x{item.quantity} - ${item.price}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex items-center space-x-2 mt-4">
                                <Select
                                    defaultValue={order.status}
                                    onValueChange={(value) => handleStatusChange(order.id, value)}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                        <SelectItem value="PREPARING">Preparing</SelectItem>
                                        <SelectItem value="READY">Ready</SelectItem>
                                        <SelectItem value="DELIVERED">Delivered</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

