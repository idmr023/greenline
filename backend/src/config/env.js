import { z } from 'zod';
import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';

// Cargar backend/.env de forma independiente del cwd (las variables ya
// presentes en el entorno —p. ej. Render— NO se sobrescriben).
config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),

  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  /** Secreto para tokens temporales de challenge (puerta staff y 2FA). Separado de access/refresh para evitar reuso. */
  JWT_TEMP_SECRET: z.string().min(32),
  JWT_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  /** Código de puerta compartido del staff. Se valida del lado del servidor (nunca en el bundle cliente). */
  STAFF_GATE_CODE: z.string().min(4),

  /** Clave maestra para cifrado de campos sensibles en reposo (AES-256-GCM). Mínimo 32 caracteres. */
  FIELD_ENCRYPTION_KEY: z.string().min(32),

  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().email(),
  SMTP_PASS: z.string().min(1),
  EMAIL_FROM: z.string(),
  /** Bandeja destino de los mensajes del formulario de contacto */
  MAIL_TO: z.string().email().optional(),
  /** Bandeja destino de las notificaciones de pedidos */
  ORDERS_MAIL_TO: z.string().email().default('greenlinemoto@gmail.com'),
  /** Bandeja destino (RRHH) de las notificaciones del Libro de Reclamaciones */
  RRHH_MAIL_TO: z.string().email().default('pe_asistente@migreenline.com'),

  /** Credenciales SMTP dedicadas a las notificaciones del Libro de Reclamaciones.
   * Opcionales: si no se definen, se usan SMTP_USER / SMTP_PASS / EMAIL_FROM globales
   * (los testimonios, pedidos y OTP siguen usando SOLO esas, nunca estas). */
  RECLAMACIONES_SMTP_USER: z.string().email().optional().or(z.literal('')),
  RECLAMACIONES_SMTP_PASS: z.string().optional(),
  RECLAMACIONES_EMAIL_FROM: z.string().optional(),

  TOTP_ISSUER: z.string().default('GreenLine'),

  FRONTEND_URL: z.string().url(),
  FRONTEND_URL_PROD: z.string().url().optional(),

  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  /** Conexión Redis para la cola de emails (BullMQ). Si falta, se usa una cola en memoria. */
  REDIS_URL: z.string().optional(),

  /**
   * Credenciales de la service account de Google Sheets como JSON minificado
   * en una sola línea. Solo para producción (Render). En desarrollo se usa el
   * archivo backend/service-account.json como fallback.
   */
  SERVICE_ACCOUNT_JSON: z.string().optional(),

  /** DSN de Sentry (error tracking). Opcional: sin esto, instrument.js es no-op. */
  SENTRY_DSN: z.string().url().optional().or(z.literal('')),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  LOGIN_RATE_LIMIT_MAX: z.coerce.number().default(5),
  OTP_RATE_LIMIT_MAX: z.coerce.number().default(3),
  CONTACT_RATE_LIMIT_MAX: z.coerce.number().default(5),
  PEDIDOS_RATE_LIMIT_MAX: z.coerce.number().default(10),

  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  /** Service role key de Supabase (solo servidor; nunca exponer al cliente). Obligatoria en producción. */
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Error en variables de entorno:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

// Rechazos de seguridad en producción (deny by default).
const PRODUCTION_REQUIRED = ['SUPABASE_SERVICE_ROLE_KEY'];
const missingProduction = PRODUCTION_REQUIRED.filter((key) => !env[key]);
if (env.NODE_ENV === 'production' && missingProduction.length > 0) {
  console.error(`❌ En producción faltan variables requeridas: ${missingProduction.join(', ')}`);
  process.exit(1);
}

export { env };
