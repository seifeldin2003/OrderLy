import { Navigate, createBrowserRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { AdminLayout } from "../components/layout/AdminLayout";
import { CustomerLayout } from "../components/layout/CustomerLayout";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminMenuPage } from "../pages/admin/AdminMenuPage";
import { AdminOrdersPage } from "../pages/admin/AdminOrdersPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { WelcomePage } from "../pages/auth/WelcomePage";
import { CartPage } from "../pages/customer/CartPage";
import { CheckoutPage } from "../pages/customer/CheckoutPage";
import { HomePage } from "../pages/customer/HomePage";
import { MenuPage } from "../pages/customer/MenuPage";
import { OrderHistoryPage } from "../pages/customer/OrderHistoryPage";
import { OrderSuccessPage } from "../pages/customer/OrderSuccessPage";
import { OrderTrackingPage } from "../pages/customer/OrderTrackingPage";
import { getCurrentUser } from "../store/authStore";
import { App } from "./App";

function RequireRole({ role, children }: { role: "customer" | "admin"; children: ReactNode }) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === "admin" ? "/admin" : "/home"} replace />;
  return children;
}

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <WelcomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        element: <RequireRole role="customer"><CustomerLayout /></RequireRole>,
        children: [
          { path: "/home", element: <HomePage /> },
          { path: "/menu", element: <MenuPage /> },
          { path: "/cart", element: <CartPage /> },
          { path: "/checkout", element: <CheckoutPage /> },
          { path: "/order-success/:orderId", element: <OrderSuccessPage /> },
          { path: "/orders", element: <OrderHistoryPage /> },
          { path: "/orders/:orderId", element: <OrderTrackingPage /> },
        ],
      },
      {
        element: <RequireRole role="admin"><AdminLayout /></RequireRole>,
        children: [
          { path: "/admin", element: <AdminDashboardPage /> },
          { path: "/admin/menu", element: <AdminMenuPage /> },
          { path: "/admin/orders", element: <AdminOrdersPage /> },
        ],
      },
    ],
  },
]);
