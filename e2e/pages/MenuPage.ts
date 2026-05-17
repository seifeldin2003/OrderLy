import { Page, Locator } from "@playwright/test";

/**
 * Page Object: /menu
 * Encapsulates selectors and actions for the Menu browsing page.
 */
export class MenuPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/menu");
  }

  /** Returns the first "Add" button visible on the page (FoodCard renders "Add" not "Add to Cart"). */
  firstAddToCartButton(): Locator {
    return this.page.getByRole("button", { name: /^add$/i }).first();
  }

  /** Clicks the first available Add button. */
  async addFirstItemToCart() {
    await this.firstAddToCartButton().click();
  }
}