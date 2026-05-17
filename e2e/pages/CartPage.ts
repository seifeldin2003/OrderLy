import { Page, Locator } from "@playwright/test";

/**
 * Page Object: /cart
 * Encapsulates selectors and actions for the Cart page.
 */
export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByRole("button", {
      name: /checkout|proceed to checkout/i,
    });
    this.emptyCartMessage = page.getByText(/your cart is empty|no items/i);
  }

  async goto() {
    await this.page.goto("/cart");
  }

  /** Returns all cart item rows currently rendered. */
  cartItems(): Locator {
    return this.page.locator('[data-testid="cart-item"], .cart-item, [class*="cart"]');
  }
}