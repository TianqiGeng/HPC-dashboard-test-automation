
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: 1,
  fullyParallel: false,
  retries: 0,

 
  
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      testMatch: '**/*.api.spec.ts',
      use: {
        baseURL: 'http://localhost:5001',
      },
    },
    {
      name: 'pre-cleanup',
      testMatch: '**/clearTestData-validation.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '00-upload',
      dependencies: ['pre-cleanup'],
      testMatch: '**/upload-validation.spec.ts',
      use: { ...devices['Desktop Chrome'] },
      teardown: 'cleanup',
    },
    {
      name: '01-upload',
      dependencies: ['00-upload'],
      testMatch: '**/upload-validation.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    
    {
      name: '02-profile',
      dependencies: ['01-upload'],
      testMatch: '**/profile-validation.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: '03-analysis',
      dependencies: ['02-profile'],
      testMatch: '**/analysis-validation.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    
    {
      name: '04-jobs',
      dependencies: ['03-analysis'],
      testMatch: '**/jobs-validation.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'cleanup',
      testMatch: '**/clearTestData-validation.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
});
