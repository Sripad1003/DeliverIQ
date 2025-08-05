// Simple hash function for demo purposes
// In production, use bcrypt or similar secure hashing libraries
export const hashPassword = async (password: string): Promise<string> => {
  // Using Web Crypto API for hashing
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "DELIVERIQ_SALT_2024") // Add salt
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const hashedInput = await hashPassword(password)
  return hashedInput === hashedPassword
}

export const hashSecurityKey = async (key: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(key + "DELIVERIQ_KEY_SALT_2024")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export const verifySecurityKey = async (key: string, hashedKey: string): Promise<boolean> => {
  const hashedInput = await hashSecurityKey(key)
  return hashedInput === hashedKey
}

// Generate secure random key
export const generateSecureKey = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
  let result = "DELIVERIQ_"

  for (let i = 0; i < 32; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

// This is a placeholder for a real security key.
// In a production environment, this should be stored securely (e.g., in environment variables)
// and not hardcoded or exposed client-side.
export const DELIVERIQ_ADMIN_SECURITY_KEY = "DELIVERIQ_ADMIN_2024"

// In a real application, you would have more sophisticated security measures:
// - Hashing passwords
// - JWTs or session management for authentication
// - Role-based access control (RBAC)
// - Input validation and sanitization
// - Protection against common web vulnerabilities (XSS, CSRF, SQL injection, etc.)
