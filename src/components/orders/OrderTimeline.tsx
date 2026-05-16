import { Check } from "lucide-react";
import type { OrderStatus } from "../../types/order";
import { ORDER_STATUSES } from "../../utils/orderStatus";

export function OrderTimeline({ status }: { status: OrderStatus }) {
  const activeIndex = ORDER_STATUSES.indexOf(status);
  return (
    <div className="space-y-4">
      {ORDER_STATUSES.map((step, index) => {
        const isDone = status === "Cancelled" ? false : index <= activeIndex;
        return (
          <div key={step} className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${isDone ? "bg-primary text-white" : "bg-surface-container text-muted"}`}>
              {isDone ? <Check size={18} /> : index + 1}
            </div>
            <span className={`font-semibold ${isDone ? "text-ink" : "text-muted"}`}>{step}</span>
          </div>
        );
      })}
    </div>
  );
}
