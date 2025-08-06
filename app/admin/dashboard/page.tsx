'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusAlert } from '@/components/ui/status-alert'
import {
  getAllOrders,
  updateOrderDriver,
  updateOrderStatus,
  Order,
  OrderStatus,
  Driver,
} from '@/lib/app-data'
import { getAdmins } from '@/actions/admin-actions'
import { getDriverById } from '@/actions/user-actions'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AdminDashboardPage() {
  const [adminName, setAdminName] = useState('Admin')
  const [orders, setOrders] = useState<Order[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentAdminId = localStorage.getItem('currentAdminId');
    if (!currentAdminId) {
      router.push('/admin/login');
      return;
    }

    const fetchAdminData = async () => {
      setLoading(true);
      const fetchedAdmins = await getAdmins();
      const currentAdmin = fetchedAdmins.find(admin => admin.id === currentAdminId);
      if (currentAdmin) {
        setAdminName(currentAdmin.name);
      } else {
        toast.error('Admin data not found. Please log in again.');
        localStorage.removeItem('currentAdminId');
        router.push('/admin/login');
        return;
      }

      const fetchedOrders = await getAllOrders();
      setOrders(fetchedOrders);

      // Fetch all drivers to populate the dropdown
      const allDrivers = await Promise.all(
        fetchedOrders.map(async (order) => {
          if (order.driverId) {
            const driver = await getDriverById(order.driverId);
            return driver;
          }
          return null;
        })
      );
      // Filter out nulls and ensure unique drivers
      const uniqueDrivers = Array.from(new Map(allDrivers.filter(d => d !== null).map(d => [d!.id, d!])).values());
      setDrivers(uniqueDrivers as Driver[]);

      setLoading(false);
    };

    fetchAdminData();
  }, [router]);

  const handleAssignDriver = async (orderId: string, driverId: string) => {
    setLoading(true);
    const result = await updateOrderDriver(orderId, driverId);
    if (result) {
      toast.success('Driver assigned successfully!');
      // Refresh orders
      const updatedOrders = await getAllOrders();
      setOrders(updatedOrders);
    } else {
      toast.error('Failed to assign driver.');
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setLoading(true);
    const result = await updateOrderStatus(orderId, newStatus);
    if (result) {
      toast.success(`Order status updated to ${newStatus}.`);
      // Refresh orders
      const updatedOrders = await getAllOrders();
      setOrders(updatedOrders);
    } else {
      toast.error('Failed to update order status.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentAdminId');
    toast.info('Logged out successfully.');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader title={`Welcome, ${adminName}!`} onLogout={handleLogout} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package2Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">All transport requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <ClockIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter((order) => order.status === OrderStatus.Pending).length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Orders awaiting assignment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Orders</CardTitle>
              <TruckIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter((order) => order.status === OrderStatus.Assigned || order.status === OrderStatus.PickedUp).length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Orders currently in progress</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">All Orders</h2>
          <Link href="/admin/manage-admins">
            <Button variant="outline">Manage Admins</Button>
          </Link>
        </div>
        <div className="grid gap-4">
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Order #{order.id.substring(0, 8)}</CardTitle>
                  <StatusAlert status={order.status} />
                </CardHeader>
                <CardContent className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Customer:</p>
                    <p className="text-sm font-medium">{order.customerName}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pickup:</p>
                    <p className="text-sm font-medium">{order.pickupLocation}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Delivery:</p>
                    <p className="text-sm font-medium">{order.deliveryLocation}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Driver:</p>
                    <p className="text-sm font-medium">{order.driverName}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    {order.status === OrderStatus.Pending && (
                      <Select onValueChange={(value) => handleAssignDriver(order.id, value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Assign Driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.length === 0 ? (
                            <SelectItem value="no-drivers" disabled>No drivers available</SelectItem>
                          ) : (
                            drivers.map((driver) => (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.name} ({driver.vehicle})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                    {order.status === OrderStatus.Assigned && (
                      <Button size="sm" onClick={() => handleUpdateStatus(order.id, OrderStatus.PickedUp)} disabled={loading}>
                        {loading ? 'Updating...' : 'Mark as Picked Up'}
                      </Button>
                    )}
                    {order.status === OrderStatus.PickedUp && (
                      <Button size="sm" onClick={() => handleUpdateStatus(order.id, OrderStatus.Delivered)} disabled={loading}>
                        {loading ? 'Updating...' : 'Mark as Delivered'}
                      </Button>
                    )}
                    {(order.status === OrderStatus.Delivered || order.status === OrderStatus.Cancelled) && (
                      <Button size="sm" variant="outline" disabled>
                        {order.status}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

function Package2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.79 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  )
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function TruckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.61a1 1 0 0 0-.88-.91l-7.35-1.62A2 2 0 0 0 13 9.28V8.5a.5.5 0 0 1 .5-.5H22a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.5" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  )
}
