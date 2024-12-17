"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface UserPreferences {
    dietaryRestrictions: string[]
    allergies: string[]
    spicePreference: string
}

export default function Preferences() {
    const { data: session } = useSession()
    const [preferences, setPreferences] = useState<UserPreferences>({
        dietaryRestrictions: [],
        allergies: [],
        spicePreference: '',
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchPreferences() {
            try {
                const response = await fetch('/api/user/preferences')
                if (!response.ok) {
                    throw new Error('Failed to fetch preferences')
                }
                const data = await response.json()
                setPreferences(data)
            } catch (error) {
                console.error('Error fetching preferences:', error)
            } finally {
                setIsLoading(false)
            }
        }

        if (session) {
            fetchPreferences()
        }
    }, [session])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/user/preferences', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preferences),
            })
            if (!response.ok) {
                throw new Error('Failed to update preferences')
            }
            toast({
                title: "Preferences updated",
                description: "Your preferences have been successfully updated.",
            })
        } catch (error) {
            console.error('Error updating preferences:', error)
            toast({
                title: "Error",
                description: "Failed to update preferences. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return <Loader2 className="h-8 w-8 animate-spin" />
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                <Input
                    id="dietaryRestrictions"
                    value={preferences.dietaryRestrictions.join(', ')}
                    onChange={(e) => setPreferences({ ...preferences, dietaryRestrictions: e.target.value.split(',').map(item => item.trim()) })}
                    placeholder="e.g. vegetarian, vegan, gluten-free"
                />
            </div>
            <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Input
                    id="allergies"
                    value={preferences.allergies.join(', ')}
                    onChange={(e) => setPreferences({ ...preferences, allergies: e.target.value.split(',').map(item => item.trim()) })}
                    placeholder="e.g. peanuts, shellfish, dairy"
                />
            </div>
            <div>
                <Label htmlFor="spicePreference">Spice Preference</Label>
                <Input
                    id="spicePreference"
                    value={preferences.spicePreference}
                    onChange={(e) => setPreferences({ ...preferences, spicePreference: e.target.value })}
                    placeholder="e.g. mild, medium, hot"
                />
            </div>
            <Button type="submit">Save Preferences</Button>
        </form>
    )
}

