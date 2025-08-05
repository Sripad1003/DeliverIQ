"use server"

import { redirect } from "next/navigation"

// In-memory data store for demonstration purposes
interface Customer {
  id: string
  name: string
  email: string
}

export enum OrderStatus {
  Pending = "Pending",
  Assigned = "Assigned",
  InProgress = "In Progress",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

interface Order {
  id: string
  customerId: string
  customerName: string
  pickupLocation: string
  dropoffLocation: string
  itemDescription: string
  weight: number
  deliveryDate: string
  price: number
  status: OrderStatus
  driverId?: string
  driverName?: string
  vehicleType?: string
  vehiclePlate?: string
  driverPhone?: string
  driverRating?: number
}

const customers: Customer[] = [
  { id: "cust1", name: "John Doe", email: "john@example.com" },
  { id: "cust2", name: "Jane Smith", email: "jane@example.com" },
]

const orders: Order[] = [
  {
    id: "ORD001",
    customerId: "cust1",
    customerName: "John Doe",
    pickupLocation: "123 Main St, Anytown",
    dropoffLocation: "456 Oak Ave, Anytown",
    itemDescription: "Large parcel",
    weight: 15,
    deliveryDate: "2025-08-10",
    price: 50.0,
    status: OrderStatus.Completed,
    driverId: "driver1",
    driverName: "Mike Ross",
    vehicleType: "Van",
    vehiclePlate: "ABC 123",
    driverPhone: "555-111-2222",
    driverRating: 5,
  },
  {
    id: "ORD002",
    customerId: "cust2",
    customerName: "Jane Smith",
    pickupLocation: "789 Pine Ln, Anytown",
    dropoffLocation: "101 Elm Rd, Anytown",
    itemDescription: "Documents",
    weight: 2,
    deliveryDate: "2025-08-12",
    price: 25.0,
    status: OrderStatus.InProgress,
    driverId: "driver2",
    driverName: "Harvey Specter",
    vehicleType: "Car",
    vehiclePlate: "DEF 456",
    driverPhone: "555-333-4444",
  },
  {
    id: "ORD003",
    customerId: "cust1",
    customerName: "John Doe",
    pickupLocation: "222 Maple Dr, Anytown",
    dropoffLocation: "333 Birch Ct, Anytown",
    itemDescription: "Furniture",
    weight: 100,
    deliveryDate: "2025-08-15",
    price: 150.0,
    status: OrderStatus.Pending,
  },
  {
    id: "ORD004",
    customerId: "cust1",
    customerName: "John Doe",
    pickupLocation: "444 Cedar St, Anytown",
    dropoffLocation: "555 Willow Ave, Anytown",
    itemDescription: "Electronics",
    weight: 8,
    deliveryDate: "2025-08-11",
    price: 75.0,
    status: OrderStatus.Assigned,
    driverId: "driver1",
    driverName: "Mike Ross",
    vehicleType: "Van",
    vehiclePlate: "ABC 123",
    driverPhone: "555-111-2222",
  },
  {
    id: "ORD005",
    customerId: "cust2",
    customerName: "Jane Smith",
    pickupLocation: "666 Poplar Rd, Anytown",
    dropoffLocation: "777 Spruce Ct, Anytown",
    itemDescription: "Artwork",
    weight: 5,
    deliveryDate: "2025-08-13",
    price: 90.0,
    status: OrderStatus.Cancelled,
  },
]

// --- User (Customer) Actions ---

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string // In a real app, hash this!

  if (customers.some((c) => c.email === email)) {
    console.error("User with this email already exists.")
    return // Or handle error more gracefully
  }

  const newCustomer: Customer = {
    id: `cust${customers.length + 1}`,
    name,
    email,
  }
  customers.push(newCustomer)
  console.log("Registered new user:", newCustomer)
  redirect("/login")
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string // In a real app, compare hashed passwords

  const user = customers.find((c) => c.email === email)

  if (user) {
    // Simulate successful login
    console.log("User logged in:", user)
    redirect("/customer/dashboard")
  } else {
    console.error("Invalid credentials")
    // In a real app, you'd show an error message
  }
}

export async function logoutUser() {
  // In a real application, this would clear session cookies or tokens
  console.log("User logged out")
  redirect("/login")
}

