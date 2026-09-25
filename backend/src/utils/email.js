import nodemailer from 'nodemailer';
import dns from 'node:dns';
import { env } from '../config/env.js';

// Forzar conexión por IPv4 (Render no tiene salida IPv6):
// resolvemos el SMTP_HOST a su primera dirección IPv4 y conectamos
// directo a esa IP, usando SNI/servername para conservar el TLS.
async function resolveIPv4(host) {
  const records = await dns.promises.resolve4(host);
  return records[0];
}

// Timeouts de nodemailer (si no se ponen, un socket muerto puede colgarse
// minutos y solo lo corta el Promise.race externo sin liberar la conexión).
const CONNECTION_TIMEOUT_MS = 10_000;
const GREETING_TIMEOUT_MS = 10_000;
const SOCKET_TIMEOUT_MS = 20_000;
// Outer race: por debajo de la suma de los anteriores + margen de DATA.
const SMTP_TIMEOUT_MS = 25_000;

function buildTransportOptions(ip, auth) {
  return {
    host: ip,
    port: env.SMTP_PORT,
    secure: false,
    requireTLS: true,
    servername: env.SMTP_HOST,
    auth: auth || {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
    connectionTimeout: CONNECTION_TIMEOUT_MS,
    greetingTimeout: GREETING_TIMEOUT_MS,
    socketTimeout: SOCKET_TIMEOUT_MS,
    // Reutiliza sockets SMTP (Gmail es lento en handshake por envío).
    pool: true,
    maxConnections: 1,
    maxMessages: 10,
  };
}

async function createSmtpTransport(auth) {
  const ip = await resolveIPv4(env.SMTP_HOST);
  return nodemailer.createTransport(buildTransportOptions(ip, auth));
}

let transporterPromise;

function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = createSmtpTransport().catch((err) => {
      // No cachear el rechazo: el siguiente intento re-resuelve DNS.
      transporterPromise = undefined;
      throw err;
    });
  }
  return transporterPromise;
}

/** Descarta el transportador global tras un fallo para no reusar un socket roto. */
async function resetGlobalTransporter(transporter) {
  try {
    if (transporter?.close) await transporter.close();
  } catch { /* noop */ }
  transporterPromise = undefined;
}

function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Timeout: ${label} no respondió en ${ms / 1000}s`)),
      ms,
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/** Quita comillas dotenv mal formadas: 'GreenLine <a@b.com>' → GreenLine <a@b.com> */
function normalizeFrom(value) {
  if (!value) return value;
  return String(value).trim().replace(/^['"]+|['"]+$/g, '');
}

export async function sendEmail({ to, subject, html, priority, auth, from }) {
  // Si se pasan credenciales propias (p. ej. las de reclamaciones), se crea un
  // transportador dedicado para ese envío; el resto de módulos sigue usando el
  // transportador global (SMTP_USER / SMTP_PASS) y su `from` por defecto.
  const isGlobal = !auth;
  const transporter = auth
    ? await createSmtpTransport(auth)
    : await getTransporter();

  try {
    const info = await withTimeout(
      transporter.sendMail({
        from: normalizeFrom(from || env.EMAIL_FROM),
        to,
        subject,
        html,
        ...(priority ? { priority } : {}),
      }),
      SMTP_TIMEOUT_MS,
      'SMTP sendMail',
    );
    if (!isGlobal && transporter.close) {
      try { await transporter.close(); } catch { /* noop */ }
    }
    return info;
  } catch (err) {
    if (isGlobal) {
      await resetGlobalTransporter(transporter);
    } else if (transporter.close) {
      try { await transporter.close(); } catch { /* noop */ }
    }
    // Código SMTP / respuesta del servidor ayudan a diagnosticar sin loguear secretos.
    const detail = [err.code, err.response, err.message]
      .filter(Boolean)
      .join(' | ');
    console.error(`[email] envío falló (${to}): ${detail}`);
    throw err;
  }
}

/**
 * Handshake SMTP (AUTH+STARTTLS, sin enviar) para validar credenciales.
 * Usado por scripts/check-smtp.mjs para diagnosticar cuentas rechazadas (535)
 * o conectividad caída (timeouts) en local y en Render.
 * @param {{user: string, pass: string}} [auth] Credenciales dedicadas; sin ellas usa las globales.
 */
export async function verifySmtp(auth) {
  const transporter = auth ? await createSmtpTransport(auth) : await getTransporter();
  try {
    await withTimeout(transporter.verify(), SMTP_TIMEOUT_MS, 'SMTP verify');
    return { ok: true, user: auth ? auth.user : env.SMTP_USER };
  } catch (err) {
    if (!auth) await resetGlobalTransporter(transporter);
    else if (transporter.close) {
      try { await transporter.close(); } catch { /* noop */ }
    }
    const detail = [err.code, err.response, err.message].filter(Boolean).join(' | ');
    return { ok: false, user: auth ? auth.user : env.SMTP_USER, error: detail };
  }
}

export function generateOTPEmail(code, nombre) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #009000; padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .body { padding: 40px 30px; text-align: center; }
        .code { font-size: 48px; font-weight: bold; color: #009000; letter-spacing: 12px; margin: 30px 0; padding: 20px; background: #f0fff0; border-radius: 8px; border: 2px dashed #009000; }
        .footer { padding: 20px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>GreenLine</h1>
        </div>
        <div class="body">
          <h2>Tu código de acceso</h2>
          <p>Hola ${nombre},</p>
          <p>Usa el siguiente código para iniciar sesión:</p>
          <div class="code">${code}</div>
          <p style="color: #666;">Este código expira en 5 minutos.</p>
          <p style="color: #999; font-size: 12px;">Si no solicitaste este código, ignora este mensaje.</p>
        </div>
        <div class="footer">
          GreenLine © ${new Date().getFullYear()} — Movilidad Eléctrica
        </div>
      </div>
    </body>
    </html>
  `;
}
