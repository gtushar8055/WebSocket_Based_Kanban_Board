import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests/e2e",
  timeout: 30 * 1000,
  workers: 1,
  fullyParallel: false,
  use: {
    headless: true,
    baseURL: "http://localhost:3000",
    viewport: { width: 1400, height: 900 },
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  webServer: {
    command: "npm run preview",
    port: 3000,
    reuseExistingServer: true,
    timeout: 60 * 1000,
  },
});
