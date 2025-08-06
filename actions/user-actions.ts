'use server'

import { MongoClient, ObjectId } from 'mongodb';
import { CustomerType, DriverType } from '@/lib/app-data-types';
import { comparePassword, hashPassword } from '@/lib/security';
import { getClient } from '@/lib/mongodb';

const DATABASE_NAME = 'DeliverIQ';

// --- Helper to get collection ---
async function getCollection<T>(collectionName: string) {
  const client = await getClient();
  const db = client.db(DATABASE_NAME);
  return db.collection<T>(collectionName);
}

// --- Customer Operations ---

export async function createCustomer(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  try {
    const customersCollection = await getCollection<CustomerType>('customers');
    const existingCustomer = await customersCollection.findOne({ email });
    if (existingCustomer) {
      return { success: false, message: "Customer with this email already exists." };
    }

    const passwordHash = await hashPassword(password);
    const newCustomer: CustomerType = {
      email,
      passwordHash,
      name: email.split('@')[0], // Simple name from email
    };

    const result = await customersCollection.insertOne(newCustomer);
    if (result.acknowledged) {
      return { success: true, message: "Customer created successfully." };
    }
    return { success: false, message: "Failed to create customer." };
  } catch (error: any) {
    console.error("Error creating customer:", error);
    return { success: false, message: error.message || "An unexpected error occurred." };
  }
}

export async function customerLogin(email: string, password: string): Promise<{ success: boolean; message?: string; customer?: CustomerType }> {
  try {
    const customersCollection = await getCollection<CustomerType>('customers');
    const customer = await customersCollection.findOne({ email });

    if (!customer) {
      return { success: false, message: "Invalid email or password." };
    }

    const isPasswordValid = await comparePassword(password, customer.passwordHash);
    if (!isPasswordValid) {
      return { success: false, message: "Invalid email or password." };
    }

    // In a real app, you'd set a secure httpOnly cookie here for session management
    // For this demo, we'll simulate a session by returning the customer object.
    // The client-side `lib/app-data.ts` will store it in localStorage.
    // This is a simplification for the v0 preview environment.
    return { success: true, message: "Login successful!", customer: { _id: customer._id?.toHexString(), email: customer.email, passwordHash: '', name: customer.name } };
  } catch (error: any) {
    console.error("Error during customer login:", error);
    return { success: false, message: error.message || "An unexpected error occurred during login." };
  }
}

export async function getCustomerByEmail(email: string): Promise<{ success: boolean; customer?: CustomerType; message?: string }> {
  try {
    const customersCollection = await getCollection<CustomerType>('customers');
    const customer = await customersCollection.findOne({ email });
    if (customer) {
      return { success: true, customer: { _id: customer._id?.toHexString(), email: customer.email, passwordHash: '', name: customer.name } };
    }
    return { success: false, message: "Customer not found." };
  } catch (error: any) {
    console.error(`Error fetching customer by email ${email}:`, error);
    return { success: false, message: error.message || "Failed to fetch customer." };
  }
}

export async function customerLogout(): Promise<{ success: boolean; message?: string }> {
  // In a real app, you'd clear the httpOnly cookie here.
  // For this demo, the client-side `lib/app-data.ts` handles clearing localStorage.
  return { success: true, message: "Logged out successfully." };
}

// --- Driver Operations ---

export async function createDriver(email: string, password: string): Promise<{ success: boolean; message?: string }> {
  try {
    const driversCollection = await getCollection<DriverType>('drivers');
    const existingDriver = await driversCollection.findOne({ email });
    if (existingDriver) {
      return { success: false, message: "Driver with this email already exists." };
    }

    const passwordHash = await hashPassword(password);
    const newDriver: DriverType = {
      email,
      passwordHash,
      name: email.split('@')[0], // Simple name from email
      vehicleType: "Car", // Default
      licensePlate: "N/A", // Default
      averageRating: 0,
      totalRatings: 0,
    };

    const result = await driversCollection.insertOne(newDriver);
    if (result.acknowledged) {
      return { success: true, message: "Driver created successfully." };
    }
    return { success: false, message: "Failed to create driver." };
  } catch (error: any) {
    console.error("Error creating driver:", error);
    return { success: false, message: error.message || "An unexpected error occurred." };
  }
}

export async function driverLogin(email: string, password: string): Promise<{ success: boolean; message?: string; driver?: DriverType }> {
  try {
    const driversCollection = await getCollection<DriverType>('drivers');
    const driver = await driversCollection.findOne({ email });

    if (!driver) {
      return { success: false, message: "Invalid email or password." };
    }

    const isPasswordValid = await comparePassword(password, driver.passwordHash);
    if (!isPasswordValid) {
      return { success: false, message: "Invalid email or password." };
    }

    // In a real app, you'd set a secure httpOnly cookie here for session management
    // For this demo, we'll simulate a session by returning the driver object.
    // The client-side `lib/app-data.ts` will store it in localStorage.
    // This is a simplification for the v0 preview environment.
    return { success: true, message: "Login successful!", driver: {
      _id: driver._id?.toHexString(),
      email: driver.email,
      passwordHash: '',
      name: driver.name,
      vehicleType: driver.vehicleType,
      licensePlate: driver.licensePlate,
      averageRating: driver.averageRating,
      totalRatings: driver.totalRatings,
    }};
  } catch (error: any) {
    console.error("Error during driver login:", error);
    return { success: false, message: error.message || "An unexpected error occurred during login." };
  }
}

export async function getDriverByEmail(email: string): Promise<{ success: boolean; driver?: DriverType; message?: string }> {
  try {
    const driversCollection = await getCollection<DriverType>('drivers');
    const driver = await driversCollection.findOne({ email });
    if (driver) {
      return { success: true, driver: {
        _id: driver._id?.toHexString(),
        email: driver.email,
        passwordHash: '',
        name: driver.name,
        vehicleType: driver.vehicleType,
        licensePlate: driver.licensePlate,
        averageRating: driver.averageRating,
        totalRatings: driver.totalRatings,
      }};
    }
    return { success: false, message: "Driver not found." };
  } catch (error: any) {
    console.error(`Error fetching driver by email ${email}:`, error);
    return { success: false, message: error.message || "Failed to fetch driver." };
  }
}

export async function driverLogout(): Promise<{ success: boolean; message?: string }> {
  // In a real app, you'd clear the httpOnly cookie here.
  // For this demo, the client-side `lib/app-data.ts` handles clearing localStorage.
  return { success: true, message: "Logged out successfully." };
}

export async function updateDriverRating(driverId: string, newRating: number): Promise<{ success: boolean; message?: string }> {
  try {
    const driversCollection = await getCollection<DriverType>('drivers');
    const driver = await driversCollection.findOne({ _id: new ObjectId(driverId) });

    if (!driver) {
      return { success: false, message: "Driver not found." };
    }

    const newTotalRatings = driver.totalRatings + 1;
    const newAverageRating = ((driver.averageRating * driver.totalRatings) + newRating) / newTotalRatings;

    const result = await driversCollection.updateOne(
      { _id: new ObjectId(driverId) },
      { $set: { averageRating: newAverageRating, totalRatings: newTotalRatings } }
    );

    if (result.modifiedCount === 1) {
      return { success: true, message: "Driver rating updated successfully." };
    }
    return { success: false, message: "Failed to update driver rating." };
  } catch (error: any) {
    console.error(`Error updating driver rating for ${driverId}:`, error);
    return { success: false, message: error.message || "Failed to update driver rating." };
  }
}
