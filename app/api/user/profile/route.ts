import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { uploadImage } from '@/lib/firebase'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                phoneNumber: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Error fetching user profile:', error)
        return NextResponse.json({ error: 'Error fetching user profile' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        console.log('Unauthorized access attempt')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        console.log('Processing profile update request')
        const formData = await req.formData()
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const phoneNumber = formData.get('phoneNumber') as string
        const imageFile = formData.get('image') as File | null

        console.log('Received form data:', { name, email, phoneNumber, hasImage: !!imageFile })

        let imageUrl = undefined

        if (imageFile) {
            console.log('Uploading image to Firebase')
            try {
                imageUrl = await uploadImage(imageFile)
                console.log('Image uploaded successfully:', imageUrl)
            } catch (uploadError) {
                console.error('Error uploading image to Firebase:', uploadError)
                throw new Error(`Failed to upload image: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`)
            }
        }

        console.log('Updating user profile in database')
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name,
                email,
                phoneNumber,
                ...(imageUrl && { image: imageUrl }),
            },
        })

        console.log('User profile updated successfully:', updatedUser)
        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('Error updating user profile:', error)
        return NextResponse.json({
            error: 'Error updating user profile',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

export async function DELETE() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        await prisma.user.delete({
            where: { id: session.user.id },
        })

        return NextResponse.json({ message: 'User account deleted successfully' })
    } catch (error) {
        console.error('Error deleting user account:', error)
        return NextResponse.json({ error: 'Error deleting user account' }, { status: 500 })
    }
}

