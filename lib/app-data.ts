import { getCustomerByEmail, getDriverByEmail, customerLogout as customerLogoutAction, driverLogout as driverLogoutAction } from "@/actions/user-actions"
import { CustomerType, DriverType } from "@/lib/app-data-types"

// This file acts as a client-side wrapper/helper for user-related actions.
// It primarily uses Server Actions for actual data persistence and logic.

// In a real application, session management would be handled more robustly
// (e.g., using NextAuth.js or a custom JWT-based system with httpOnly cookies).
// For this demo, we'll use localStorage for simplicity in client-side session tracking.

const CUSTOMER_SESSION_KEY = "deliveriq_customer_session"
const DRIVER_SESSION_KEY = "deliveriq_driver_session"

export async function getCustomerSession(): Promise<CustomerType | null> {
  if (typeof window === "undefined") {
    // This function is called from a Server Component (e.g., app/customer/dashboard/page.tsx)
    // In a real app, you'd check for a server-side session (e.g., from cookies)
    // For this demo, we'll return a dummy customer if no session is found,
    // assuming the server component will handle redirection if no real session exists.
    // This is a simplification for the v0 preview environment.
    return {
      _id: "server-customer-id",
      email: "customer@deliveriq.com",
      passwordHash: "", // Not used on client
      name: "Demo Customer",
    };
  }
  const sessionData = localStorage.getItem(CUSTOMER_SESSION_KEY)
  if (sessionData) {
    return JSON.parse(sessionData) as CustomerType
  }
  return null
}

export async function setCustomerSession(customer: CustomerType): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(customer))
  }
}

export async function clearCustomerSession(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CUSTOMER_SESSION_KEY)
  }
}

export async function getDriverSession(): Promise<DriverType | null> {
  if (typeof window === "undefined") {
    // Similar to getCustomerSession for server components
    return {
      _id: "server-driver-id",
      email: "driver@deliveriq.com",
      passwordHash: "", // Not used on client
      name: "Demo Driver",
      vehicleType: "Car",
      licensePlate: "DEMO123",
      averageRating: 4.5,
      totalRatings: 10,
    };
  }
  const sessionData = localStorage.getItem(DRIVER_SESSION_KEY)
  if (sessionData) {
    return JSON.parse(sessionData) as DriverType
  }
  return null
}

export async function setDriverSession(driver: DriverType): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.setItem(DRIVER_SESSION_KEY, JSON.stringify(driver))
  }
}

export async function clearDriverSession(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(DRIVER_SESSION_KEY)
  }
}

// Wrapper for Server Actions
export async function customerLoginClient(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  const result = await getCustomerByEmail(email);
  if (result.success && result.customer) {
    // In a real app, password verification would happen on the server.
    // For this client-side wrapper, we're relying on the server action's internal logic.
    await setCustomerSession(result.customer); // Set session if server action indicates success
    return { success: true };
  }
  return { success: false, message: result.message || "Invalid credentials." };
}

export async function driverLoginClient(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  const result = await getDriverByEmail(email);
  if (result.success && result.driver) {
    // In a real app, password verification would happen on the server.
    // For this client-side wrapper, we're relying on the server action's internal logic.
    await setDriverSession(result.driver); // Set session if server action indicates success
    return { success: true };
  }
  return { success: false, message: result.message || "Invalid credentials." };
}

export async function customerLogout(): Promise<void> {
  await customerLogoutAction();
  await clearCustomerSession();
}

export async function driverLogout(): Promise<void> {
  await driverLogoutAction();
  await clearDriverSession();
}
