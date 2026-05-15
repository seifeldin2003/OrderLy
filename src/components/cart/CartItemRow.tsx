import { Trash2 } from "lucide-react";
import type { CartItem } from "../../types/cart";
import { formatCurrency } from "../../utils/currency";

export function CartItemRow({ item, onQuantity, onRemove }: { item: CartItem; onQuantity: (id: string, quantity: number) => void; onRemove: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-soft sm:flex-row sm:items-center">
      <img className="h-24 w-full rounded-xl object-cover sm:w-28" src={item.menuItem.image} alt={item.menuItem.name} />
      <div className="flex-1">
        <h3 className="font-bold">{item.menuItem.name}</h3>
        <p className="text-sm text-muted">{item.specialInstructions || item.menuItem.description}</p>
        <p className="mt-2 font-bold text-primary">{formatCurrency(item.menuItem.price)}</p>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center rounded-full bg-surface-container">
          <button className="h-10 w-10 font-bold" onClick={() => onQuantity(item.id, item.quantity - 1)}>
            -
          </button>
          <span className="w-8 text-center font-bold">{item.quantity}</span>
          <button className="h-10 w-10 font-bold" onClick={() => onQuantity(item.id, item.quantity + 1)}>
            +
          </button>
        </div>
        <button className="rounded-full p-2 text-danger hover:bg-red-50" onClick={() => onRemove(item.id)} aria-label="Remove item">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
