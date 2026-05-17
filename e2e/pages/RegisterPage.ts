import { Page, Locator } from "@playwright/test";

/**
 * Page Object: /register
 * Encapsulates all selectors and actions for the Registration page.
 */
export class RegisterPage {
  readonly page: Page;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Target the first text input (full name) — not email, not password
    this.fullNameInput = page
      .locator('input[type="text"], input:not([type="email"]):not([type="password"])')
      .first();
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton = page.getByRole("button", {
      name: /register|sign up|create account/i,
    });
  }

  async goto() {
    await this.page.goto("/register");
  }

  async register(fullName: string, email: string, password: string) {
    await this.fullNameInput.fill(fullName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}