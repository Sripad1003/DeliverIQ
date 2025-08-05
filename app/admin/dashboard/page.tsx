"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Truck, Package, TrendingUp, AlertCircle, CheckCircle, Shield, Key } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showAccessDenied, setShowAccessDenied] = useState(false)

  useEffect(() => {
    if (searchParams.get("accessDenied") === "true") {
      setShowAccessDenied(true)
      // Clear the query param after showing the message
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete("accessDenied")
      router.replace(newUrl.pathname + newUrl.search, undefined)
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("adminSession")
                window.location.href = "/"
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showAccessDenied && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Access Denied:</strong> Only the Super Admin can access the Security Setup page.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-sm text-gray-600">+12% from last month</p>
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
              <p className="text-2xl font-bold">342</p>
              <p className="text-sm text-gray-600">Currently online</p>
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
              <p className="text-2xl font-bold">89</p>
              <p className="text-sm text-gray-600">+5% from yesterday</p>
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
              <p className="text-2xl font-bold">₹45,230</p>
              <p className="text-sm text-gray-600">Today's total</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Registrations</CardTitle>
              <CardDescription>New users who joined today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Rahul Sharma</p>
                    <p className="text-sm text-gray-600">Customer • Mumbai</p>
                  </div>
                  <Badge variant="secondary">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Priya Patel</p>
                    <p className="text-sm text-gray-600">Driver • Truck • Delhi</p>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Amit Kumar</p>
                    <p className="text-sm text-gray-600">Customer • Bangalore</p>
                  </div>
                  <Badge variant="secondary">Verified</Badge>
                </div>
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
            <div className="grid md:grid-cols-5 gap-4">
              <Button className="h-20 flex flex-col">
                <Users className="h-6 w-6 mb-2" />
                Manage Users
              </Button>
              <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                <Truck className="h-6 w-6 mb-2" />
                Driver Verification
              </Button>
              <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                <Package className="h-6 w-6 mb-2" />
                Order Management
              </Button>
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
      </main>
    </div>
  )
}
