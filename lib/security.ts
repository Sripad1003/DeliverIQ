import bcrypt from 'bcryptjs';
import { getSetting, setSetting } from '@/actions/db-actions'; // Assuming db-actions handles settings

const SALT_ROUNDS = 10;
const ADMIN_SECURITY_KEY_SETTING_NAME = "admin_security_key";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getAdminSecurityKeyHash(): Promise<string | null> {
  const setting = await getSetting(ADMIN_SECURITY_KEY_SETTING_NAME);
  return setting?.value || null;
}

export async function setAdminSecurityKey(key: string): Promise<{ success: boolean; message?: string }> {
  try {
    const hashedKey = await hashPassword(key);
    const result = await setSetting(ADMIN_SECURITY_KEY_SETTING_NAME, hashedKey);
    return result;
  } catch (error: any) {
    console.error("Error setting admin security key:", error);
    return { success: false, message: error.message || "Failed to set security key." };
  }
}

export async function verifyAdminSecurityKey(key: string): Promise<boolean> {
  const storedHash = await getAdminSecurityKeyHash();
  if (!storedHash) {
    // If no key is set, allow access for initial setup, or deny based on policy
    // For this app, we'll assume if no key is set, it's an uninitialized state
    // and the setup page will handle it. For login, it must be set.
    return false;
  }
  return comparePassword(key, storedHash);
}
