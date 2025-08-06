'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusAlert } from '@/components/ui/status-alert'
import { getCustomerSession, getCustomerOrders, Order, OrderStatus } from '@/lib/app-data'
import { toast } from 'sonner'

export default function CustomerDashboardPage() {
  const [customerName, setCustomerName] = useState('Customer')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserType = localStorage.getItem('currentUserType');

    if (!currentUserId || currentUserType !== 'customer') {
      router.push('/login');
      return;
    }

    const fetchCustomerData = async () => {
      setLoading(true);
      const customer = await getCustomerSession(currentUserId);
      if (customer) {
        setCustomerName(customer.name);
        const customerOrders = await getCustomerOrders(currentUserId);
        setOrders(customerOrders);
      } else {
        toast.error('Failed to load customer data. Please log in again.');
        router.push('/login');
      }
      setLoading(false);
    };

    fetchCustomerData();
  }, [router]);

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
      <DashboardHeader title={`Welcome, ${customerName}!`} onLogout={handleLogout} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package2Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Your total transport requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <ClockIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter((order) => order.status === OrderStatus.Pending || order.status === OrderStatus.Assigned).length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Orders awaiting pickup or delivery</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <CheckCircleIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {orders.filter((order) => order.status === OrderStatus.Delivered).length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Orders successfully delivered</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Orders</h2>
          <Link href="/customer/book-transport">
            <Button>Book New Transport</Button>
          </Link>
        </div>
        <div className="grid gap-4">
          {orders.length === 0 ? (
            <p>You have no orders yet. Book a new transport to get started!</p>
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
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Price:</p>
                    <p className="text-sm font-medium">${order.price.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    {order.status !== OrderStatus.Cancelled && order.status !== OrderStatus.Delivered && (
                      <Link href={`/customer/track-order/${order.id}`}>
                        <Button variant="outline" size="sm">
                          Track Order
                        </Button>
                      </Link>
                    )}
                    {order.status === OrderStatus.Delivered && (
                      <Link href={`/customer/rate-driver/${order.id}`}>
                        <Button variant="outline" size="sm">
                          Rate Driver
                        </Button>
                      </Link>
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
