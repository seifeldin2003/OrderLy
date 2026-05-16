import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { OrderSummaryCard } from "../../components/cart/OrderSummaryCard";
import { EmptyState } from "../../components/common/EmptyState";
import { Input } from "../../components/common/Input";
import { Toast } from "../../components/common/Toast";
import { fetchCart } from "../../services/cartService";
import { createOrder } from "../../services/orderService";
import { calculateCartSummary } from "../../store/cartStore";
import { getCurrentUser } from "../../store/authStore";
import type { Cart } from "../../types/cart";
import type { PaymentMethod } from "../../types/order";

export function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({ deliveryAddress: "", phone: "", paymentMethod: "Cash on Delivery" as PaymentMethod });
  const summary = calculateCartSummary(cart.items, cart.promoCode);

  useEffect(() => {
    fetchCart().then(setCart);
  }, []);

  async function placeOrder(event: FormEvent) {
    event.preventDefault();
    const user = getCurrentUser();
    if (!user) return navigate("/login");
    const order = await createOrder({ user, items: cart.items, summary, ...form });
    setToast("Order placed");
    setTimeout(() => navigate(`/order-success/${order.id}`), 500);
  }

  if (!cart.items.length) {
    return <EmptyState title="Checkout needs items" description="Your cart is empty. Add meals before placing an order." actionHref="/menu" actionLabel="Browse menu" />;
  }

  return (
    <form className="grid gap-6 lg:grid-cols-[1fr_360px]" onSubmit={placeOrder}>
      <section className="rounded-2xl bg-white p-5 shadow-soft">
        <h1 className="text-3xl font-extrabold">Checkout</h1>
        <div className="mt-5 space-y-4">
          <Input label="Delivery address" value={form.deliveryAddress} onChange={(event) => setForm({ ...form, deliveryAddress: event.target.value })} required />
          <Input label="Phone number" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-muted">Payment method</span>
            <select className="focus-ring w-full rounded-xl border border-outline bg-white px-4 py-3" value={form.paymentMethod} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value as PaymentMethod })}>
              <option>Cash on Delivery</option>
              <option>Card</option>
              <option>Wallet</option>
            </select>
          </label>
        </div>
      </section>
      <OrderSummaryCard summary={summary} actionLabel="Place Order" />
      <Toast message={toast} />
    </form>
  );
}
