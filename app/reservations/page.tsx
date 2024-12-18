"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface Restaurant {
  id: string;
  name: string;
}

export default function ReservationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    restaurantId: '',
    date: '',
    time: '',
    partySize: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('/api/restaurants')
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants')
        }
        const data = await response.json()
        setRestaurants(data)
      } catch (error) {
        console.error('Error fetching restaurants:', error)
        toast({
          title: "Error",
          description: "Failed to load restaurants. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchRestaurants()
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/reservations')
    }
  }, [status, router])

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status !== 'authenticated') {
      toast({
        title: "Error",
        description: "You must be logged in to make a reservation.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const reservationData = {
        restaurantId: formData.restaurantId,
        dateTime: `${formData.date}T${formData.time}:00Z`,
        partySize: parseInt(formData.partySize, 10),
      }

      console.log('Sending reservation data:', reservationData)

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      })

      const responseText = await response.text()
      console.log('Raw response:', responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError)
        throw new Error('Invalid JSON response from server')
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create reservation')
      }

      console.log('Reservation created:', data)

      toast({
        title: "Success",
        description: "Your reservation has been created.",
      })
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating reservation:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create reservation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return <Loader2 className="h-8 w-8 animate-spin" />
  }

  if (status === 'unauthenticated') {
    return <p>Please log in to make a reservation.</p>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Make a Reservation</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <Select
          name="restaurantId"
          onValueChange={(value) => handleChange('restaurantId', value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a restaurant" />
          </SelectTrigger>
          <SelectContent>
            {restaurants.map((restaurant) => (
              <SelectItem key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          name="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          required
        />
        <Input
          type="time"
          name="time"
          value={formData.time}
          onChange={(e) => handleChange('time', e.target.value)}
          required
        />
        <Input
          type="number"
          name="partySize"
          value={formData.partySize}
          onChange={(e) => handleChange('partySize', e.target.value)}
          placeholder="Party Size"
          min="1"
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Reservation...
            </>
          ) : (
            'Make Reservation'
          )}
        </Button>
      </form>
    </div>
  )
}

