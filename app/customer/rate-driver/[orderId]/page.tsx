"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getOrderById, updateOrder, updateDriverRating, getCustomerSession, type Order } from "@/lib/app-data"

export default function RateDriverPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<Order | null>(null)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [message, setMessage] = useState({ type: "", text: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getCustomerSession()
    if (!session) {
      router.push("/login")
      return
    }

    const fetchedOrder = getOrderById(orderId)
    if (fetchedOrder && fetchedOrder.customerId === session.id && fetchedOrder.status === "completed") {
      setOrder(fetchedOrder)
      if (fetchedOrder.rating) {
        setRating(fetchedOrder.rating)
      }
    } else {
      setMessage({ type: "error", text: "Order not found, not completed, or you do not have permission to rate it." })
    }
    setLoading(false)
  }, [orderId, router])

  const handleRatingSubmit = () => {
    setMessage({ type: "", text: "" })
    if (!order || !order.driverId) {
      setMessage({ type: "error", text: "Cannot rate this order. Driver information is missing." })
      return
    }
    if (rating === 0) {
      setMessage({ type: "error", text: "Please select a star rating." })
      return
    }

    try {
      // Update order with rating
      const updatedOrder = { ...order, rating: rating }
      updateOrder(updatedOrder)

      // Update driver's average rating
      updateDriverRating(order.driverId, rating)

      setMessage({ type: "success", text: "Thank you for your feedback! Rating submitted successfully." })
      setTimeout(() => router.push("/customer/dashboard"), 2000)
    } catch (error) {
      console.error("Failed to submit rating:", error)
      setMessage({ type: "error", text: "Failed to submit rating. Please try again." })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading rating page...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        {message.text && (
          <Alert className={`mb-4 ${message.type === "error" ? "border-red-200 bg-red-50" : ""}`}>
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{message.text}</AlertDescription>
          </Alert>
        )}
        <p className="text-gray-600 text-lg mb-4">Could not load order for rating.</p>
        <Link href="/customer/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/customer/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Star className="h-8 w-8 text-yellow-500" />
            Rate Your Trip
          </h1>
          <p className="text-gray-600">Order ID: {order.id}</p>
        </div>

        {message.text && (
          <Alert
            className={`mb-6 ${message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
          >
            {message.type === "error" ? (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-center">How was your experience?</CardTitle>
            <CardDescription className="text-center">
              Please rate your driver for the delivery from {order.pickupLocation} to {order.deliveryLocation}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-10 w-10 cursor-pointer transition-colors ${
                    (hoverRating || rating) >= star ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Additional Comments (Optional)</Label>
              <Textarea
                id="comment"
                placeholder="Share your feedback..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
            <Button onClick={handleRatingSubmit} className="w-full">
              Submit Rating
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
