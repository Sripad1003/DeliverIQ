"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Shield, Users, Truck, Package, Key, Database, Settings, BarChart3, UserCheck, ClipboardList, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { DashboardHeader } from "../../components/layout/dashboard-header"
import { StatusAlert } from "../../components/ui/status-alert"
import { getCustomers, getDrivers, getOrders, OrderStatus } from "../../lib/app-data"

export default function AdminHomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCustomers: 0,
    totalDrivers: 0,
    pendingDrivers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  })
  const [adminInfo, setAdminInfo] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    // Check authentication
    const adminSessionString = localStorage.getItem("adminSession")
    if (!adminSessionString) {
      router.push("/admin/login")
      return
    }

    try {
      const adminSession = JSON.parse(adminSessionString)
      setAdminInfo({ name: adminSession.name, email: adminSession.email })
    } catch (error) {
      console.error("Failed to parse admin session:", error)
      router.push("/admin/login")
      return
    }

    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        const [customers, drivers, orders] = await Promise.all([
          getCustomers(),
          getDrivers(),
          getOrders()
        ])

        const pendingDrivers = drivers.filter(d => !d.documentsVerified).length
        const pendingOrders = orders.filter(o => o.status === OrderStatus.pending).length
        const activeOrders = orders.filter(o => 
          o.status === OrderStatus.accepted || o.status === OrderStatus.inTransit
        ).length
        const completedOrders = orders.filter(o => o.status === OrderStatus.completed).length
        const totalRevenue = orders
          .filter(o => o.status === OrderStatus.completed && o.paymentStatus === "paid")
          .reduce((sum, order) => sum + order.price, 0)

        setStats({
          totalUsers: customers.length + drivers.length,
          totalCustomers: customers.length,
          totalDrivers: drivers.length,
          pendingDrivers,
          totalOrders: orders.length,
          pendingOrders,
          activeOrders,
          completedOrders,
          totalRevenue
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminSession")
    window.location.href = "/"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Admin Control Panel" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Shield className="h-6 w-6" />
                Welcome, {adminInfo?.name || "Administrator"}
              </CardTitle>
              <CardDescription className="text-blue-600">
                Manage and monitor the DeliverIQ platform from this central dashboard
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4 text-blue-600" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-gray-600">
                {stats.totalCustomers} customers, {stats.totalDrivers} drivers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Package className="h-4 w-4 text-green-600" />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-gray-600">
                {stats.pendingOrders} pending, {stats.activeOrders} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                Pending Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingDrivers}</div>
              <p className="text-xs text-gray-600">Driver verifications needed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(0)}</div>
              <p className="text-xs text-gray-600">From {stats.completedOrders} completed orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* User Management */}
          <Link href="/admin/manage-users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-blue-600" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage customer and driver accounts, verification status, and access controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge variant="outline">{stats.totalUsers} total users</Badge>
                  <Button size="sm">Manage →</Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Driver Verification */}
          <Link href="/admin/driver-verification">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <UserCheck className="h-6 w-6 text-yellow-600" />
                  Driver Verification
                </CardTitle>
                <CardDescription>
                  Review and verify driver documents, licenses, and vehicle information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">{stats.pendingDrivers} pending</Badge>
                  <Button size="sm" variant="outline">Review →</Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Order Management */}
          <Link href="/admin/order-management">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <ClipboardList className="h-6 w-6 text-green-600" />
                  Order Management
                </CardTitle>
                <CardDescription>
                  Monitor orders, resolve disputes, and manage platform transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge variant="outline">{stats.totalOrders} total orders</Badge>
                  <Button size="sm" variant="outline">Manage →</Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Admin Management */}
          <Link href="/admin/manage-admins">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-purple-600" />
                  Admin Management
                </CardTitle>
                <CardDescription>
                  Create and manage administrator accounts with secure access controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge variant="outline">Secure access</Badge>
                  <Button size="sm" variant="outline">Manage →</Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Security Setup */}
          <Link href="/admin/setup">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Key className="h-6 w-6 text-red-600" />
                  Security Setup
                </CardTitle>
                <CardDescription>
                  Configure security keys, encryption settings, and access credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge variant="destructive">Restricted</Badge>
                  <Button size="sm" variant="outline">Configure →</Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Data Transparency */}
          <Link href="/admin/data-transparency">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="h-6 w-6 text-indigo-600" />
                  Data Transparency
                </CardTitle>
                <CardDescription>
                  View encrypted data storage, security compliance, and system transparency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge variant="outline">AES-256 Encrypted</Badge>
                  <Button size="sm" variant="outline">View →</Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Frequently used administrative functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" className="w-full h-16 flex flex-col">
                  <BarChart3 className="h-5 w-5 mb-1" />
                  <span className="text-xs">Analytics Dashboard</span>
                </Button>
              </Link>
              
              <Link href="/admin/driver-verification">
                <Button variant="outline" className="w-full h-16 flex flex-col">
                  <Clock className="h-5 w-5 mb-1" />
                  <span className="text-xs">Pending Reviews</span>
                  {stats.pendingDrivers > 0 && (
                    <Badge variant="destructive" className="text-xs mt-1">
                      {stats.pendingDrivers}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Link href="/admin/order-management">
                <Button variant="outline" className="w-full h-16 flex flex-col">
                  <AlertTriangle className="h-5 w-5 mb-1" />
                  <span className="text-xs">Active Issues</span>
                  {stats.pendingOrders > 0 && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {stats.pendingOrders}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Link href="/admin/data-transparency">
                <Button variant="outline" className="w-full h-16 flex flex-col">
                  <CheckCircle className="h-5 w-5 mb-1 text-green-600" />
                  <span className="text-xs">System Status</span>
                  <Badge variant="outline" className="text-xs mt-1 text-green-600">
                    Secure
                  </Badge>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <div className="mt-8">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                System Status: All Systems Operational
              </CardTitle>
              <CardDescription className="text-green-600">
                Last updated: {new Date().toLocaleString()} • All security protocols active
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          © {new Date().getFullYear()} DeliverIQ Admin Panel. All rights reserved.
        </p>
      </main>
    </div>
  )
}
