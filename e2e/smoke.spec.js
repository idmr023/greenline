import { test, expect } from '@playwright/test';

// Smoke E2E: rutas públicas críticas + API sin efectos colaterales.
// No quema números de reclamo ni envía correos (solo GETs y un POST inválido
// que debe rebotar en la validación Zod con 400, antes de tocar Sheets/DB).
//
// Tolerante a CI: esperas amplias, selectores por estructura (form/roles)
// y no por copy exacta que pueda cambiar; captura pageerror si la SPA no monta.

const UI_TIMEOUT = 20_000;

async function gotoApp(page, path) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e?.message || e)));
  await page.goto(path, { waitUntil: 'domcontentloaded', timeout: UI_TIMEOUT });
  // La SPA debe montar #root con contenido (no vacío / no ErrorBoundary)
  await expect(page.locator('#root')).not.toBeEmpty({ timeout: UI_TIMEOUT });
  return errors;
}

test('home carga', async ({ page }) => {
  await gotoApp(page, '/');
  // SEOHead puede servir "GreenLine" o "Green Line" según hidratación
  await expect(page).toHaveTitle(/green\s?line/i, { timeout: UI_TIMEOUT });
  await expect(page.locator('body')).toContainText(/greenline|green line/i, {
    timeout: UI_TIMEOUT,
  });
});

test('libro de reclamaciones carga el formulario', async ({ page }) => {
  const errors = await gotoApp(page, '/libro-reclamaciones');
  expect(errors, `pageerrors: ${errors.join('; ')}`).toHaveLength(0);
  // No ErrorBoundary ni loader eterno
  await expect(page.getByText('Algo salió mal')).toHaveCount(0);
  await expect(page.locator('form')).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(
    page.getByText('Identificación del consumidor reclamante'),
  ).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(
    page.locator('button[type="submit"]', { hasText: /enviar/i }),
  ).toBeVisible({ timeout: UI_TIMEOUT });
});

test('modo prueba oculto muestra botón sin registrar', async ({ page }) => {
  const errors = await gotoApp(page, '/libro-reclamaciones?modo=prueba');
  expect(errors, `pageerrors: ${errors.join('; ')}`).toHaveLength(0);
  await expect(page.locator('form')).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByText(/modo prueba/i).first()).toBeVisible({
    timeout: UI_TIMEOUT,
  });
  await expect(
    page.getByRole('button', { name: /probar sin registrar/i }),
  ).toBeVisible({ timeout: UI_TIMEOUT });
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
