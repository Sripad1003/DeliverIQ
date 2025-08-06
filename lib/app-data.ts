import { hashPassword } from "./security"
import { SecureStorage } from "./server-storage"

// Enums and Types (keeping existing ones)
export const enum OrderStatus {
  pending = "pending",
  accepted = "accepted", 
  inTransit = "in-transit",
  completed = "completed",
  cancelled = "cancelled"
}

export type PaymentStatus = "pending" | "paid" | "failed"
export type VehicleType = "bike" | "auto" | "car" | "van" | "truck"

export interface Item {
  name: string
  quantity: number
  weight: number
  length: number
  width: number
  height: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  passwordHash: string
  createdAt: string
  lastLoginAt?: string
  isVerified: boolean
  status: "active" | "suspended" | "banned"
}

export interface Driver {
  id: string
  name: string
  email: string
  phone: string
  vehicleType: VehicleType
  vehicleNumber: string
  licenseNumber: string
  passwordHash: string
  rating: number
  totalTrips: number
  createdAt: string
  lastLoginAt?: string
  isVerified: boolean
  status: "active" | "suspended" | "banned"
  documentsVerified: boolean
}

export interface Order {
  id: string
  customerId: string
  driverId?: string
  items: Item[]
  pickupLocation: string
  deliveryLocation: string
  pickupDate: string
  pickupTime: string
  suggestedVehicleType: VehicleType
  price: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  createdAt: string
  acceptedAt?: string
  inTransitAt?: string
  completedAt?: string
  driverLocation?: string
  rating?: number
  adminNotes?: string
}

export interface CustomerSession {
  id: string
  email: string
  name: string
  loginTime: string
}

export interface DriverSession {
  id: string
  email: string
  name: string
  vehicleType: VehicleType
  rating?: number
  totalTrips?: number
  loginTime: string
}

// Initialize sample data with enhanced security
export async function initializeAppData() {
  if (typeof window === "undefined") return

  // Initialize customers with encrypted storage
  const existingCustomers = await SecureStorage.getCustomers()
  if (existingCustomers.length === 0) {
    const sampleCustomers: Customer[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+91 9876543210",
        address: "123 Main St, Mumbai, Maharashtra",
        passwordHash: await hashPassword("password123"),
        createdAt: new Date().toISOString(),
        isVerified: true,
        status: "active"
      },
      {
        id: "2", 
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+91 9876543211",
        address: "456 Oak Ave, Delhi, Delhi",
        passwordHash: await hashPassword("password123"),
        createdAt: new Date().toISOString(),
        isVerified: true,
        status: "active"
      }
    ]
    await SecureStorage.storeCustomers(sampleCustomers)
  }

  // Initialize drivers with encrypted storage
  const existingDrivers = await SecureStorage.getDrivers()
  if (existingDrivers.length === 0) {
    const sampleDrivers: Driver[] = [
      {
        id: "1",
        name: "Raj Kumar",
        email: "raj@example.com", 
        phone: "+91 9876543212",
        vehicleType: "truck",
        vehicleNumber: "MH-01-AB-1234",
        licenseNumber: "DL123456789",
        passwordHash: await hashPassword("password123"),
        rating: 4.5,
        totalTrips: 25,
        createdAt: new Date().toISOString(),
        isVerified: true,
        status: "active",
        documentsVerified: true
      },
      {
        id: "2",
        name: "Amit Singh",
        email: "amit@example.com",
        phone: "+91 9876543213", 
        vehicleType: "van",
        vehicleNumber: "DL-02-CD-5678",
        licenseNumber: "DL987654321",
        passwordHash: await hashPassword("password123"),
        rating: 4.2,
        totalTrips: 18,
        createdAt: new Date().toISOString(),
        isVerified: true,
        status: "active",
        documentsVerified: true
      }
    ]
    await SecureStorage.storeDrivers(sampleDrivers)
  }

  // Initialize orders with encrypted storage
  const existingOrders = await SecureStorage.getOrders()
  if (existingOrders.length === 0) {
    const sampleOrders: Order[] = [
      {
        id: "1",
        customerId: "1",
        driverId: "1",
        items: [
          { name: "Furniture", quantity: 1, weight: 50, length: 2, width: 1, height: 1 }
        ],
        pickupLocation: "Mumbai, Bandra",
        deliveryLocation: "Pune, Koregaon Park", 
        pickupDate: "2024-01-15",
        pickupTime: "10:00",
        suggestedVehicleType: "truck",
        price: 2500,
        status: OrderStatus.completed,
        paymentStatus: "paid",
        createdAt: "2024-01-10T10:00:00Z",
        acceptedAt: "2024-01-10T11:00:00Z",
        inTransitAt: "2024-01-15T10:30:00Z",
        completedAt: "2024-01-15T16:00:00Z",
        rating: 5
      },
      {
        id: "2",
        customerId: "2",
        items: [
          { name: "Electronics", quantity: 3, weight: 15, length: 0.5, width: 0.3, height: 0.2 }
        ],
        pickupLocation: "Delhi, Connaught Place",
        deliveryLocation: "Gurgaon, Cyber City",
        pickupDate: "2024-01-20",
        pickupTime: "14:00",
        suggestedVehicleType: "van",
        price: 800,
        status: OrderStatus.pending,
        paymentStatus: "pending",
        createdAt: new Date().toISOString()
      }
    ]
    await SecureStorage.storeOrders(sampleOrders)
  }
}

