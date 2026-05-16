import { LogOut, Menu, ShoppingCart, UserCircle } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearAuthSession, getCurrentUser } from "../../store/authStore";

export function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  function logout() {
    clearAuthSession();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-outline/50 bg-background/90 backdrop-blur">
      <nav className="page-shell flex h-16 items-center justify-between gap-4">
        <Link to="/home" className="text-2xl font-extrabold text-primary">
          Orderly
        </Link>
        <div className="hidden items-center gap-1 text-sm font-semibold text-muted md:flex">
          <NavLink to="/home" className={({ isActive }) => `rounded-xl px-3 py-2 ${isActive ? "bg-primary-soft text-primary" : "hover:bg-surface-container"}`}>
            Home
          </NavLink>
          <NavLink to="/menu" className={({ isActive }) => `rounded-xl px-3 py-2 ${isActive ? "bg-primary-soft text-primary" : "hover:bg-surface-container"}`}>
            Menu
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => `rounded-xl px-3 py-2 ${isActive ? "bg-primary-soft text-primary" : "hover:bg-surface-container"}`}>
            Orders
          </NavLink>
        </div>
        <div className="flex items-center gap-2">
          <Link className="rounded-full p-2 text-primary hover:bg-surface-container" to="/cart" aria-label="Cart">
            <ShoppingCart />
          </Link>
          <div className="hidden items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold shadow-soft sm:flex">
            <UserCircle size={18} />
            {user?.name ?? "Guest"}
          </div>
          <button className="rounded-full p-2 text-muted hover:bg-surface-container" onClick={logout} aria-label="Log out">
            <LogOut size={20} />
          </button>
          <Menu className="md:hidden" />
        </div>
      </nav>
    </header>
  );
}
