import { DashboardHeader } from '@/components/layout/dashboard-header'

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title="Admin Dashboard" />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-900 border-t-transparent dark:border-gray-50 dark:border-t-transparent" />
          <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </main>
    </div>
  )
}
