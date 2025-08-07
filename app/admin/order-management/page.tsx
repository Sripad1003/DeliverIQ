"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Package, Search, Clock, CheckCircle, XCircle, Truck, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from "react"
import { DashboardHeader } from "../../../components/layout/dashboard-header"
import { getOrders, getCustomers, getDrivers, Order, OrderStatus, Customer, Driver } from "../../../lib/app-data"

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | OrderStatus>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [adminNote, setAdminNote] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [ordersData, customersData, driversData] = await Promise.all([
          getOrders(),
          getCustomers(),
          getDrivers()
        ])
        setOrders(ordersData)
        setCustomers(customersData)
        setDrivers(driversData)
      } catch (error) {
        console.error("Error fetching order data:", error)
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

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId)
    return customer ? customer.name : "Unknown Customer"
  }

  const getDriverName = (driverId?: string) => {
    if (!driverId) return "No Driver Assigned"
    const driver = drivers.find(d => d.id === driverId)
    return driver ? driver.name : "Unknown Driver"
  }

  const filteredOrders = orders.filter(order => {
    const customerName = getCustomerName(order.customerId)
    const driverName = getDriverName(order.driverId)
    
    const matchesSearch = order.id.includes(searchTerm) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.deliveryLocation.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || order.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      [OrderStatus.pending]: { variant: "secondary" as const, icon: Clock, color: "text-yellow-600" },
      [OrderStatus.accepted]: { variant: "default" as const, icon: CheckCircle, color: "text-blue-600" },
      [OrderStatus.inTransit]: { variant: "default" as const, icon: Truck, color: "text-purple-600" },
      [OrderStatus.completed]: { variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      [OrderStatus.cancelled]: { variant: "destructive" as const, icon: XCircle, color: "text-red-600" }
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant}>
        <Icon className={`h-3 w-3 mr-1 ${config.color}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getPaymentBadge = (paymentStatus: string) => {
    const config = {
      pending: { variant: "secondary" as const, color: "text-yellow-600" },
      paid: { variant: "default" as const, color: "text-green-600" },
      failed: { variant: "destructive" as const, color: "text-red-600" }
    }

    const statusConfig = config[paymentStatus as keyof typeof config] || config.pending

    return (
      <Badge variant={statusConfig.variant}>
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </Badge>
    )
  }

  const statusCounts = {
    pending: orders.filter(o => o.status === OrderStatus.pending).length,
    accepted: orders.filter(o => o.status === OrderStatus.accepted).length,
    inTransit: orders.filter(o => o.status === OrderStatus.inTransit).length,
    completed: orders.filter(o => o.status === OrderStatus.completed).length,
    cancelled: orders.filter(o => o.status === OrderStatus.cancelled).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Order Management" onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{statusCounts.pending}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{statusCounts.accepted}</p>
                  <p className="text-sm text-gray-600">Accepted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{statusCounts.inTransit}</p>
                  <p className="text-sm text-gray-600">In Transit</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{statusCounts.completed}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{statusCounts.cancelled}</p>
                  <p className="text-sm text-gray-600">Cancelled</p>
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
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
            >
              All ({orders.length})
            </Button>
            <Button
              variant={filterStatus === OrderStatus.pending ? "default" : "outline"}
              onClick={() => setFilterStatus(OrderStatus.pending)}
            >
              Pending ({statusCounts.pending})
            </Button>
            <Button
              variant={filterStatus === OrderStatus.accepted ? "default" : "outline"}
              onClick={() => setFilterStatus(OrderStatus.accepted)}
            >
              Accepted ({statusCounts.accepted})
            </Button>
            <Button
              variant={filterStatus === OrderStatus.inTransit ? "default" : "outline"}
              onClick={() => setFilterStatus(OrderStatus.inTransit)}
            >
              In Transit ({statusCounts.inTransit})
            </Button>
            <Button
              variant={filterStatus === OrderStatus.completed ? "default" : "outline"}
              onClick={() => setFilterStatus(OrderStatus.completed)}
            >
              Completed ({statusCounts.completed})
            </Button>
            <Button
              variant={filterStatus === OrderStatus.cancelled ? "default" : "outline"}
              onClick={() => setFilterStatus(OrderStatus.cancelled)}
            >
              Cancelled ({statusCounts.cancelled})
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Management
            </CardTitle>
            <CardDescription>
              Monitor and manage all platform orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        {getStatusBadge(order.status)}
                        {getPaymentBadge(order.paymentStatus)}
                        {order.rating && (
                          <Badge variant="outline">★ {order.rating}/5</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                        <div>
                          <span className="font-medium">Customer:</span> {getCustomerName(order.customerId)}
                        </div>
                        <div>
                          <span className="font-medium">Driver:</span> {getDriverName(order.driverId)}
                        </div>
                        <div>
                          <span className="font-medium">Pickup:</span> {order.pickupLocation}
                        </div>
                        <div>
                          <span className="font-medium">Delivery:</span> {order.deliveryLocation}
                        </div>
                        <div>
                          <span className="font-medium">Vehicle:</span> {order.suggestedVehicleType.toUpperCase()}
                        </div>
                        <div>
                          <span className="font-medium">Price:</span> ₹{order.price}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Items:</span> {order.items.map(item => `${item.name} (${item.quantity})`).join(", ")}
                      </div>
                      {order.adminNotes && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                          <span className="font-medium text-yellow-800">Admin Note:</span> {order.adminNotes}
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Created: {new Date(order.createdAt).toLocaleString()}
                        {order.completedAt && ` • Completed: ${new Date(order.completedAt).toLocaleString()}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order)
                          setAdminNote(order.adminNotes || "")
                        }}
                      >
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Add Note
                      </Button>
                      {order.status === OrderStatus.pending && (
                        <Button size="sm" variant="destructive">
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No orders found matching your criteria</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Admin Note Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add Admin Note</CardTitle>
                <CardDescription>Order #{selectedOrder.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter admin note..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={4}
                />
                <div className="flex gap-2 mt-4">
                  <Button 
                    onClick={() => {
                      // Here you would update the order with the admin note
                      console.log("Saving admin note:", adminNote)
                      setSelectedOrder(null)
                      setAdminNote("")
                    }}
                  >
                    Save Note
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedOrder(null)
                      setAdminNote("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
