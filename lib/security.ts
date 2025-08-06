// Security utilities for password hashing and verification
export async function hashPassword(password: string): Promise<string> {
  // Simple hash function for demo purposes
  // In production, use bcrypt or similar
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "DELIVERIQ_SALT")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

export async function hashSecurityKey(key: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(key + "DELIVERIQ_ADMIN_SALT")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}

export async function verifySecurityKey(key: string, hash: string): Promise<boolean> {
  const keyHash = await hashSecurityKey(key)
  return keyHash === hash
}

export function generateSecureKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = "DELIVERIQ_ADMIN_"
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
