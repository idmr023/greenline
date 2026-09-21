import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const htmlPath = path.resolve(__dirname, '..', 'docs', 'Propuesta_CEO', 'presentacion-ceo.html');
const outPath = path.resolve(__dirname, '..', 'docs', 'Propuesta_CEO', 'presentacion-ceo.pdf');

const browser = await puppeteer.launch();
try {
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath.replace(/\\/g, '/')}`, {
    waitUntil: 'networkidle0',
    timeout: 60000,
  });

  await page.pdf({
    path: outPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: true,
  });

  console.log(`PDF generado: ${outPath}`);
} finally {
  await browser.close();
}
