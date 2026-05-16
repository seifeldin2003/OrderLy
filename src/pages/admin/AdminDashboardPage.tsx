import { ClipboardList, DollarSign, PackageCheck, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminMenuTable } from "../../components/admin/AdminMenuTable";
import { AdminOrderTable } from "../../components/admin/AdminOrderTable";
import { DashboardStatCard } from "../../components/admin/DashboardStatCard";
import { getAdminDashboard, getAdminMenu, getAdminOrders, updateAdminOrderStatus } from "../../services/adminService";
import type { AdminDashboardStats } from "../../types/admin";
import type { MenuItem } from "../../types/menu";
import type { Order, OrderStatus } from "../../types/order";
import { formatCurrency } from "../../utils/currency";

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats>({ totalOrders: 0, pendingOrders: 0, revenue: 0, availableMenuItems: 0 });
  const [orders, setOrders] = useState<Order[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);

  async function refresh() {
    setStats(await getAdminDashboard());
    setOrders(await getAdminOrders());
    setMenu(await getAdminMenu());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function changeStatus(id: string, status: OrderStatus) {
    await updateAdminOrderStatus(id, status);
    refresh();
  }

  return (
    <div className="space-y-8">
      <header><h1 className="text-3xl font-extrabold">Overview</h1><p className="text-muted">Dashboard statistics and recent activity.</p></header>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard label="Total Orders" value={stats.totalOrders} icon={ShoppingBag} hint="All stored orders" />
        <DashboardStatCard label="Pending Orders" value={stats.pendingOrders} icon={ClipboardList} hint="Requires attention" />
        <DashboardStatCard label="Revenue" value={formatCurrency(stats.revenue)} icon={DollarSign} hint="Demo local sales" />
        <DashboardStatCard label="Available Items" value={stats.availableMenuItems} icon={PackageCheck} hint="Active menu" />
      </section>
      <section className="space-y-4"><h2 className="text-2xl font-bold">Recent Orders</h2><AdminOrderTable orders={orders.slice(0, 5)} onStatusChange={changeStatus} /></section>
      <section className="space-y-4"><h2 className="text-2xl font-bold">Recent Menu Items</h2><AdminMenuTable items={menu.slice(0, 5)} onEdit={() => undefined} onDelete={() => undefined} onToggle={() => undefined} /></section>
    </div>
  );
}
