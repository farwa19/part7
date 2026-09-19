// @ts-check
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  timeout: 30000, // 30 seconds
  fullyParallel: false,
  workers: 1, // Forces tests to run one at a time to protect the database
  testDir: "./tests",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",

  use: {
    baseURL: "http://localhost:5173", // Allows you to use page.goto('/') in your tests
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
