import { defineConfig, devices } from "@playwright/test";

/**
 * E2E base URL — override when the app is already running, e.g.:
 *   PLAYWRIGHT_BASE_URL=https://staging.example.com playwright test
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEB_SERVER === "1";

/** If `reuseExistingServer` reuses an old `next dev`, config changes (e.g. CSP) may not apply — restart the dev server or run with `CI=true` for a fresh webServer. */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.GITHUB_ACTIONS ? "github" : "list",
  use: {
    baseURL,
    headless: true,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: skipWebServer
    ? undefined
    : {
        // Force development mode: a parent shell with NODE_ENV=production breaks `next dev` (Edge middleware / HMR).
        command: "cross-env NODE_ENV=development npm run dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
