'use server'

import { MongoClient, ObjectId } from 'mongodb';
import { AdminType, SettingType } from '@/lib/admin-data-types';
import { CustomerType, DriverType, OrderType, OrderStatus } from '@/lib/app-data-types';
import { hashPassword } from '@/lib/security';
import { getClient } from '@/lib/mongodb';

const DATABASE_NAME = 'DeliverIQ';

// --- Helper to get collection ---
async function getCollection<T>(collectionName: string) {
  const client = await getClient();
  const db = client.db(DATABASE_NAME);
  return db.collection<T>(collectionName);
}

// --- Settings (for admin security key) ---
export async function getSetting(name: string): Promise<SettingType | null> {
  try {
    const settingsCollection = await getCollection<SettingType>('settings');
    const setting = await settingsCollection.findOne({ name });
    return setting || null;
  } catch (error: any) {
    console.error(`Error getting setting ${name}:`, error);
    throw new Error(`Failed to get setting: ${error.message}`);
  }
}

export async function setSetting(name: string, value: string): Promise<{ success: boolean; message?: string }> {
  try {
    const settingsCollection = await getCollection<SettingType>('settings');
    const result = await settingsCollection.updateOne(
      { name },
      { $set: { name, value } },
      { upsert: true }
    );
    if (result.upsertedId || result.modifiedCount === 1) {
      return { success: true };
    }
    return { success: false, message: "Failed to update or insert setting." };
  } catch (error: any) {
    console.error(`Error setting setting ${name}:`, error);
    return { success: false, message: error.message || "Failed to set setting." };
  }
}

// --- Database Seeding ---
export async function seedDatabase(): Promise<{ success: boolean; message?: string }> {
  try {
    const adminsCollection = await getCollection<AdminType>('admins');
    const customersCollection = await getCollection<CustomerType>('customers');
    const driversCollection = await getCollection<DriverType>('drivers');
    const ordersCollection = await getCollection<OrderType>('orders');
    const settingsCollection = await getCollection<SettingType>('settings');

    // Check if collections are empty before seeding
    const adminCount = await adminsCollection.countDocuments();
    const customerCount = await customersCollection.countDocuments();
    const driverCount = await driversCollection.countDocuments();
    const orderCount = await ordersCollection.countDocuments();
    const settingCount = await settingsCollection.countDocuments();

    if (adminCount === 0 && customerCount === 0 && driverCount === 0 && orderCount === 0 && settingCount === 0) {
      console.log("Database is empty. Seeding with demo data...");

      // Seed Admins
      const adminPasswordHash = await hashPassword("admin123");
      const adminSecurityKeyHash = await hashPassword("DELIVERIQ_ADMIN_2024");

      await adminsCollection.insertMany([
        { email: "admin@deliveriq.com", passwordHash: adminPasswordHash, status: "active" },
      ]);
      await settingsCollection.insertOne({ name: "admin_security_key", value: adminSecurityKeyHash });

      // Seed Customers
      const customerPasswordHash = await hashPassword("customer123");
      await customersCollection.insertMany([
        { email: "customer@deliveriq.com", passwordHash: customerPasswordHash, name: "Demo Customer" },
      ]);

      // Seed Drivers
      const driverPasswordHash = await hashPassword("driver123");
      await driversCollection.insertMany([
        { email: "driver@deliveriq.com", passwordHash: driverPasswordHash, name: "Demo Driver", vehicleType: "Car", licensePlate: "DEMO123", averageRating: 4.5, totalRatings: 10 },
      ]);

      // Seed Orders (example)
      const demoCustomer = await customersCollection.findOne({ email: "customer@deliveriq.com" });
      const demoDriver = await driversCollection.findOne({ email: "driver@deliveriq.com" });

      if (demoCustomer && demoDriver) {
        await ordersCollection.insertMany([
          {
            customerId: demoCustomer._id!.toHexString(),
            driverId: demoDriver._id!.toHexString(),
            pickupLocation: "123 Main St, Anytown",
            deliveryLocation: "456 Oak Ave, Otherville",
            itemDescription: "Electronics package",
            status: OrderStatus.InProgress,
            orderDate: new Date().toISOString(),
          },
          {
            customerId: demoCustomer._id!.toHexString(),
            pickupLocation: "789 Pine Ln, Somewhere",
            deliveryLocation: "101 Elm Rd, Nowhere",
            itemDescription: "Documents",
            status: OrderStatus.Pending,
            orderDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          },
          {
            customerId: demoCustomer._id!.toHexString(),
            driverId: demoDriver._id!.toHexString(),
            pickupLocation: "222 Maple Dr, City A",
            deliveryLocation: "333 Birch Blvd, City B",
            itemDescription: "Furniture",
            status: OrderStatus.Delivered,
            orderDate: new Date(Date.now() - 2 * 86400000).toISOString(), // Two days ago
            deliveryDate: new Date(Date.now() - 1.5 * 86400000).toISOString(),
            driverRating: 5,
            driverFeedback: "Excellent service!",
          },
        ]);
      }

      console.log("Database seeding complete.");
      return { success: true, message: "Database seeded successfully." };
    } else {
      console.log("Database already contains data. Skipping seeding.");
      return { success: true, message: "Database already contains data. Seeding skipped." };
    }
  } catch (error: any) {
    console.error("Error seeding database:", error);
    return { success: false, message: error.message || "Failed to seed database." };
  }
}
