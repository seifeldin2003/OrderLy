import type { MenuCategory } from "../../types/menu";

const categories: Array<MenuCategory | "All"> = ["All", "Pizza", "Burgers", "Pasta", "Drinks", "Desserts"];

export function CategoryChips({ selected, onSelect }: { selected: MenuCategory | "All"; onSelect: (category: MenuCategory | "All") => void }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category}
          className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition ${selected === category ? "border-primary bg-primary text-white shadow-soft" : "border-outline bg-white text-muted hover:bg-primary-soft hover:text-primary"}`}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
