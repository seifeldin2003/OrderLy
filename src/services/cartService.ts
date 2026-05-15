import { apiClient } from "./apiClient";
import type { Cart } from "../types/cart";
import type { MenuItem } from "../types/menu";
import { mapMenuItem, type BackendMenuItem } from "./menuService";

interface BackendCartItem {
  id: number;
  cart_id: number;
  menu_item_id: number;
  quantity: number;
  special_instructions?: string | null;
  menu_item?: BackendMenuItem | null;
}

interface BackendCart {
  id: number;
  user_id: number;
  items: BackendCartItem[];
}

const PROMO_KEY = "cos.promo";

function mapCart(response: BackendCart): Cart {
  return {
    promoCode: localStorage.getItem(PROMO_KEY) || undefined,
    items: response.items
      .filter((item) => item.menu_item)
      .map((item) => ({
        id: String(item.id),
        menuItem: mapMenuItem(item.menu_item!),
        quantity: item.quantity,
        specialInstructions: item.special_instructions ?? undefined,
      })),
  };
}

export async function fetchCart(): Promise<Cart> {
  return mapCart(await apiClient.get<BackendCart>("/api/cart"));
}

export async function addItemToCart(menuItem: MenuItem, quantity: number, specialInstructions?: string): Promise<Cart> {
  return mapCart(
    await apiClient.post<BackendCart>("/api/cart/items", {
      menu_item_id: Number(menuItem.id),
      quantity,
      special_instructions: specialInstructions || undefined,
    }),
  );
}

export async function updateCartQuantity(id: string, quantity: number): Promise<Cart> {
  return mapCart(await apiClient.put<BackendCart>(`/api/cart/items/${id}`, { quantity }));
}

export async function deleteCartItem(id: string): Promise<Cart> {
  return mapCart(await apiClient.delete<BackendCart>(`/api/cart/items/${id}`));
}

export async function setPromoCode(code: string): Promise<Cart> {
  localStorage.setItem(PROMO_KEY, code.trim().toUpperCase());
  return fetchCart();
}
