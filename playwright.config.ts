import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Playwright will automatically look in /ui and /api
  retries: 1,
  workers: 1,
  use: {
    headless: true,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});