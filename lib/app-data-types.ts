export const OrderStatus = {
  Pending: 'Pending',
  Assigned: 'Assigned',
  PickedUp: 'Picked Up',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const VehicleType = {
  Motorcycle: 'Motorcycle',
  Car: 'Car',
  Van: 'Van',
  Truck: 'Truck',
} as const;

export type VehicleType = (typeof VehicleType)[keyof typeof VehicleType];

export const PaymentMethod = {
  CreditCard: 'Credit Card',
  PayPal: 'PayPal',
  Cash: 'Cash',
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const DeliveryType = {
  Standard: 'Standard',
  Express: 'Express',
  SameDay: 'Same Day',
} as const;

export type DeliveryType = (typeof DeliveryType)[keyof typeof DeliveryType];

export type Rating = {
  count: number;
  sum: number;
};

export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
};

export type Customer = User & {
  address: string;
};

export type Driver = User & {
  vehicle: VehicleType;
  rating: Rating;
};

export type Admin = User & {
  isActive: boolean;
};

export type Order = {
  id: string;
  customerId: string;
  pickupLocation: string;
  deliveryLocation: string;
  itemDescription: string;
  weight: number; // in kg
  dimensions: string; // e.g., "LxWxH cm"
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  price: number;
  status: OrderStatus;
  driverId: string | null;
  pickupTime: string | null; // ISO string
  deliveryTime: string | null; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};
