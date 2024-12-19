"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MenuItem, Category } from '@/types/menu'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { uploadImage } from '@/lib/firebase'

interface EditMenuItemFormProps {
    item: MenuItem
    onUpdate: (updatedItem: MenuItem) => void
    onCancel: () => void
}

export function EditMenuItemForm({ item, onUpdate, onCancel }: EditMenuItemFormProps) {
    const [formData, setFormData] = useState<MenuItem>(item)
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
    const [imageFile, setImageFile] = useState<File | null>(null)

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
            } finally {
                setIsCategoriesLoading(false)
            }
        }

        fetchCategories()
    }, [])

    const handleChange = (name: string, value: string | number) => {
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
            let imageUrl = formData.image
            if (imageFile) {
                imageUrl = await uploadImage(imageFile)
            }

            const updatedItem: MenuItem = {
                ...formData,
                image: imageUrl,
                category: categories.find(cat => cat.id === formData.category.id) || formData.category
            }
            await onUpdate(updatedItem)
            toast({
                title: "Success",
                description: "Menu item updated successfully.",
            })
        } catch (error) {
            console.error('Error updating menu item:', error)
            toast({
                title: "Error",
                description: "Failed to update menu item. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isCategoriesLoading) {
        return <Loader2 className="h-8 w-8 animate-spin" />
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
                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                placeholder="Price"
                step="0.01"
                required
            />
            <Select
                name="categoryId"
                value={formData.category.id}
                onValueChange={(value) => handleChange('category', { id: value, name: categories.find(cat => cat.id === value)?.name || '' })}
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
            {formData.image && (
                <img src={formData.image} alt="Current menu item" className="w-32 h-32 object-cover rounded" />
            )}
            <div className="flex justify-end space-x-2">
                <Button type="button" onClick={onCancel} variant="outline">Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isLoading ? 'Updating...' : 'Update Menu Item'}
                </Button>
            </div>
        </form>
    )
}

