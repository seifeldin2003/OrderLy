import { ArrowRight, Clock, Search, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { mockMenuItems } from "../../services/mockData";
import { formatCurrency } from "../../utils/currency";

export function HomePage() {
  return (
    <div className="space-y-10">
      <section className="relative min-h-[390px] overflow-hidden rounded-2xl bg-ink p-6 text-white shadow-lift md:p-12">
        <img className="absolute inset-0 h-full w-full object-cover opacity-60" src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1400&q=80" alt="Prepared meals" />
        <div className="relative max-w-2xl">
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Fresh meals delivered fast</h1>
          <p className="mt-4 text-lg text-white/90">Browse chef picks, filter by category, and checkout with a few taps.</p>
          <Link to="/menu" className="mt-7 inline-flex"><Button>Browse menu <ArrowRight size={18} /></Button></Link>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[["Fast delivery", Clock], ["Easy search", Search], ["Top rated", Star]].map(([label, Icon]) => {
          const TypedIcon = Icon as typeof Clock;
          return <div key={String(label)} className="rounded-2xl bg-white p-5 shadow-soft"><TypedIcon className="text-primary" /><h3 className="mt-3 font-bold">{String(label)}</h3><p className="text-sm text-muted">A smooth flow for demo and future backend integration.</p></div>;
        })}
      </section>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">Popular now</h2>
          <Link to="/menu" className="text-sm font-bold text-primary">See all</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {mockMenuItems.slice(0, 3).map((item) => (
            <Link key={item.id} to="/menu" className="overflow-hidden rounded-2xl bg-white shadow-soft">
              <img className="h-44 w-full object-cover" src={item.image} alt={item.name} />
              <div className="p-4"><h3 className="font-bold">{item.name}</h3><p className="text-primary font-extrabold">{formatCurrency(item.price)}</p></div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
