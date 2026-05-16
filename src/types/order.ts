import type { MenuItem } from "./menu";

export type OrderStatus = "Pending" | "Confirmed" | "Preparing" | "Ready" | "Out for Delivery" | "Delivered" | "Cancelled";
export type PaymentMethod = "Cash on Delivery" | "Card" | "Wallet";

export interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  deliveryAddress: string;
  phone: string;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  estimatedMinutes: number;
}
