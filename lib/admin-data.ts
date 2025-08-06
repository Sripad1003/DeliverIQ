import { hashPassword, hashSecurityKey } from "./security"

export interface Admin {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: string
  createdBy: string
  status: "active" | "suspended"
}

const DEFAULT_SECURITY_KEY = "DELIVERIQ_ADMIN_2024"

export function initializeAdminData() {
  if (typeof window === "undefined") return

  // Initialize default admin if not exists
  const existingAdmins = localStorage.getItem("adminData")
  if (!existingAdmins) {
    const defaultAdmins: Admin[] = [
      {
        id: "1",
        name: "Super Admin",
        email: "admin@deliveriq.com",
        passwordHash: "", // Will be set below
        createdAt: "2024-01-01",
        createdBy: "System",
        status: "active"
      }
    ]
    
    // Hash the default password
    hashPassword("admin123").then(hash => {
      defaultAdmins[0].passwordHash = hash
      localStorage.setItem("adminData", JSON.stringify(defaultAdmins))
    })
  }

  // Initialize security key if not exists
  const existingKey = localStorage.getItem("adminSecurityKey")
  if (!existingKey) {
    hashSecurityKey(DEFAULT_SECURITY_KEY).then(hash => {
      localStorage.setItem("adminSecurityKey", hash)
      localStorage.setItem("adminSecurityKeyPlain", DEFAULT_SECURITY_KEY)
    })
  }
}

export function getAdminData(): Admin[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("adminData")
  return data ? JSON.parse(data) : []
}

export function setAdminData(admins: Admin[]) {
  if (typeof window === "undefined") return
  localStorage.setItem("adminData", JSON.stringify(admins))
}

export function getSecurityKeyHash(): string {
  if (typeof window === "undefined") return ""
  return localStorage.getItem("adminSecurityKey") || ""
}

export function getSecurityKeyPlain(): string {
  if (typeof window === "undefined") return DEFAULT_SECURITY_KEY
  return localStorage.getItem("adminSecurityKeyPlain") || DEFAULT_SECURITY_KEY
}

export async function setSecurityKey(key: string) {
  if (typeof window === "undefined") return
  const hash = await hashSecurityKey(key)
  localStorage.setItem("adminSecurityKey", hash)
  localStorage.setItem("adminSecurityKeyPlain", key)
}

export async function createAdmin(adminData: {
  name: string
  email: string
  password: string
}): Promise<Admin> {
  const passwordHash = await hashPassword(adminData.password)
  
  const newAdmin: Admin = {
    id: Date.now().toString(),
    name: adminData.name,
    email: adminData.email,
    passwordHash,
    createdAt: new Date().toISOString(),
    createdBy: "Admin",
    status: "active"
  }

  return newAdmin
}
