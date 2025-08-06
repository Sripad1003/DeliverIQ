'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeaderWithBack } from '@/components/layout/page-header-with-back'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusAlert } from '@/components/ui/status-alert'
import { getOrderDetails, updateOrderStatus, cancelOrder, Order, OrderStatus } from '@/lib/app-data'
import { toast } from 'sonner'

export default function TrackOrderPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserType = localStorage.getItem('currentUserType');

    if (!currentUserId || currentUserType !== 'customer') {
      router.push('/login');
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      const fetchedOrder = await getOrderDetails(orderId);
      if (fetchedOrder && fetchedOrder.customerId === currentUserId) {
        setOrder(fetchedOrder);
      } else {
        toast.error('Order not found or you do not have permission to view it.');
        router.push('/customer/dashboard');
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId, router]);

  const handleCancelOrder = async () => {
    if (!order) return;
    setLoading(true);
    const result = await cancelOrder(order.id);
    if (result) {
      toast.success('Order cancelled successfully.');
      // Update local state to reflect cancellation
      setOrder((prevOrder) => prevOrder ? { ...prevOrder, status: OrderStatus.Cancelled } : null);
    } else {
      toast.error('Failed to cancel order.');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return null; // Should redirect by now
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <PageHeaderWithBack title="Track Order" backHref="/customer/dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Order #{order.id.substring(0, 8)}</CardTitle>
            <StatusAlert status={order.status} />
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <p className="text-sm font-medium">Pickup Location: {order.pickupLocation}</p>
              <p className="text-sm font-medium">Delivery Location: {order.deliveryLocation}</p>
              <p className="text-sm font-medium">Item: {order.itemDescription}</p>
              <p className="text-sm font-medium">Price: ${order.price.toFixed(2)}</p>
            </div>
            <div className="grid gap-2">
              <h3 className="font-semibold">Driver Information</h3>
              {order.driverId ? (
                <>
                  <p className="text-sm font-medium">Name: {order.driverName}</p>
                  <p className="text-sm font-medium">Phone: {order.driverPhone}</p>
                  <p className="text-sm font-medium">Vehicle: {order.driverVehicle}</p>
                  <p className="text-sm font-medium">Rating: {order.driverRating}</p>
                </>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Driver not yet assigned.</p>
              )}
            </div>
            <div className="grid gap-2">
              <h3 className="font-semibold">Timeline</h3>
              <p className="text-sm font-medium">Ordered: {new Date(order.createdAt).toLocaleString()}</p>
              {order.pickupTime && (
                <p className="text-sm font-medium">Picked Up: {new Date(order.pickupTime).toLocaleString()}</p>
              )}
              {order.deliveryTime && (
                <p className="text-sm font-medium">Delivered: {new Date(order.deliveryTime).toLocaleString()}</p>
              )}
            </div>
            {order.status !== OrderStatus.Cancelled && order.status !== OrderStatus.Delivered && (
              <Button variant="destructive" onClick={handleCancelOrder} disabled={loading}>
                {loading ? 'Cancelling...' : 'Cancel Order'}
              </Button>
            )}
            {order.status === OrderStatus.Delivered && (
              <Button onClick={() => router.push(`/customer/rate-driver/${order.id}`)}>Rate Driver</Button>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