// Updated functions to use secure storage
export async function getCustomers(): Promise<Customer[]> {
  return await SecureStorage.getCustomers()
}

export async function createCustomer(customerData: {
  name: string
  email: string
  password: string
  phone: string
  address: string
}): Promise<Customer> {
  const passwordHash = await hashPassword(customerData.password)
  
  const newCustomer: Customer = {
    id: Date.now().toString(),
    name: customerData.name,
    email: customerData.email,
    phone: customerData.phone,
    address: customerData.address,
    passwordHash,
    createdAt: new Date().toISOString(),
    isVerified: false,
    status: "active"
  }

  const customers = await getCustomers()
  customers.push(newCustomer)
  await SecureStorage.storeCustomers(customers)
  
  return newCustomer
}

export async function getDrivers(): Promise<Driver[]> {
  return await SecureStorage.getDrivers()
}

export async function createDriver(driverData: {
  name: string
  email: string
  password: string
  phone: string
  vehicleType: VehicleType
  vehicleNumber: string
  licenseNumber: string
}): Promise<Driver> {
  const passwordHash = await hashPassword(driverData.password)
  
  const newDriver: Driver = {
    id: Date.now().toString(),
    name: driverData.name,
    email: driverData.email,
    phone: driverData.phone,
    vehicleType: driverData.vehicleType,
    vehicleNumber: driverData.vehicleNumber,
    licenseNumber: driverData.licenseNumber,
    passwordHash,
    rating: 0,
    totalTrips: 0,
    createdAt: new Date().toISOString(),
    isVerified: false,
    status: "active",
    documentsVerified: false
  }

  const drivers = await getDrivers()
  drivers.push(newDriver)
  await SecureStorage.storeDrivers(drivers)
  
  return newDriver
}

export async function getOrders(): Promise<Order[]> {
  return await SecureStorage.getOrders()
}

export async function createOrder(orderData: Omit<Order, "id" | "createdAt" | "status" | "paymentStatus">): Promise<Order> {
  const newOrder: Order = {
    ...orderData,
    id: Date.now().toString(),
    status: OrderStatus.pending,
    paymentStatus: "pending",
    createdAt: new Date().toISOString()
  }

  const orders = await getOrders()
  orders.push(newOrder)
  await SecureStorage.storeOrders(orders)
  
  return newOrder
}

export async function updateOrder(updatedOrder: Order) {
  const orders = await getOrders()
  const index = orders.findIndex(order => order.id === updatedOrder.id)
  if (index !== -1) {
    orders[index] = updatedOrder
    await SecureStorage.storeOrders(orders)
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const orders = await getOrders()
  return orders.find(order => order.id === orderId) || null
}

export async function cancelOrder(orderId: string): Promise<boolean> {
  const orders = await getOrders()
  const order = orders.find(o => o.id === orderId)
  
  if (order && order.status === OrderStatus.pending) {
    order.status = OrderStatus.cancelled
    await SecureStorage.storeOrders(orders)
    return true
  }
  
  return false
}

// Keep existing session management functions
export function loginCustomer(session: CustomerSession) {
  if (typeof window === "undefined") return
  localStorage.setItem("customerSession", JSON.stringify(session))
}

export function getCustomerSession(): CustomerSession | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem("customerSession")
  return data ? JSON.parse(data) : null
}

export function loginDriver(session: DriverSession) {
  if (typeof window === "undefined") return
  localStorage.setItem("driverSession", JSON.stringify(session))
}

export function getDriverSession(): DriverSession | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem("driverSession")
  return data ? JSON.parse(data) : null
}

export async function updateDriverRating(driverId: string, newRating: number) {
  const drivers = await getDrivers()
  const driver = drivers.find(d => d.id === driverId)
  
  if (driver) {
    const totalRating = driver.rating * driver.totalTrips + newRating
    driver.totalTrips += 1
    driver.rating = totalRating / driver.totalTrips
    await SecureStorage.storeDrivers(drivers)
  }
}

export function getCurrentUserSession(): (CustomerSession & { role: "customer" }) | (DriverSession & { role: "driver" }) | null {
  const customerSession = getCustomerSession()
  const driverSession = getDriverSession()
  
  if (customerSession) {
    return { ...customerSession, role: "customer" }
  }
  
  if (driverSession) {
    return { ...driverSession, role: "driver" }
  }
  
  return null
}
