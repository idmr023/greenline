import { defineConfig, devices } from '@playwright/test';

// Base URL del frontend. En CI se levanta `vite preview` en :4173.
// Para probar un deploy (Vercel/Render preview), pasar:
//   PLAYWRIGHT_BASE_URL=https://xxx.vercel.app npx playwright test
// API del backend (solo /health y validaciones sin efectos colaterales).
const FRONTEND_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4173';
const API_URL = process.env.PLAYWRIGHT_API_URL || 'http://localhost:3000/api';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: FRONTEND_URL,
    trace: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: undefined, // los servidores los levanta el workflow (ver e2e.yml)
  metadata: { apiUrl: API_URL },
});
