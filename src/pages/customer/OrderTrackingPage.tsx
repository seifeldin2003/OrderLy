import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { Toast } from "../../components/common/Toast";
import { OrderDetailsCard } from "../../components/orders/OrderDetailsCard";
import { OrderTimeline } from "../../components/orders/OrderTimeline";
import { cancelOrder, getOrder } from "../../services/orderService";
import type { Order } from "../../types/order";
import { canCancelOrder } from "../../utils/orderStatus";

export function OrderTrackingPage() {
  const { orderId = "" } = useParams();
  const [order, setOrder] = useState<Order>();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    getOrder(orderId).then(setOrder);
  }, [orderId]);

  if (!order) return <EmptyState title="Order not found" description="We could not find this order in local demo storage." actionHref="/orders" actionLabel="View orders" />;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <OrderDetailsCard order={order} />
        {canCancelOrder(order.status) && (
          <Button
            variant="danger"
            onClick={async () => {
              await cancelOrder(order.id);
              setOrder({ ...order, status: "Cancelled" });
              setToast("Order cancelled");
              setTimeout(() => setToast(null), 2200);
            }}
          >
            Cancel order
          </Button>
        )}
      </div>
      <aside className="rounded-2xl bg-white p-5 shadow-soft">
        <h2 className="mb-5 text-xl font-bold">Order status</h2>
        <OrderTimeline status={order.status} />
      </aside>
      <Toast message={toast} />
    </div>
  );
}
