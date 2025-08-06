"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Truck, Search, CheckCircle, XCircle, Clock, FileText } from 'lucide-react'
import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { getDrivers, Driver } from "@/lib/app-data"

export default function DriverVerification() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "verified" | "rejected">("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const driversData = await getDrivers()
        setDrivers(driversData)
      } catch (error) {
        console.error("Error fetching drivers:", error)
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

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || 
      (filterStatus === "pending" && !driver.documentsVerified) ||
      (filterStatus === "verified" && driver.documentsVerified && driver.isVerified) ||
      (filterStatus === "rejected" && !driver.isVerified && driver.status === "suspended")

    return matchesSearch && matchesFilter
  })

  const getVerificationBadge = (driver: Driver) => {
    if (driver.documentsVerified && driver.isVerified) {
      return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>
    }
    if (!driver.documentsVerified) {
      return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>
    }
    if (!driver.isVerified) {
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
    }
    return <Badge variant="outline">Unknown</Badge>
  }

  const pendingCount = drivers.filter(d => !d.documentsVerified).length
  const verifiedCount = drivers.filter(d => d.documentsVerified && d.isVerified).length
  const rejectedCount = drivers.filter(d => !d.isVerified && d.status === "suspended").length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading driver verification data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Driver Verification" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-gray-600">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{verifiedCount}</p>
                  <p className="text-sm text-gray-600">Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{rejectedCount}</p>
                  <p className="text-sm text-gray-600">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{drivers.length}</p>
                  <p className="text-sm text-gray-600">Total Drivers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
            >
              All ({drivers.length})
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              onClick={() => setFilterStatus("pending")}
            >
              Pending ({pendingCount})
            </Button>
            <Button
              variant={filterStatus === "verified" ? "default" : "outline"}
              onClick={() => setFilterStatus("verified")}
            >
              Verified ({verifiedCount})
            </Button>
            <Button
              variant={filterStatus === "rejected" ? "default" : "outline"}
              onClick={() => setFilterStatus("rejected")}
            >
              Rejected ({rejectedCount})
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Driver Document Verification
            </CardTitle>
            <CardDescription>
              Review and verify driver documents and credentials
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
                        {getVerificationBadge(driver)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{driver.email}</p>
                      <p className="text-sm text-gray-600 mb-1">{driver.phone}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-2">
                        <div>
                          <span className="font-medium">Vehicle Type:</span> {driver.vehicleType.toUpperCase()}
                        </div>
                        <div>
                          <span className="font-medium">Vehicle Number:</span> {driver.vehicleNumber}
                        </div>
                        <div>
                          <span className="font-medium">License Number:</span> {driver.licenseNumber}
                        </div>
                        <div>
                          <span className="font-medium">Rating:</span> {driver.rating.toFixed(1)}/5 ({driver.totalTrips} trips)
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">
                        Applied: {new Date(driver.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!driver.documentsVerified && (
                        <>
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4 mr-1" />
                            View Documents
                          </Button>
                          <Button size="sm" variant="default">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {driver.documentsVerified && (
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No drivers found matching your criteria</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
