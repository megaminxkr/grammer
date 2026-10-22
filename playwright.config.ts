import { defineConfig, devices } from '@playwright/test';
const external = process.env.E2E_BASE_URL;
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: true, forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0, reporter: 'list',
  use: { baseURL: external ?? 'http://127.0.0.1:4321', trace: 'retain-on-failure' },
  projects: [ { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } } ],
  ...(external ? {} : { webServer: { command: 'npm run dev:review -- --host 127.0.0.1 --port 4321 --strictPort', url: 'http://127.0.0.1:4321/grammer/', reuseExistingServer: !process.env.CI, timeout: 120_000, stdout: 'pipe', stderr: 'pipe' } }),
});
