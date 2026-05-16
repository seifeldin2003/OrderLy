import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="p-5 lg:ml-64 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}
