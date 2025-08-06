'use server'

import { connectToDatabase } from '@/lib/mongodb';
import { hashPassword, verifyPassword } from '@/lib/security';
import { Customer, Driver, Rating } from '@/lib/app-data';
import { ObjectId } from 'mongodb';

export async function createCustomer(customerData: Omit<Customer, 'id'>) {
  try {
    const { db } = await connectToDatabase();
    const customersCollection = db.collection<Customer>('customers');

    const existingCustomer = await customersCollection.findOne({ email: customerData.email });
    if (existingCustomer) {
      return { success: false, message: 'Customer with this email already exists.' };
    }

    const hashedPassword = await hashPassword(customerData.password);
    const result = await customersCollection.insertOne({
      ...customerData,
      password: hashedPassword,
      id: new ObjectId().toHexString(), // Generate a new ID
    });
    return { success: true, message: 'Customer created successfully.', customerId: result.insertedId.toHexString() };
  } catch (error) {
    console.error('Error creating customer:', error);
    return { success: false, message: 'Failed to create customer.' };
  }
}

export async function createDriver(driverData: Omit<Driver, 'id' | 'rating'>) {
  try {
    const { db } = await connectToDatabase();
    const driversCollection = db.collection<Driver>('drivers');

    const existingDriver = await driversCollection.findOne({ email: driverData.email });
    if (existingDriver) {
      return { success: false, message: 'Driver with this email already exists.' };
    }

    const hashedPassword = await hashPassword(driverData.password);
    const result = await driversCollection.insertOne({
      ...driverData,
      password: hashedPassword,
      rating: { count: 0, sum: 0 }, // Initialize rating
      id: new ObjectId().toHexString(), // Generate a new ID
    });
    return { success: true, message: 'Driver created successfully.', driverId: result.insertedId.toHexString() };
  } catch (error) {
    console.error('Error creating driver:', error);
    return { success: false, message: 'Failed to create driver.' };
  }
}

export async function getCustomerByEmail(email: string) {
  try {
    const { db } = await connectToDatabase();
    const customersCollection = db.collection<Customer>('customers');
    const customer = await customersCollection.findOne({ email });
    return customer ? { ...customer, password: '' } : null; // Don't return password
  } catch (error) {
    console.error('Error fetching customer by email:', error);
    return null;
  }
}

export async function getDriverByEmail(email: string) {
  try {
    const { db } = await connectToDatabase();
    const driversCollection = db.collection<Driver>('drivers');
    const driver = await driversCollection.findOne({ email });
    return driver ? { ...driver, password: '' } : null; // Don't return password
  } catch (error) {
    console.error('Error fetching driver by email:', error);
    return null;
  }
}

export async function verifyCustomerCredentials(email: string, passwordInput: string) {
  try {
    const { db } = await connectToDatabase();
    const customersCollection = db.collection<Customer>('customers');
    const customer = await customersCollection.findOne({ email });

    if (customer && await verifyPassword(passwordInput, customer.password)) {
      return { success: true, customerId: customer.id };
    }
    return { success: false, message: 'Invalid credentials.' };
  } catch (error) {
    console.error('Error verifying customer credentials:', error);
    return { success: false, message: 'An error occurred during login.' };
  }
}

export async function verifyDriverCredentials(email: string, passwordInput: string) {
  try {
    const { db } = await connectToDatabase();
    const driversCollection = db.collection<Driver>('drivers');
    const driver = await driversCollection.findOne({ email });

    if (driver && await verifyPassword(passwordInput, driver.password)) {
      return { success: true, driverId: driver.id };
    }
    return { success: false, message: 'Invalid credentials.' };
  } catch (error) {
    console.error('Error verifying driver credentials:', error);
    return { success: false, message: 'An error occurred during login.' };
  }
}

export async function updateDriverRating(driverId: string, newRating: number) {
  try {
    const { db } = await connectToDatabase();
    const driversCollection = db.collection<Driver>('drivers');

    const driver = await driversCollection.findOne({ id: driverId });
    if (!driver) {
      return { success: false, message: 'Driver not found.' };
    }

    const updatedRating: Rating = {
      count: driver.rating.count + 1,
      sum: driver.rating.sum + newRating,
    };

    await driversCollection.updateOne(
      { id: driverId },
      { $set: { rating: updatedRating } }
    );
    return { success: true, message: 'Driver rating updated successfully.' };
  } catch (error) {
    console.error('Error updating driver rating:', error);
    return { success: false, message: 'Failed to update driver rating.' };
  }
}

export async function getDriverById(driverId: string) {
  try {
    const { db } = await connectToDatabase();
    const driversCollection = db.collection<Driver>('drivers');
    const driver = await driversCollection.findOne({ id: driverId });
    return driver ? { ...driver, password: '' } : null;
  } catch (error) {
    console.error('Error fetching driver by ID:', error);
    return null;
  }
}

export async function getCustomerById(customerId: string) {
  try {
    const { db } = await connectToDatabase();
    const customersCollection = db.collection<Customer>('customers');
    const customer = await customersCollection.findOne({ id: customerId });
    return customer ? { ...customer, password: '' } : null;
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    return null;
  }
}
