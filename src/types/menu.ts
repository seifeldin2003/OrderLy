export type MenuCategory = "Pizza" | "Burgers" | "Pasta" | "Drinks" | "Desserts";

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  price: number;
  image: string;
  stock: number;
  available: boolean;
}

export interface MenuFilters {
  category?: MenuCategory | "All";
  search?: string;
}
