import { defineConfig, devices } from '@playwright/test';
const external = process.env.E2E_BASE_URL;
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: true, forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0, reporter: 'list',
  use: { baseURL: external ?? 'http://127.0.0.1:4321', trace: 'retain-on-failure' },
  projects: [ { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } } ],
  ...(external ? {} : { webServer: { command: 'npm run dev:review -- --port 4321', url: 'http://127.0.0.1:4321/grammer/', reuseExistingServer: !process.env.CI } }),
});
