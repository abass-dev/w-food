import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Menu Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">25</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">5</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">100</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

