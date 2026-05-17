import { Page, Locator } from "@playwright/test";

/**
 * Page Object: /admin
 * Encapsulates selectors and actions for the Admin Dashboard page.
 */
export class AdminDashboardPage {
  readonly page: Page;
  readonly statCards: Locator;

  constructor(page: Page) {
    this.page = page;
    // Stat cards rendered by DashboardStatCard component
    this.statCards = page.locator(
      '[data-testid="stat-card"], [class*="stat"], [class*="dashboard"]'
    );
  }

  async goto() {
    await this.page.goto("/admin");
  }

  isOnAdminPage(): Promise<boolean> {
    return Promise.resolve(this.page.url().includes("/admin"));
  }
}