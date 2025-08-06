import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">DeliverIQ</h1>
        <nav className="space-x-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
          Your Ultimate Delivery and Logistics Solution
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
          Streamline your deliveries, manage your fleet, and track your packages with ease. DeliverIQ connects customers, drivers, and administrators for a seamless logistics experience.
        </p>
        <div className="grid gap-6 md:grid-cols-3 w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>For Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Book transport, track your orders in real-time, and rate your delivery experience.
              </p>
              <Link href="/customer/dashboard">
                <Button variant="outline">Customer Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>For Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Manage your assigned deliveries, update order statuses, and optimize your routes.
              </p>
              <Link href="/driver/dashboard">
                <Button variant="outline">Driver Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>For Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Oversee all operations, manage users, and configure system settings.
              </p>
              <Link href="/admin/dashboard">
                <Button variant="outline">Admin Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="bg-white dark:bg-gray-800 shadow p-4 text-center text-gray-600 dark:text-gray-400">
        © 2024 DeliverIQ. All rights reserved.
      </footer>
    </div>
  )
}
