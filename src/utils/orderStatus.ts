import type { OrderStatus } from "../types/order";

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Delivered",
];

export function canCancelOrder(status: OrderStatus) {
  return status === "Pending" || status === "Confirmed";
}

export function statusTone(status: OrderStatus) {
  return {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    Preparing: "bg-orange-100 text-orange-800 border-orange-200",
    Ready: "bg-purple-100 text-purple-800 border-purple-200",
    "Out for Delivery": "bg-indigo-100 text-indigo-800 border-indigo-200",
    Delivered: "bg-green-100 text-green-800 border-green-200",
    Cancelled: "bg-red-100 text-red-800 border-red-200",
  }[status];
}
