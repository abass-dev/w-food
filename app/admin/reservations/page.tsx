"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface Reservation {
    id: string
    userId: string
    restaurantId: string
    dateTime: string
    partySize: number
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
    user: {
        name: string
        email: string
    }
    restaurant: {
        name: string
    }
}

export default function AdminReservations() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/admin/reservations')
        } else if (status === 'authenticated' && session.user.role !== 'ADMIN') {
            router.push('/')
        } else if (status === 'authenticated' && session.user.role === 'ADMIN') {
            fetchReservations()
        }
    }, [status, session, router])

    const fetchReservations = async () => {
        try {
            const response = await fetch('/api/admin/reservations')
            if (!response.ok) {
                throw new Error('Failed to fetch reservations')
            }
            const data = await response.json()
            setReservations(data)
        } catch (error) {
            console.error('Error fetching reservations:', error)
            toast({
                title: "Error",
                description: "Failed to load reservations. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const response = await fetch('/api/admin/reservations', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, status: newStatus }),
            })
            if (!response.ok) {
                throw new Error('Failed to update reservation status')
            }
            toast({
                title: "Success",
                description: "Reservation status updated successfully.",
            })
        } catch (error) {
            console.error('Error updating reservation status:', error)
            toast({
                title: "Error",
                description: "Failed to update reservation status. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this reservation?')) {
            try {
                const response = await fetch(`/api/admin/reservations?id=${id}`, {
                    method: 'DELETE',
                })
                if (!response.ok) {
                    throw new Error('Failed to delete reservation')
                }
                setReservations(reservations.filter(res => res.id !== id))
                toast({
                    title: "Success",
                    description: "Reservation deleted successfully.",
                })
            } catch (error) {
                console.error('Error deleting reservation:', error)
                toast({
                    title: "Error",
                    description: "Failed to delete reservation. Please try again.",
                    variant: "destructive",
                })
            }
        }
    }

    if (isLoading) {
        return <Loader2 className="h-8 w-8 animate-spin" />
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Manage Reservations</h1>
            <div className="space-y-4">
                {reservations.map((reservation) => (
                    <Card key={reservation.id}>
                        <CardHeader>
                            <CardTitle>{reservation.restaurant.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>User: {reservation.user.name} ({reservation.user.email})</p>
                            <p>Date: {new Date(reservation.dateTime).toLocaleDateString()}</p>
                            <p>Time: {new Date(reservation.dateTime).toLocaleTimeString()}</p>
                            <p>Party Size: {reservation.partySize}</p>
                            <div className="flex items-center space-x-2 mt-2">
                                <Select
                                    defaultValue={reservation.status}
                                    onValueChange={(value) => handleStatusChange(reservation.id, value)}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={() => handleDelete(reservation.id)} variant="destructive">
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

