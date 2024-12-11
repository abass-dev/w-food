"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export default function ReservationsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    guests: '',
  })

  const [availability, setAvailability] = useState(null)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const checkAvailability = () => {
    // Simulating an API call to check availability
    setTimeout(() => {
      const isAvailable = Math.random() < 0.7 // 70% chance of availability
      setAvailability(isAvailable)
      toast({
        title: isAvailable ? "Table available!" : "Sorry, no tables available.",
        description: isAvailable ? "You can proceed with your reservation." : "Please try a different date or time.",
      })
    }, 1000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission (e.g., send data to server)
    console.log('Form submitted:', formData)
    toast({
      title: "Reservation submitted",
      description: "We'll confirm your reservation shortly.",
    })
  }

  return (
    <motion.div 
      className="container mx-auto px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-8 text-center">Make a Reservation</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="guests">Number of Guests</Label>
          <Input type="number" id="guests" name="guests" value={formData.guests} onChange={handleChange} required min="1" max="10" />
        </div>
        <Button type="button" onClick={checkAvailability} className="w-full mb-4">Check Availability</Button>
        {availability !== null && (
          <p className={`text-center mb-4 ${availability ? 'text-green-600' : 'text-red-600'}`}>
            {availability ? 'Table available!' : 'No tables available for the selected time.'}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={!availability}>Make Reservation</Button>
      </form>
    </motion.div>
  )
}