export async function getCustomerDashboardData() {
  // Simulate fetching data for a logged-in customer (e.g., 'cust1')
  const currentCustomerId = "cust1" // This would come from session in a real app
  const customer = customers.find((c) => c.id === currentCustomerId)
  const customerOrders = orders.filter((order) => order.customerId === currentCustomerId)

  const totalOrders = customerOrders.length
  const pendingOrders = customerOrders.filter(
    (order) =>
      order.status === OrderStatus.Pending ||
      order.status === OrderStatus.Assigned ||
      order.status === OrderStatus.InProgress,
  ).length
  const completedOrders = customerOrders.filter((order) => order.status === OrderStatus.Completed).length

  const recentOrders = customerOrders
    .sort((a, b) => b.id.localeCompare(a.id)) // Simple sort for "recent"
    .slice(0, 5)

  return {
    customerName: customer?.name || "Customer",
    totalOrders,
    pendingOrders,
    completedOrders,
    recentOrders,
  }
}

export async function bookTransport(formData: FormData) {
  const pickupLocation = formData.get("pickupLocation") as string
  const dropoffLocation = formData.get("dropoffLocation") as string
  const itemDescription = formData.get("itemDescription") as string
  const weight = Number.parseFloat(formData.get("weight") as string)
  const deliveryDate = formData.get("deliveryDate") as string

  // Simulate price calculation
  const price = weight * 3 + 20 // Example calculation

  const newOrder: Order = {
    id: `ORD${(orders.length + 1).toString().padStart(3, "0")}`,
    customerId: "cust1", // Assume logged in customer
    customerName: "John Doe", // Assume logged in customer name
    pickupLocation,
    dropoffLocation,
    itemDescription,
    weight,
    deliveryDate,
    price,
    status: OrderStatus.Pending,
  }
  orders.push(newOrder)
  console.log("New order booked:", newOrder)
  redirect(`/customer/track-order/${newOrder.id}`)
}

export async function getOrderDetails(orderId: string) {
  return orders.find((order) => order.id === orderId)
}

export async function cancelOrder(formData: FormData) {
  const orderId = formData.get("orderId") as string
  const orderIndex = orders.findIndex((order) => order.id === orderId)

  if (orderIndex !== -1) {
    if (orders[orderIndex].status === OrderStatus.Pending || orders[orderIndex].status === OrderStatus.Assigned) {
      orders[orderIndex].status = OrderStatus.Cancelled
      console.log(`Order ${orderId} cancelled.`)
    } else {
      console.warn(`Order ${orderId} cannot be cancelled in its current status.`)
    }
  } else {
    console.error(`Order ${orderId} not found.`)
  }
  redirect(`/customer/track-order/${orderId}`)
}

export async function submitDriverRating(formData: FormData) {
  const orderId = formData.get("orderId") as string
  const rating = Number.parseInt(formData.get("rating") as string)
  const comments = formData.get("comments") as string

  const orderIndex = orders.findIndex((order) => order.id === orderId)

  if (orderIndex !== -1) {
    orders[orderIndex].driverRating = rating
    console.log(`Rating submitted for order ${orderId}: ${rating} stars. Comments: ${comments}`)
  } else {
    console.error(`Order ${orderId} not found for rating.`)
  }
  redirect(`/customer/track-order/${orderId}`)
}

// --- Driver Actions ---

export async function getDriverDashboardData() {
  // Simulate fetching data for a logged-in driver (e.g., 'driver1')
  const currentDriverId = "driver1" // This would come from session in a real app

  const driverOrders = orders.filter((order) => order.driverId === currentDriverId)

  const totalOrders = driverOrders.length
  const pendingOrders = driverOrders.filter((order) => order.status === OrderStatus.Assigned).length
  const completedOrders = driverOrders.filter((order) => order.status === OrderStatus.Completed).length

  const assignedOrders = driverOrders.filter(
    (order) => order.status === OrderStatus.Assigned || order.status === OrderStatus.InProgress,
  )

  return {
    driverName: "Mike Ross", // Placeholder
    totalOrders,
    pendingOrders,
    completedOrders,
    assignedOrders,
  }
}

export async function updateOrderStatus(formData: FormData) {
  const orderId = formData.get("orderId") as string
  const newStatus = formData.get("newStatus") as OrderStatus

  const orderIndex = orders.findIndex((order) => order.id === orderId)

  if (orderIndex !== -1) {
    orders[orderIndex].status = newStatus
    console.log(`Order ${orderId} status updated to: ${newStatus}`)
  } else {
    console.error(`Order ${orderId} not found for status update.`)
  }
  redirect("/driver/dashboard")
}
