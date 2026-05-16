import { Link } from "react-router-dom";
import type { Order } from "../../types/order";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/date";
import { Button } from "../common/Button";
import { StatusBadge } from "../common/StatusBadge";

export function OrderCard({ order }: { order: Order }) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-soft">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold">{order.orderNumber}</h3>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-muted">{formatDate(order.createdAt)} - {order.items.length} items</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg font-extrabold text-primary">{formatCurrency(order.total)}</span>
          <Link to={`/orders/${order.id}`}>
            <Button variant="secondary">View details</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
