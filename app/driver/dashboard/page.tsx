"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Star, DollarSign, Clock } from "lucide-react"
import { useRouter } from "next/navigation" // Add this import

export default function DriverDashboard() {
  const router = useRouter() // Initialize useRouter

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("driverSession")
                router.push("/") // Redirect to home page
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

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
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-gray-600">Jobs matching your vehicle</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Today's Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹2,400</p>
              <p className="text-sm text-gray-600">From 3 completed trips</p>
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
              <p className="text-2xl font-bold">4.8</p>
              <p className="text-sm text-gray-600">Based on 156 reviews</p>
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
              <Badge variant="secondary">In Progress</Badge>
              <p className="text-sm text-gray-600 mt-1">Mumbai to Pune</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Jobs</CardTitle>
              <CardDescription>Jobs matching your truck</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Electronics Transport</h3>
                    <p className="text-sm text-gray-600">Mumbai → Pune • 150 km</p>
                    <p className="text-sm text-gray-600">Load: 500 kg</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">₹1,800</p>
                    <Button size="sm" className="mt-2">
                      Accept
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Furniture Delivery</h3>
                    <p className="text-sm text-gray-600">Delhi → Gurgaon • 45 km</p>
                    <p className="text-sm text-gray-600">Load: 800 kg</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">₹1,200</p>
                    <Button size="sm" className="mt-2">
                      Accept
                    </Button>
                  </div>
                </div>
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
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Completed</h3>
                    <p className="text-sm text-gray-600">Bangalore → Chennai</p>
                    <p className="text-sm text-gray-600">Yesterday</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹3,200</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm ml-1">4.9</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Completed</h3>
                    <p className="text-sm text-gray-600">Hyderabad → Vijayawada</p>
                    <p className="text-sm text-gray-600">2 days ago</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹1,800</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm ml-1">4.7</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
