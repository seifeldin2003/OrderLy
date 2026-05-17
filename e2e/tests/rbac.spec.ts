import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

/**
 * E2E: Role-Based Access Control
 * Maps to Phase 2 Gherkin Feature 1.9.
 * Padlocks R-1 and R-2 — verified at the UI routing layer.
 */
test.describe("Role-Based Access Control", () => {
  test("unauthenticated user is redirected away from /home", async ({ page }) => {
    // Gherkin: Scenario — Unauthenticated access to protected routes
    // RequireRole in router.tsx redirects to /login when no session exists
    await page.goto("/home");
    await expect(page).toHaveURL(/\/login|\/$/, { timeout: 5000 });
  });

  test("customer JWT is blocked from /admin route", async ({ page }) => {
    // Gherkin: Scenario — Customer accessing admin routes
    // RequireRole redirects customer role away from /admin back to /home
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("customer@example.com", "customer123");
    await page.waitForURL(/\/home|\/menu/, { timeout: 5000 });

    await page.goto("/admin");

    // Must NOT end up on /admin — RequireRole sends customer to /home
    await expect(page).not.toHaveURL("/admin");
    await expect(page).toHaveURL(/\/home|\/menu/, { timeout: 5000 });
  });

  test("admin can access the admin dashboard", async ({ page }) => {
    // Gherkin: Scenario — Admin accesses dashboard (happy path)
    // LoginPage.tsx navigates to /admin automatically for admin role.
    // Do NOT call adminPage.goto() — wait for the post-login redirect instead.
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("admin@example.com", "admin123");

    await expect(page).toHaveURL(/\/admin/, { timeout: 5000 });
  });
});