import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Link from 'next/link'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        console.log('Redirecting to login - Not authenticated or not admin')
        redirect('/login?callbackUrl=/admin')
    }

    return (
        <div className="flex min-h-screen">
            <nav className="w-64 bg-gray-100 p-6">
                <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
                <ul className="space-y-2">
                    <li>
                        <Link href="/admin" className="text-blue-600 hover:underline">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/menu" className="text-blue-600 hover:underline">
                            Manage Menu
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/orders" className="text-blue-600 hover:underline">
                            Manage Orders
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/reservations" className="text-blue-600 hover:underline">
                            Manage Reservations
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/users" className="text-blue-600 hover:underline">
                            Manage Users
                        </Link>
                    </li>
                </ul>
            </nav>
            <main className="flex-1 p-6">{children}</main>
        </div>
    )
}

