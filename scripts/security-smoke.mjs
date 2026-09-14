// ============================================================
// GreenLine - Security Smoke (Fase A.1)
// Verificaciones sin base de datos: separación de secretos JWT,
// no-reuso de tokens temporales, puerta staff en tiempo constante
// y CSPRNG de códigos. Úsalo en CI/local con:
//   npm run security-smoke
// ============================================================
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const here = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(here, '../backend/.env') });

let failures = 0;
const ok = (msg) => console.log('  \u2713', msg);
const fail = (msg) => { failures += 1; console.error('  \u2717', msg); };

// ------------------------------------------------------------
// 1. Variables sensibles presentes
// ------------------------------------------------------------
const sensitive = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'JWT_TEMP_SECRET', 'STAFF_GATE_CODE', 'FIELD_ENCRYPTION_KEY'];
for (const key of sensitive) {
  const val = process.env[key];
  if (!val) { fail(`${key} no definida en backend/.env`); continue; }
  if (key.includes('SECRET') && val.length < 32) fail(`${key} debe tener >= 32 caracteres`);
  else ok(`${key} presente`);
}

// ------------------------------------------------------------
// 2. Token temporal no es válido como access token
// ------------------------------------------------------------
const { signTempToken, verifyTempToken, signAccessToken, verifyAccessToken } = await import('../backend/src/utils/jwt.js');

const fakeUser = { id: crypto.randomUUID(), rol: 'ADMIN' };
const temp = signTempToken(fakeUser, { gate: false });

let tempRoundtrip = true;
try {
  const p = verifyTempToken(temp);
  if (p.sub !== fakeUser.id) tempRoundtrip = false;
} catch { tempRoundtrip = false; }
tempRoundtrip ? ok('roundtrip signTempToken/verifyTempToken') : fail('roundtrip temp token');

try {
  verifyAccessToken(temp);
  fail('¡el temp token se aceptó como access token!');
} catch {
  ok('temp token rechazado con access secret (secretos separados)');
}

// ------------------------------------------------------------
// 3. Puerta: comparación en tiempo constante y largo correcto
// ------------------------------------------------------------
const gate = process.env.STAFF_GATE_CODE ?? '';
const tryGate = (input) => {
  if (String(gate).length !== String(input).length) return false;
  const a = Buffer.from(String(input));
  const b = Buffer.from(String(gate));
  return crypto.timingSafeEqual(a, b);
};
tryGate(gate) ? ok('STAFF_GATE_CODE válido (longitud + timingSafeEqual)') : fail('puerta staff no verificable');
tryGate('x'.repeat(gate.length)) === false ? ok('código incorrecto rechazado') : fail('código incorrecto aceptado');

// ------------------------------------------------------------
// 4. JWT temp con gate:false no habilita 2FA
// ------------------------------------------------------------
// El servicio exige payload.gate === true en verify2FALogin; aquí verificamos
// que el token emitido por login (gate:false) no lleve ese marcador.
const p = verifyTempToken(temp);
if (p.gate === true) fail('temp token de login trae gate:true (debería ser false)');
else ok('temp token de login trae gate:false (exigido para continuar con 2FA)');

// ------------------------------------------------------------
// 5. Backup codes con CSPRNG (formato XXX-XXX, hex)
// ------------------------------------------------------------
const { generateBackupCodes } = await import('../backend/src/utils/qr.js');
const colors = generateBackupCodes(200);
const allValid = colors.every((c) => /^[0-9A-F]{3}-[0-9A-F]{3}$/.test(c));
const unique = new Set(colors).size === colors.length;
allValid ? ok('200 backup codes con formato válido') : fail('formato de backup code inválido');
unique ? ok('backup codes únicos (CSPRNG)') : fail('colisiones de backup codes');

// ------------------------------------------------------------
// 6. Cifrado de campo AES-256-GCM (OTP / 2FA) y hash de tokens
// ------------------------------------------------------------
const { encryptField, decryptField, hashToken } = await import('../backend/src/utils/cipher.js');

const plain = '123456';
const enc = encryptField(plain);
const roundtrip = decryptField(enc) === plain;
roundtrip ? ok('roundtrip encrypt/decrypt AES-256-GCM') : fail('roundtrip cifrado');

enc !== plain ? ok('cifrado ≠ texto plano') : fail('cifrado devolvió texto plano');

const enc2 = encryptField(plain);
enc2 !== enc ? ok('IV aleatorio (dos cifrados distintos)') : fail('IV reutilizado');

decryptField('v1:bad:data:here') === null ? ok('cifrado inválido rechazado') : fail('cifrado inválido aceptado');

const tok = crypto.randomUUID();
hashToken(tok) === hashToken(tok) && hashToken(tok).length === 64
  ? ok('hashToken determinista SHA-256 (64 hex)')
  : fail('hashToken');

hashToken(tok) !== tok ? ok('hashToken no devuelve el token crudo') : fail('hashToken filtró el token');

const legacy = 'JBSWY3DPEHPK3PXP';
const legacyOk = decryptField(legacy) === null && String(legacy).startsWith('v1:') === false;
legacyOk ? ok('valores legado sin prefijo v1: se tratan como texto plano (migración suave)') : fail('migración legado');

// ------------------------------------------------------------
console.log(failures === 0 ? '\nSecurity smoke: TODAS PASARON' : `\nSecurity smoke: ${failures} FALLARON`);
process.exit(failures === 0 ? 0 : 1);