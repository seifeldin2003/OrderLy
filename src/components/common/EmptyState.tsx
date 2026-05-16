import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./Button";

export function EmptyState({ title, description, actionHref, actionLabel }: { title: string; description: string; actionHref?: string; actionLabel?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-outline bg-white p-10 text-center shadow-soft">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
        <ShoppingBag />
      </div>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-muted">{description}</p>
      {actionHref && actionLabel && (
        <Link to={actionHref} className="mt-5 inline-flex">
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
