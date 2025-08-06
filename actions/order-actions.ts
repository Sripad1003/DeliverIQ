'use server'

import { connectToDatabase } from '@/lib/mongodb';
import { Order, OrderStatus, Customer, Driver } from '@/lib/app-data';
import { ObjectId } from 'mongodb';

export async function createOrder(orderData: Omit<Order, 'id' | 'status' | 'driverId' | 'pickupTime' | 'deliveryTime'>) {
  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection<Order>('orders');

    const newOrder: Order = {
      ...orderData,
      id: new ObjectId().toHexString(),
      status: OrderStatus.Pending,
      driverId: null, // No driver assigned initially
      pickupTime: null,
      deliveryTime: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await ordersCollection.insertOne(newOrder);
    return { success: true, message: 'Order created successfully.', orderId: result.insertedId.toHexString() };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, message: 'Failed to create order.' };
  }
}

export async function getOrders(filter: { customerId?: string; driverId?: string; status?: OrderStatus } = {}) {
  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection<Order>('orders');
    const query: any = {};

    if (filter.customerId) {
      query.customerId = filter.customerId;
    }
    if (filter.driverId) {
      query.driverId = filter.driverId;
    }
    if (filter.status) {
      query.status = filter.status;
    }

    const orders = await ordersCollection.find(query).sort({ createdAt: -1 }).toArray();

    // Optionally populate customer and driver details
    const customersCollection = db.collection<Customer>('customers');
    const driversCollection = db.collection<Driver>('drivers');

    const populatedOrders = await Promise.all(orders.map(async (order) => {
      const customer = await customersCollection.findOne({ id: order.customerId });
      const driver = order.driverId ? await driversCollection.findOne({ id: order.driverId }) : null;
      return {
        ...order,
        customerName: customer?.name || 'Unknown Customer',
        driverName: driver?.name || 'Unassigned',
        driverPhone: driver?.phone || 'N/A',
        driverVehicle: driver?.vehicle || 'N/A',
        driverRating: driver?.rating ? (driver.rating.sum / driver.rating.count).toFixed(1) : 'N/A',
      };
    }));

    return populatedOrders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function getOrderById(orderId: string) {
  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection<Order>('orders');
    const order = await ordersCollection.findOne({ id: orderId });

    if (!order) return null;

    // Optionally populate customer and driver details
    const customersCollection = db.collection<Customer>('customers');
    const driversCollection = db.collection<Driver>('drivers');

    const customer = await customersCollection.findOne({ id: order.customerId });
    const driver = order.driverId ? await driversCollection.findOne({ id: order.driverId }) : null;

    return {
      ...order,
      customerName: customer?.name || 'Unknown Customer',
      driverName: driver?.name || 'Unassigned',
      driverPhone: driver?.phone || 'N/A',
      driverVehicle: driver?.vehicle || 'N/A',
      driverRating: driver?.rating ? (driver.rating.sum / driver.rating.count).toFixed(1) : 'N/A',
    };
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return null;
  }
}

export async function updateOrder(updatedOrder: Partial<Order> & { id: string }) {
  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection<Order>('orders');

    const result = await ordersCollection.updateOne(
      { id: updatedOrder.id },
      { $set: { ...updatedOrder, updatedAt: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return { success: false, message: 'Order not found.' };
    }
    return { success: true, message: 'Order updated successfully.' };
  } catch (error) {
    console.error('Error updating order:', error);
    return { success: false, message: 'Failed to update order.' };
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection<Order>('orders');

    const result = await ordersCollection.updateOne(
      { id: orderId },
      { $set: { status: OrderStatus.Cancelled, updatedAt: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return { success: false, message: 'Order not found.' };
    }
    return { success: true, message: 'Order cancelled successfully.' };
  } catch (error) {
    console.error('Error cancelling order:', error);
    return { success: false, message: 'Failed to cancel order.' };
  }
}

export async function assignDriverToOrder(orderId: string, driverId: string) {
  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection<Order>('orders');

    const result = await ordersCollection.updateOne(
      { id: orderId },
      { $set: { driverId: driverId, status: OrderStatus.Assigned, updatedAt: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return { success: false, message: 'Order not found.' };
    }
    return { success: true, message: 'Driver assigned successfully.' };
  } catch (error) {
    console.error('Error assigning driver to order:', error);
    return { success: false, message: 'Failed to assign driver to order.' };
  }
}
