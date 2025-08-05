import { hashPassword } from "./security"

// --- Interfaces ---

export interface Item {
  name: string
  quantity: number
  weight: number // in kg
  length: number // in meters
  width: number // in meters
  height: number // in meters
}

// Changed from type alias to const enum for runtime availability
export enum OrderStatus {
  pending = "pending",
  accepted = "accepted",
  inTransit = "in-transit",
  completed = "completed",
  cancelled = "cancelled",
}

export type PaymentStatus = "pending" | "paid" | "failed" // New: Payment status

export interface Order {
  id: string
  customerId: string
  driverId?: string // Optional, assigned when accepted
  items: Item[]
  pickupLocation: string
  deliveryLocation: string
  pickupDate: string
  pickupTime: string
  suggestedVehicleType: string // The vehicle type the customer selected
  price: number
  status: OrderStatus
  paymentStatus: PaymentStatus // New: Payment status for the order
  createdAt: string
  acceptedAt?: string
  inTransitAt?: string // New: Timestamp when order goes in-transit
  completedAt?: string
  rating?: number // New: Customer rating for this specific order (1-5)
  driverLocation?: string // New: Driver's current location during transit
}

export interface Customer {
  id: string
  name: string
  email: string
  passwordHash: string
  phone: string
  address: string
  createdAt: string
}

export interface Driver {
  id: string
  name: string
  email: string
  passwordHash: string
  phone: string
  vehicleType: "bike" | "auto" | "car" | "van" | "truck"
  vehicleNumber: string
  licenseNumber: string
  rating: number // Average rating
  totalTrips: number
  createdAt: string
}

export interface CustomerSession {
  id: string
  email: string
  name: string
  loginTime: string
  role: "customer" // Added role for session
}

export interface DriverSession {
  id: string
  email: string
  name: string
  vehicleType: "bike" | "auto" | "car" | "van" | "truck"
  loginTime: string
  role: "driver" // Added role for session
}

// --- Initialization and Persistence Functions ---

export const initializeAppData = async () => {
  // Initialize default customer if no customer data exists
  const existingCustomers = localStorage.getItem("customerAccounts")
  if (!existingCustomers) {
    const defaultPasswordHash = await hashPassword("customer123")
    const customer2PasswordHash = await hashPassword("customerpass")
    const defaultCustomers: Customer[] = [
      {
        id: "cust1",
        name: "Customer User",
        email: "customer@trolla.com",
        passwordHash: defaultPasswordHash,
        phone: "9876543210",
        address: "123 Customer St, Mumbai",
        createdAt: "2024-01-01",
      },
      {
        id: "cust2",
        name: "Priya Sharma",
        email: "priya@trolla.com",
        passwordHash: customer2PasswordHash,
        phone: "9123456789",
        address: "456 Lake View, Bangalore",
        createdAt: "2024-02-15",
      },
    ]
    localStorage.setItem("customerAccounts", JSON.stringify(defaultCustomers))
  }

  // Initialize default driver if no driver data exists
  const existingDrivers = localStorage.getItem("driverAccounts")
  if (!existingDrivers) {
    const defaultPasswordHash = await hashPassword("driver123")
    const driver2PasswordHash = await hashPassword("driverpass")
    const driver3PasswordHash = await hashPassword("driverpass2")
    const defaultDrivers: Driver[] = [
      {
        id: "driver1",
        name: "Driver User",
        email: "driver@trolla.com",
        passwordHash: defaultPasswordHash,
        phone: "9988776655",
        vehicleType: "truck",
        vehicleNumber: "MH01AB1234",
        licenseNumber: "DL1234567890",
        rating: 4.5,
        totalTrips: 10,
        createdAt: "2024-01-01",
      },
      {
        id: "driver2",
        name: "Amit Singh",
        email: "amit@trolla.com",
        passwordHash: driver2PasswordHash,
        phone: "8765432109",
        vehicleType: "car",
        vehicleNumber: "DL05CD5678",
        licenseNumber: "UP9876543210",
        rating: 4.8,
        totalTrips: 25,
        createdAt: "2024-03-01",
      },
      {
        id: "driver3",
        name: "Sunita Devi",
        email: "sunita@trolla.com",
        passwordHash: driver3PasswordHash,
        phone: "7654321098",
        vehicleType: "auto",
        vehicleNumber: "KA02EF9012",
        licenseNumber: "RJ1234567890",
        rating: 4.2,
        totalTrips: 15,
        createdAt: "2024-04-10",
      },
    ]
    localStorage.setItem("driverAccounts", JSON.stringify(defaultDrivers))
  }

  // Initialize orders if none exist
  const existingOrders = localStorage.getItem("orders")
  if (!existingOrders) {
    localStorage.setItem("orders", JSON.stringify([]))
  }
}

// --- Customer Functions ---

export const getCustomers = (): Customer[] => {
  const data = localStorage.getItem("customerAccounts")
  return data ? JSON.parse(data) : []
}

export const setCustomers = (customers: Customer[]): void => {
  localStorage.setItem("customerAccounts", JSON.stringify(customers))
}

