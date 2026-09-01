// Keepalive: mantiene despierto el backend en Render (evita el "sleep" del free tier).
// Se ejecuta cada N minutos vía cron job; hace ping a /health y termina.
const url = process.env.KEEPALIVE_URL;

if (!url) {
  console.error('Falta KEEPALIVE_URL (ej: https://tu-backend.onrender.com/health)');
  process.exit(1);
}

try {
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  console.log(`[keepalive] ${new Date().toISOString()} ${res.status} ${url}`);
  process.exit(0);
} catch (err) {
  console.error(`[keepalive] error ${err.message}`);
  process.exit(1);
}
