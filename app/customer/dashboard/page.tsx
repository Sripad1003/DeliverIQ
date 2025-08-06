"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Truck, Clock, MapPin, User, Calendar, DollarSign, Star, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  getCustomerSession,
  getOrders,
  getDrivers,
  type Order,
  type Driver,
  type OrderStatus,
  type PaymentStatus,
  updateOrder,
  cancelOrder,
} from "@/lib/app-data"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/layout/dashboard-header" // Import DashboardHeader

export default function CustomerDashboard() {
  const router = useRouter()
  const [customerSession, setCustomerSession] = useState(null)
  const [activeOrders, setActiveOrders] = useState<Order[]>([])
  const [completedOrders, setCompletedOrders] = useState<Order[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])

  const refreshOrders = () => {
    const session = getCustomerSession()
    if (!session) {
      router.push("/login")
      return
    }
    setCustomerSession(session)

    const allOrders = getOrders()
    const customerOrders = allOrders.filter((order) => order.customerId === session.id)
    setActiveOrders(
      customerOrders.filter(
        (order) => order.status === "pending" || order.status === "accepted" || order.status === "in-transit",
      ),
    )
    setCompletedOrders(customerOrders.filter((order) => order.status === "completed" || order.status === "cancelled")) // Include cancelled in completed for history

    setDrivers(getDrivers()) // Load all drivers to display driver info
  }

  useEffect(() => {
    refreshOrders()
  }, [router])

  const getDriverInfo = (driverId?: string) => {
    if (!driverId) return null
    const driver = drivers.find((d) => d.id === driverId)
    return driver
      ? `${driver.name} (${driver.vehicleType.charAt(0).toUpperCase() + driver.vehicleType.slice(1)})`
      : "N/A"
  }

  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "accepted":
        return "bg-blue-500"
      case "in-transit":
        return "bg-green-500"
      case "completed":
        return "bg-gray-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPaymentBadgeColor = (status: PaymentStatus) => {
    switch (status) {
      case "pending":
        return "bg-orange-500"
      case "paid":
        return "bg-green-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const handlePayNow = (orderId: string) => {
    // Placeholder for payment logic
    alert(`Initiating payment for Order ID: ${orderId}. (Not implemented yet)`)
    // In a real app, this would redirect to a payment gateway or open a modal
    // For now, let's simulate a successful payment for demo purposes
    const orders = getOrders()
    const orderToUpdate = orders.find((order) => order.id === orderId)
    if (orderToUpdate) {
      const updatedOrder = { ...orderToUpdate, paymentStatus: "paid" as PaymentStatus }
      updateOrder(updatedOrder)
      refreshOrders() // Refresh the dashboard to reflect payment status
    }
  }

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      const cancelled = cancelOrder(orderId)
      if (cancelled) {
        alert("Order cancelled successfully!")
        refreshOrders() // Refresh the dashboard to reflect the cancellation
      } else {
        alert("Failed to cancel order. Only pending orders can be cancelled.")
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("customerSession")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Customer Dashboard" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Book Transport
              </CardTitle>
              <CardDescription>Get your goods delivered safely</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/customer/book-transport">
                <Button className="w-full">New Booking</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Active Orders
              </CardTitle>
              <CardDescription>Track your current shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{activeOrders.length}</p>
              <p className="text-sm text-gray-600">Orders in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-purple-600" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{completedOrders.length}</p>
              <p className="text-sm text-gray-600">Completed orders</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeOrders.length > 0 ? (
                activeOrders.map((order) => (
                  <div key={order.id} className="flex flex-col p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-lg">{order.items.map((item) => item.name).join(", ")}</h3>
                      <div className="flex gap-2">
                        <Badge className={getStatusBadgeColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <Badge className={getPaymentBadgeColor(order.paymentStatus)}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-500" /> From: {order.pickupLocation}
                      </p>
                      <p className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-500" /> To: {order.deliveryLocation}
                      </p>
                      <p className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-500" /> Pickup: {order.pickupDate} at {order.pickupTime}
                      </p>
                      <p className="flex items-center gap-1">
                        <Truck className="h-4 w-4 text-gray-500" /> Vehicle:{" "}
                        {order.suggestedVehicleType.charAt(0).toUpperCase() + order.suggestedVehicleType.slice(1)}
                      </p>
                      {order.driverId && (
                        <p className="flex items-center gap-1">
                          <User className="h-4 w-4 text-gray-500" /> Driver: {getDriverInfo(order.driverId)}
                        </p>
                      )}
                      <p className="flex items-center gap-1 font-bold text-base text-green-700">
                        <DollarSign className="h-4 w-4" /> Price: ₹{order.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link href={`/customer/track-order/${order.id}`} className="flex-1">
                        <Button size="sm" className="w-full">
                          Track Order
                        </Button>
                      </Link>
                      {order.paymentStatus === "pending" && (
                        <Button size="sm" variant="secondary" className="flex-1" onClick={() => handlePayNow(order.id)}>
                          <CreditCard className="h-4 w-4 mr-2" /> Pay Now
                        </Button>
                      )}
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No active orders.</p>
              )}
              {completedOrders.length > 0 && (
                <>
                  <h3 className="font-semibold mt-4 text-xl">Completed & Cancelled Orders</h3>
                  {completedOrders.map((order) => (
                    <div key={order.id} className="flex flex-col p-4 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg">{order.items.map((item) => item.name).join(", ")}</h3>
                        <div className="flex gap-2">
                          <Badge className={getStatusBadgeColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <Badge className={getPaymentBadgeColor(order.paymentStatus)}>
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-500" /> From: {order.pickupLocation}
                        </p>
                        <p className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-gray-500" /> To: {order.deliveryLocation}
                        </p>
                        <p className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-500" /> Completed:{" "}
                          {new Date(order.completedAt || "").toLocaleDateString()}
                        </p>
                        <p className="flex items-center gap-1">
                          <Truck className="h-4 w-4 text-gray-500" /> Vehicle:{" "}
                          {order.suggestedVehicleType.charAt(0).toUpperCase() + order.suggestedVehicleType.slice(1)}
                        </p>
                        {order.driverId && (
                          <p className="flex items-center gap-1">
                            <User className="h-4 w-4 text-gray-500" /> Driver: {getDriverInfo(order.driverId)}
                          </p>
                        )}
                        <p className="flex items-center gap-1 font-bold text-base text-green-700">
                          <DollarSign className="h-4 w-4" /> Price: ₹{order.price.toFixed(2)}
                        </p>
                        {order.rating && (
                          <p className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            Your Rating: {order.rating} / 5
                          </p>
                        )}
                      </div>
                      <div className="mt-4 flex gap-2">
                        {!order.rating &&
                          order.driverId &&
                          order.status === "completed" && ( // Only allow rating if completed and not yet rated
                            <Link href={`/customer/rate-driver/${order.id}`} className="flex-1">
                              <Button size="sm" className="w-full">
                                Rate Driver
                              </Button>
                            </Link>
                          )}
                        {order.rating && (
                          <Button size="sm" variant="outline" className="w-full bg-transparent flex-1" disabled>
                            Rating Submitted
                          </Button>
                        )}
                        {order.paymentStatus === "pending" &&
                          order.status !== "cancelled" && ( // Don't show pay now for cancelled orders
                            <Button
                              size="sm"
                              variant="secondary"
                              className="flex-1"
                              onClick={() => handlePayNow(order.id)}
                            >
                              <CreditCard className="h-4 w-4 mr-2" /> Pay Now
                            </Button>
                          )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
