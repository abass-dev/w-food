import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hash } from 'bcrypt'

export async function POST(req: Request) {
  try {
    const { name, email, phoneNumber, password } = await req.json()
    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashedPassword,
      },
    })

    return NextResponse.json({ message: 'User created successfully' })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 })
  }
}

