import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { clearCache } from '@/lib/cache'

export async function POST() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Clear the user profile cache
        clearCache(`userProfile:${session.user.id}`)
        console.log(`Cleared cache for user ${session.user.id}`)
        return NextResponse.json({ message: 'Cache cleared successfully' })
    } catch (error) {
        console.error('Error clearing cache:', error)
        return NextResponse.json({ error: 'Error clearing cache' }, { status: 500 })
    }
}

