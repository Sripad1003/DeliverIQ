// This file contains types specific to application data (customers, drivers, orders).

export interface CustomerType {
  _id?: string; // MongoDB ObjectId
  email: string;
  passwordHash: string;
  name: string;
}

export interface DriverType {
  _id?: string; // MongoDB ObjectId
  email: string;
  passwordHash: string;
  name: string;
  vehicleType: string;
  licensePlate: string;
  averageRating: number;
  totalRatings: number;
}

export const OrderStatus = {
  Pending: "Pending",
  InProgress: "In Progress",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface OrderType {
  _id?: string; // MongoDB ObjectId
  customerId: string;
  driverId?: string; // Optional, assigned when order is taken
  pickupLocation: string;
  deliveryLocation: string;
  itemDescription: string;
  status: OrderStatus;
  orderDate: string; // ISO string
  pickupDate?: string; // ISO string
  deliveryDate?: string; // ISO string
  driverRating?: number; // 1-5 stars
  driverFeedback?: string;
}
