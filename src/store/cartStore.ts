import type { Cart, CartItem, CartSummary } from "../types/cart";
import type { MenuItem } from "../types/menu";

const CART_KEY = "cos.cart";
const DELIVERY_FEE = 3.5;

export function getCart(): Cart {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? (JSON.parse(raw) as Cart) : { items: [] };
}

export function saveCart(cart: Cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart:changed"));
}

export function clearCart() {
  saveCart({ items: [] });
}

export function addCartItem(menuItem: MenuItem, quantity = 1, specialInstructions = "") {
  const cart = getCart();
  const existing = cart.items.find((item) => item.menuItem.id === menuItem.id && item.specialInstructions === specialInstructions);
  const items = existing
    ? cart.items.map((item) => (item.id === existing.id ? { ...item, quantity: item.quantity + quantity } : item))
    : [...cart.items, { id: crypto.randomUUID(), menuItem, quantity, specialInstructions }];
  saveCart({ ...cart, items });
}

export function updateCartItem(id: string, quantity: number) {
  const cart = getCart();
  const items = quantity <= 0 ? cart.items.filter((item) => item.id !== id) : cart.items.map((item) => (item.id === id ? { ...item, quantity } : item));
  saveCart({ ...cart, items });
}

export function removeCartItem(id: string) {
  const cart = getCart();
  saveCart({ ...cart, items: cart.items.filter((item) => item.id !== id) });
}

export function applyPromoCode(promoCode: string) {
  saveCart({ ...getCart(), promoCode: promoCode.trim().toUpperCase() });
}

export function calculateCartSummary(items: CartItem[], promoCode?: string): CartSummary {
  const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const discount = promoCode === "SAVE10" ? subtotal * 0.1 : 0;
  const deliveryFee = items.length ? DELIVERY_FEE : 0;
  return { subtotal, discount, deliveryFee, total: subtotal - discount + deliveryFee };
}
