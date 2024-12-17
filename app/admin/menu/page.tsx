import { Suspense } from 'react'
import { MenuItemList } from '@/components/admin/MenuItemList'
import { AddMenuItemForm } from '@/components/admin/AddMenuItemForm'
import { Loader2 } from 'lucide-react'

export default function ManageMenu() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Menu</h1>
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Add New Menu Item</h2>
                <AddMenuItemForm />
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-4">Menu Items</h2>
                <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                    <MenuItemList />
                </Suspense>
            </div>
        </div>
    )
}

