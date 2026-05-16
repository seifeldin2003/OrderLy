import { Edit3, Trash2 } from "lucide-react";
import type { MenuItem } from "../../types/menu";
import { formatCurrency } from "../../utils/currency";

export function AdminMenuTable({ items, onEdit, onDelete, onToggle }: { items: MenuItem[]; onEdit: (item: MenuItem) => void; onDelete: (id: string) => void; onToggle: (item: MenuItem) => void }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-soft">
      <table className="w-full min-w-[780px] text-left">
        <thead className="bg-surface-low text-sm text-muted">
          <tr>
            <th className="p-4">Item</th>
            <th className="p-4">Category</th>
            <th className="p-4">Price</th>
            <th className="p-4">Stock</th>
            <th className="p-4">Available</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline/50">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="p-4"><div className="font-bold">{item.name}</div><div className="max-w-sm truncate text-sm text-muted">{item.description}</div></td>
              <td className="p-4">{item.category}</td>
              <td className="p-4 font-bold">{formatCurrency(item.price)}</td>
              <td className="p-4">{item.stock}</td>
              <td className="p-4">
                <button className={`rounded-full px-3 py-1 text-xs font-bold ${item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`} onClick={() => onToggle(item)}>
                  {item.available ? "Available" : "Hidden"}
                </button>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button className="rounded-full p-2 text-primary hover:bg-primary-soft" onClick={() => onEdit(item)} aria-label="Edit item"><Edit3 size={18} /></button>
                  <button className="rounded-full p-2 text-danger hover:bg-red-50" onClick={() => onDelete(item.id)} aria-label="Delete item"><Trash2 size={18} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
