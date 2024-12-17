"use client"

import { useState, useEffect } from 'react'
import { Star, Send, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Review {
    id: string
    userId: string
    userName: string
    rating: number
    comment: string
    createdAt: string
}

interface ReviewsRatingsProps {
    menuItemId: string
}

export function ReviewsRatings({ menuItemId }: ReviewsRatingsProps) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchReviews()
    }, [menuItemId])

    const fetchReviews = async () => {
        try {
            setIsLoading(true)
            setError(null)
            const response = await fetch(`/api/reviews/${menuItemId}`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            setReviews(data)
        } catch (error) {
            console.error('Error fetching reviews:', error)
            setError('Failed to load reviews. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleRatingChange = (rating: number) => {
        setNewReview(prev => ({ ...prev, rating }))
    }

    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewReview(prev => ({ ...prev, comment: event.target.value }))
    }

    const handleSubmitReview = async () => {
        try {
            const response = await fetch(`/api/reviews/${menuItemId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newReview),
            })

            if (!response.ok) {
                throw new Error('Failed to submit review')
            }

            const savedReview = await response.json()
            setReviews(prev => [savedReview, ...prev])
            setNewReview({ rating: 0, comment: '' })
            toast({
                title: "Review submitted",
                description: "Thank you for your feedback!",
            })
        } catch (error) {
            console.error('Error submitting review:', error)
            toast({
                title: "Error",
                description: "Failed to submit review. Please try again.",
                variant: "destructive",
            })
        }
    }

    if (isLoading) {
        return <div>Loading reviews...</div>
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Reviews & Ratings</h3>
            <div className="mb-6">
                <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`h-6 w-6 cursor-pointer ${star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                            onClick={() => handleRatingChange(star)}
                        />
                    ))}
                </div>
                <Textarea
                    placeholder="Write your review here..."
                    value={newReview.comment}
                    onChange={handleCommentChange}
                    className="mb-2"
                />
                <Button onClick={handleSubmitReview} disabled={newReview.rating === 0 || newReview.comment.trim() === ''}>
                    <Send className="mr-2 h-4 w-4" /> Submit Review
                </Button>
            </div>
            {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to review!</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-card text-card-foreground p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                                <div className="flex mr-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="font-semibold">{review.userName}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

