'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { StatusAlert } from "@/components/ui/status-alert"
import { getOrderById, updateOrder } from "@/actions/order-actions"
import { OrderType } from "@/lib/app-data-types"
import { updateDriverRating } from "@/actions/user-actions"
import { toast } from "sonner"

export default function RateDriverPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params
  const [order, setOrder] = useState<OrderType | null>(null)
  const [rating, setRating] = useState<string>("")
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const fetchedOrder = await getOrderById(orderId)
        if (fetchedOrder) {
          setOrder(fetchedOrder)
          if (fetchedOrder.driverRating) {
            setRating(fetchedOrder.driverRating.toString())
          }
          if (fetchedOrder.driverFeedback) {
            setFeedback(fetchedOrder.driverFeedback)
          }
        } else {
          setError("Order not found.")
          toast.error("Order not found.")
        }
      } catch (err) {
        console.error("Failed to fetch order:", err)
        setError("Failed to load order details. Please try again.")
        toast.error("Failed to load order details.")
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (!order) {
      setError("Order data is missing.")
      setIsSubmitting(false)
      return
    }
    if (!rating) {
      setError("Please select a rating.")
      setIsSubmitting(false)
      return
    }

    try {
      // Update order with rating and feedback
      const updatedOrderResult = await updateOrder({
        ...order,
        driverRating: parseInt(rating),
        driverFeedback: feedback,
      })

      if (!updatedOrderResult.success) {
        setError(updatedOrderResult.message)
        toast.error(updatedOrderResult.message)
        setIsSubmitting(false)
        return
      }

      // Update driver's average rating
      if (order.driverId) {
        const updateDriverResult = await updateDriverRating(order.driverId, parseInt(rating))
        if (!updateDriverResult.success) {
          // Log this error but don't block the user, as order update was successful
          console.warn("Failed to update driver's average rating:", updateDriverResult.message)
          toast.warning("Order rated, but failed to update driver's average rating.")
        } else {
          toast.success("Driver rating submitted successfully!")
        }
      } else {
        toast.success("Order rated successfully! No driver assigned to update rating.")
      }

      router.push("/customer/dashboard")
    } catch (err) {
      console.error("Rating submission error:", err)
      setError("An unexpected error occurred. Please try again.")
      toast.error("An unexpected error occurred during rating submission.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <PageHeaderWithBack title="Rate Driver" backHref="/customer/dashboard" />
        <main className="flex-1 p-6 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Loading Order...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (error && !order) { // Only show error if order failed to load
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 text-red-500">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <PageHeaderWithBack title="Rate Driver" backHref="/customer/dashboard" />
      <main className="flex-1 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Rate Your Delivery Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Order from {order?.pickupLocation} to {order?.deliveryLocation}
            </p>
            <form onSubmit={handleSubmitRating} className="space-y-4">
              {error && <StatusAlert type="error" message={error} />}
              <div>
                <Label htmlFor="rating">Rating (1-5 Stars)</Label>
                <Select value={rating} onValueChange={setRating} disabled={isSubmitting || !!order?.driverRating}>
                  <SelectTrigger id="rating">
                    <SelectValue placeholder="Select a rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Stars - Excellent</SelectItem>
                    <SelectItem value="4">4 Stars - Very Good</SelectItem>
                    <SelectItem value="3">3 Stars - Good</SelectItem>
                    <SelectItem value="2">2 Stars - Fair</SelectItem>
                    <SelectItem value="1">1 Star - Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="feedback">Feedback (Optional)</Label>
                <Textarea
                  id="feedback"
                  placeholder="Share your experience..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  disabled={isSubmitting || !!order?.driverFeedback}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting || !!order?.driverRating}>
                {isSubmitting ? "Submitting..." : order?.driverRating ? "Rating Submitted" : "Submit Rating"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
