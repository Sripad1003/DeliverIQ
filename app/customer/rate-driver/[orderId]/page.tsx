import { PageHeaderWithBack } from "@/components/layout/page-header-with-back"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { getOrderDetails, submitDriverRating } from "@/lib/app-data"

export default async function RateDriverPage({
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

  return (
    <>
      <PageHeaderWithBack
        title="Rate Your Driver"
        description={`Provide feedback for your recent trip (Order #${order.id}).`}
        backHref={`/customer/track-order/${order.id}`}
      />
      <Card>
        <CardHeader>
          <CardTitle>How was your experience with {order.driverName}?</CardTitle>
          <CardDescription>Your feedback helps us improve our service.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" action={submitDriverRating}>
            <input type="hidden" name="orderId" value={order.id} />
            <div className="grid gap-2">
              <Label className="text-base">Rating</Label>
              <RadioGroup defaultValue="5" className="flex items-center gap-4" name="rating">
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="rating-1" value="1" />
                  <Label htmlFor="rating-1">1 Star</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="rating-2" value="2" />
                  <Label htmlFor="rating-2">2 Stars</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="rating-3" value="3" />
                  <Label htmlFor="rating-3">3 Stars</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="rating-4" value="4" />
                  <Label htmlFor="rating-4">4 Stars</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="rating-5" value="5" />
                  <Label htmlFor="rating-5">5 Stars</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comments">Comments (Optional)</Label>
              <Textarea id="comments" name="comments" placeholder="Share your thoughts on the trip..." rows={4} />
            </div>
            <Button type="submit">Submit Rating</Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
