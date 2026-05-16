import { apiClient } from "./apiClient";
import type { AdminDashboardStats } from "../types/admin";
import type { MenuItem } from "../types/menu";
import type { Order, OrderStatus } from "../types/order";
import { mapMenuItem, toBackendMenuItem, type BackendMenuItem } from "./menuService";
import { fromBackendStatus, toBackendStatus } from "./orderService";

interface BackendDashboard {
  total_orders: number;
  pending_orders: number;
  revenue: number;
  available_menu_items: number;
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
  items: Array<{
    id: number;
    menu_item_id: number;
    item_name_snapshot: string;
    item_price_snapshot: number;
    quantity: number;
    special_instructions?: string | null;
  }>;
}

function mapDashboard(stats: BackendDashboard): AdminDashboardStats {
  return {
    totalOrders: stats.total_orders,
    pendingOrders: stats.pending_orders,
    revenue: stats.revenue,
    availableMenuItems: stats.available_menu_items,
  };
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
    paymentMethod: order.payment_method === "CashOnDelivery" ? "Cash on Delivery" : (order.payment_method as Order["paymentMethod"]),
    subtotal: order.subtotal,
    discount: order.discount,
    deliveryFee: order.delivery_fee,
    total: order.total,
    createdAt: order.created_at,
    estimatedMinutes: 45,
    items: order.items.map((item) => ({
      id: String(item.id),
      menuItem: {
        id: String(item.menu_item_id),
        name: item.item_name_snapshot,
        category: "Pizza",
        description: item.special_instructions || "Ordered item",
        price: item.item_price_snapshot,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
        stock: 0,
        available: true,
      },
      quantity: item.quantity,
      price: item.item_price_snapshot,
      specialInstructions: item.special_instructions ?? undefined,
    })),
  };
}

export async function getAdminDashboard(): Promise<AdminDashboardStats> {
  return mapDashboard(await apiClient.get<BackendDashboard>("/api/admin/dashboard"));
}

export async function getAdminOrders(): Promise<Order[]> {
  return (await apiClient.get<BackendOrder[]>("/api/admin/orders")).map(mapOrder);
}

export async function updateAdminOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await apiClient.put<BackendOrder>(`/api/admin/orders/${id}/status`, { status: toBackendStatus(status) });
}

export async function getAdminMenu(): Promise<MenuItem[]> {
  return (await apiClient.get<BackendMenuItem[]>("/api/admin/menu")).map(mapMenuItem);
}

export async function saveAdminMenuItem(item: MenuItem): Promise<MenuItem> {
  const payload = toBackendMenuItem(item);
  const response = item.id
    ? await apiClient.put<BackendMenuItem>(`/api/admin/menu/${item.id}`, payload)
    : await apiClient.post<BackendMenuItem>("/api/admin/menu", payload);
  return mapMenuItem(response);
}

export async function deleteAdminMenuItem(id: string): Promise<void> {
  await apiClient.delete<BackendMenuItem>(`/api/admin/menu/${id}`);
}
