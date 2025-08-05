import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getDriverDashboardData, updateOrderStatus } from "@/lib/app-data"
import { OrderStatus } from "@/lib/app-data"
import { CheckCircleIcon, ClockIcon, Package2Icon } from "lucide-react"

export default async function DriverDashboardPage() {
  const { driverName, totalOrders, pendingOrders, completedOrders, assignedOrders } = await getDriverDashboardData()

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader
        userType="driver"
        userName={driverName}
        navItems={[{ href: "/driver/dashboard", label: "Dashboard" }]}
      />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package2Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">{/* +20.1% from last month */}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">{/* +15% from last month */}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <CheckCircleIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders}</div>
              <p className="text-xs text-muted-foreground">{/* -5% from last month */}</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Assigned Orders</CardTitle>
              <CardDescription>Your currently assigned transportation orders.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Drop-off</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.pickupLocation}</TableCell>
                    <TableCell>{order.dropoffLocation}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell className="text-right">
                      {order.status === OrderStatus.Assigned && (
                        <form action={updateOrderStatus}>
                          <input type="hidden" name="orderId" value={order.id} />
                          <input type="hidden" name="newStatus" value={OrderStatus.InProgress} />
                          <Button size="sm" variant="outline" type="submit">
                            Start Trip
                          </Button>
                        </form>
                      )}
                      {order.status === OrderStatus.InProgress && (
                        <form action={updateOrderStatus}>
                          <input type="hidden" name="orderId" value={order.id} />
                          <input type="hidden" name="newStatus" value={OrderStatus.Completed} />
                          <Button size="sm" type="submit">
                            Complete Trip
                          </Button>
                        </form>
                      )}
                      {order.status === OrderStatus.Completed && (
                        <Button size="sm" disabled>
                          Completed
                        </Button>
                      )}
                      {order.status === OrderStatus.Cancelled && (
                        <Button size="sm" disabled variant="destructive">
                          Cancelled
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
