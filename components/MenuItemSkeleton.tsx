import { Skeleton } from "@/components/ui/skeleton"

export function MenuItemSkeleton() {
    return (
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                    <Skeleton className="w-full h-[400px] rounded-lg" />
                </div>
                <div className="md:w-1/2 space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-8 w-1/4" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-16" />
                        <Skeleton className="h-10 w-10" />
                    </div>
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
    )
}

