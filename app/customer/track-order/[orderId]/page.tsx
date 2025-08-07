"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import { MapPin, Truck, Package, User, Calendar, DollarSign, Clock, CircleDot, CircleCheck, Star } from "lucide-react"
import { PageHeaderWithBack } from "../../../../components/layout/page-header-with-back" // Import PageHeaderWithBack
import { getOrderById, getDrivers, getCurrentUserSession, type Order, type Driver, OrderStatus } from "../../../../lib/app-data"

export default function TrackOrderPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<Order | null>(null)
  const [driverInfo, setDriverInfo] = useState<Driver | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dashboardLink, setDashboardLink] = useState("/login") // Default to login

  useEffect(() => {
    const fetchData = async () => {
      const session = getCurrentUserSession() // Check for any session (customer or driver)
      if (!session) {
        router.push("/login")
        return
      }

      // Set the correct dashboard link based on the user's role
      if (session.role === "customer") {
        setDashboardLink("/customer/dashboard")
      } else if (session.role === "driver") {
        setDashboardLink("/driver/dashboard")
      }

      try {
        const fetchedOrder = await getOrderById(orderId) // Use await here
        if (fetchedOrder) {
          // Check if the logged-in user is either the customer who placed the order
          // or the driver assigned to the order.
          if (
            (session.role === "customer" && fetchedOrder.customerId === session.id) ||
            (session.role === "driver" && fetchedOrder.driverId === session.id)
          ) {
            setOrder(fetchedOrder)
            if (fetchedOrder.driverId) {
              const drivers = await getDrivers() // Use await here
              setDriverInfo(drivers.find((d) => d.id === fetchedOrder.driverId) || null)
            }
          } else {
            setError("Order not found or you do not have permission to view it.")
          }
        } else {
          setError("Order not found.")
        }
      } catch (err) {
        setError("Failed to fetch order details.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [orderId, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <Link href={dashboardLink}>
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-gray-600 text-lg mb-4">Order details could not be loaded.</p>
        <Link href={dashboardLink}>
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    )
  }

  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.pending:
        return "bg-yellow-500"
      case OrderStatus.accepted:
        return "bg-blue-500"
      case OrderStatus.inTransit:
        return "bg-green-500"
      case OrderStatus.completed:
        return "bg-gray-500"
      case OrderStatus.cancelled:
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.pending:
        return 1
      case OrderStatus.accepted:
        return 2
      case OrderStatus.inTransit:
        return 3
      case OrderStatus.completed:
        return 4
      case OrderStatus.cancelled:
        return 0 // Special case for cancelled
      default:
        return 0
    }
  }

  const currentStep = getStatusStep(order.status)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center p-4">
      <div className="w-full max-w-3xl">
        <PageHeaderWithBack
          title="Track Your Order"
          description={`Order ID: ${order.id}`}
          backLink={dashboardLink}
          icon={Truck}
        />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Order Status
              <Badge className={getStatusBadgeColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </CardTitle>
            <CardDescription>Current progress of your shipment.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>Pickup: {order.pickupLocation}</span>
              <span>Delivery: {order.deliveryLocation}</span>
            </div>
            <div className="relative flex justify-between items-center mb-6">
              <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${(currentStep - 1) * (100 / 3)}%` }}
                />
              </div>
              <div className="relative z-10 flex flex-col items-center">
                {currentStep >= 1 ? (
                  <CircleCheck className="h-6 w-6 text-blue-500 fill-blue-500" />
                ) : (
                  <CircleDot className="h-6 w-6 text-gray-400" />
                )}
                <span className="mt-1 text-xs text-center">Pending</span>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                {currentStep >= 2 ? (
                  <CircleCheck className="h-6 w-6 text-blue-500 fill-blue-500" />
                ) : (
                  <CircleDot className="h-6 w-6 text-gray-400" />
                )}
                <span className="mt-1 text-xs text-center">Accepted</span>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                {currentStep >= 3 ? (
                  <CircleCheck className="h-6 w-6 text-blue-500 fill-blue-500" />
                ) : (
                  <CircleDot className="h-6 w-6 text-gray-400" />
                )}
                <span className="mt-1 text-xs text-center">In-Transit</span>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                {currentStep >= 4 ? (
                  <CircleCheck className="h-6 w-6 text-blue-500 fill-blue-500" />
                ) : (
                  <CircleDot className="h-6 w-6 text-gray-400" />
                )}
                <span className="mt-1 text-xs text-center">Completed</span>
              </div>
            </div>

            {order.status === OrderStatus.inTransit && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200 text-sm text-blue-800 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Your order is currently in transit.</span>
                {order.driverLocation && <span>Last known location: {order.driverLocation}</span>}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Order Details
            </CardTitle>
            <CardDescription>Information about your shipment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <strong>Pickup:</strong> {order.pickupLocation}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <strong>Delivery:</strong> {order.deliveryLocation}
            </p>
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <strong>Scheduled:</strong> {order.pickupDate} at {order.pickupTime}
            </p>
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-gray-500" />
              <strong>Vehicle Type:</strong>{" "}
              {order.suggestedVehicleType.charAt(0).toUpperCase() + order.suggestedVehicleType.slice(1)}
            </p>
            <p className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <strong>Price:</strong> ₹{order.price.toFixed(2)}
            </p>
            <div className="pt-2">
              <h4 className="font-semibold mb-1">Items:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} (x{item.quantity}) - {item.weight}kg, {item.length}x{item.width}x{item.height}m
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {driverInfo && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Driver Details
              </CardTitle>
              <CardDescription>Information about the assigned driver.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <strong>Name:</strong> {driverInfo.name}
              </p>
              <p className="flex items-center gap-2">
                <strong>Vehicle:</strong>{" "}
                {driverInfo.vehicleType.charAt(0).toUpperCase() + driverInfo.vehicleType.slice(1)} (
                {driverInfo.vehicleNumber})
              </p>
              <p className="flex items-center gap-2">
                <strong>Contact:</strong> {driverInfo.phone}
              </p>
              <p className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <strong>Rating:</strong> {driverInfo.rating.toFixed(1)} ({driverInfo.totalTrips} trips)
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}