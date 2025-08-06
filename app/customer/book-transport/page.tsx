'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { StatusAlert } from "@/components/ui/status-alert"
import { createOrder } from "@/actions/order-actions"
import { getCustomerSession } from "@/lib/app-data"
import { toast } from "sonner"

export default function BookTransportPage() {
  const [pickupLocation, setPickupLocation] = useState("")
  const [deliveryLocation, setDeliveryLocation] = useState("")
  const [itemDescription, setItemDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const customer = await getCustomerSession()
    if (!customer) {
      setError("You must be logged in to book transport.")
      setLoading(false)
      toast.error("Please log in to book transport.")
      router.push("/login")
      return
    }

    try {
      const result = await createOrder({
        customerId: customer._id!,
        pickupLocation,
        deliveryLocation,
        itemDescription,
        status: "Pending",
        orderDate: new Date().toISOString(),
      })

      if (result.success) {
        toast.success("Transport booked successfully!")
        router.push(`/customer/track-order/${result.orderId}`)
      } else {
        setError(result.message)
        toast.error(result.message)
      }
    } catch (err) {
      console.error("Booking error:", err)
      setError("An unexpected error occurred. Please try again.")
      toast.error("An unexpected error occurred during booking.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <PageHeaderWithBack title="Book Transport" backHref="/customer/dashboard" />
      <main className="flex-1 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>New Transport Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBooking} className="space-y-4">
              {error && <StatusAlert type="error" message={error} />}
              <div>
                <Label htmlFor="pickup-location">Pickup Location</Label>
                <Input
                  id="pickup-location"
                  type="text"
                  placeholder="Enter pickup location"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="delivery-location">Delivery Location</Label>
                <Input
                  id="delivery-location"
                  type="text"
                  placeholder="Enter delivery location"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="item-description">Item Description</Label>
                <Textarea
                  id="item-description"
                  placeholder="Describe the item(s) to be transported"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Booking..." : "Book Now"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
