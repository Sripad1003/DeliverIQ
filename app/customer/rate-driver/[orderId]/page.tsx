'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeaderWithBack } from '@/components/layout/page-header-with-back'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { getOrderDetails, updateDriverRating } from '@/lib/app-data'
import { toast } from 'sonner'

export default function RateDriverPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [order, setOrder] = useState<any>(null)
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

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!order || !order.driverId) {
      toast.error('Cannot rate: Driver not assigned or order not found.');
      return;
    }
    if (rating === 0) {
      toast.error('Please select a rating.');
      return;
    }
    setLoading(true);
    const result = await updateDriverRating(order.driverId, rating);
    if (result) {
      toast.success('Driver rated successfully!');
      router.push('/customer/dashboard');
    } else {
      toast.error('Failed to submit rating.');
    }
    setLoading(false);
  }

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
      <PageHeaderWithBack title="Rate Your Driver" backHref={`/customer/track-order/${orderId}`} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Order #{order.id.substring(0, 8)}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Driver:</p>
              <p className="text-sm font-medium">{order.driverName || 'N/A'}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Pickup:</p>
              <p className="text-sm font-medium">{order.pickupLocation}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Delivery:</p>
              <p className="text-sm font-medium">{order.deliveryLocation}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`h-8 w-8 cursor-pointer ${
                        star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'
                      }`}
                      onClick={() => handleRatingChange(star)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Comment (Optional)</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience with the driver"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Rating'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
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
