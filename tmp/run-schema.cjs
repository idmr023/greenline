'use strict';

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = "postgresql://postgres.nxcbtcexsakfenjfdarr:539M*Q5Jkktn.%23M@aws-0-us-east-1.pooler.supabase.com:6543/postgres";

// Decode the URL (replace %23 with #)
const decodedUrl = DATABASE_URL.replace('%23', '#');

const pool = new Pool({
  connectionString: decodedUrl,
  ssl: { rejectUnauthorized: false },
  max: 1,
  connectionTimeoutMillis: 10000,
});

async function main() {
  let client;
  try {
    client = await pool.connect();
    console.log("✅ Conectado a la base de datos Supabase\n");

    // Read SQL file
    const sqlPath = path.resolve(__dirname, '..', 'supabase', 'distribucion_rol_y_rls.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log("Ejecutando script RLS para DISTRIBUCION...");
    await client.query(sql);
    console.log("✅ Script RLS ejecutado\n");

    // Verification queries
    console.log("=== VERIFICACIÓN ===\n");

    // Check panel_acceso
    const pa = await client.query("SELECT rol FROM public.panel_acceso ORDER BY rol");
    console.log("Panel accesos (roles permitidos):", pa.rows.map(r => r.rol).join(", "));

    // Check es_distribucion function exists
    const fn = await client.query("SELECT proname, proacl FROM pg_proc WHERE proname = 'es_distribucion'");
    console.log("\nFonción es_distribucion():", fn.rowCount > 0 ? "✓ EXISTS" : "✗ NOT FOUND");

    // Check greenline_distributors policies
    const pol = await client.query("SELECT polname, polcmd, polqual, polwithcheck FROM pg_policy WHERE polrelid = 'greenline_distributors'::regclass");
    console.log("\nPolíticas RLS greenline_distributors:");
    for (const p of pol.rows) {
      console.log(`  - ${p.polname} (command: ${p.polcmd})`);
    }

    // Check if table has RLS enabled
    const tbl = await client.query("SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'greenline_distributors'");
    console.log("\nRLS habilitado:", tbl.rows[0].relrowsecurity ? "✓ YES" : "✗ NO");

    // Check user in users table
    const user = await client.query("SELECT email, rol, activo FROM public.users WHERE email ILIKE 'distribucion@greenline.com'");
    console.log("\nUsuario distribucion@greenline.com:");
    if (user.rowCount > 0) {
      console.log(`  email: ${user.rows[0].email}`);
      console.log(`  rol: ${user.rows[0].rol}`);
      console.log(`  activo: ${user.rows[0].activo}`);
    } else {
      console.log("  ✗ NO ENCONTRADO EN users");
    }

    // Sample distributors count
    const count = await client.query("SELECT COUNT(*) as c FROM public.greenline_distributors");
    console.log(`\nDistributeores en la tabla: ${count.rows[0].c}`);

    console.log("\n=== TODO LISTO ===");

  } catch (err) {
    console.error("❌ Error:", err.message);
    if (err.detail) console.error("   detail:", err.detail);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

main();
