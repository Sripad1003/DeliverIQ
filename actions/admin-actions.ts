'use server'

import { MongoClient, ObjectId } from 'mongodb';
import { AdminType, SettingType } from '@/lib/admin-data-types';
import { comparePassword, hashPassword, getAdminSecurityKeyHash, setAdminSecurityKey as setSecurityKeyInDb, verifyAdminSecurityKey } from '@/lib/security';
import { getClient } from '@/lib/mongodb';

const DATABASE_NAME = 'DeliverIQ';
const ADMIN_SESSION_KEY = "deliveriq_admin_session"; // Used for server-side session management (cookies)

// --- Helper to get collection ---
async function getCollection<T>(collectionName: string) {
  const client = await getClient();
  const db = client.db(DATABASE_NAME);
  return db.collection<T>(collectionName);
}

// --- Admin Authentication & Management ---

export async function adminLogin(email: string, password: string, securityKey: string): Promise<{ success: boolean; message?: string; admin?: AdminType }> {
  try {
    const adminsCollection = await getCollection<AdminType>('admins');
    const admin = await adminsCollection.findOne({ email });

    if (!admin) {
      return { success: false, message: "Invalid email or password." };
    }

    const isPasswordValid = await comparePassword(password, admin.passwordHash);
    if (!isPasswordValid) {
      return { success: false, message: "Invalid email or password." };
    }

    const isSecurityKeyValid = await verifyAdminSecurityKey(securityKey);
    if (!isSecurityKeyValid) {
      return { success: false, message: "Invalid admin security key." };
    }

    if (admin.status === 'inactive') {
      return { success: false, message: "Your admin account is inactive. Please contact support." };
    }

    // In a real app, you'd set a secure httpOnly cookie here for session management
    // For this demo, we'll simulate a session by returning the admin object.
    // The client-side `lib/admin-data.ts` will store it in localStorage.
    // This is a simplification for the v0 preview environment.
    return { success: true, message: "Login successful!", admin: { _id: admin._id?.toHexString(), email: admin.email, passwordHash: '', status: admin.status } };
  } catch (error: any) {
    console.error("Error during admin login:", error);
    return { success: false, message: error.message || "An unexpected error occurred during login." };
  }
}

export async function adminLogout(): Promise<{ success: boolean; message?: string }> {
  // In a real app, you'd clear the httpOnly cookie here.
  // For this demo, the client-side `lib/admin-data.ts` handles clearing localStorage.
  return { success: true, message: "Logged out successfully." };
}

export async function createAdmin(email: string, password: string, securityKey: string): Promise<{ success: boolean; message?: string }> {
  try {
    const adminsCollection = await getCollection<AdminType>('admins');
    const existingAdmin = await adminsCollection.findOne({ email });
    if (existingAdmin) {
      return { success: false, message: "Admin with this email already exists." };
    }

    const isSecurityKeyValid = await verifyAdminSecurityKey(securityKey);
    if (!isSecurityKeyValid) {
      return { success: false, message: "Invalid admin security key. Cannot create new admin." };
    }

    const passwordHash = await hashPassword(password);
    const newAdmin: AdminType = {
      email,
      passwordHash,
      status: "active", // New admins are active by default
    };

    const result = await adminsCollection.insertOne(newAdmin);
    if (result.acknowledged) {
      return { success: true, message: "Admin created successfully." };
    }
    return { success: false, message: "Failed to create admin." };
  } catch (error: any) {
    console.error("Error creating admin:", error);
    return { success: false, message: error.message || "An unexpected error occurred." };
  }
}

export async function getAdmins(): Promise<AdminType[]> {
  try {
    const adminsCollection = await getCollection<AdminType>('admins');
    const admins = await adminsCollection.find({}).toArray();
    return admins.map(admin => ({
      _id: admin._id?.toHexString(),
      email: admin.email,
      passwordHash: '', // Do not expose password hash
      status: admin.status,
    }));
  } catch (error: any) {
    console.error("Error fetching admins:", error);
    throw new Error(error.message || "Failed to fetch admins.");
  }
}

export async function updateAdminStatus(adminId: string, status: "active" | "inactive"): Promise<{ success: boolean; message?: string }> {
  try {
    const adminsCollection = await getCollection<AdminType>('admins');
    const result = await adminsCollection.updateOne(
      { _id: new ObjectId(adminId) },
      { $set: { status } }
    );
    if (result.modifiedCount === 1) {
      return { success: true, message: "Admin status updated." };
    }
    return { success: false, message: "Admin not found or status not changed." };
  } catch (error: any) {
    console.error("Error updating admin status:", error);
    return { success: false, message: error.message || "Failed to update admin status." };
  }
}

export async function deleteAdmin(adminId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const adminsCollection = await getCollection<AdminType>('admins');
    const result = await adminsCollection.deleteOne({ _id: new ObjectId(adminId) });
    if (result.deletedCount === 1) {
      return { success: true, message: "Admin deleted successfully." };
    }
    return { success: false, message: "Admin not found." };
  } catch (error: any) {
    console.error("Error deleting admin:", error);
    return { success: false, message: error.message || "Failed to delete admin." };
  }
}

export async function getSecurityKey(): Promise<{ success: boolean; key?: string; message?: string }> {
  try {
    const keyHash = await getAdminSecurityKeyHash();
    if (keyHash) {
      // In a real app, you would NOT return the actual key.
      // This is a simplification for the demo to show it's set.
      // For security, you'd only return a status like 'key_set' or 'key_not_set'.
      return { success: true, key: "******** (Key is set)" }; // Mask the key
    }
    return { success: true, key: "Not Set" };
  } catch (error: any) {
    console.error("Error getting security key:", error);
    return { success: false, message: error.message || "Failed to retrieve security key status." };
  }
}

export async function setSecurityKey(key: string): Promise<{ success: boolean; message?: string }> {
  return setSecurityKeyInDb(key);
}
