import { z } from 'zod';
import { config } from 'dotenv';

config();

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),

  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().email(),
  SMTP_PASS: z.string().min(1),
  EMAIL_FROM: z.string(),
  /** Bandeja destino de los mensajes del formulario de contacto */
  MAIL_TO: z.string().email().optional(),
  /** Bandeja destino de las notificaciones de pedidos */
  ORDERS_MAIL_TO: z.string().email().default('greenlinemoto@gmail.com'),

  TOTP_ISSUER: z.string().default('GreenLine'),

  FRONTEND_URL: z.string().url(),
  FRONTEND_URL_PROD: z.string().url().optional(),

  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  /** Conexión Redis para la cola de emails (BullMQ). Si falta, se usa una cola en memoria. */
  REDIS_URL: z.string().optional(),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  LOGIN_RATE_LIMIT_MAX: z.coerce.number().default(5),
  OTP_RATE_LIMIT_MAX: z.coerce.number().default(3),
  CONTACT_RATE_LIMIT_MAX: z.coerce.number().default(5),
  PEDIDOS_RATE_LIMIT_MAX: z.coerce.number().default(10),

  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Error en variables de entorno:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
