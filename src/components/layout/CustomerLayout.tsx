import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function CustomerLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="page-shell py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
