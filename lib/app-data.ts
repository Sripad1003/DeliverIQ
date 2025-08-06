import {
  createCustomer as createCustomerAction,
  verifyCustomerCredentials,
  getCustomerById,
  createDriver as createDriverAction,
  verifyDriverCredentials,
  getDriverById,
  updateDriverRating as updateDriverRatingAction,
} from '@/actions/user-actions';
import {
  createOrder as createOrderAction,
  getOrders as fetchOrders,
  getOrderById as fetchOrderById,
  updateOrder as updateOrderAction,
  cancelOrder as cancelOrderAction,
  assignDriverToOrder as assignDriverToOrderAction,
} from '@/actions/order-actions';
import { Admin, Customer, Driver, Order, OrderStatus, VehicleType, PaymentMethod, DeliveryType, Rating } from './app-data-types'; // Assuming types are in a separate file now

// Re-export types from a dedicated types file if you create one
export { Admin, Customer, Driver, Order, OrderStatus, VehicleType, PaymentMethod, DeliveryType, Rating };

// --- User (Customer/Driver) Management ---

export async function registerCustomer(customer: Omit<Customer, 'id'>): Promise<{ success: boolean; message: string; customerId?: string }> {
  return await createCustomerAction(customer);
}

export async function loginCustomer(email: string, password: string): Promise<{ success: boolean; message: string; customerId?: string }> {
  const result = await verifyCustomerCredentials(email, password);
  if (result.success) {
    return { success: true, message: 'Login successful!', customerId: result.customerId };
  }
  return { success: false, message: result.message || 'Login failed.' };
}

export async function getCustomerSession(customerId: string): Promise<Customer | null> {
  return await getCustomerById(customerId);
}

export async function registerDriver(driver: Omit<Driver, 'id' | 'rating'>): Promise<{ success: boolean; message: string; driverId?: string }> {
  return await createDriverAction(driver);
}

export async function loginDriver(email: string, password: string): Promise<{ success: boolean; message: string; driverId?: string }> {
  const result = await verifyDriverCredentials(email, password);
  if (result.success) {
    return { success: true, message: 'Login successful!', driverId: result.driverId };
  }
  return { success: false, message: result.message || 'Login failed.' };
}

export async function getDriverSession(driverId: string): Promise<Driver | null> {
  return await getDriverById(driverId);
}

export async function updateDriverRating(driverId: string, rating: number): Promise<boolean> {
  const result = await updateDriverRatingAction(driverId, rating);
  return result.success;
}

// --- Order Management ---

export async function createNewOrder(order: Omit<Order, 'id' | 'status' | 'driverId' | 'pickupTime' | 'deliveryTime'>): Promise<{ success: boolean; message: string; orderId?: string }> {
  return await createOrderAction(order);
}

export async function getAllOrders(): Promise<Order[]> {
  return await fetchOrders();
}

export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  return await fetchOrders({ customerId });
}

export async function getDriverOrders(driverId: string): Promise<Order[]> {
  return await fetchOrders({ driverId });
}

export async function getOrderDetails(orderId: string): Promise<Order | null> {
  return await fetchOrderById(orderId);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  const result = await updateOrderAction({ id: orderId, status });
  return result.success;
}

export async function updateOrderDriver(orderId: string, driverId: string): Promise<boolean> {
  const result = await assignDriverToOrderAction(orderId, driverId);
  return result.success;
}

export async function updateOrderPickupTime(orderId: string, time: string): Promise<boolean> {
  const result = await updateOrderAction({ id: orderId, pickupTime: time });
  return result.success;
}

export async function updateOrderDeliveryTime(orderId: string, time: string): Promise<boolean> {
  const result = await updateOrderAction({ id: orderId, deliveryTime: time });
  return result.success;
}

export async function cancelOrder(orderId: string): Promise<boolean> {
  const result = await cancelOrderAction(orderId);
  return result.success;
}

// --- Demo Data (for seeding, not direct app use after migration) ---
// These are kept here for the initial seedDatabase action.
export const demoAdmins: Omit<Admin, 'id'>[] = [
  { email: 'admin@deliveriq.com', password: 'admin123', name: 'Admin User', isActive: true },
];

export const demoCustomers: Omit<Customer, 'id'>[] = [
  { email: 'customer1@example.com', password: 'password123', name: 'Alice Smith', phone: '555-1111', address: '123 Main St' },
  { email: 'customer2@example.com', password: 'password123', name: 'Bob Johnson', phone: '555-2222', address: '456 Oak Ave' },
];

export const demoDrivers: Omit<Driver, 'id' | 'rating'>[] = [
  { email: 'driver1@example.com', password: 'password123', name: 'Charlie Brown', phone: '555-3333', vehicle: 'Motorcycle' },
  { email: 'driver2@example.com', password: 'password123', name: 'Diana Prince', phone: '555-4444', vehicle: 'Van' },
];

export const demoOrders: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    customerId: 'customer1_id_placeholder', // Will be replaced by actual MongoDB IDs during seeding
    pickupLocation: '123 Main St, Anytown',
    deliveryLocation: '789 Pine Ln, Anytown',
    itemDescription: 'Documents',
    weight: 0.5,
    dimensions: '10x10x5 cm',
    deliveryType: DeliveryType.Standard,
    paymentMethod: PaymentMethod.CreditCard,
    price: 15.00,
    status: OrderStatus.Pending,
    driverId: null,
    pickupTime: null,
    deliveryTime: null,
  },
  {
    customerId: 'customer2_id_placeholder',
    pickupLocation: '456 Oak Ave, Anytown',
    deliveryLocation: '101 Elm St, Anytown',
    itemDescription: 'Electronics',
    weight: 2.0,
    dimensions: '20x15x10 cm',
    deliveryType: DeliveryType.Express,
    paymentMethod: PaymentMethod.PayPal,
    price: 30.00,
    status: OrderStatus.Assigned,
    driverId: 'driver1_id_placeholder',
    pickupTime: '2024-08-07T10:00:00Z',
    deliveryTime: null,
  },
];
