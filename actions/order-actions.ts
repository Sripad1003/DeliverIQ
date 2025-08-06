'use server'

import { MongoClient, ObjectId } from 'mongodb';
import { OrderType, OrderStatus } from '@/lib/app-data-types';
import { getClient } from '@/lib/mongodb';

const DATABASE_NAME = 'DeliverIQ';

// --- Helper to get collection ---
async function getCollection<T>(collectionName: string) {
  const client = await getClient();
  const db = client.db(DATABASE_NAME);
  return db.collection<T>(collectionName);
}

// --- Order Operations ---

export async function createOrder(orderData: Omit<OrderType, '_id'>): Promise<{ success: boolean; message?: string; orderId?: string }> {
  try {
    const ordersCollection = await getCollection<OrderType>('orders');
    const result = await ordersCollection.insertOne({
      ...orderData,
      orderDate: new Date().toISOString(), // Ensure orderDate is set on creation
      status: OrderStatus.Pending, // Ensure initial status is Pending
    });
    if (result.acknowledged) {
      return { success: true, message: "Order created successfully.", orderId: result.insertedId.toHexString() };
    }
    return { success: false, message: "Failed to create order." };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return { success: false, message: error.message || "An unexpected error occurred." };
  }
}

export async function getOrders(): Promise<OrderType[]> {
  try {
    const ordersCollection = await getCollection<OrderType>('orders');
    const orders = await ordersCollection.find({}).toArray();
    return orders.map(order => ({
      ...order,
      _id: order._id?.toHexString(),
    }));
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    throw new Error(error.message || "Failed to fetch orders.");
  }
}

export async function getOrderById(orderId: string): Promise<OrderType | null> {
  try {
    const ordersCollection = await getCollection<OrderType>('orders');
    const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });
    if (order) {
      return { ...order, _id: order._id?.toHexString() };
    }
    return null;
  } catch (error: any) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw new Error(error.message || "Failed to fetch order.");
  }
}

export async function getOrdersByCustomerId(customerId: string): Promise<OrderType[]> {
  try {
    const ordersCollection = await getCollection<OrderType>('orders');
    const orders = await ordersCollection.find({ customerId }).toArray();
    return orders.map(order => ({
      ...order,
      _id: order._id?.toHexString(),
    }));
  } catch (error: any) {
    console.error(`Error fetching orders for customer ${customerId}:`, error);
    throw new Error(error.message || "Failed to fetch customer orders.");
  }
}

export async function getOrdersByDriverId(driverId: string): Promise<OrderType[]> {
  try {
    const ordersCollection = await getCollection<OrderType>('orders');
    const orders = await ordersCollection.find({ driverId }).toArray();
    return orders.map(order => ({
      ...order,
      _id: order._id?.toHexString(),
    }));
  } catch (error: any) {
    console.error(`Error fetching orders for driver ${driverId}:`, error);
    throw new Error(error.message || "Failed to fetch driver orders.");
  }
}

export async function updateOrder(updatedOrder: OrderType): Promise<{ success: boolean; message?: string }> {
  try {
    if (!updatedOrder._id) {
      return { success: false, message: "Order ID is required for update." };
    }
    const ordersCollection = await getCollection<OrderType>('orders');
    const { _id, ...dataToUpdate } = updatedOrder; // Exclude _id from $set operation

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: dataToUpdate }
    );
    if (result.modifiedCount === 1) {
      return { success: true, message: "Order updated successfully." };
    }
    return { success: false, message: "Order not found or no changes made." };
  } catch (error: any) {
    console.error(`Error updating order ${updatedOrder._id}:`, error);
    return { success: false, message: error.message || "Failed to update order." };
  }
}

export async function cancelOrder(orderId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const ordersCollection = await getCollection<OrderType>('orders');
    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: OrderStatus.Cancelled } }
    );
    if (result.modifiedCount === 1) {
      return { success: true, message: "Order cancelled successfully." };
    }
    return { success: false, message: "Order not found or already cancelled." };
  } catch (error: any) {
    console.error(`Error cancelling order ${orderId}:`, error);
    return { success: false, message: error.message || "Failed to cancel order." };
  }
}
