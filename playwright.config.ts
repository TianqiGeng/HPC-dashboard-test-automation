
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 30000,

  expect: {
    timeout: 5000,
  },

  testDir: './tests',

  // Run tests sequentially
  fullyParallel: true,

  // Prevent test.only from being committed to CI
  forbidOnly: !!process.env.CI,

  // Retry failed tests only in CI
  retries: process.env.CI ? 2 : 0,

  // Use one worker in CI
  workers: process.env.CI ? 1 : undefined,

  // Console output and HTML report
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  use: {
    baseURL: 'http://localhost:5173',

    // Capture screenshots on failure
    screenshot: 'only-on-failure',

    // Capture traces on the first retry
    trace: 'on-first-retry',
  },

  // Cross-browser testing
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
