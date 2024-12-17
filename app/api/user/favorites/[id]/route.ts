import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { clearCache } from '@/lib/cache'

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id: menuItemId } = params

        console.log(`Attempting to remove favorite dish with menuItemId: ${menuItemId} for user: ${session.user.id}`)

        const favoriteDish = await prisma.favoriteDish.findFirst({
            where: {
                userId: session.user.id,
                menuItemId: menuItemId,
            },
        })

        if (!favoriteDish) {
            console.log(`Favorite dish not found for menuItemId: ${menuItemId} and userId: ${session.user.id}`)
            return NextResponse.json({ error: 'Favorite dish not found' }, { status: 404 })
        }

        await prisma.favoriteDish.delete({
            where: {
                id: favoriteDish.id,
            },
        })

        console.log(`Successfully removed favorite dish with menuItemId: ${menuItemId}`)

        // Clear the cache for this specific menu item
        clearCache(`menuItem:${menuItemId}`)

        // Also clear the menu items cache to ensure fresh data on next fetch
        clearCache('menuItems')

        return NextResponse.json({ message: 'Favorite dish removed successfully' })
    } catch (error) {
        console.error('Error removing favorite dish:', error)
        return NextResponse.json({ error: 'Error removing favorite dish' }, { status: 500 })
    }
}

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id: menuItemId } = await params

        const favoriteDish = await prisma.favoriteDish.create({
            data: {
                userId: session.user.id,
                menuItemId: menuItemId,
            },
        })

        // Clear the cache for this specific menu item
        clearCache(`menuItem:${menuItemId}`)

        // Also clear the menu items cache to ensure fresh data on next fetch
        clearCache('menuItems')

        return NextResponse.json(favoriteDish)
    } catch (error) {
        console.error('Error adding favorite dish:', error)
        return NextResponse.json({ error: 'Error adding favorite dish' }, { status: 500 })
    }
}

