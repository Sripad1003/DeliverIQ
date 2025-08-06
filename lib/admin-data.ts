import { Admin } from './app-data';
import {
  getAdmins as fetchAdmins,
  updateAdminStatus as updateAdminStatusAction,
  deleteAdmin as deleteAdminAction,
  getAdminSecurityKeyHash,
  setAdminSecurityKey as setAdminSecurityKeyAction,
  verifyAdminSecurityKey as verifyAdminSecurityKeyAction,
} from '@/actions/admin-actions';

export async function getAdminSecurityKey(): Promise<string | null> {
  // This function is primarily for checking if a key exists or for initial setup.
  // The actual key value is not returned for security.
  const hash = await getAdminSecurityKeyHash();
  return hash ? 'KEY_SET' : null; // Return a placeholder if set, null otherwise
}

export async function setSecurityKey(key: string): Promise<boolean> {
  const result = await setAdminSecurityKeyAction(key);
  return result.success;
}

export async function verifySecurityKey(key: string): Promise<boolean> {
  const result = await verifyAdminSecurityKeyAction(key);
  return result.success;
}

export async function getAdmins(): Promise<Admin[]> {
  return await fetchAdmins();
}

export async function updateAdminStatus(adminId: string, isActive: boolean): Promise<boolean> {
  const result = await updateAdminStatusAction(adminId, isActive);
  return result.success;
}

export async function deleteAdmin(adminId: string): Promise<boolean> {
  const result = await deleteAdminAction(adminId);
  return result.success;
}
