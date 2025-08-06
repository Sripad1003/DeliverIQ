'use server'

import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword, verifyPassword } from '@/lib/security';
import { Admin } from '@/lib/app-data';
import { ObjectId } from 'mongodb';

export async function createAdmin(adminData: Omit<Admin, 'id'>) {
  try {
    const { db } = await connectToDatabase();
    const adminsCollection = db.collection<Admin>('admins');

    const existingAdmin = await adminsCollection.findOne({ email: adminData.email });
    if (existingAdmin) {
      return { success: false, message: 'Admin with this email already exists.' };
    }

    const hashedPassword = await hashPassword(adminData.password);
    const result = await adminsCollection.insertOne({
      ...adminData,
      password: hashedPassword,
      id: new ObjectId().toHexString(), // Generate a new ID
    });
    return { success: true, message: 'Admin created successfully.', adminId: result.insertedId.toHexString() };
  } catch (error) {
    console.error('Error creating admin:', error);
    return { success: false, message: 'Failed to create admin.' };
  }
}

export async function getAdminByEmail(email: string) {
  try {
    const { db } = await connectToDatabase();
    const adminsCollection = db.collection<Admin>('admins');
    const admin = await adminsCollection.findOne({ email });
    return admin ? { ...admin, password: '' } : null; // Don't return password
  } catch (error) {
    console.error('Error fetching admin by email:', error);
    return null;
  }
}

export async function verifyAdminCredentials(email: string, passwordInput: string) {
  try {
    const { db } = await connectToDatabase();
    const adminsCollection = db.collection<Admin>('admins');
    const admin = await adminsCollection.findOne({ email });

    if (admin && await verifyPassword(passwordInput, admin.password)) {
      return { success: true, adminId: admin.id };
    }
    return { success: false, message: 'Invalid credentials.' };
  } catch (error) {
    console.error('Error verifying admin credentials:', error);
    return { success: false, message: 'An error occurred during login.' };
  }
}

export async function getAdmins() {
  try {
    const { db } = await connectToDatabase();
    const adminsCollection = db.collection<Admin>('admins');
    const admins = await adminsCollection.find({}).toArray();
    return admins.map(admin => ({ ...admin, password: '' })); // Don't return passwords
  } catch (error) {
    console.error('Error fetching admins:', error);
    return [];
  }
}

export async function updateAdminStatus(adminId: string, isActive: boolean) {
  try {
    const { db } = await connectToDatabase();
    const adminsCollection = db.collection<Admin>('admins');
    await adminsCollection.updateOne(
      { id: adminId },
      { $set: { isActive } }
    );
    return { success: true, message: 'Admin status updated successfully.' };
  } catch (error) {
    console.error('Error updating admin status:', error);
    return { success: false, message: 'Failed to update admin status.' };
  }
}

export async function deleteAdmin(adminId: string) {
  try {
    const { db } = await connectToDatabase();
    const adminsCollection = db.collection<Admin>('admins');
    await adminsCollection.deleteOne({ id: adminId });
    return { success: true, message: 'Admin deleted successfully.' };
  } catch (error) {
    console.error('Error deleting admin:', error);
    return { success: false, message: 'Failed to delete admin.' };
  }
}

export async function getAdminSecurityKeyHash() {
  try {
    const { db } = await connectToDatabase();
    const settingsCollection = db.collection<{ key: string; value: string }>('settings');
    const setting = await settingsCollection.findOne({ key: 'adminSecurityKey' });
    return setting ? setting.value : null;
  } catch (error) {
    console.error('Error fetching admin security key hash:', error);
    return null;
  }
}

export async function setAdminSecurityKey(newKey: string) {
  try {
    const { db } = await connectToDatabase();
    const settingsCollection = db.collection<{ key: string; value: string }>('settings');
    const hashedKey = await hashPassword(newKey);
    await settingsCollection.updateOne(
      { key: 'adminSecurityKey' },
      { $set: { value: hashedKey } },
      { upsert: true } // Create if not exists
    );
    return { success: true, message: 'Admin security key updated successfully.' };
  } catch (error) {
    console.error('Error setting admin security key:', error);
    return { success: false, message: 'Failed to set admin security key.' };
  }
}

export async function verifyAdminSecurityKey(keyInput: string) {
  try {
    const storedHash = await getAdminSecurityKeyHash();
    if (!storedHash) {
      // If no key is set, allow initial setup with any key (or a default one)
      // For now, we'll assume it must be set by seedDatabase or setup page
      return { success: false, message: 'Admin security key not set.' };
    }
    return { success: await verifyPassword(keyInput, storedHash) };
  } catch (error) {
    console.error('Error verifying admin security key:', error);
    return { success: false, message: 'An error occurred during key verification.' };
  }
}
