import { hashPassword, hashSecurityKey } from "./security"

export interface Admin {
  id: string
  name: string
  email: string
  passwordHash: string // Store hashed password instead of plain text
  createdAt: string
  createdBy: string
  status: "active" | "suspended"
}

export const initializeAdminData = async () => {
  // Initialize default admin if no admin data exists
  const existingAdmins = localStorage.getItem("adminAccounts")
  if (!existingAdmins) {
    const defaultPasswordHash = await hashPassword("admin123") // Default password
    const defaultAdmin: Admin = {
      id: "1",
      name: "Super Admin",
      email: "admin@deliveriq.com",
      passwordHash: defaultPasswordHash,
      createdAt: "2024-01-01",
      createdBy: "System",
      status: "active",
    }
    localStorage.setItem("adminAccounts", JSON.stringify([defaultAdmin]))
  }

  // Initialize default security key if none exists
  const existingKey = localStorage.getItem("adminSecurityKey")
  if (!existingKey) {
    const defaultKeyHash = await hashSecurityKey("DELIVERIQ_ADMIN_2024")
    localStorage.setItem("adminSecurityKey", defaultKeyHash)
    // Store the plain key temporarily for initial setup (remove in production)
    localStorage.setItem("adminSecurityKeyPlain", "DELIVERIQ_ADMIN_2024")
  }
}

export const getAdminData = (): Admin[] => {
  const data = localStorage.getItem("adminAccounts")
  if (data) {
    try {
      return JSON.parse(data)
    } catch (error) {
      console.error("Error parsing admin data:", error)
      return []
    }
  }
  return []
}

export const getSecurityKeyHash = (): string => {
  return localStorage.getItem("adminSecurityKey") || ""
}

export const getSecurityKeyPlain = (): string => {
  // This is for display purposes only - remove in production
  return localStorage.getItem("adminSecurityKeyPlain") || "DELIVERIQ_ADMIN_2024"
}

export const setSecurityKey = async (key: string): Promise<void> => {
  const hashedKey = await hashSecurityKey(key)
  localStorage.setItem("adminSecurityKey", hashedKey)
  localStorage.setItem("adminSecurityKeyPlain", key) // For display - remove in production
}

export const setAdminData = (admins: Admin[]): void => {
  localStorage.setItem("adminAccounts", JSON.stringify(admins))
}

export const createAdmin = async (
  adminData: Omit<Admin, "id" | "passwordHash" | "createdAt" | "createdBy" | "status"> & { password: string },
): Promise<Admin> => {
  const passwordHash = await hashPassword(adminData.password)

  return {
    id: Date.now().toString(),
    name: adminData.name,
    email: adminData.email,
    passwordHash,
    createdAt: new Date().toISOString().split("T")[0],
    createdBy: "Super Admin", // In real app, get from current admin session
    status: "active",
  }
}
