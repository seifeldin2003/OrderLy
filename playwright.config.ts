import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for the Customer Ordering System E2E suite.
 *
 * Prerequisites before running:
 *   1. Backend running:  cd backend && uvicorn app.main:app --reload  (port 8000)
 *   2. Frontend running: npm run dev                                   (port 5173)
 *   3. Backend seeded:   cd backend && python -m app.seed
 *
 * Run tests:
 *   npx playwright test
 *   npx playwright test --ui          (interactive mode)
 *   npx playwright show-report e2e/report
 */
export default defineConfig({
  testDir: "./e2e/tests",
  fullyParallel: false,   // tests share seeded DB state — run sequentially
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [["html", { outputFolder: "e2e/report", open: "never" }]],
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          executablePath: "/snap/bin/chromium",
        },
      },
    },
  ],
});