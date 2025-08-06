import { Customer, Driver, Order } from "./app-data"

// Simulated server-side encryption using Web Crypto API
class SecureStorage {
  private static readonly ENCRYPTION_KEY_NAME = "app_encryption_key"
  private static readonly CUSTOMERS_KEY = "encrypted_customers"
  private static readonly DRIVERS_KEY = "encrypted_drivers" 
  private static readonly ORDERS_KEY = "encrypted_orders"

  // Generate or retrieve encryption key
  private static async getEncryptionKey(): Promise<CryptoKey> {
    if (typeof window === "undefined") {
      // Server-side fallback - in real app this would be from environment
      const keyData = new Uint8Array(32).fill(1) // Dummy key for demo
      return await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
      )
    }

    // Check if key exists in localStorage
    const existingKey = localStorage.getItem(this.ENCRYPTION_KEY_NAME)
    if (existingKey) {
      const keyData = new Uint8Array(JSON.parse(existingKey))
      return await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
      )
    }

    // Generate new key
    const key = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    )

    // Export and store key
    const exportedKey = await crypto.subtle.exportKey("raw", key)
    localStorage.setItem(this.ENCRYPTION_KEY_NAME, JSON.stringify(Array.from(new Uint8Array(exportedKey))))

    return key
  }

  // Encrypt data
  private static async encryptData(data: string): Promise<{ encrypted: string; iv: string }> {
    const key = await this.getEncryptionKey()
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encodedData = new TextEncoder().encode(data)

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encodedData
    )

    return {
      encrypted: Array.from(new Uint8Array(encrypted)).join(","),
      iv: Array.from(iv).join(",")
    }
  }

  // Decrypt data
  private static async decryptData(encryptedData: string, ivString: string): Promise<string> {
    const key = await this.getEncryptionKey()
    const iv = new Uint8Array(ivString.split(",").map(Number))
    const encrypted = new Uint8Array(encryptedData.split(",").map(Number))

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encrypted
    )

    return new TextDecoder().decode(decrypted)
  }

  // Store encrypted customers
  static async storeCustomers(customers: Customer[]): Promise<void> {
    if (typeof window === "undefined") return
    
    const dataString = JSON.stringify(customers)
    const { encrypted, iv } = await this.encryptData(dataString)
    
    const storageData = {
      data: encrypted,
      iv,
      timestamp: new Date().toISOString(),
      count: customers.length
    }
    
    localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(storageData))
  }

  // Retrieve and decrypt customers
  static async getCustomers(): Promise<Customer[]> {
    if (typeof window === "undefined") return []
    
    const stored = localStorage.getItem(this.CUSTOMERS_KEY)
    if (!stored) return []

    try {
      const { data, iv } = JSON.parse(stored)
      const decryptedData = await this.decryptData(data, iv)
      return JSON.parse(decryptedData)
    } catch (error) {
      console.error("Failed to decrypt customers:", error)
      return []
    }
  }

  // Store encrypted drivers
  static async storeDrivers(drivers: Driver[]): Promise<void> {
    if (typeof window === "undefined") return
    
    const dataString = JSON.stringify(drivers)
    const { encrypted, iv } = await this.encryptData(dataString)
    
    const storageData = {
      data: encrypted,
      iv,
      timestamp: new Date().toISOString(),
      count: drivers.length
    }
    
    localStorage.setItem(this.DRIVERS_KEY, JSON.stringify(storageData))
  }

  // Retrieve and decrypt drivers
  static async getDrivers(): Promise<Driver[]> {
    if (typeof window === "undefined") return []
    
    const stored = localStorage.getItem(this.DRIVERS_KEY)
    if (!stored) return []

    try {
      const { data, iv } = JSON.parse(stored)
      const decryptedData = await this.decryptData(data, iv)
      return JSON.parse(decryptedData)
    } catch (error) {
      console.error("Failed to decrypt drivers:", error)
      return []
    }
  }

  // Store encrypted orders
  static async storeOrders(orders: Order[]): Promise<void> {
    if (typeof window === "undefined") return
    
    const dataString = JSON.stringify(orders)
    const { encrypted, iv } = await this.encryptData(dataString)
    
    const storageData = {
      data: encrypted,
      iv,
      timestamp: new Date().toISOString(),
      count: orders.length
    }
    
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(storageData))
  }

  // Retrieve and decrypt orders
  static async getOrders(): Promise<Order[]> {
    if (typeof window === "undefined") return []
    
    const stored = localStorage.getItem(this.ORDERS_KEY)
    if (!stored) return []

    try {
      const { data, iv } = JSON.parse(stored)
      const decryptedData = await this.decryptData(data, iv)
      return JSON.parse(decryptedData)
    } catch (error) {
      console.error("Failed to decrypt orders:", error)
      return []
    }
  }

  // Get storage metadata for transparency
  static getStorageMetadata() {
    if (typeof window === "undefined") return null

    const customers = localStorage.getItem(this.CUSTOMERS_KEY)
    const drivers = localStorage.getItem(this.DRIVERS_KEY)
    const orders = localStorage.getItem(this.ORDERS_KEY)

    return {
      customers: customers ? JSON.parse(customers) : null,
      drivers: drivers ? JSON.parse(drivers) : null,
      orders: orders ? JSON.parse(orders) : null,
      encryptionEnabled: true,
      algorithm: "AES-GCM-256"
    }
  }
}

export { SecureStorage }
