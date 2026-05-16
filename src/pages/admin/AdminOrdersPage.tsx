import { useEffect, useState } from "react";
import { AdminOrderTable } from "../../components/admin/AdminOrderTable";
import { EmptyState } from "../../components/common/EmptyState";
import { Toast } from "../../components/common/Toast";
import { getAdminOrders, updateAdminOrderStatus } from "../../services/adminService";
import type { Order, OrderStatus } from "../../types/order";

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  async function refresh() {
    setOrders(await getAdminOrders());
  }

  useEffect(() => {
    refresh();
  }, []);

  if (!orders.length) {
    return <EmptyState title="No orders yet" description="Customer orders will appear here once checkout is used." />;
  }

  return (
    <div className="space-y-6">
      <header><h1 className="text-3xl font-extrabold">Order Management</h1><p className="text-muted">Review orders and update fulfillment status.</p></header>
      <AdminOrderTable
        orders={orders}
        onStatusChange={async (id: string, status: OrderStatus) => {
          await updateAdminOrderStatus(id, status);
          await refresh();
          setToast("Order status updated");
          setTimeout(() => setToast(null), 2200);
        }}
      />
      <Toast message={toast} />
    </div>
  );
}
