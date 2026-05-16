import type { LucideIcon } from "lucide-react";

export function DashboardStatCard({ label, value, icon: Icon, hint }: { label: string; value: string | number; icon: LucideIcon; hint?: string }) {
  return (
    <article className="rounded-2xl border border-outline/40 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <p className="text-sm font-bold text-muted">{label}</p>
        <div className="rounded-full bg-primary-soft p-2 text-primary">
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-4 text-3xl font-extrabold">{value}</div>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </article>
  );
}
