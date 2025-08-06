'use server'

import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword } from '@/lib/security';
import {
  demoAdmins,
  demoCustomers,
  demoDrivers,
  demoOrders,
  Admin,
  Customer,
  Driver,
  Order,
  OrderStatus,
  VehicleType,
  PaymentMethod,
  DeliveryType,
  Rating,
} from '@/lib/app-data'; // Assuming these are still defined for demo data

export async function seedDatabase() {
  try {
    const { db } = await connectToDatabase();

    const adminsCollection = db.collection<Admin>('admins');
    const customersCollection = db.collection<Customer>('customers');
    const driversCollection = db.collection<Driver>('drivers');
    const ordersCollection = db.collection<Order>('orders');
    const settingsCollection = db.collection<{ key: string; value: string }>('settings');

    // Check if collections are empty before seeding
    const adminCount = await adminsCollection.countDocuments();
    const customerCount = await customersCollection.countDocuments();
    const driverCount = await driversCollection.countDocuments();
    const orderCount = await ordersCollection.countDocuments();
    const settingsCount = await settingsCollection.countDocuments();

    if (adminCount === 0) {
      console.log('Seeding admins...');
      const hashedDemoAdmins = await Promise.all(demoAdmins.map(async (admin) => ({
        ...admin,
        password: await hashPassword(admin.password),
      })));
      await adminsCollection.insertMany(hashedDemoAdmins);
    }

    if (customerCount === 0) {
      console.log('Seeding customers...');
      const hashedDemoCustomers = await Promise.all(demoCustomers.map(async (customer) => ({
        ...customer,
        password: await hashPassword(customer.password),
      })));
      await customersCollection.insertMany(hashedDemoCustomers);
    }

    if (driverCount === 0) {
      console.log('Seeding drivers...');
      const hashedDemoDrivers = await Promise.all(demoDrivers.map(async (driver) => ({
        ...driver,
        password: await hashPassword(driver.password),
      })));
      await driversCollection.insertMany(hashedDemoDrivers);
    }

    if (orderCount === 0) {
      console.log('Seeding orders...');
      await ordersCollection.insertMany(demoOrders);
    }

    if (settingsCount === 0) {
      console.log('Seeding settings...');
      await settingsCollection.insertOne({ key: 'adminSecurityKey', value: await hashPassword('DELIVERIQ_ADMIN_2024') });
    }

    console.log('Database seeding complete.');
    return { success: true, message: 'Database seeded successfully.' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: 'Failed to seed database.' };
  }
}

// You can add other general DB actions here if needed
