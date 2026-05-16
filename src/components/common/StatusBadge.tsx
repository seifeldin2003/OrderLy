import type { OrderStatus } from "../../types/order";
import { statusTone } from "../../utils/orderStatus";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase ${statusTone(status)}`}>{status}</span>;
}
