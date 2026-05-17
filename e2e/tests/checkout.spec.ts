import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { MenuPage } from "../pages/MenuPage";
import { CartPage } from "../pages/CartPage";

/**
 * E2E: Checkout flow
 * Maps to Phase 2 Gherkin Feature 1.3 and 1.4.
 * Requires seeded backend with at least 15 available menu items.
 */
test.describe("Checkout Flow", () => {
  // Log in before each test in this block
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("customer@example.com", "customer123");
    await page.waitForURL(/\/home|\/menu/, { timeout: 5000 });
  });

  test("customer can add a menu item to the cart", async ({ page }) => {
    // Gherkin: Scenario — Add an available item to cart
    const menuPage = new MenuPage(page);
    await menuPage.goto();

    // Wait for menu items to load
    await expect(menuPage.firstAddToCartButton()).toBeVisible({ timeout: 5000 });
    await menuPage.addFirstItemToCart();

    // Navigate to cart and confirm the checkout button is available
    const cartPage = new CartPage(page);
    await cartPage.goto();
    await expect(cartPage.checkoutButton).toBeVisible({ timeout: 5000 });
  });

  test("empty cart shows no checkout button", async ({ page }) => {
    // Gherkin: Scenario — Checkout with empty cart (frontend guard)
    const cartPage = new CartPage(page);
    await cartPage.goto();

    // With an empty cart the checkout button must not be present
    await expect(cartPage.checkoutButton).not.toBeVisible();
  });
});