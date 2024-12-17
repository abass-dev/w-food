"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MenuItem } from '@/types/menu'
import { EditMenuItemForm } from './EditMenuItemForm'
import { toast } from '@/hooks/use-toast'

export function MenuItemList() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

    useEffect(() => {
        fetchMenuItems()
    }, [])

    const fetchMenuItems = async () => {
        try {
            const response = await fetch('/api/admin/menu')
            if (!response.ok) throw new Error('Failed to fetch menu items')
            const data = await response.json()
            setMenuItems(data)
        } catch (error) {
            console.error('Error fetching menu items:', error)
            toast({
                title: "Error",
                description: "Failed to load menu items. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await fetch(`/api/admin/menu/${id}`, {
                    method: 'DELETE',
                })
                if (!response.ok) throw new Error('Failed to delete menu item')
                setMenuItems(menuItems.filter(item => item.id !== id))
                toast({
                    title: "Success",
                    description: "Menu item deleted successfully.",
                })
            } catch (error) {
                console.error('Error deleting menu item:', error)
                toast({
                    title: "Error",
                    description: "Failed to delete menu item. Please try again.",
                    variant: "destructive",
                })
            }
        }
    }

    const handleEdit = (item: MenuItem) => {
        setEditingItem(item)
    }

    const handleUpdate = async (updatedItem: MenuItem) => {
        try {
            const response = await fetch(`/api/admin/menu/${updatedItem.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            })
            if (!response.ok) throw new Error('Failed to update menu item')
            setMenuItems(menuItems.map(item => item.id === updatedItem.id ? updatedItem : item))
            setEditingItem(null)
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
        }
    }

    return (
        <div>
            {editingItem ? (
                <EditMenuItemForm item={editingItem} onUpdate={handleUpdate} onCancel={() => setEditingItem(null)} />
            ) : (
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left">Name</th>
                            <th className="text-left">Price</th>
                            <th className="text-left">Category</th>
                            <th className="text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuItems.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>${item.price}</td>
                                <td>{item.category.name}</td>
                                <td>
                                    <Button onClick={() => handleEdit(item)} className="mr-2">Edit</Button>
                                    <Button onClick={() => handleDelete(item.id)} variant="destructive">Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

