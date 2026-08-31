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

let transporterPromise;

function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = resolveIPv4(env.SMTP_HOST).then((ip) =>
      nodemailer.createTransport({
        host: ip,
        port: env.SMTP_PORT,
        secure: false,
        requireTLS: true,
        servername: env.SMTP_HOST,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      }),
    );
  }
  return transporterPromise;
}

export async function sendEmail({ to, subject, html }) {
  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });
  return info;
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
