import { useState } from "react";
import type { MenuCategory, MenuItem } from "../../types/menu";
import { Button } from "../common/Button";
import { Input } from "../common/Input";

const categories: MenuCategory[] = ["Pizza", "Burgers", "Pasta", "Drinks", "Desserts"];

const emptyItem: MenuItem = {
  id: "",
  name: "",
  category: "Pizza",
  description: "",
  price: 0,
  image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
  stock: 0,
  available: true,
};

export function MenuItemForm({ item, onSubmit }: { item?: MenuItem; onSubmit: (item: MenuItem) => void }) {
  const [form, setForm] = useState<MenuItem>(item ?? emptyItem);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <Input label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-muted">Category</span>
        <select className="focus-ring w-full rounded-xl border border-outline bg-white px-4 py-3" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as MenuCategory })}>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
      </label>
      <textarea className="focus-ring min-h-24 w-full rounded-xl border border-outline p-3" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
      <div className="grid gap-3 md:grid-cols-2">
        <Input label="Price" type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} required />
        <Input label="Stock" type="number" min="0" value={form.stock} onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })} required />
      </div>
      <Input label="Image URL" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} required />
      <label className="flex items-center gap-2 text-sm font-semibold text-muted">
        <input type="checkbox" checked={form.available} onChange={(event) => setForm({ ...form, available: event.target.checked })} />
        Available
      </label>
      <Button className="w-full">Save item</Button>
    </form>
  );
}
