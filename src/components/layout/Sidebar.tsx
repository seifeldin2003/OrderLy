import { BarChart3, ClipboardList, LogOut, Utensils } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { clearAuthSession } from "../../store/authStore";

const links = [
  { to: "/admin", label: "Dashboard", icon: BarChart3 },
  { to: "/admin/menu", label: "Menu Management", icon: Utensils },
  { to: "/admin/orders", label: "Order Management", icon: ClipboardList },
];

export function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-outline bg-surface-low p-4 lg:flex">
      <div className="mb-6 rounded-2xl bg-white p-4 shadow-soft">
        <div className="text-2xl font-extrabold text-primary">Admin Panel</div>
        <p className="text-sm text-muted">Orderly Management</p>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/admin"} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${isActive ? "bg-primary-bright text-white" : "text-muted hover:bg-white"}`}>
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted hover:bg-white"
        onClick={() => {
          clearAuthSession();
          navigate("/");
        }}
      >
        <LogOut size={19} />
        Logout
      </button>
    </aside>
  );
}
