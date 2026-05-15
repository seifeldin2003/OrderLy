import { apiClient } from "./apiClient";
import type { MenuFilters, MenuItem } from "../types/menu";

export interface BackendMenuItem {
  id: number;
  name: string;
  category: MenuItem["category"];
  description: string;
  price: number;
  image_url?: string | null;
  stock: number;
  available: boolean;
}

export function mapMenuItem(item: BackendMenuItem): MenuItem {
  return {
    id: String(item.id),
    name: item.name,
    category: item.category,
    description: item.description,
    price: item.price,
    image: item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
    stock: item.stock,
    available: item.available,
  };
}

export function toBackendMenuItem(item: MenuItem) {
  return {
    name: item.name,
    category: item.category,
    description: item.description,
    price: item.price,
    image_url: item.image,
    stock: item.stock,
    available: item.available,
  };
}

export async function getMenuItems(filters?: MenuFilters): Promise<MenuItem[]> {
  const response = await apiClient.get<BackendMenuItem[]>("/api/menu/items", {
    params: {
      category: filters?.category === "All" ? undefined : filters?.category,
      search: filters?.search || undefined,
      available: true,
    },
  });
  return response.map(mapMenuItem);
}

export async function getMenuItem(id: string): Promise<MenuItem | undefined> {
  const response = await apiClient.get<BackendMenuItem>(`/api/menu/items/${id}`);
  return mapMenuItem(response);
}
