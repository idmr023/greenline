import { test, expect } from '@playwright/test';

// Smoke E2E: rutas públicas críticas + API sin efectos colaterales.
// No quema números de reclamo ni envía emails (solo GETs y un POST inválido
// que debe rebotar en la validación Zod con 400, antes de tocar Sheets/DB).
test('home carga', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Green Line/i);
});

test('libro de reclamaciones carga el formulario', async ({ page }) => {
  await page.goto('/libro-reclamaciones');
  await expect(page.getByText('Identificación del consumidor reclamante')).toBeVisible();
  await expect(page.locator('button[type="submit"]', { hasText: 'Enviar' })).toBeVisible();
});

test('modo prueba oculto muestra botón sin registrar', async ({ page }) => {
  await page.goto('/libro-reclamaciones?modo=prueba');
  await expect(page.getByText('Modo prueba')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Probar sin registrar' })).toBeVisible();
});

test('API health responde ok', async ({ request }, testInfo) => {
  const apiUrl = testInfo.project.metadata?.apiUrl || 'http://localhost:3000/api';
  const res = await request.get(apiUrl.replace(/\/api$/, '') + '/health');
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.status).toBe('ok');
});

test('POST inválido a reclamaciones rebota con 400 (sin efectos)', async ({ request }, testInfo) => {
  const apiUrl = testInfo.project.metadata?.apiUrl || 'http://localhost:3000/api';
  const res = await request.post(`${apiUrl}/reclamaciones/validate`, {
    data: { nombre: 'Solo un campo' },
    headers: { Origin: 'http://localhost:4173' },
  });
  expect(res.status()).toBe(400);
});
