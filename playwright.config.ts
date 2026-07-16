import { defineConfig, devices } from '@playwright/test';

/**
 * E2E konfigurácia pre VESMA.
 *
 * - Spúšťa Vite dev server (`npm run dev`, port 5173) a počká, kým nabehne.
 * - Testy bežia v jednom prehliadači (Chromium) – pre rýchlu spätnú väzbu v CI.
 *   Ďalšie prehliadače sa dajú doplniť do `projects`, keď bude treba.
 * - `reuseExistingServer` v lokále znovu použije už bežiaci dev server.
 */
export default defineConfig({
  testDir: './e2e',
  // Každý test má vlastný čistý kontext (cookies/localStorage), pozri stubs.ts.
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Slovenské UI – pomáha pri lokále/dátumoch.
    locale: 'sk-SK',
    timezoneId: 'Europe/Bratislava',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
