import type { Order, OrderStatus } from "../../types/order";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/date";
import { ORDER_STATUSES } from "../../utils/orderStatus";
import { StatusBadge } from "../common/StatusBadge";

export function AdminOrderTable({ orders, onStatusChange }: { orders: Order[]; onStatusChange: (id: string, status: OrderStatus) => void }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-soft">
      <table className="w-full min-w-[760px] text-left">
        <thead className="bg-surface-low text-sm text-muted">
          <tr>
            <th className="p-4">Order #</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Date</th>
            <th className="p-4">Status</th>
            <th className="p-4">Total</th>
            <th className="p-4">Update</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline/50">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="p-4 font-bold">{order.orderNumber}</td>
              <td className="p-4">{order.customerName}</td>
              <td className="p-4 text-sm text-muted">{formatDate(order.createdAt)}</td>
              <td className="p-4"><StatusBadge status={order.status} /></td>
              <td className="p-4 font-bold">{formatCurrency(order.total)}</td>
              <td className="p-4">
                <select className="rounded-xl border border-outline bg-white px-3 py-2" value={order.status} onChange={(event) => onStatusChange(order.id, event.target.value as OrderStatus)}>
                  {[...ORDER_STATUSES, "Cancelled" as OrderStatus].map((status) => <option key={status}>{status}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
