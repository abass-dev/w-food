import { MenuItem } from '@/types/menu'

export async function createWhatsAppOrder(menuItem: MenuItem, quantity: number, customerName: string, customerEmail: string, customerPhone: string, description: string) {
    try {
        const orderData = {
            menuItemId: menuItem.id,
            quantity: quantity,
            total: menuItem.price * quantity,
            customerName,
            customerEmail,
            customerPhone,
            description,
        };
        console.log('Sending order data:', orderData);
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create order');
        }

        const order = await response.json();
        console.log('Received order:', order);

        // Send email to manager
        await fetch('/api/send-order-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });

        const message = encodeURIComponent(
            `Hello, I'd like to confirm my order:

Order #${order.id}
Item: ${quantity} x ${menuItem.name}
Total: $${order.total}

Customer: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone}

${description ? `Additional Instructions: ${description}

` : ''}Please confirm my order. Thank you!`
        );
        const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${message}`;
        window.open(whatsappUrl, '_blank');

        return order;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

export async function createEmailOrder(menuItem: MenuItem, quantity: number, customerName: string, customerEmail: string, customerPhone: string, description: string) {
    try {
        const orderData = {
            menuItemId: menuItem.id,
            quantity: quantity,
            total: menuItem.price * quantity,
            customerName,
            customerEmail,
            customerPhone,
            description,
        };
        console.log('Sending email order data:', orderData);
        const response = await fetch('/api/email-orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create email order');
        }

        const order = await response.json();
        console.log('Received email order:', order);

        return order;
    } catch (error) {
        console.error('Error creating email order:', error);
        throw error;
    }
}

