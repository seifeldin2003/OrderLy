import type { Order, OrderStatus } from "../types/order";

const ORDERS_KEY = "cos.orders";

export function getOrders(): Order[] {
  const raw = localStorage.getItem(ORDERS_KEY);
  return raw ? (JSON.parse(raw) as Order[]) : [];
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("orders:changed"));
}

export function saveOrder(order: Order) {
  saveOrders([order, ...getOrders()]);
}

export function getOrderById(id: string) {
  return getOrders().find((order) => order.id === id);
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  saveOrders(getOrders().map((order) => (order.id === id ? { ...order, status } : order)));
}
