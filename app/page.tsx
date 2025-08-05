"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Users, Shield, Star, Clock, MapPin } from "lucide-react"

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const adminSession = localStorage.getItem("adminSession")
    const customerSession = localStorage.getItem("customerSession")
    const driverSession = localStorage.getItem("driverSession")

    if (adminSession) {
      setIsLoggedIn(true)
      setUserType("admin")
    } else if (customerSession) {
      setIsLoggedIn(true)
      setUserType("customer")
    } else if (driverSession) {
      setIsLoggedIn(true)
      setUserType("driver")
    }
  }, [])

  const handleLogout = () => {
    // Clear all sessions
    localStorage.removeItem("adminSession")
    localStorage.removeItem("customerSession")
    localStorage.removeItem("driverSession")

    setIsLoggedIn(false)
    setUserType("")

    // Redirect to home
    window.location.href = "/"
  }

  const getDashboardLink = () => {
    switch (userType) {
      case "admin":
        return "/admin/dashboard"
      case "customer":
        return "/customer/dashboard"
      case "driver":
        return "/driver/dashboard"
      default:
        return "/"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Truck className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Trolla</h1>
          </div>
          <div className="flex space-x-4 items-center">
            {isLoggedIn ? (
              <>
                <Link href={getDashboardLink()}>
                  <Button variant="outline">{userType.charAt(0).toUpperCase() + userType.slice(1)} Dashboard</Button>
                </Link>
                <Button onClick={handleLogout} variant="destructive">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Smart Goods Transportation</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect customers with reliable drivers for efficient goods transportation. Get the right vehicle for your
            cargo at the best price.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/signup?role=customer">
              <Button size="lg" className="px-8">
                Book Transport
              </Button>
            </Link>
            <Link href="/signup?role=driver">
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Become a Driver
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Our Services</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>For Customers</CardTitle>
                <CardDescription>Book the perfect vehicle for your goods transportation needs</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Vehicle recommendations based on your items</li>
                  <li>• Cost optimization suggestions</li>
                  <li>• Real-time tracking</li>
                  <li>• Secure payment options</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Truck className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>For Drivers</CardTitle>
                <CardDescription>Earn money by providing reliable transportation services</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Get jobs matching your vehicle type</li>
                  <li>• Build your reputation with ratings</li>
                  <li>• Track your earnings and history</li>
                  <li>• Flexible working hours</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Admin Control</CardTitle>
                <CardDescription>Comprehensive platform management and oversight</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• User management and verification</li>
                  <li>• Platform analytics and insights</li>
                  <li>• Quality control and monitoring</li>
                  <li>• Support and dispute resolution</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose Trolla?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Star className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Rated Drivers</h4>
              <p className="text-gray-600">All drivers are verified and rated by previous customers</p>
            </div>
            <div className="text-center">
              <Clock className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Quick Booking</h4>
              <p className="text-gray-600">Book your transport in minutes with our smart matching system</p>
            </div>
            <div className="text-center">
              <MapPin className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Real-time Tracking</h4>
              <p className="text-gray-600">Track your goods in real-time from pickup to delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Truck className="h-6 w-6" />
            <span className="text-xl font-bold">Trolla</span>
          </div>
          <p className="text-gray-400">Connecting customers and drivers for efficient goods transportation</p>
        </div>
      </footer>
    </div>
  )
}
