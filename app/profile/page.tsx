"use client"

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { Loader2, User, Upload } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface UserProfile {
    id: string
    name: string
    email: string
    image: string | null
    phoneNumber: string | null
}

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [newImage, setNewImage] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        } else if (status === 'authenticated') {
            fetchProfile()
        }
    }, [status, router])

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/user/profile')
            if (!response.ok) throw new Error('Failed to fetch profile')
            const data = await response.json()
            setProfile(data)
        } catch (error) {
            console.error('Error fetching profile:', error)
            toast({
                title: "Error",
                description: "Failed to load profile. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProfile(prev => prev ? { ...prev, [name]: value } : null)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewImage(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!profile) return

        setIsLoading(true)
        try {
            console.log('Preparing form data for submission')
            const formData = new FormData()
            formData.append('name', profile.name)
            formData.append('email', profile.email)
            formData.append('phoneNumber', profile.phoneNumber || '')
            if (newImage) {
                console.log('New image selected:', newImage.name)
                formData.append('image', newImage)
            } else {
                console.log('No new image selected')
            }

            console.log('Sending profile update request')
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                body: formData,
            })
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to update profile')
            }
            const updatedProfile = await response.json()
            console.log('Profile updated successfully:', updatedProfile)
            setProfile(updatedProfile)
            toast({
                title: "Success",
                description: "Profile updated successfully.",
            })
            setIsEditing(false)
            setNewImage(null)
        } catch (error) {
            console.error('Error updating profile:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? `Failed to update profile: ${error.message}` : "Failed to update profile. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch('/api/user/profile', { method: 'DELETE' })
            if (!response.ok) throw new Error('Failed to delete account')
            toast({
                title: "Account Deleted",
                description: "Your account has been successfully deleted.",
            })
            router.push('/')
        } catch (error) {
            console.error('Error deleting account:', error)
            toast({
                title: "Error",
                description: "Failed to delete account. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return <Loader2 className="h-8 w-8 animate-spin" />
    }

    if (!profile) {
        return <div>No profile data available.</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">User Profile</h1>
            <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.image || ''} alt={profile.name} />
                    <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-2xl font-semibold">{profile.name}</h2>
                    <p className="text-muted-foreground">{profile.email}</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={profile.phoneNumber || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div>
                    <Label htmlFor="image">Profile Image</Label>
                    <div className="flex items-center space-x-2">
                        <Input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={!isEditing}
                            className="hidden"
                            ref={fileInputRef}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={!isEditing}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload New Image
                        </Button>
                        {newImage && <span className="text-sm text-muted-foreground">{newImage.name}</span>}
                    </div>
                </div>
                {isEditing ? (
                    <div className="flex space-x-2">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save Changes
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                ) : (
                    <Button type="button" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
            </form>
            <div className="mt-8">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount}>Delete Account</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}

