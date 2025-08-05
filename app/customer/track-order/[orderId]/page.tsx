import { PageHeaderWithBack } from "@/components/layout/page-header-with-back"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { StatusAlert } from "@/components/ui/status-alert"
import { getOrderDetails, OrderStatus } from "@/lib/app-data"
import { cancelOrder } from "@/lib/app-data"
import { MapPinIcon, TruckIcon, UserIcon } from "lucide-react"
import Link from "next/link"

export default async function TrackOrderPage({
  params,
}: {
  params: { orderId: string }
}) {
  const order = await getOrderDetails(params.orderId)

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h1 className="text-2xl font-bold">Order Not Found</h1>
        <p className="text-muted-foreground">The order you are looking for does not exist.</p>
      </div>
    )
  }

  const isCancellable = order.status === OrderStatus.Pending || order.status === OrderStatus.Assigned

  return (
    <>
      <PageHeaderWithBack
        title={`Track Order #${order.id}`}
        description="View the real-time status and details of your transportation order."
        backHref="/customer/dashboard"
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Information about your current order.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status:</span>
              <StatusAlert status={order.status} />
            </div>
            <Separator />
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Pickup:</span>
                <span>{order.pickupLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Drop-off:</span>
                <span>{order.dropoffLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <TruckIcon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Item:</span>
                <span>{order.itemDescription}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium ml-7">Weight:</span>
                <span>{order.weight} kg</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium ml-7">Delivery Date:</span>
                <span>{order.deliveryDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium ml-7">Price:</span>
                <span>${order.price.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Driver Information</CardTitle>
            <CardDescription>Details about the assigned driver.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {order.driverId ? (
              <>
                <div className="flex items-center gap-4">
                  <img
                    alt={order.driverName || "Driver"}
                    className="rounded-full"
                    height="64"
                    src="/placeholder-user.jpg"
                    style={{
                      aspectRatio: "64/64",
                      objectFit: "cover",
                    }}
                    width="64"
                  />
                  <div className="grid gap-1">
                    <div className="text-lg font-bold">{order.driverName}</div>
                    <div className="text-muted-foreground">
                      Vehicle: {order.vehicleType} ({order.vehiclePlate})
                    </div>
                    <div className="text-muted-foreground">Contact: {order.driverPhone}</div>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Driver Rating:</span>
                    <span>{order.driverRating ? `${order.driverRating} / 5 Stars` : "N/A"}</span>
                  </div>
                </div>
                {order.status === OrderStatus.Completed && !order.driverRating && (
                  <Button asChild>
                    <Link href={`/customer/rate-driver/${order.id}`}>Rate Driver</Link>
                  </Button>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">No driver assigned yet. Please check back later.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Manage your order.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          {isCancellable && (
            <form action={cancelOrder}>
              <input type="hidden" name="orderId" value={order.id} />
              <Button variant="destructive" type="submit">
                Cancel Order
              </Button>
            </form>
          )}
          {order.status === OrderStatus.Cancelled && (
            <Button asChild>
              <Link href="/customer/book-transport">Re-book Transport</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </>
  )
}
