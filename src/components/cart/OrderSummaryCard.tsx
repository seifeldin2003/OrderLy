import type { CartSummary } from "../../types/cart";
import { formatCurrency } from "../../utils/currency";
import { Button } from "../common/Button";

export function OrderSummaryCard({ summary, actionLabel, onAction }: { summary: CartSummary; actionLabel?: string; onAction?: () => void }) {
  return (
    <aside className="rounded-2xl bg-white p-5 shadow-soft">
      <h2 className="text-xl font-bold">Order Summary</h2>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between text-muted"><span>Subtotal</span><span>{formatCurrency(summary.subtotal)}</span></div>
        <div className="flex justify-between text-green-700"><span>Discount</span><span>-{formatCurrency(summary.discount)}</span></div>
        <div className="flex justify-between text-muted"><span>Delivery fee</span><span>{formatCurrency(summary.deliveryFee)}</span></div>
        <div className="border-t border-outline/60 pt-3 text-lg font-extrabold">
          <div className="flex justify-between"><span>Total</span><span className="text-primary">{formatCurrency(summary.total)}</span></div>
        </div>
      </div>
      {actionLabel && <Button className="mt-5 w-full" onClick={onAction}>{actionLabel}</Button>}
    </aside>
  );
}
