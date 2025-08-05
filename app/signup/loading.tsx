import { Skeleton } from "@/components/ui/skeleton"

export default function SignUpLoading() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900">
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-8 w-48" />
          <Skeleton className="mx-auto h-5 w-64" />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="mt-4 text-center text-sm">
          <Skeleton className="mx-auto h-4 w-48" />
        </div>
      </div>
    </div>
  )
}
