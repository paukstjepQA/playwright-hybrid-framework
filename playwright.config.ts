import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', 
  reporter: 'html',
  retries: 1,
  
  workers: undefined, 
  
  use: {
    headless: true,

    trace: 'on', 
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});