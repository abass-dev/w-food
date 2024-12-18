"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface Reservation {
    id: string
    restaurantId: string
    dateTime: string
    partySize: number
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
    restaurant: {
        name: string
    }
}

export default function Reservations() {
    const { data: session, status } = useSession()
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
    const [editDate, setEditDate] = useState('')
    const [editTime, setEditTime] = useState('')
    const [editPartySize, setEditPartySize] = useState('')

    useEffect(() => {
        if (status === 'authenticated') {
            fetchReservations()
        } else if (status === 'unauthenticated') {
            setIsLoading(false)
            toast({
                title: "Error",
                description: "You must be logged in to view reservations.",
                variant: "destructive",
            })
        }
    }, [status])

    const fetchReservations = async () => {
        try {
            const response = await fetch('/api/reservations')
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to fetch reservations')
            }
            const data = await response.json()
            console.log('Fetched reservations:', data)
            setReservations(data)
        } catch (error) {
            console.error('Error fetching reservations:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to load reservations. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancelReservation = async (id: string) => {
        try {
            const response = await fetch(`/api/reservations?id=${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to cancel reservation')
            }
            const data = await response.json()
            if (data.success) {
                setReservations(reservations.filter(res => res.id !== id))
                toast({
                    title: "Success",
                    description: "Reservation cancelled successfully.",
                })
            } else {
                throw new Error('Failed to cancel reservation')
            }
        } catch (error) {
            console.error('Error cancelling reservation:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to cancel reservation. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleEditReservation = (reservation: Reservation) => {
        setEditingReservation(reservation)
        const date = new Date(reservation.dateTime)
        setEditDate(date.toISOString().split('T')[0])
        setEditTime(date.toTimeString().split(' ')[0].slice(0, 5))
        setEditPartySize(reservation.partySize.toString())
    }

    const handleSaveEdit = async () => {
        if (!editingReservation) return

        try {
            const response = await fetch(`/api/reservations`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingReservation.id,
                    dateTime: `${editDate}T${editTime}:00Z`,
                    partySize: parseInt(editPartySize, 10),
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to update reservation')
            }

            const data = await response.json()
            if (data.success) {
                setReservations(reservations.map(res =>
                    res.id === editingReservation.id ? { ...res, ...data.reservation } : res
                ))
                setEditingReservation(null)
                toast({
                    title: "Success",
                    description: "Reservation updated successfully.",
                })
            } else {
                throw new Error('Failed to update reservation')
            }
        } catch (error) {
            console.error('Error updating reservation:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update reservation. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return <Loader2 className="h-8 w-8 animate-spin" />
    }

    if (status === 'unauthenticated') {
        return <p>Please log in to view your reservations.</p>
    }

    if (reservations.length === 0) {
        return <p>You have no reservations.</p>
    }

    return (
        <div className="space-y-4">
            {reservations.map((reservation) => (
                <Card key={reservation.id}>
                    <CardHeader>
                        <CardTitle>{reservation.restaurant.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Date: {new Date(reservation.dateTime).toLocaleDateString()}</p>
                        <p>Time: {new Date(reservation.dateTime).toLocaleTimeString()}</p>
                        <p>Party Size: {reservation.partySize}</p>
                        <p>Status: {reservation.status}</p>
                        {reservation.status !== 'CANCELLED' && (
                            <div className="mt-2 space-x-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button onClick={() => handleEditReservation(reservation)}>
                                            Edit Reservation
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Reservation</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="edit-date">Date</label>
                                                <Input
                                                    id="edit-date"
                                                    type="date"
                                                    value={editDate}
                                                    onChange={(e) => setEditDate(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="edit-time">Time</label>
                                                <Input
                                                    id="edit-time"
                                                    type="time"
                                                    value={editTime}
                                                    onChange={(e) => setEditTime(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="edit-party-size">Party Size</label>
                                                <Input
                                                    id="edit-party-size"
                                                    type="number"
                                                    value={editPartySize}
                                                    onChange={(e) => setEditPartySize(e.target.value)}
                                                />
                                            </div>
                                            <Button onClick={handleSaveEdit}>Save Changes</Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <Button onClick={() => handleCancelReservation(reservation.id)} variant="destructive">
                                    Cancel Reservation
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

