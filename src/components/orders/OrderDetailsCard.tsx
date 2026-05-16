import type { Order } from "../../types/order";
import { formatCurrency } from "../../utils/currency";
import { StatusBadge } from "../common/StatusBadge";

export function OrderDetailsCard({ order }: { order: Order }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">{order.orderNumber}</h1>
          <p className="text-muted">Estimated delivery: {order.estimatedMinutes} minutes</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="mt-5 divide-y divide-outline/50">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between py-3">
            <span>{item.quantity}x {item.menuItem.name}</span>
            <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 text-sm text-muted md:grid-cols-3">
        <p><strong className="text-ink">Address:</strong> {order.deliveryAddress}</p>
        <p><strong className="text-ink">Payment:</strong> {order.paymentMethod}</p>
        <p><strong className="text-ink">Total:</strong> {formatCurrency(order.total)}</p>
      </div>
    </section>
  );
}
