import React from 'react'
import { render, screen } from '@testing-library/react'
import FeaturedDishes from '@/components/FeaturedDishes'

// Mock the necessary modules
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        return <img {...props} />
    },
}))

// Mock prisma
jest.mock('@/lib/prisma', () => ({
    __esModule: true,
    default: {
        menuItem: {
            findMany: jest.fn().mockResolvedValue([
                {
                    id: '1',
                    name: 'Test Dish 1',
                    description: 'Test Description 1',
                    price: 9.99,
                    image: '/images/test-dish-1.jpg',
                    category: { id: 'cat1', name: 'Test Category' },
                    favoriteDishes: [],
                },
                {
                    id: '2',
                    name: 'Test Dish 2',
                    description: 'Test Description 2',
                    price: 14.99,
                    image: '/images/test-dish-2.jpg',
                    category: { id: 'cat1', name: 'Test Category' },
                    favoriteDishes: [{ userId: 'user1' }],
                },
            ]),
        },
    },
}))

jest.mock('next-auth/next', () => ({
    getServerSession: jest.fn(() => Promise.resolve({ user: { id: 'user1' } })),
}))

jest.mock('next-auth', () => ({
    default: jest.fn(),
}))

jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
    authOptions: {},
}))

describe('FeaturedDishes', () => {
    it('renders featured dishes', async () => {
        const { findByText, findAllByRole } = render(await FeaturedDishes())

        // Check if the component renders the correct number of dishes
        const dishElements = await findAllByRole('heading', { level: 3 })
        expect(dishElements).toHaveLength(2)

        // Check if the first dish is rendered correctly
        expect(await findByText('Test Dish 1')).toBeInTheDocument()
        expect(await findByText('Test Description 1')).toBeInTheDocument()
        expect(await findByText('$9.99')).toBeInTheDocument()

        // Check if the second dish is rendered correctly
        expect(await findByText('Test Dish 2')).toBeInTheDocument()
        expect(await findByText('Test Description 2')).toBeInTheDocument()
        expect(await findByText('$14.99')).toBeInTheDocument()

        // Check if the "View Details" buttons are present
        const viewDetailsButtons = await findAllByRole('link', { name: 'View Details' })
        expect(viewDetailsButtons).toHaveLength(2)
    })
})

