import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SPREADSHEET_ID = '1BUpIZXG_l9xEUeHXP9JEnwPbZiNJtoEM74UbTAj3VPQ';
const NUMERO_INICIAL = 12555;

let sheetsClient = null;

// Credenciales: SERVICE_ACCOUNT_JSON (env var, JSON minificado) con fallback
// al archivo local backend/service-account.json (solo desarrollo).
function loadCredentials() {
  if (process.env.SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
  }
  const keyPath = join(__dirname, '../../service-account.json');
  return JSON.parse(readFileSync(keyPath, 'utf-8'));
}

function getSheets() {
  if (sheetsClient) return sheetsClient;

  const auth = new google.auth.GoogleAuth({
    credentials: loadCredentials(),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
}

function yearSheetName() {
  return String(new Date().getFullYear());
}

async function getSheetTabs() {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    fields: 'sheets.properties(title)',
  });
  return (res.data.sheets || []).map((s) => s.properties.title);
}

// Asegura que exista el tab del año actual. Si no existe, lo crea y copia la
// fila de encabezados (fila 1) del último año previo presente en el libro.
async function ensureYearSheet() {
  const sheets = getSheets();
  const name = yearSheetName();
  const tabs = await getSheetTabs();
  if (tabs.includes(name)) return name;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [{ addSheet: { properties: { title: name } } }],
    },
  });

  const prevYear = tabs
    .filter((t) => /^\d{4}$/.test(t) && t !== name)
    .sort()
    .pop();
  if (prevYear) {
    const header = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${prevYear}!A1:AA1`,
    });
    const values = header.data.values || [[]];
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${name}!A1:AA1`,
      valueInputOption: 'RAW',
      requestBody: { values },
    });
  }
  return name;
}

/**
 * Calcula el siguiente número de reclamo leyendo la columna B del tab del año
 * actual. El número se asigna siempre en el servidor (el cliente no decide).
 * Semilla: si el libro está vacío, el primer reclamo real = NUMERO_INICIAL.
 */
export async function getNextClaimNumber() {
  const sheets = getSheets();
  const sheetName = await ensureYearSheet();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!B1:B`,
  });

  let max = NUMERO_INICIAL - 1;
  for (const row of res.data.values || []) {
    const val = parseInt(row[0], 10);
    if (Number.isInteger(val) && val >= NUMERO_INICIAL && val > max) {
      max = val;
    }
  }
  return max + 1;
}

export async function appendReclamo(row) {
  const sheets = getSheets();
  const sheetName = await ensureYearSheet();

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:AA`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [row],
    },
  });
  return { sheetName };
}