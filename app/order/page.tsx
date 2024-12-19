"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { MenuItem } from '@/types/menu'
import { createWhatsAppOrder, createEmailOrder } from '@/lib/orderUtils'

export default function OrderPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { data: session, status } = useSession()
    const [menuItem, setMenuItem] = useState<MenuItem | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [customerName, setCustomerName] = useState('')
    const [customerEmail, setCustomerEmail] = useState('')
    const [customerPhone, setCustomerPhone] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/order')
        } else if (status === 'authenticated') {
            const fetchMenuItem = async () => {
                const id = searchParams.get('id')
                if (id) {
                    try {
                        const response = await fetch(`/api/menu/${id}`)
                        if (!response.ok) throw new Error('Failed to fetch menu item')
                        const data = await response.json()
                        setMenuItem(data)
                        setQuantity(parseInt(searchParams.get('quantity') || '1', 10))
                        setCustomerName(session.user.name || '')
                        setCustomerEmail(session.user.email || '')
                    } catch (error) {
                        console.error('Error fetching menu item:', error)
                        toast({
                            title: "Error",
                            description: "Failed to load menu item. Please try again.",
                            variant: "destructive",
                        })
                        router.push('/menu')
                    } finally {
                        setIsLoading(false)
                    }
                } else {
                    router.push('/menu')
                }
            }
            fetchMenuItem()
        }
    }, [status, router, searchParams, session])

    const handleWhatsAppOrder = async () => {
        if (!menuItem) return

        setIsLoading(true)
        try {
            await createWhatsAppOrder(menuItem, quantity, customerName, customerEmail, customerPhone, description)
            toast({
                title: "Order Submitted",
                description: "Your order has been sent via WhatsApp.",
            })
            router.push('/menu')
        } catch (error) {
            console.error('Error submitting order:', error)
            toast({
                title: "Error",
                description: "Failed to submit order. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleEmailOrder = async () => {
        if (!menuItem) return;

        setIsLoading(true);
        try {
            const order = await createEmailOrder(menuItem, quantity, customerName, customerEmail, customerPhone, description);
            toast({
                title: "Order Submitted",
                description: "Your order has been sent via email. We'll contact you shortly.",
            });
            router.push('/menu');
        } catch (error) {
            console.error('Error submitting email order:', error);
            toast({
                title: "Error",
                description: "Failed to submit email order. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-8" />
    }

    if (!menuItem) {
        return <div>Menu item not found.</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Confirm Your Order</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <Image
                        src={menuItem.image}
                        alt={menuItem.name}
                        width={400}
                        height={300}
                        className="rounded-lg object-cover w-full"
                    />
                    <h2 className="text-2xl font-semibold mt-4">{menuItem.name}</h2>
                    <p className="text-muted-foreground">{menuItem.description}</p>
                    <p className="text-xl font-bold mt-2">${menuItem.price.toFixed(2)}</p>
                    <div className="flex items-center mt-4">
                        <Label htmlFor="quantity" className="mr-2">Quantity:</Label>
                        <Input
                            id="quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
                            className="w-20"
                            min="1"
                        />
                    </div>
                    <p className="text-xl font-bold mt-4">Total: ${(menuItem.price * quantity).toFixed(2)}</p>
                </div>
                <form className="space-y-4">
                    <div>
                        <Label htmlFor="customerName">Name</Label>
                        <Input
                            id="customerName"
                            value={customerName}
                            disabled
                        />
                    </div>
                    <div>
                        <Label htmlFor="customerEmail">Email</Label>
                        <Input
                            id="customerEmail"
                            type="email"
                            value={customerEmail}
                            disabled
                        />
                    </div>
                    <div>
                        <Label htmlFor="customerPhone">Phone</Label>
                        <Input
                            id="customerPhone"
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Additional Instructions (Optional)</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Any special requests or instructions for your order?"
                            className="h-24"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <Button type="button" className="w-1/2" onClick={handleWhatsAppOrder} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isLoading ? 'Submitting...' : 'Order via WhatsApp'}
                        </Button>
                        <Button type="button" className="w-1/2" onClick={handleEmailOrder} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isLoading ? 'Submitting...' : 'Order via Email'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

