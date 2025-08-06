'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeaderWithBack } from '@/components/layout/page-header-with-back'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { createNewOrder, getCustomerSession, PaymentMethod, DeliveryType } from '@/lib/app-data'
import { toast } from 'sonner'

export default function BookTransportPage() {
  const [pickupLocation, setPickupLocation] = useState('')
  const [deliveryLocation, setDeliveryLocation] = useState('')
  const [itemDescription, setItemDescription] = useState('')
  const [weight, setWeight] = useState('')
  const [dimensions, setDimensions] = useState('')
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(DeliveryType.Standard)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CreditCard)
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUserId = localStorage.getItem('currentUserId');
    const currentUserType = localStorage.getItem('currentUserType');

    if (!currentUserId || currentUserType !== 'customer') {
      router.push('/login');
      return;
    }
    setCustomerId(currentUserId);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId) {
      toast.error('Customer not logged in.');
      return;
    }
    setLoading(true)

    const orderData = {
      customerId: customerId,
      pickupLocation,
      deliveryLocation,
      itemDescription,
      weight: parseFloat(weight),
      dimensions,
      deliveryType,
      paymentMethod,
      price: parseFloat(price),
    }

    const result = await createNewOrder(orderData)
    if (result.success) {
      toast.success('Order placed successfully!')
      router.push('/customer/dashboard')
    } else {
      toast.error(result.message || 'Failed to place order.')
    }
    setLoading(false)
  }

  if (!customerId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <PageHeaderWithBack title="Book New Transport" backHref="/customer/dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pickup-location">Pickup Location</Label>
                <Input
                  id="pickup-location"
                  placeholder="Enter pickup location"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-location">Delivery Location</Label>
                <Input
                  id="delivery-location"
                  placeholder="Enter delivery location"
                  required
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="item-description">Item Description</Label>
                <Textarea
                  id="item-description"
                  placeholder="Describe the item to be transported"
                  required
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g., 5.0"
                  step="0.1"
                  required
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions (LxWxH cm)</Label>
                <Input
                  id="dimensions"
                  placeholder="e.g., 30x20x10"
                  required
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-type">Delivery Type</Label>
                <Select value={deliveryType} onValueChange={(value: DeliveryType) => setDeliveryType(value)}>
                  <SelectTrigger id="delivery-type">
                    <SelectValue placeholder="Select delivery type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DeliveryType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}>
                  <SelectTrigger id="payment-method">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PaymentMethod).map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 25.00"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Placing Order...' : 'Place Order'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
