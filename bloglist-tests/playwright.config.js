import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: [
    {
      command: 'set DNS_SERVER=192.168.0.1&& npm run start:test',
      cwd: '../bloglist/blog',
      url: 'http://localhost:3002/api/blogs',
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev',
      cwd: '../bloglist/blog',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
    },
  ],
})