export const createCustomer = async (
  customerData: Omit<Customer, "id" | "passwordHash" | "createdAt"> & { password: string },
): Promise<Customer> => {
  const passwordHash = await hashPassword(customerData.password)
  const newCustomer: Customer = {
    id: `cust${Date.now()}`,
    name: customerData.name,
    email: customerData.email,
    passwordHash,
    phone: customerData.phone,
    address: customerData.address,
    createdAt: new Date().toISOString().split("T")[0],
  }
  const customers = getCustomers()
  setCustomers([...customers, newCustomer])
  return newCustomer
}

export const loginCustomer = (sessionData: Omit<CustomerSession, "role">): void => {
  localStorage.setItem("customerSession", JSON.stringify({ ...sessionData, role: "customer" }))
}

export const getCustomerSession = (): CustomerSession | null => {
  const session = localStorage.getItem("customerSession")
  return session ? JSON.parse(session) : null
}

// --- Driver Functions ---

export const getDrivers = (): Driver[] => {
  const data = localStorage.getItem("driverAccounts")
  return data ? JSON.parse(data) : []
}

export const setDrivers = (drivers: Driver[]): void => {
  localStorage.setItem("driverAccounts", JSON.stringify(drivers))
}

export const createDriver = async (
  driverData: Omit<Driver, "id" | "passwordHash" | "createdAt" | "rating" | "totalTrips"> & { password: string },
): Promise<Driver> => {
  const passwordHash = await hashPassword(driverData.password)
  const newDriver: Driver = {
    id: `driver${Date.now()}`,
    name: driverData.name,
    email: driverData.email,
    passwordHash,
    phone: driverData.phone,
    vehicleType: driverData.vehicleType,
    vehicleNumber: driverData.vehicleNumber,
    licenseNumber: driverData.licenseNumber,
    rating: 5.0, // Default rating for new drivers
    totalTrips: 0,
    createdAt: new Date().toISOString().split("T")[0],
  }
  const drivers = getDrivers()
  setDrivers([...drivers, newDriver])
  return newDriver
}

export const loginDriver = (sessionData: Omit<DriverSession, "role">): void => {
  localStorage.setItem("driverSession", JSON.stringify({ ...sessionData, role: "driver" }))
}

export const getDriverSession = (): DriverSession | null => {
  const session = localStorage.getItem("driverSession")
  return session ? JSON.parse(session) : null
}

export const updateDriverRating = (driverId: string, newRating: number): void => {
  const drivers = getDrivers()
  const driverIndex = drivers.findIndex((d) => d.id === driverId)

  if (driverIndex > -1) {
    const driver = drivers[driverIndex]
    // Calculate new average rating
    const currentTotalRating = driver.rating * driver.totalTrips
    const updatedTotalTrips = driver.totalTrips + 1
    const updatedRating = (currentTotalRating + newRating) / updatedTotalTrips

    drivers[driverIndex] = {
      ...driver,
      rating: Number.parseFloat(updatedRating.toFixed(1)), // Keep one decimal place
      totalTrips: updatedTotalTrips,
    }
    setDrivers(drivers)
  }
}

// --- Order Functions ---

export const getOrders = (): Order[] => {
  const data = localStorage.getItem("orders")
  return data ? JSON.parse(data) : []
}

export const setOrders = (orders: Order[]): void => {
  localStorage.setItem("orders", JSON.stringify(orders))
}

export const createOrder = (orderData: Omit<Order, "id" | "createdAt" | "status" | "paymentStatus">): Order => {
  const newOrder: Order = {
    id: `order${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: OrderStatus.pending, // Use enum value
    paymentStatus: "pending", // Default to pending payment
    ...orderData,
  }
  const orders = getOrders()
  setOrders([...orders, newOrder])
  return newOrder
}

export const updateOrder = (updatedOrder: Order): Order | null => {
  const orders = getOrders()
  const index = orders.findIndex((order) => order.id === updatedOrder.id)
  if (index > -1) {
    orders[index] = updatedOrder
    setOrders(orders)
    return updatedOrder
  }
  return null
}

export const getOrderById = (orderId: string): Order | null => {
  const orders = getOrders()
  return orders.find((order) => order.id === orderId) || null
}

// New function to cancel an order
export const cancelOrder = (orderId: string): Order | null => {
  const orders = getOrders()
  const orderIndex = orders.findIndex((order) => order.id === orderId)

  if (orderIndex > -1) {
    const orderToCancel = orders[orderIndex]
    if (orderToCancel.status === OrderStatus.pending) {
      const updatedOrder = {
        ...orderToCancel,
        status: OrderStatus.cancelled,
        completedAt: new Date().toISOString(), // Mark cancellation time
      }
      orders[orderIndex] = updatedOrder
      setOrders(orders)
      return updatedOrder
    }
  }
  return null
}

// New helper to get any active session
export const getCurrentUserSession = (): CustomerSession | DriverSession | null => {
  const customerSession = getCustomerSession()
  if (customerSession) {
    return { ...customerSession, role: "customer" }
  }
  const driverSession = getDriverSession()
  if (driverSession) {
    return { ...driverSession, role: "driver" }
  }
  return null
}
