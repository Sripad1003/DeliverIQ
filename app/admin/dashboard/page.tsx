"use client"

import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Users, Truck, Package, TrendingUp, AlertCircle, CheckCircle, Shield, Key, Database, Bell, X, ExternalLink } from 'lucide-react'
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

interface AdminTask {
  id: string
  type: 'verification' | 'payment' | 'support' | 'system'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  actionUrl?: string
  actionLabel?: string
  dismissible: boolean
  count?: number
}

function AdminDashboardContent() {
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

  // Interactive tasks state
  const [adminTasks, setAdminTasks] = useState<AdminTask[]>([])

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

        // Generate interactive admin tasks based on real data
        const tasks: AdminTask[] = []

        // Driver verification tasks
        const unverifiedDrivers = drivers.filter(d => !d.documentsVerified || !d.isVerified)
        if (unverifiedDrivers.length > 0) {
          tasks.push({
            id: 'driver-verification',
            type: 'verification',
            title: 'Driver Verification Required',
            description: `${unverifiedDrivers.length} drivers need verification`,
            priority: 'high',
            actionUrl: '/admin/driver-verification',
            actionLabel: 'Review Drivers',
            dismissible: false,
            count: unverifiedDrivers.length
          })
        }

        // Payment issues
        const failedPayments = orders.filter(o => o.paymentStatus === 'failed')
        if (failedPayments.length > 0) {
          tasks.push({
            id: 'payment-issues',
            type: 'payment',
            title: 'Payment Issues',
            description: `${failedPayments.length} orders have payment failures`,
            priority: 'high',
            actionUrl: '/admin/order-management',
            actionLabel: 'View Orders',
            dismissible: true,
            count: failedPayments.length
          })
        }

        // Pending orders without drivers
        const pendingOrders = orders.filter(o => o.status === OrderStatus.pending && !o.driverId)
        if (pendingOrders.length > 0) {
          tasks.push({
            id: 'pending-orders',
            type: 'support',
            title: 'Orders Need Attention',
            description: `${pendingOrders.length} orders are pending driver assignment`,
            priority: 'medium',
            actionUrl: '/admin/order-management',
            actionLabel: 'Manage Orders',
            dismissible: true,
            count: pendingOrders.length
          })
        }

        // New user registrations today
        const todayRegistrations = allUsers.filter(u =>
          new Date(u.createdAt).toDateString() === new Date().toDateString()
        )
        if (todayRegistrations.length > 0) {
          tasks.push({
            id: 'new-registrations',
            type: 'system',
            title: 'New User Registrations',
            description: `${todayRegistrations.length} new users registered today`,
            priority: 'low',
            actionUrl: '/admin/manage-users',
            actionLabel: 'View Users',
            dismissible: true,
            count: todayRegistrations.length
          })
        }
        setAdminTasks(tasks)

      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams, router])

  const handleDismissTask = (taskId: string) => {
    setAdminTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const handleTaskAction = (task: AdminTask) => {
    if (task.actionUrl) {
      router.push(task.actionUrl)
    }
  }

  const getPriorityColor = (priority: AdminTask['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getPriorityIcon = (type: AdminTask['type']) => {
    switch (type) {
      case 'verification': return Shield
      case 'payment': return AlertCircle
      case 'support': return Bell
      case 'system': return CheckCircle
      default: return AlertCircle
    }
  }

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

          {/* Interactive Admin Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Admin Tasks
                {adminTasks.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {adminTasks.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {adminTasks.length > 0 ? (
                  adminTasks.map((task) => {
                    const Icon = getPriorityIcon(task.type)
                    return (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <Icon className={`h-5 w-5 ${getPriorityColor(task.priority)}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-sm">{task.title}</p>
                              {task.count && (
                                <Badge variant="outline" className="text-xs">
                                  {task.count}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{task.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {task.actionUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTaskAction(task)}
                              className="text-xs"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {task.actionLabel}
                            </Button>
                          )}
                          {task.dismissible && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDismissTask(task.id)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">All tasks completed!</p>
                    <p className="text-xs text-gray-500">No items require immediate attention</p>
                  </div>
                )}
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
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
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

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminDashboardContent />
    </Suspense>
  )
}
