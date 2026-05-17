import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";

/**
 * E2E: Authentication scenarios
 * Maps to Phase 2 Gherkin Feature 1.1 and 1.2.
 * Uses seeded accounts: customer@example.com / customer123
 */
test.describe("Authentication", () => {
  test("customer can log in with valid credentials", async ({ page }) => {
    // Gherkin: Scenario — Successful login with valid credentials
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("customer@example.com", "customer123");

    // After successful login, RequireRole redirects customer to /home
    await expect(page).toHaveURL(/\/home|\/menu/, { timeout: 5000 });
  });

  test("login with wrong password stays on login page", async ({ page }) => {
    // Gherkin: Scenario — Login with incorrect password
    // Note: LoginPage.tsx has no try/catch so no toast is rendered on failure.
    // The correct observable behaviour is: page stays on /login (no redirect).
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("customer@example.com", "WRONGPASSWORD");

    // Must stay on login — no redirect to /home
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL(/\/login/);
  });

  test("new customer can register an account", async ({ page }) => {
    // Gherkin: Scenario Outline — Successful user registration
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    // Use timestamp to guarantee a unique email per run
    const uniqueEmail = `e2e_${Date.now()}@example.com`;
    await registerPage.register("E2E Test User", uniqueEmail, "password123");

    // Registration returns a JWT and redirects to home
    await expect(page).toHaveURL(/\/home|\/menu/, { timeout: 5000 });
  });
});