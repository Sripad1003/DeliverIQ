'use client'

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getCustomerSession } from "@/lib/app-data"
import { CustomerType, OrderStatus, OrderType } from "@/lib/app-data-types"
import { getOrdersByCustomerId } from "@/actions/order-actions"
import { toast } from "sonner"

export default function CustomerDashboardPage() {
  const [customer, setCustomer] = useState<CustomerType | null>(null)
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentCustomer = await getCustomerSession()
        if (!currentCustomer) {
          setError("Customer session not found. Please log in.")
          toast.error("Customer session not found. Please log in.")
          return
        }
        setCustomer(currentCustomer)
        const fetchedOrders = await getOrdersByCustomerId(currentCustomer._id!)
        setOrders(fetchedOrders)
      } catch (err) {
        console.error("Failed to fetch customer data:", err)
        setError("Failed to load dashboard data. Please try again.")
        toast.error("Failed to load dashboard data.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">DeliverIQ Customer Dashboard</h1>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </header>
        <main className="flex-1 p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-2 border rounded animate-pulse">
                    <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 text-red-500">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  const pendingOrders = orders.filter(
    (order) => order.status === OrderStatus.Pending || order.status === OrderStatus.InProgress
  )
  const completedOrders = orders.filter((order) => order.status === OrderStatus.Delivered)

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardHeader title="DeliverIQ Customer Dashboard" userEmail={customer?.email || "Guest"} />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <Link href="/customer/book-transport">
            <Button className="w-full md:w-auto">Book New Transport</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingOrders.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No pending orders.</p>
            ) : (
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">Order #{order._id?.slice(-6)}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.pickupLocation} to {order.deliveryLocation}
                      </p>
                    </div>
                    <div className="text-sm font-medium">{order.status}</div>
                    <Link href={`/customer/track-order/${order._id}`}>
                      <Button variant="outline" size="sm">
                        Track
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Completed Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {completedOrders.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No completed orders.</p>
            ) : (
              <div className="space-y-4">
                {completedOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">Order #{order._id?.slice(-6)}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.pickupLocation} to {order.deliveryLocation}
                      </p>
                    </div>
                    <div className="text-sm font-medium">{order.status}</div>
                    <Link href={`/customer/rate-driver/${order._id}`}>
                      <Button variant="outline" size="sm">
                        Rate Driver
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
