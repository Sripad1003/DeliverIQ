import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// Simple hash function for demo purposes
// In production, use bcrypt or similar secure hashing libraries
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
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
