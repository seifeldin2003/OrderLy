import { useEffect, useState } from "react";
import { Toast } from "../../components/common/Toast";
import { CategoryChips } from "../../components/menu/CategoryChips";
import { FoodCard } from "../../components/menu/FoodCard";
import { FoodDetailsModal } from "../../components/menu/FoodDetailsModal";
import { MenuFilters } from "../../components/menu/MenuFilters";
import { addItemToCart } from "../../services/cartService";
import { getMenuItems } from "../../services/menuService";
import type { MenuCategory, MenuItem } from "../../types/menu";

export function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selected, setSelected] = useState<MenuCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [details, setDetails] = useState<MenuItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    getMenuItems({ category: selected, search }).then(setItems);
  }, [selected, search]);

  async function add(item: MenuItem, quantity = 1, instructions = "") {
    await addItemToCart(item, quantity, instructions);
    setDetails(null);
    setToast("Added to cart");
    setTimeout(() => setToast(null), 2200);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Browse Menu</h1>
        <p className="text-muted">Search, filter, view details, and add dishes to cart.</p>
      </div>
      <MenuFilters search={search} onSearch={setSearch} />
      <CategoryChips selected={selected} onSelect={setSelected} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => <FoodCard key={item.id} item={item} onAdd={(entry) => add(entry)} onView={setDetails} />)}
      </div>
      <FoodDetailsModal item={details} onClose={() => setDetails(null)} onAdd={add} />
      <Toast message={toast} />
    </div>
  );
}
