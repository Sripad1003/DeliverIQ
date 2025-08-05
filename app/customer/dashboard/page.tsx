"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Truck, Clock } from "lucide-react"
import { useRouter } from "next/navigation" // Add this import at the top

export default function CustomerDashboard() {
  const router = useRouter() // Initialize useRouter

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("customerSession")
                router.push("/") // Or window.location.href = "/" for a full refresh
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

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
              <Button className="w-full">New Booking</Button>
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
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-gray-600">Orders in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-purple-600" />
                Order History
              </CardTitle>
              <CardDescription>View past deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">24</p>
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
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Electronics Delivery</h3>
                  <p className="text-sm text-gray-600">From: Mumbai • To: Pune</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">In Transit</p>
                  <p className="text-sm text-gray-600">₹1,200</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Furniture Moving</h3>
                  <p className="text-sm text-gray-600">From: Delhi • To: Gurgaon</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">Scheduled</p>
                  <p className="text-sm text-gray-600">₹2,500</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
