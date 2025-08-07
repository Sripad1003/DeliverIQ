"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Users, Search, Shield, Ban, CheckCircle, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from "react"
import { DashboardHeader } from "../../../components/layout/dashboard-header"
import { getCustomers, getDrivers, Customer, Driver } from "../../../lib/app-data"

export default function ManageUsers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"customers" | "drivers">("customers")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [customersData, driversData] = await Promise.all([
          getCustomers(),
          getDrivers()
        ])
        setCustomers(customersData)
        setDrivers(driversData)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("adminSession")
    window.location.href = "/"
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string, isVerified: boolean) => {
    if (status === "banned") return <Badge variant="destructive">Banned</Badge>
    if (status === "suspended") return <Badge variant="secondary">Suspended</Badge>
    if (!isVerified) return <Badge variant="outline">Unverified</Badge>
    return <Badge variant="default">Active</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="User Management" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === "customers" ? "default" : "outline"}
              onClick={() => setActiveTab("customers")}
            >
              Customers ({customers.length})
            </Button>
            <Button
              variant={activeTab === "drivers" ? "default" : "outline"}
              onClick={() => setActiveTab("drivers")}
            >
              Drivers ({drivers.length})
            </Button>
          </div>
        </div>

        {activeTab === "customers" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Management
              </CardTitle>
              <CardDescription>
                Manage customer accounts, verification status, and access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{customer.name}</h3>
                          {getStatusBadge(customer.status, customer.isVerified)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{customer.email}</p>
                        <p className="text-sm text-gray-600 mb-1">{customer.phone}</p>
                        <p className="text-sm text-gray-500">{customer.address}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Joined: {new Date(customer.createdAt).toLocaleDateString()}
                          {customer.lastLoginAt && ` • Last login: ${new Date(customer.lastLoginAt).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!customer.isVerified && (
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                        )}
                        {customer.status === "active" && (
                          <Button size="sm" variant="outline">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Suspend
                          </Button>
                        )}
                        {customer.status !== "banned" && (
                          <Button size="sm" variant="destructive">
                            <Ban className="h-4 w-4 mr-1" />
                            Ban
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No customers found</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "drivers" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Driver Management
              </CardTitle>
              <CardDescription>
                Manage driver accounts, verification status, and vehicle information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDrivers.length > 0 ? (
                  filteredDrivers.map((driver) => (
                    <div key={driver.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{driver.name}</h3>
                          {getStatusBadge(driver.status, driver.isVerified)}
                          {driver.documentsVerified && <Badge variant="outline">Docs Verified</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{driver.email}</p>
                        <p className="text-sm text-gray-600 mb-1">{driver.phone}</p>
                        <div className="flex gap-4 text-sm text-gray-500 mb-1">
                          <span>Vehicle: {driver.vehicleType.toUpperCase()}</span>
                          <span>Number: {driver.vehicleNumber}</span>
                          <span>License: {driver.licenseNumber}</span>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>Rating: {driver.rating.toFixed(1)}/5</span>
                          <span>Trips: {driver.totalTrips}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Joined: {new Date(driver.createdAt).toLocaleDateString()}
                          {driver.lastLoginAt && ` • Last login: ${new Date(driver.lastLoginAt).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!driver.isVerified && (
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Verify
                          </Button>
                        )}
                        {driver.status === "active" && (
                          <Button size="sm" variant="outline">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Suspend
                          </Button>
                        )}
                        {driver.status !== "banned" && (
                          <Button size="sm" variant="destructive">
                            <Ban className="h-4 w-4 mr-1" />
                            Ban
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No drivers found</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
