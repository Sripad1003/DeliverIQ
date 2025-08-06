'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusAlert } from "@/components/ui/status-alert"
import { getOrderById, updateOrder } from "@/actions/order-actions"
import { OrderStatus, OrderType } from "@/lib/app-data-types"
import { toast } from "sonner"

export default function TrackOrderPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params
  const [order, setOrder] = useState<OrderType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const fetchedOrder = await getOrderById(orderId)
        if (fetchedOrder) {
          setOrder(fetchedOrder)
        } else {
          setError("Order not found.")
          toast.error("Order not found.")
        }
      } catch (err) {
        console.error("Failed to fetch order:", err)
        setError("Failed to load order details. Please try again.")
        toast.error("Failed to load order details.")
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  const handleCancelOrder = async () => {
    if (!order) return

    if (window.confirm("Are you sure you want to cancel this order?")) {
      setIsCancelling(true)
      try {
        const result = await updateOrder({ ...order, status: OrderStatus.Cancelled })
        if (result.success) {
          setOrder((prev) => (prev ? { ...prev, status: OrderStatus.Cancelled } : null))
          toast.success("Order cancelled successfully!")
        } else {
          setError(result.message)
          toast.error(result.message)
        }
      } catch (err) {
        console.error("Cancellation error:", err)
        setError("An unexpected error occurred during cancellation.")
        toast.error("An unexpected error occurred during cancellation.")
      } finally {
        setIsCancelling(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <PageHeaderWithBack title="Track Order" backHref="/customer/dashboard" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Loading Order...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (error && !order) { // Only show error if order failed to load
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 text-red-500">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <PageHeaderWithBack title="Track Order" backHref="/customer/dashboard" />
      <main className="flex-1 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <StatusAlert type="error" message={error} />}
            {order ? (
              <>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</p>
                  <p className="text-lg font-bold">{order._id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                  <p className="text-lg font-bold">{order.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pickup Location</p>
                  <p className="text-lg font-bold">{order.pickupLocation}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Delivery Location</p>
                  <p className="text-lg font-bold">{order.deliveryLocation}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Item Description</p>
                  <p className="text-lg font-bold">{order.itemDescription}</p>
                </div>
                {order.driverId && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Driver ID</p>
                    <p className="text-lg font-bold">{order.driverId}</p>
                  </div>
                )}
                {order.status === OrderStatus.Pending && (
                  <Button onClick={handleCancelOrder} className="w-full" variant="destructive" disabled={isCancelling}>
                    {isCancelling ? "Cancelling..." : "Cancel Order"}
                  </Button>
                )}
                {order.status === OrderStatus.Cancelled && (
                  <StatusAlert type="info" message="This order has been cancelled." />
                )}
                {order.status === OrderStatus.Delivered && (
                  <StatusAlert type="success" message="This order has been delivered." />
                )}
              </>
            ) : (
              <StatusAlert type="error" message="Order details could not be loaded." />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
