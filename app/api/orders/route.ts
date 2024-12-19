import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        console.log('Unauthorized access attempt');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        console.log('Received request body:', body);

        if (!body) {
            console.log('Request body is null or undefined');
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const { menuItemId, quantity, total } = body;

        if (!menuItemId || !quantity || total === undefined) {
            console.log('Missing required fields in request body');
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Fetch the user's information
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { name: true, email: true, phoneNumber: true },
        });

        if (!user) {
            console.log('User not found:', session.user.id);
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        console.log('User found:', user);

        // Fetch the menu item to get the associated restaurant
        const menuItem = await prisma.menuItem.findUnique({
            where: { id: menuItemId },
            include: { category: { include: { restaurant: true } } },
        });

        if (!menuItem || !menuItem.category.restaurant) {
            console.log('Menu item or restaurant not found:', menuItemId);
            return NextResponse.json({ error: 'Menu item or restaurant not found' }, { status: 404 });
        }

        console.log('Menu item found:', menuItem);

        const orderData: Prisma.OrderCreateInput = {
            status: 'PENDING',
            total: new Prisma.Decimal(total),
            customerName: user.name || 'Unknown',
            customerEmail: user.email || 'unknown@example.com',
            customerPhone: user.phoneNumber || '',
            restaurant: {
                connect: { id: menuItem.category.restaurant.id }
            },
            items: {
                create: [
                    {
                        menuItem: { connect: { id: menuItemId } },
                        quantity: quantity,
                        price: menuItem.price,
                    },
                ],
            },
        };

        console.log('Attempting to create order with data:', orderData);

        const order = await prisma.order.create({
            data: orderData,
            include: {
                items: {
                    include: {
                        menuItem: true,
                    },
                },
            },
        });

        console.log('Order created successfully:', order);

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({
            error: 'Error creating order',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

