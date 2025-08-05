"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, MinusCircle, Package, MapPin, Truck, DollarSign, CreditCard } from "lucide-react"
import { StatusAlert } from "@/components/ui/status-alert" // Import StatusAlert
import { PageHeaderWithBack } from "@/components/layout/page-header-with-back" // Import PageHeaderWithBack
import { getCustomerSession, createOrder, type Item, type Order } from "@/lib/app-data"
import { suggestVehicles, calculateDistance, type VehicleType } from "@/lib/vehicle-logic"

export default function BookTransportPage() {
  const router = useRouter()
  const [customerSession, setCustomerSession] = useState(null)
  const [pickupLocation, setPickupLocation] = useState("")
  const [deliveryLocation, setDeliveryLocation] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [pickupTime, setPickupTime] = useState("")
  const [items, setItems] = useState<Item[]>([{ name: "", quantity: 1, weight: 0, length: 0, width: 0, height: 0 }])
  const [suggestions, setSuggestions] = useState<{ type: VehicleType; estimatedPrice: number; description: string }[]>(
    [],
  )
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null)
  const [estimatedDistance, setEstimatedDistance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [bookingConfirmed, setBookingConfirmed] = useState(false) // New state for booking confirmation

  useEffect(() => {
    const session = getCustomerSession()
    if (!session) {
      router.push("/login") // Redirect to login if not authenticated
    } else {
      setCustomerSession(session)
    }
  }, [router])

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1, weight: 0, length: 0, width: 0, height: 0 }])
  }

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleItemChange = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items]
    // Ensure numeric fields are parsed as numbers
    if (typeof value === "string" && ["quantity", "weight", "length", "width", "height"].includes(field)) {
      newItems[index][field] = Number.parseFloat(value as string) || 0
    } else {
      newItems[index][field] = value as any
    }
    setItems(newItems)
  }

  const handleGetSuggestions = () => {
    setMessage({ type: "", text: "" })
    if (
      !pickupLocation ||
      !deliveryLocation ||
      !pickupDate ||
      !pickupTime ||
      items.some(
        (item) =>
          !item.name ||
          item.quantity <= 0 ||
          item.weight <= 0 ||
          item.length <= 0 ||
          item.width <= 0 ||
          item.height <= 0,
      )
    ) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields for locations, date, time, and all item details.",
      })
      return
    }

    setIsLoading(true)
    const distance = calculateDistance(pickupLocation, deliveryLocation)
    setEstimatedDistance(distance)
    const suggested = suggestVehicles(items, distance)
    setSuggestions(suggested)
    setSelectedVehicle(suggested.length > 0 ? suggested[0].type : null) // Auto-select cheapest
    setIsLoading(false)
    if (suggested.length === 0) {
      setMessage({ type: "error", text: "No suitable vehicle found for your items. Please adjust item details." })
    } else {
      setMessage({ type: "success", text: "Vehicle suggestions loaded. Choose the best option!" })
    }
  }

  const handleConfirmBooking = () => {
    setMessage({ type: "", text: "" })
    if (!customerSession) {
      setMessage({ type: "error", text: "You must be logged in to book transport." })
      router.push("/login")
      return
    }
    if (!selectedVehicle || suggestions.length === 0) {
      setMessage({ type: "error", text: "Please get vehicle suggestions and select a vehicle type." })
      return
    }

    setIsLoading(true)
    try {
      const selectedSuggestion = suggestions.find((s) => s.type === selectedVehicle)
      if (!selectedSuggestion) {
        setMessage({ type: "error", text: "Selected vehicle type is invalid." })
        setIsLoading(false)
        return
      }

      const newOrder: Omit<Order, "id" | "createdAt" | "status" | "paymentStatus"> = {
        customerId: customerSession.id,
        items: items,
        pickupLocation,
        deliveryLocation,
        pickupDate,
        pickupTime,
        suggestedVehicleType: selectedVehicle,
        price: selectedSuggestion.estimatedPrice,
      }
      createOrder(newOrder)
      setMessage({
        type: "success",
        text: "Your booking has been placed successfully! Proceed to payment.",
      })
      setBookingConfirmed(true) // Set booking as confirmed
      setIsLoading(false)
      // No immediate redirect, allow user to proceed to payment
    } catch (error) {
      console.error("Failed to create order:", error)
      setMessage({ type: "error", text: "Failed to place booking. Please try again." })
      setIsLoading(false)
    }
  }

  const handleProceedToPayment = () => {
    // This is a placeholder for future payment integration
    setMessage({ type: "success", text: "Redirecting to payment gateway... (Not implemented yet)" })
    // In a real app, you'd redirect to a payment page or open a payment modal
    setTimeout(() => router.push("/customer/dashboard"), 3000) // Redirect to dashboard after a delay
  }

  if (!customerSession) {
    return null // Or a loading spinner/redirect message
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center p-4">
      <div className="w-full max-w-3xl">
        <PageHeaderWithBack
          title="Book New Transport"
          description="Tell us about your goods and where they need to go."
          backLink="/customer/dashboard"
          icon={Truck}
        />

        <StatusAlert message={message} />

        {!bookingConfirmed ? (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Route Details
                </CardTitle>
                <CardDescription>Where are your goods going?</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickupLocation">Pickup Location</Label>
                  <Input
                    id="pickupLocation"
                    placeholder="e.g., Mumbai, Bandra"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryLocation">Delivery Location</Label>
                  <Input
                    id="deliveryLocation"
                    placeholder="e.g., Pune, Koregaon Park"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupDate">Pickup Date</Label>
                  <Input
                    id="pickupDate"
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupTime">Pickup Time</Label>
                  <Input
                    id="pickupTime"
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Item Details
                </CardTitle>
                <CardDescription>List all items to be transported. Be accurate for best suggestions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative"
                  >
                    <h4 className="col-span-full font-semibold text-sm mb-2">Item {index + 1}</h4>
                    <div className="space-y-2">
                      <Label htmlFor={`itemName-${index}`}>Item Name</Label>
                      <Input
                        id={`itemName-${index}`}
                        placeholder="e.g., Refrigerator, Boxes"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, "name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`itemQuantity-${index}`}>Quantity</Label>
                      <Input
                        id={`itemQuantity-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`itemWeight-${index}`}>Weight (kg per item)</Label>
                      <Input
                        id={`itemWeight-${index}`}
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={item.weight}
                        onChange={(e) => handleItemChange(index, "weight", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`itemLength-${index}`}>Length (m per item)</Label>
                      <Input
                        id={`itemLength-${index}`}
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={item.length}
                        onChange={(e) => handleItemChange(index, "length", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`itemWidth-${index}`}>Width (m per item)</Label>
                      <Input
                        id={`itemWidth-${index}`}
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={item.width}
                        onChange={(e) => handleItemChange(index, "width", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`itemHeight-${index}`}>Height (m per item)</Label>
                      <Input
                        id={`itemHeight-${index}`}
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={item.height}
                        onChange={(e) => handleItemChange(index, "height", e.target.value)}
                        required
                      />
                    </div>
                    {items.length > 1 && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={handleAddItem} className="w-full bg-transparent">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Another Item
                </Button>
              </CardContent>
            </Card>

            <Button onClick={handleGetSuggestions} className="w-full mb-6" disabled={isLoading}>
              {isLoading ? "Getting Suggestions..." : "Get Vehicle Suggestions"}
            </Button>

            {suggestions.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    Suggested Vehicles ({estimatedDistance} km)
                  </CardTitle>
                  <CardDescription>Select the best vehicle type for your transport.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    value={selectedVehicle || ""}
                    onValueChange={(value: VehicleType) => setSelectedVehicle(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a suggested vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {suggestions.map((sug) => (
                        <SelectItem key={sug.type} value={sug.type}>
                          {sug.type.charAt(0).toUpperCase() + sug.type.slice(1)} - ₹{sug.estimatedPrice.toFixed(2)} (
                          {sug.description})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedVehicle && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md border border-blue-200">
                      <span className="font-semibold text-blue-800">
                        Selected: {selectedVehicle.charAt(0).toUpperCase() + selectedVehicle.slice(1)}
                      </span>
                      <span className="font-bold text-blue-800 flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {suggestions.find((s) => s.type === selectedVehicle)?.estimatedPrice.toFixed(2)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {suggestions.length > 0 && selectedVehicle && (
              <Button
                onClick={handleConfirmBooking}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Confirming Booking..." : "Confirm Booking"}
              </Button>
            )}
          </>
        ) : (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Payment Required
              </CardTitle>
              <CardDescription>Your booking is confirmed. Please proceed to payment.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold mb-4">
                Total Amount: ₹{suggestions.find((s) => s.type === selectedVehicle)?.estimatedPrice.toFixed(2)}
              </p>
              <Button onClick={handleProceedToPayment} className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Payment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
