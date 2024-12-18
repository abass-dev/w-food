import { Suspense, use } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from '@/lib/prisma'
import { Loader2 } from 'lucide-react'

async function getDashboardStats() {
    try {
        const [menuItemsCount, categoriesCount, ordersCount] = await Promise.all([
            prisma.menuItem.count(),
            prisma.menuCategory.count(),
            prisma.order.count(),
        ])

        return { menuItemsCount, categoriesCount, ordersCount }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        throw new Error('Failed to fetch dashboard statistics')
    }
}

function DashboardCard({ title, value }: { title: string; value: number }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">{value}</p>
            </CardContent>
        </Card>
    )
}

function DashboardContent() {
    const stats = use(getDashboardStats())

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard title="Total Menu Items" value={stats.menuItemsCount} />
            <DashboardCard title="Total Categories" value={stats.categoriesCount} />
            <DashboardCard title="Total Orders" value={stats.ordersCount} />
        </div>
    )
}

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                <DashboardContent />
            </Suspense>
        </div>
    )
}

