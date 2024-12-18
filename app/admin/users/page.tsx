"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface OrderItem {
    name: string
    quantity: number
    price: number
}

interface Order {
    id: string
    createdAt: string
    total: number
    status: string
    items: OrderItem[]
}

interface Review {
    id: string
    rating: number
    comment: string
    createdAt: string
    menuItemName: string
}

interface FavoriteDish {
    id: string
    name: string
}

interface User {
    id: string
    name: string
    email: string
    role: string
    phoneNumber: string | null
    createdAt: string
    emailVerified: string | null
    orders: Order[]
    reviews: Review[]
    favoriteDishes: FavoriteDish[]
    image: string | null
}

export default function AdminUsers() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingUser, setEditingUser] = useState<User | null>(null)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/admin/users')
        } else if (status === 'authenticated' && session.user.role !== 'ADMIN') {
            router.push('/')
        } else if (status === 'authenticated' && session.user.role === 'ADMIN') {
            fetchUsers()
        }
    }, [status, session, router])

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users')
            if (!response.ok) {
                throw new Error('Failed to fetch users')
            }
            const data = await response.json()
            setUsers(data)
        } catch (error) {
            console.error('Error fetching users:', error)
            toast({
                title: "Error",
                description: "Failed to load users. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditUser = (user: User) => {
        setEditingUser(user)
    }

    const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!editingUser) return

        try {
            const response = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingUser),
            })
            if (!response.ok) {
                throw new Error('Failed to update user')
            }
            const updatedUser = await response.json()
            setUsers(users.map(user => user.id === updatedUser.user.id ? { ...user, ...updatedUser.user } : user))
            setEditingUser(null)
            toast({
                title: "Success",
                description: "User updated successfully.",
            })
        } catch (error) {
            console.error('Error updating user:', error)
            toast({
                title: "Error",
                description: "Failed to update user. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleDeleteUser = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                const response = await fetch(`/api/admin/users?id=${id}`, {
                    method: 'DELETE',
                })
                if (!response.ok) {
                    throw new Error('Failed to delete user')
                }
                setUsers(users.filter(user => user.id !== id))
                toast({
                    title: "Success",
                    description: "User deleted successfully.",
                })
            } catch (error) {
                console.error('Error deleting user:', error)
                toast({
                    title: "Error",
                    description: "Failed to delete user. Please try again.",
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
            <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
            <div className="space-y-4">
                {users.map((user) => (
                    <Card key={user.id}>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex items-center space-x-2">
                                    <Avatar>
                                        <AvatarImage src={user.image || 'https://placehold.co/60'} alt={user.name} />
                                        <AvatarFallback> {user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    {user.name}
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Email: {user.email}</p>
                            <p>Role: {user.role}</p>
                            <p>Phone Number: {user.phoneNumber || 'Not provided'}</p>
                            <p>Created At: {new Date(user.createdAt).toLocaleDateString()}</p>
                            <p>Email Verified: {user.emailVerified ? 'Yes' : 'No'}</p>

                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="orders">
                                    <AccordionTrigger>Orders ({user.orders.length})</AccordionTrigger>
                                    <AccordionContent>
                                        {user.orders.map(order => (
                                            <div key={order.id} className="mb-2">
                                                <p>Order ID: {order.id}</p>
                                                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                                <p>Total: ${order.total}</p>
                                                <p>Status: {order.status}</p>
                                                <ul>
                                                    {order.items.map((item, index) => (
                                                        <li key={index}>{item.name} x{item.quantity} - ${item.price}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="reviews">
                                    <AccordionTrigger>Reviews ({user.reviews.length})</AccordionTrigger>
                                    <AccordionContent>
                                        {user.reviews.map(review => (
                                            <div key={review.id} className="mb-2">
                                                <p>Item: {review.menuItemName}</p>
                                                <p>Rating: {review.rating}/5</p>
                                                <p>Comment: {review.comment}</p>
                                                <p>Date: {new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="favorites">
                                    <AccordionTrigger>Favorite Dishes ({user.favoriteDishes.length})</AccordionTrigger>
                                    <AccordionContent>
                                        <ul>
                                            {user.favoriteDishes.map(dish => (
                                                <li key={dish.id}>{dish.name}</li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                            <div className="flex items-center space-x-2 mt-4">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button onClick={() => handleEditUser(user)}>Edit</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit User</DialogTitle>
                                        </DialogHeader>
                                        {editingUser && (
                                            <form onSubmit={handleUpdateUser} className="space-y-4">
                                                <Input
                                                    value={editingUser.name}
                                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                                    placeholder="Name"
                                                />
                                                <Input
                                                    value={editingUser.email}
                                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                                    placeholder="Email"
                                                />
                                                <Input
                                                    value={editingUser.phoneNumber || ''}
                                                    onChange={(e) => setEditingUser({ ...editingUser, phoneNumber: e.target.value })}
                                                    placeholder="Phone Number"
                                                />
                                                <Select
                                                    value={editingUser.role}
                                                    onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="USER">User</SelectItem>
                                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button type="submit">Update User</Button>
                                            </form>
                                        )}
                                    </DialogContent>
                                </Dialog>
                                <Button onClick={() => handleDeleteUser(user.id)} variant="destructive">Delete</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

