import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Look for tests in this folder
  testDir: './tests',
  
  // The setting I asked you to change. 1 retry if a test fails.
  retries: 1,
  
  // Run tests in parallel to save time
  workers: 1,
  
  use: {
    // true = invisible browser (fast). false = visible browser (slow).
    headless: true,
    // Take a UI Mode snapshot only if a test fails
    trace: 'retain-on-failure',
  },

  // The Browsers we want to test on
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});