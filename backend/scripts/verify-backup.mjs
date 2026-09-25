import 'dotenv/config';
import pg from 'pg';

// ============================================================
// Verificación de backups de la DB (Supabase/Postgres).
// ------------------------------------------------------------
// 1) Si hay SUPABASE_ACCESS_TOKEN + SUPABASE_PROJECT_REF, consulta la
//    Management API y reporta el backup más reciente.
// 2) Siempre: prueba de conectividad + frescura de escritura
//    (último created_at en tablas clave) como sanity de recuperabilidad.
// Uso: node backend/scripts/verify-backup.mjs
// Salida 0 = OK, 1 = problema, 2 = sin credenciales de Management API
//        (solo corre el sanity local).
// ============================================================

const { SUPABASE_ACCESS_TOKEN, SUPABASE_PROJECT_REF, DIRECT_URL } = process.env;

let failed = false;

async function checkManagementApi() {
  if (!SUPABASE_ACCESS_TOKEN || !SUPABASE_PROJECT_REF) {
    console.log('⚠️  Sin SUPABASE_ACCESS_TOKEN/PROJECT_REF: omito chequeo de backups (exit 2 si todo lo demás OK).');
    return 'skipped';
  }

  const res = await fetch(
    `https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/database/backups`,
    { headers: { Authorization: `Bearer ${SUPABASE_ACCESS_TOKEN}`, apikey: SUPABASE_ACCESS_TOKEN } },
  );

  if (!res.ok) {
    console.error(`❌ Management API respondió ${res.status}. Revisa token/ref.`);
    failed = true;
    return 'error';
  }

  const data = await res.json();
  const backups = data?.backups || data || [];
  if (!Array.isArray(backups) || backups.length === 0) {
    console.error('❌ Sin backups listados para el proyecto.');
    failed = true;
    return 'error';
  }

  const latest = backups
    .map((b) => new Date(b.inserted_at || b.created_at || 0).getTime())
    .sort((a, b) => b - a)[0];
  const ageH = (Date.now() - latest) / 3600000;
  console.log(`✅ Backup más reciente: ${new Date(latest).toISOString()} (hace ${ageH.toFixed(1)}h)`);

  if (ageH > 30) {
    console.error('❌ El backup más reciente tiene más de 30h. Revisa el plan de backups.');
    failed = true;
  }
  return 'ok';
}

async function checkFreshness() {
  if (!DIRECT_URL) {
    console.error('❌ Falta DIRECT_URL para el sanity de conectividad.');
    failed = true;
    return;
  }

  const client = new pg.Client({ connectionString: DIRECT_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    // Tablas clave del negocio: ajusta si cambia el schema.
    // Fallo duro (no "Omito"): una tabla ausente = features rotas en silencio.
    const tables = [
      'pedidos',
      'libro_reclamaciones',
      'contactos',
      'email_logs',
      'productos',
      'users',
    ];
    for (const t of tables) {
      try {
        const { rows } = await client.query(
          `SELECT COUNT(*)::int AS n, MAX(created_at) AS ultima FROM ${t}`,
        );
        console.log(`✅ ${t}: ${rows[0].n} filas, última escritura: ${rows[0].ultima || '—'}`);
      } catch (err) {
        console.error(`❌ ${t}: NO accesible (${err.message})`);
        failed = true;
      }
    }
  } finally {
    await client.end();
  }
}

const mgmt = await checkManagementApi().catch((e) => {
  console.error('❌ Error Management API:', e.message);
  failed = true;
  return 'error';
});
await checkFreshness().catch((e) => {
  console.error('❌ Error conectando a la DB:', e.message);
  failed = true;
});

if (failed) process.exit(1);
if (mgmt === 'skipped') process.exit(2);
console.log('🎉 Backups OK');
process.exit(0);
