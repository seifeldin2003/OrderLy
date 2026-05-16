import { ArrowRight, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/common/Button";

export function WelcomePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="page-shell grid min-h-screen items-center gap-10 py-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-sm font-bold text-primary">
            <UtensilsCrossed size={18} />
            Customer Ordering System
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-ink md:text-6xl">Order your favorite meals in minutes</h1>
          <p className="mt-5 max-w-xl text-lg text-muted"> </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login"><Button>Login <ArrowRight size={18} /></Button></Link>
            <Link to="/register"><Button variant="secondary">Create account</Button></Link>
          </div>
        </div>
        <div className="relative h-[520px] overflow-hidden rounded-2xl shadow-lift">
          <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80" alt="A warm table of restaurant meals" />
          <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/92 p-5 shadow-soft backdrop-blur">
            <p className="text-sm font-bold uppercase text-primary">Demo tip</p>
            <p className="mt-1 text-muted">Use any email with "admin" to enter the admin dashboard.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
