import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItemRow } from "../../components/cart/CartItemRow";
import { OrderSummaryCard } from "../../components/cart/OrderSummaryCard";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { Input } from "../../components/common/Input";
import { Toast } from "../../components/common/Toast";
import { deleteCartItem, fetchCart, setPromoCode, updateCartQuantity } from "../../services/cartService";
import { calculateCartSummary } from "../../store/cartStore";
import type { Cart } from "../../types/cart";

export function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [promo, setPromo] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const summary = calculateCartSummary(cart.items, cart.promoCode);

  async function refresh() {
    setCart(await fetchCart());
  }

  useEffect(() => {
    refresh();
  }, []);

  if (!cart.items.length) {
    return <EmptyState title="Your cart is empty" description="Add a few dishes from the menu and they will appear here." actionHref="/menu" actionLabel="Browse menu" />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        <h1 className="text-3xl font-extrabold">Your Cart</h1>
        {cart.items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            onQuantity={async (id, quantity) => {
              await updateCartQuantity(id, quantity);
              refresh();
            }}
            onRemove={async (id) => {
              await deleteCartItem(id);
              await refresh();
              setToast("Removed from cart");
              setTimeout(() => setToast(null), 2200);
            }}
          />
        ))}
      </section>
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-5 shadow-soft">
          <Input label="Promo code" placeholder="SAVE10" value={promo} onChange={(event) => setPromo(event.target.value)} />
          <Button className="mt-3 w-full" variant="secondary" onClick={async () => { await setPromoCode(promo); refresh(); }}>
            Apply promo
          </Button>
        </div>
        <OrderSummaryCard summary={summary} actionLabel="Checkout" onAction={() => navigate("/checkout")} />
      </div>
      <Toast message={toast} />
    </div>
  );
}
