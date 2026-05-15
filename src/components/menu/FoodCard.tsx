import { Eye, Plus } from "lucide-react";
import type { MenuItem } from "../../types/menu";
import { formatCurrency } from "../../utils/currency";
import { Button } from "../common/Button";

export function FoodCard({ item, onAdd, onView }: { item: MenuItem; onAdd: (item: MenuItem) => void; onView: (item: MenuItem) => void }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
      <button className="block h-44 w-full overflow-hidden text-left" onClick={() => onView(item)}>
        <img className="h-full w-full object-cover transition duration-300 group-hover:scale-105" src={item.image} alt={item.name} />
      </button>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-primary">{item.category}</p>
            <h3 className="text-lg font-bold">{item.name}</h3>
          </div>
          <span className="font-extrabold text-primary">{formatCurrency(item.price)}</span>
        </div>
        <p className="line-clamp-2 min-h-12 text-sm text-muted">{item.description}</p>
        <div className="flex gap-2">
          <Button className="flex-1" disabled={!item.available || item.stock <= 0} onClick={() => onAdd(item)}>
            <Plus size={18} />
            Add
          </Button>
          <Button variant="secondary" onClick={() => onView(item)} aria-label={`View ${item.name}`}>
            <Eye size={18} />
          </Button>
        </div>
      </div>
    </article>
  );
}
