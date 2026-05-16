import { apiClient } from "./apiClient";
import type { CartItem, CartSummary } from "../types/cart";
import type { Order, OrderStatus, PaymentMethod } from "../types/order";
import type { User } from "../types/auth";
import { mapMenuItem, type BackendMenuItem } from "./menuService";

interface CheckoutPayload {
  user: User;
  items: CartItem[];
  summary: CartSummary;
  deliveryAddress: string;
  phone: string;
  paymentMethod: PaymentMethod;
}

interface BackendOrderItem {
  id: number;
  menu_item_id: number;
  item_name_snapshot: string;
  item_price_snapshot: number;
  quantity: number;
  special_instructions?: string | null;
  line_total: number;
}

interface BackendOrder {
  id: number;
  user_id: number;
  order_number: string;
  customer_name?: string | null;
  status: string;
  subtotal: number;
  discount: number;
  delivery_fee: number;
  total: number;
  delivery_address: string;
  phone: string;
  payment_method: string;
  created_at: string;
  items: BackendOrderItem[];
}

function toBackendPayment(method: PaymentMethod): string {
  return method === "Cash on Delivery" ? "CashOnDelivery" : method;
}

function fromBackendPayment(method: string): PaymentMethod {
  return method === "CashOnDelivery" ? "Cash on Delivery" : (method as PaymentMethod);
}

export function toBackendStatus(status: OrderStatus): string {
  return status === "Out for Delivery" ? "OutForDelivery" : status;
}

export function fromBackendStatus(status: string): OrderStatus {
  return status === "OutForDelivery" ? "Out for Delivery" : (status as OrderStatus);
}

function mapOrder(order: BackendOrder): Order {
  return {
    id: String(order.id),
    orderNumber: order.order_number,
    customerName: order.customer_name ?? "Customer",
    customerId: String(order.user_id),
    status: fromBackendStatus(order.status),
    deliveryAddress: order.delivery_address,
    phone: order.phone,
    paymentMethod: fromBackendPayment(order.payment_method),
    subtotal: order.subtotal,
    discount: order.discount,
    deliveryFee: order.delivery_fee,
    total: order.total,
    createdAt: order.created_at,
    estimatedMinutes: 45,
    items: order.items.map((item) => ({
      id: String(item.id),
      menuItem: mapMenuItem({
        id: item.menu_item_id,
        name: item.item_name_snapshot,
        category: "Pizza",
        description: item.special_instructions || "Ordered item",
        price: item.item_price_snapshot,
        image_url: null,
        stock: 0,
        available: true,
      } satisfies BackendMenuItem),
      quantity: item.quantity,
      price: item.item_price_snapshot,
      specialInstructions: item.special_instructions ?? undefined,
    })),
  };
}

export async function createOrder(payload: CheckoutPayload): Promise<Order> {
  const promoCode = localStorage.getItem("cos.promo") || undefined;
  const response = await apiClient.post<BackendOrder>("/api/orders", {
    delivery_address: payload.deliveryAddress,
    phone: payload.phone,
    payment_method: toBackendPayment(payload.paymentMethod),
    promo_code: promoCode,
  });
  localStorage.removeItem("cos.promo");
  return mapOrder(response);
}

export async function getCustomerOrders(): Promise<Order[]> {
  const response = await apiClient.get<BackendOrder[]>("/api/orders");
  return response.map(mapOrder);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  return mapOrder(await apiClient.get<BackendOrder>(`/api/orders/${id}`));
}

export async function cancelOrder(id: string): Promise<void> {
  await apiClient.put<BackendOrder>(`/api/orders/${id}/cancel`);
}
