import { useState } from "react";
import type { MenuItem } from "../../types/menu";
import { formatCurrency } from "../../utils/currency";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";

export function FoodDetailsModal({ item, onClose, onAdd }: { item: MenuItem | null; onClose: () => void; onAdd: (item: MenuItem, quantity: number, instructions: string) => void }) {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");

  return (
    <Modal open={Boolean(item)} title={item?.name ?? "Food details"} onClose={onClose}>
      {item && (
        <div className="grid gap-5 md:grid-cols-[1fr_1.1fr]">
          <img className="h-64 w-full rounded-2xl object-cover" src={item.image} alt={item.name} />
          <div className="space-y-4">
            <p className="text-sm font-bold uppercase text-primary">{item.category}</p>
            <p className="text-muted">{item.description}</p>
            <p className="text-2xl font-extrabold text-primary">{formatCurrency(item.price)}</p>
            <div className="flex items-center gap-3">
              <button className="h-10 w-10 rounded-full bg-surface-container font-bold" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                -
              </button>
              <span className="w-8 text-center text-lg font-bold">{quantity}</span>
              <button className="h-10 w-10 rounded-full bg-surface-container font-bold" onClick={() => setQuantity(quantity + 1)}>
                +
              </button>
            </div>
            <textarea
              className="focus-ring min-h-28 w-full rounded-xl border border-outline p-3"
              placeholder="Special instructions"
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
            />
            <Button
              className="w-full"
              onClick={() => {
                onAdd(item, quantity, instructions);
                setQuantity(1);
                setInstructions("");
              }}
            >
              Add {quantity} to cart
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
