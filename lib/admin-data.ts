"use server"

import { redirect } from "next/navigation"
import { DELIVERIQ_ADMIN_SECURITY_KEY } from "./security"
import { OrderStatus } from "./app-data"

// In-memory data store for demonstration purposes
interface Admin {
  id: string
  name: string
  email: string
  role: string
}

interface Order {
  id: string
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

interface Driver {
  id: string
  name: string
  completedOrders: number
  totalRevenue: number
}

let adminSecurityKey = DELIVERIQ_ADMIN_SECURITY_KEY

const admins: Admin[] = [
  { id: "admin1", name: "Alice Smith", email: "alice@deliveriq.com", role: "Super Admin" },
  { id: "admin2", name: "Bob Johnson", email: "bob@deliveriq.com", role: "Operations" },
]

const orders: Order[] = [
  {
    id: "ORD001",
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
    driverRating: undefined,
  },
  {
    id: "ORD003",
    customerName: "Peter Jones",
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
    customerName: "Alice Brown",
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
    customerName: "Chris Green",
    pickupLocation: "666 Poplar Rd, Anytown",
    dropoffLocation: "777 Spruce Ct, Anytown",
    itemDescription: "Artwork",
    weight: 5,
    deliveryDate: "2025-08-13",
    price: 90.0,
    status: OrderStatus.Cancelled,
  },
]

const drivers: Driver[] = [
  { id: "driver1", name: "Mike Ross", completedOrders: 120, totalRevenue: 6000 },
  { id: "driver2", name: "Harvey Specter", completedOrders: 90, totalRevenue: 4500 },
  { id: "driver3", name: "Louis Litt", completedOrders: 70, totalRevenue: 3500 },
]

export async function loginAdmin(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string
  const securityKey = formData.get("security-key") as string

  // Basic validation (replace with actual authentication logic)
  if (username === "admin" && password === "admin" && securityKey === adminSecurityKey) {
    redirect("/admin/dashboard")
  } else {
    // In a real app, you'd show an error message
    console.error("Invalid admin credentials or security key")
  }
}

export async function getAdminDashboardData() {
  const totalOrders = orders.length
  const pendingOrders = orders.filter((order) => order.status === OrderStatus.Pending).length
  const completedOrders = orders.filter((order) => order.status === OrderStatus.Completed).length
  const totalRevenue = orders.reduce((sum, order) => sum + order.price, 0)

  const recentOrders = orders
    .sort((a, b) => b.id.localeCompare(a.id)) // Simple sort for "recent"
    .slice(0, 5)

  const ordersByDay = [
    { date: "2025-08-01", orders: 5 },
    { date: "2025-08-02", orders: 7 },
    { date: "2025-08-03", orders: 10 },
    { date: "2025-08-04", orders: 8 },
    { date: "2025-08-05", orders: 12 },
    { date: "2025-08-06", orders: 9 },
    { date: "2025-08-07", orders: 11 },
  ]

  return {
    adminName: "Admin User", // Placeholder
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue,
    recentOrders,
    topDrivers: drivers.sort((a, b) => b.completedOrders - a.completedOrders).slice(0, 3),
    admins,
    ordersByDay,
  }
}

export async function updateAdminSecurityKey(formData: FormData) {
  const newKey = formData.get("newKey") as string
  if (newKey) {
    adminSecurityKey = newKey
    console.log(`Admin security key updated to: ${adminSecurityKey}`)
  }
  redirect("/admin/setup") // Redirect back to setup page
}

export async function logoutAdmin() {
  // In a real application, this would clear session cookies or tokens
  console.log("Admin logged out")
  redirect("/admin/login")
}
