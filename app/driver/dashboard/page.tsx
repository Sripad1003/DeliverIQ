'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusAlert } from '@/components/ui/status-alert'
import { getDriverSession, getDriverOrders, updateOrderStatus, updateOrderPickupTime, updateOrderDeliveryTime, Order, OrderStatus } from '@/lib/app-data'
import { toast } from 'sonner'

export default function DriverDashboardPage() {
  const [driverName, setDriverName] = useState('Driver')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserType = localStorage.getItem('currentUserType');

    if (!currentUserId || currentUserType !== 'driver') {
      router.push('/login');
      return;
    }

    const fetchDriverData = async () => {
      setLoading(true);
      const driver = await getDriverSession(currentUserId);
      if (driver) {
        setDriverName(driver.name);
        const driverOrders = await getDriverOrders(currentUserId);
        setOrders(driverOrders);
      } else {
        toast.error('Failed to load driver data. Please log in again.');
        router.push('/login');
      }
      setLoading(false);
    };

    fetchDriverData();
  }, [router]);

  const handleUpdateStatus = async (orderId: string, currentStatus: OrderStatus) => {
    let newStatus: OrderStatus | null = null;
    let updateAction: ((orderId: string, time: string) => Promise<boolean>) | null = null;

    if (currentStatus === OrderStatus.Assigned) {
      newStatus = OrderStatus.PickedUp;
      updateAction = updateOrderPickupTime;
    } else if (currentStatus === OrderStatus.PickedUp) {
      newStatus = OrderStatus.Delivered;
      updateAction = updateOrderDeliveryTime;
    }

    if (newStatus) {
      setLoading(true);
      const statusResult = await updateOrderStatus(orderId, newStatus);
      if (statusResult) {
        if (updateAction) {
          const timeResult = await updateAction(orderId, new Date().toISOString());
          if (!timeResult) {
            toast.error(`Failed to update ${newStatus === OrderStatus.PickedUp ? 'pickup' : 'delivery'} time.`);
          }
        }
        toast.success(`Order status updated to ${newStatus}.`);
        // Refresh orders
        const currentUserId = localStorage.getItem('currentUserId');
        if (currentUserId) {
          const updatedOrders = await getDriverOrders(currentUserId);
          setOrders(updatedOrders);
        }
      } else {
        toast.error('Failed to update order status.');
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentUserType');
    toast.info('Logged out successfully.');
    router.push('/login');
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
      <DashboardHeader title={`Welcome, ${driverName}!`} onLogout={handleLogout} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Orders</CardTitle>
              <Package2Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter((order) => order.status === OrderStatus.Assigned || order.status === OrderStatus.PickedUp).length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Orders currently assigned to you</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Deliveries</CardTitle>
              <CheckCircleIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter((order) => order.status === OrderStatus.Delivered).length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Orders you have successfully delivered</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Rating</CardTitle>
              <StarIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {/* This would ideally come from driver session data */}
                {/* For now, a placeholder or calculated from orders if driver object had rating */}
                {orders.length > 0 && orders[0].driverRating ? orders[0].driverRating : 'N/A'}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Average rating from customers</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Deliveries</h2>
        </div>
        <div className="grid gap-4">
          {orders.length === 0 ? (
            <p>No orders assigned to you yet.</p>
          ) : (
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Order #{order.id.substring(0, 8)}</CardTitle>
                  <StatusAlert status={order.status} />
                </CardHeader>
                <CardContent className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pickup:</p>
                    <p className="text-sm font-medium">{order.pickupLocation}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Delivery:</p>
                    <p className="text-sm font-medium">{order.deliveryLocation}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Item:</p>
                    <p className="text-sm font-medium">{order.itemDescription}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    {order.status === OrderStatus.Assigned && (
                      <Button size="sm" onClick={() => handleUpdateStatus(order.id, OrderStatus.Assigned)} disabled={loading}>
                        {loading ? 'Updating...' : 'Mark as Picked Up'}
                      </Button>
                    )}
                    {order.status === OrderStatus.PickedUp && (
                      <Button size="sm" onClick={() => handleUpdateStatus(order.id, OrderStatus.PickedUp)} disabled={loading}>
                        {loading ? 'Updating...' : 'Mark as Delivered'}
                      </Button>
                    )}
                    {order.status === OrderStatus.Delivered && (
                      <Button size="sm" variant="outline" disabled>
                        Delivered
                      </Button>
                    )}
                    {order.status === OrderStatus.Cancelled && (
                      <Button size="sm" variant="outline" disabled>
                        Cancelled
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

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
