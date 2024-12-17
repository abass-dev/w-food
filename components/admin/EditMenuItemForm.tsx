"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { MenuItem } from '@/types/menu'

interface EditMenuItemFormProps {
    item: MenuItem
    onUpdate: (updatedItem: MenuItem) => void
    onCancel: () => void
}

export function EditMenuItemForm({ item, onUpdate, onCancel }: EditMenuItemFormProps) {
    const [formData, setFormData] = useState(item)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onUpdate(formData)
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
                value={formData.category.id}
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
            <div className="flex justify-end space-x-2">
                <Button type="button" onClick={onCancel} variant="outline">Cancel</Button>
                <Button type="submit">Update Menu Item</Button>
            </div>
        </form>
    )
}

