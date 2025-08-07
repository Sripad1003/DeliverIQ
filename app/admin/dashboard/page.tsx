"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Users, Truck, Package, TrendingUp, AlertCircle, CheckCircle, Shield, Key, Database } from 'lucide-react'
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { StatusAlert } from "../../../components/ui/status-alert"
import { DashboardHeader } from "../../../components/layout/dashboard-header"
import { getCustomers, getDrivers, getOrders, OrderStatus, Customer, Driver, Order } from "../../../lib/app-data"

// Helper for comparing arrays of objects by their stringified content
const areArraysOfObjectsEqual = (arr1: any[], arr2: any[]) => {
  if (arr1.length !== arr2.length) return false
  for (let i = 0; i < arr1.length; i++) {
    if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) {
      return false
    }
  }
  return true
}

export default function AdminDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showAccessDenied, setShowAccessDenied] = useState(false)
  const [loading, setLoading] = useState(true)

  // State for dynamic data
  const [totalUsers, setTotalUsers] = useState(0)
  const [activeDrivers, setActiveDrivers] = useState(0)
  const [todaysOrders, setTodaysOrders] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [recentRegistrations, setRecentRegistrations] = useState<
    { name: string; role: string; location?: string; vehicleType?: string; status?: string }[]
  >([])

  useEffect(() => {
    if (searchParams.get("accessDenied") === "true") {
      setShowAccessDenied(true)
      // Clear the query param after showing the message
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete("accessDenied")
      router.replace(newUrl.pathname + newUrl.search, undefined)
    }

    // Fetch and calculate dynamic data asynchronously
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const [customers, drivers, orders] = await Promise.all([
          getCustomers(),
          getDrivers(), 
          getOrders()
        ])

        // Calculate Total Users
        setTotalUsers(customers.length + drivers.length)

        // Calculate Active Drivers (drivers with accepted or in-transit orders)
        const driversWithActiveOrders = new Set(
          orders
            .filter(
              (order) =>
                order.driverId && (order.status === OrderStatus.accepted || order.status === OrderStatus.inTransit),
            )
            .map((order) => order.driverId),
        )
        setActiveDrivers(driversWithActiveOrders.size)

        // Calculate Today's Orders
        const today = new Date().toISOString().split("T")[0]
        const ordersToday = orders.filter((order) => order.createdAt.split("T")[0] === today)
        setTodaysOrders(ordersToday.length)

        // Calculate Total Revenue (from completed and paid orders)
        const revenue = orders.reduce((sum, order) => {
          if (order.status === OrderStatus.completed && order.paymentStatus === "paid") {
            return sum + order.price
          }
          return sum
        }, 0)
        setTotalRevenue(revenue)

        // Get Recent User Registrations (last 5, combining customers and drivers)
        const allUsers = [
          ...customers.map((c) => ({
            name: c.name,
            role: "Customer",
            location: c.address.split(",").pop()?.trim(),
            createdAt: c.createdAt,
            status: c.isVerified ? "Verified" : "Pending",
          })),
          ...drivers.map((d) => ({
            name: d.name,
            role: "Driver",
            vehicleType: d.vehicleType.charAt(0).toUpperCase() + d.vehicleType.slice(1),
            location: "N/A", // Driver location not stored in app-data, can be added if needed
            createdAt: d.createdAt,
            status: d.isVerified ? "Verified" : "Pending",
          })),
        ]
        const sortedRecentRegistrations = allUsers
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5) // Get top 5 recent registrations

        // Only update state if the content of the array has actually changed
        if (!areArraysOfObjectsEqual(recentRegistrations, sortedRecentRegistrations)) {
          setRecentRegistrations(sortedRecentRegistrations as any)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams, router])

  const handleLogout = () => {
    localStorage.removeItem("adminSession")
    window.location.href = "/"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Admin Dashboard" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <StatusAlert
          message={
            showAccessDenied
              ? { type: "error", text: "Access Denied: Only the Super Admin can access the Security Setup page." }
              : { type: "", text: "" }
          }
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalUsers}</p>
              <p className="text-sm text-gray-600">Customers & Drivers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-600" />
                Active Drivers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{activeDrivers}</p>
              <p className="text-sm text-gray-600">Drivers on active trips</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                Today's Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{todaysOrders}</p>
              <p className="text-sm text-gray-600">Orders created today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-gray-600">From completed & paid orders</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Registrations</CardTitle>
              <CardDescription>Latest users who joined the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRegistrations.length > 0 ? (
                  recentRegistrations.map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-600">
                          {user.role} • {user.role === "Driver" && user.vehicleType ? `${user.vehicleType} • ` : ""}
                          {user.location}
                        </p>
                      </div>
                      <Badge variant={user.status === "Verified" ? "default" : "secondary"}>{user.status}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">No recent registrations.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Issues requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-semibold">Payment Failed</p>
                    <p className="text-sm text-gray-600">Order #1234 payment issue</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-semibold">Driver Verification</p>
                    <p className="text-sm text-gray-600">3 drivers pending verification</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-semibold">System Update</p>
                    <p className="text-sm text-gray-600">Successfully deployed v2.1</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Platform Management</CardTitle>
            <CardDescription>Quick actions and controls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link href="/admin/manage-users">
                <Button className="h-20 flex flex-col w-full">
                  <Users className="h-6 w-6 mb-2" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/admin/driver-verification">
                <Button variant="outline" className="h-20 flex flex-col bg-transparent w-full">
                  <Truck className="h-6 w-6 mb-2" />
                  Driver Verification
                </Button>
              </Link>
              <Link href="/admin/order-management">
                <Button variant="outline" className="h-20 flex flex-col bg-transparent w-full">
                  <Package className="h-6 w-6 mb-2" />
                  Order Management
                </Button>
              </Link>
              <Link href="/admin/manage-admins">
                <Button variant="outline" className="h-20 flex flex-col bg-transparent w-full">
                  <Shield className="h-6 w-6 mb-2" />
                  Admin Management
                </Button>
              </Link>
              <Link href="/admin/setup">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col bg-transparent w-full border-red-200 hover:bg-red-50"
                >
                  <Key className="h-6 w-6 mb-2 text-red-600" />
                  Security Setup
                </Button>
              </Link>
              <Link href="/admin/data-transparency">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col bg-transparent w-full border-blue-200 hover:bg-blue-50"
                >
                  <Database className="h-6 w-6 mb-2 text-blue-600" />
                  Data Transparency
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-gray-500 text-sm mt-4">
          © {new Date().getFullYear()} DeliverIQ. All rights reserved.
        </p>
      </main>
    </div>
  )
}
