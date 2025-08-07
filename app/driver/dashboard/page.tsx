"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Car, Star, DollarSign, Clock, MapPin, Package, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardHeader } from "../../../components/layout/dashboard-header" // Import DashboardHeader
import { getDriverSession, getOrders, updateOrder, type Order, OrderStatus, type DriverSession } from "../../../lib/app-data" // Ensure DriverSession is imported

export default function DriverDashboard() {
  const router = useRouter()
  const [driverSession, setDriverSession] = useState<DriverSession | null>(null) // Explicit type for driverSession
  const [availableJobs, setAvailableJobs] = useState<Order[]>([])
  const [activeTrip, setActiveTrip] = useState<Order | null>(null)
  const [tripHistory, setTripHistory] = useState<Order[]>([])

  const refreshOrders = async () => { // Make this function async
    const session = getDriverSession()
    if (!session) {
      router.push("/login")
      return
    }
    setDriverSession(session)

    const allOrders = await getOrders() // Use await here
    const driverVehicleType = session.vehicleType

    // Filter available jobs: pending, not assigned, and matching vehicle type
    const pendingJobs = allOrders.filter(
      (order) =>
        order.status === OrderStatus.pending && !order.driverId && order.suggestedVehicleType === driverVehicleType,
    )
    setAvailableJobs(pendingJobs)

    // Find active trip
    const currentTrip = allOrders.find(
      (order) =>
        order.driverId === session.id &&
        (order.status === OrderStatus.accepted || order.status === OrderStatus.inTransit),
    )
    setActiveTrip(currentTrip || null)

    // Filter trip history
    const completedTrips = allOrders.filter(
      (order) => order.driverId === session.id && order.status === OrderStatus.completed,
    )
    setTripHistory(completedTrips)
  }

  useEffect(() => {
    refreshOrders()
  }, [router])

  const handleAcceptJob = async (orderId: string) => { // Make this function async
    if (!driverSession) return
    const orders = await getOrders() // Use await here
    const orderToUpdate = orders.find((order) => order.id === orderId)

    if (orderToUpdate) {
      const updatedOrder = {
        ...orderToUpdate,
        driverId: driverSession.id,
        status: OrderStatus.accepted,
        acceptedAt: new Date().toISOString(),
      }
      await updateOrder(updatedOrder) // Use await here
      refreshOrders() // Refresh state after update
    }
  }

  const handleMarkInTransit = async (orderId: string) => { // Make this function async
    if (!driverSession) return
    const orders = await getOrders() // Use await here
    const orderToUpdate = orders.find((order) => order.id === orderId)

    if (orderToUpdate) {
      const updatedOrder = {
        ...orderToUpdate,
        status: OrderStatus.inTransit,
        inTransitAt: new Date().toISOString(),
        driverLocation: orderToUpdate.pickupLocation, // Set initial driver location
      }
      await updateOrder(updatedOrder) // Use await here
      refreshOrders() // Refresh state after update
    }
  }

  const handleCompleteTrip = async (orderId: string) => { // Make this function async
    if (!driverSession) return
    const orders = await getOrders() // Use await here
    const orderToUpdate = orders.find((order) => order.id === orderId)

    if (orderToUpdate) {
      const updatedOrder = {
        ...orderToUpdate,
        status: OrderStatus.completed,
        completedAt: new Date().toISOString(),
        driverLocation: orderToUpdate.deliveryLocation, // Final location
      }
      await updateOrder(updatedOrder) // Use await here
      refreshOrders() // Refresh state after update
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("driverSession")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Driver Dashboard" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-blue-600" />
                Available Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{availableJobs.length}</p>
              <p className="text-sm text-gray-600">Jobs matching your vehicle</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{tripHistory.reduce((sum, trip) => sum + trip.price, 0).toFixed(2)}</p>
              <p className="text-sm text-gray-600">From {tripHistory.length} completed trips</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{driverSession?.rating?.toFixed(1) || "N/A"}</p>
              <p className="text-sm text-gray-600">Based on {driverSession?.totalTrips || 0} reviews</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Active Trip
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeTrip ? (
                <>
                  <Badge variant="secondary">
                    {activeTrip.status.charAt(0).toUpperCase() + activeTrip.status.slice(1)}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    {activeTrip.pickupLocation} to {activeTrip.deliveryLocation}
                  </p>
                  <p className="text-xs text-gray-500">Items: {activeTrip.items.map((item) => item.name).join(", ")}</p>
                  <p className="text-xs text-gray-500">Price: ₹{activeTrip.price.toFixed(2)}</p>
                  {activeTrip.status === OrderStatus.accepted && (
                    <Button size="sm" className="mt-2 w-full" onClick={() => handleMarkInTransit(activeTrip.id)}>
                      Mark as In-Transit
                    </Button>
                  )}
                  {activeTrip.status === OrderStatus.inTransit && (
                    <Button
                      size="sm"
                      className="mt-2 w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleCompleteTrip(activeTrip.id)}
                    >
                      Mark as Completed
                    </Button>
                  )}
                  <Link href={`/customer/track-order/${activeTrip.id}`}>
                    <Button size="sm" variant="outline" className="mt-2 w-full bg-transparent">
                      View Tracking
                    </Button>
                  </Link>
                </>
              ) : (
                <p className="text-sm text-gray-600">No active trip.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Jobs</CardTitle>
              <CardDescription>Jobs matching your {driverSession?.vehicleType || "vehicle"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableJobs.length > 0 ? (
                  availableJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{job.items.map((item) => item.name).join(", ")} Transport</h3>
                        <p className="text-sm text-gray-600">
                          <MapPin className="inline-block h-3 w-3 mr-1" />
                          {job.pickupLocation} → {job.deliveryLocation}
                        </p>
                        <p className="text-sm text-gray-600">
                          <Package className="inline-block h-3 w-3 mr-1" />
                          Load: {job.items.reduce((sum, item) => sum + item.weight * item.quantity, 0)} kg
                        </p>
                        <p className="text-sm text-gray-600">
                          <Calendar className="inline-block h-3 w-3 mr-1" />
                          Pickup: {job.pickupDate} at {job.pickupTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">₹{job.price.toFixed(2)}</p>
                        <Button
                          size="sm"
                          className="mt-2"
                          onClick={() => handleAcceptJob(job.id)}
                          disabled={!!activeTrip}
                        >
                          {!!activeTrip ? "Trip Active" : "Accept"}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No available jobs matching your vehicle type.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trip History</CardTitle>
              <CardDescription>Your recent completed trips</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tripHistory.length > 0 ? (
                  tripHistory.map((trip) => (
                    <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">Completed: {trip.items.map((item) => item.name).join(", ")}</h3>
                        <p className="text-sm text-gray-600">
                          {trip.pickupLocation} → {trip.deliveryLocation}
                        </p>
                        <p className="text-sm text-gray-600">
                          On: {new Date(trip.completedAt || trip.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{trip.price.toFixed(2)}</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm ml-1">{trip.rating?.toFixed(1) || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No completed trips yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}