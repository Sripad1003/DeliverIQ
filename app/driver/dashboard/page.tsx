'use client'

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getDriverSession } from "@/lib/app-data"
import { DriverType, OrderStatus, OrderType } from "@/lib/app-data-types"
import { getOrdersByDriverId, updateOrder } from "@/actions/order-actions"
import { toast } from "sonner"

export default function DriverDashboardPage() {
  const [driver, setDriver] = useState<DriverType | null>(null)
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDriver = await getDriverSession()
        if (!currentDriver) {
          setError("Driver session not found. Please log in.")
          toast.error("Driver session not found. Please log in.")
          return
        }
        setDriver(currentDriver)
        const fetchedOrders = await getOrdersByDriverId(currentDriver._id!)
        setOrders(fetchedOrders)
      } catch (err) {
        console.error("Failed to fetch driver data:", err)
        setError("Failed to load dashboard data. Please try again.")
        toast.error("Failed to load dashboard data.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const orderToUpdate = orders.find((order) => order._id === orderId)
    if (!orderToUpdate) return

    try {
      const result = await updateOrder({ ...orderToUpdate, status: newStatus })
      if (result.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
        )
        toast.success(`Order #${orderId?.slice(-6)} status updated to ${newStatus}!`)
      } else {
        toast.error(result.message)
      }
    } catch (err) {
      console.error("Failed to update order status:", err)
      toast.error("An unexpected error occurred while updating order status.")
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">DeliverIQ Driver Dashboard</h1>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </header>
        <main className="flex-1 p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Your Assigned Orders</CardTitle>
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
  const cancelledOrders = orders.filter((order) => order.status === OrderStatus.Cancelled)

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardHeader title="DeliverIQ Driver Dashboard" userEmail={driver?.email || "Guest"} />
      <main className="flex-1 p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Assigned Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingOrders.length === 0 && completedOrders.length === 0 && cancelledOrders.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No orders assigned to you.</p>
            ) : (
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">Order #{order._id?.slice(-6)}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.pickupLocation} to {order.deliveryLocation}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Item: {order.itemDescription}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={order.status}
                        onValueChange={(value: OrderStatus) => handleStatusChange(order._id!, value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={OrderStatus.Pending}>Pending</SelectItem>
                          <SelectItem value={OrderStatus.InProgress}>In Progress</SelectItem>
                          <SelectItem value={OrderStatus.Delivered}>Delivered</SelectItem>
                          <SelectItem value={OrderStatus.Cancelled}>Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
                {completedOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-2 border rounded bg-green-50 dark:bg-green-950">
                    <div>
                      <p className="font-medium">Order #{order._id?.slice(-6)}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.pickupLocation} to {order.deliveryLocation}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Item: {order.itemDescription}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-green-600 dark:text-green-400">{order.status}</div>
                  </div>
                ))}
                {cancelledOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-2 border rounded bg-red-50 dark:bg-red-950">
                    <div>
                      <p className="font-medium">Order #{order._id?.slice(-6)}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {order.pickupLocation} to {order.deliveryLocation}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Item: {order.itemDescription}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-red-600 dark:text-red-400">{order.status}</div>
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
