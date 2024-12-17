"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

export function AddMenuItemForm() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        image: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/admin/menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            if (!response.ok) throw new Error('Failed to add menu item')
            setFormData({
                name: '',
                description: '',
                price: '',
                categoryId: '',
                image: '',
            })
            toast({
                title: "Success",
                description: "Menu item added successfully.",
            })
        } catch (error) {
            console.error('Error adding menu item:', error)
            toast({
                title: "Error",
                description: "Failed to add menu item. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Item Name"
                required
            />
            <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
            />
            <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                step="0.01"
                required
            />
            <Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
            >
                <option value="">Select a category</option>
                {/* Add category options here */}
            </Select>
            <Input
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Image URL"
                required
            />
            <Button type="submit">Add Menu Item</Button>
        </form>
    )
}

