import { useEffect, useState } from "react";
import { EmptyState } from "../../components/common/EmptyState";
import { OrderCard } from "../../components/orders/OrderCard";
import { getCustomerOrders } from "../../services/orderService";
import type { Order } from "../../types/order";

export function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getCustomerOrders().then(setOrders);
  }, []);

  if (!orders.length) {
    return <EmptyState title="No orders yet" description="Your previous orders will show here after checkout." actionHref="/menu" actionLabel="Order food" />;
  }

  return (
    <div className="space-y-5">
      <div><h1 className="text-3xl font-extrabold">My Orders</h1><p className="text-muted">Track active orders and review previous purchases.</p></div>
      {orders.map((order) => <OrderCard key={order.id} order={order} />)}
    </div>
  );
}
