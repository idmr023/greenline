#!/usr/bin/env node
// ============================================================
// GreenLine - Aplicar triggers WORM de auditoría + RLS deny-by-default
// Uso (desde la raíz del repo):
//   node scripts/aplicar-audit-rls.mjs
//
// Conecta a la DB usando DATABASE_URL de backend/.env (la misma de Prisma).
// Advertencia: los triggers ya aplicados se DROP y se re-CREATE (idempotente).
// La RLS se habilita SOLO si un flag lo confirma; ver constants abajo.
// ============================================================

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env') });

const AUDIT_SQL = path.join(__dirname, '..', 'backend', 'prisma', 'audit-triggers.sql');
const RLS_SQL = path.join(__dirname, '..', 'supabase', 'rls-auth-tablas.sql');
const APPLY_RLS = process.env.APPLY_RLS === '1'; // activa RLS solo si se pide explícitamente

if (!process.env.DATABASE_URL) {
  console.error('Falta DATABASE_URL en backend/.env');
  process.exit(1);
}

const { default: pg } = await import('pg');

async function main() {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    console.log('[1/2] Aplicando triggers WORM de auditoría...');
    const auditSql = readFileSync(AUDIT_SQL, 'utf8');
    await client.query(auditSql);
    console.log('  OK - triggers de auditoría y pg_cron configurados');

    console.log('[2/2] Aplicando RLS deny-by-default en tablas de auth...');
    if (!APPLY_RLS) {
      console.log('  Omitido (ejecuta con APPLY_RLS=1 para habilitar RLS)');
      process.exit(0);
    }
    const rlsSql = readFileSync(RLS_SQL, 'utf8');
    await client.query(rlsSql);
    console.log('  OK - RLS habilitada en users / otp_codes / refresh_tokens / audit_logs');

    console.log('\nVerifica con: SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = \'public\';');
  } catch (error) {
    console.error('Error aplicando SQL:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();