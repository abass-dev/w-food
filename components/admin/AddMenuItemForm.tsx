"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { Category } from '@/types/menu'
import { uploadImage } from '@/lib/firebase'

export function AddMenuItemForm() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: '',
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories')
                if (!response.ok) throw new Error('Failed to fetch categories')
                const data = await response.json()
                setCategories(data)
            } catch (error) {
                console.error('Error fetching categories:', error)
                toast({
                    title: "Error",
                    description: "Failed to load categories. Please try again.",
                    variant: "destructive",
                })
            }
        }

        fetchCategories()
    }, [])

    const handleChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            let imageUrl = ''
            if (imageFile) {
                imageUrl = await uploadImage(imageFile)
            }

            const response = await fetch('/api/admin/menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    image: imageUrl,
                }),
            })
            if (!response.ok) throw new Error('Failed to add menu item')
            setFormData({
                name: '',
                description: '',
                price: '',
                categoryId: '',
            })
            setImageFile(null)
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
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                name="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Item Name"
                required
            />
            <Textarea
                name="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Description"
                required
            />
            <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="Price"
                step="0.01"
                required
            />
            <Select
                name="categoryId"
                value={formData.categoryId}
                onValueChange={(value) => handleChange('categoryId', value)}
                required
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
            />
            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Menu Item'}
            </Button>
        </form>
    )
}

