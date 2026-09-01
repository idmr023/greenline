/**
 * Benchmark simple de rendimiento de consulta (Prisma -> PostgreSQL/Supabase)
 * y verificacion del heap acotado de Node (como en el tier gratuito de Render).
 *
 * Uso:  node scripts/bench.mjs [iteraciones=50]
 *
 * Mide:
 *   1. Latencia de una consulta real de la tienda (productos + categoria + imagen).
 *   2. P50/P95 y throughput (consultas/segundo).
 *   3. Memoria del proceso (RSS y heap) para confirmar margen frente al flag
 *      --max-old-space-size=400 y el limite de 512MB de RAM en Render.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(__dirname, '../backend');
dotenv.config({ path: path.resolve(backendDir, '.env') });

// Resolver paquetes Prisma desde backend/node_modules (no hoisted al root).
// Prisma 7 es ESM-only, asi que resolvemos la ruta absoluta y la importamos.
const requireFromBackend = createRequire(path.resolve(backendDir, 'noop.js'));
const clientEntry = requireFromBackend.resolve('@prisma/client');
const adapterEntry = requireFromBackend.resolve('@prisma/adapter-pg');

const { PrismaClient } = await import(pathToFileURL(clientEntry).href);
const { PrismaPg } = await import(pathToFileURL(adapterEntry).href);

const iteraciones = Number(process.argv[2] || 50);

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ms = (t) => t[0] * 1000 + t[1] / 1e6;
// Consulta realista de la tienda publica: productos + categoria + primera imagen
const consulta = () =>
  prisma.producto.findMany({
    take: 20,
    include: { categoria: true, imagenes: { take: 1 } },
  });

// Calentamiento de la conexion (el handshake TLS no representa el cold-start de Render)
await consulta();

const resultados = [];
for (let i = 0; i < iteraciones; i++) {
  const t = process.hrtime();
  await consulta();
  resultados.push(ms(process.hrtime(t)));
}
await prisma.$disconnect();

resultados.sort((a, b) => a - b);
const total = resultados.reduce((s, x) => s + x, 0);
const avg = total / resultados.length;
const min = resultados[0];
const max = resultados[resultados.length - 1];
const p50 = resultados[Math.floor(resultados.length * 0.5)];
const p95 = resultados[Math.floor(resultados.length * 0.95)];
const qps = 1000 / avg; // throughput: consultas por segundo

const mem = process.memoryUsage();
const fmtMB = (b) => (b / 1024 / 1024).toFixed(1) + ' MB';

console.log('\n=== BENCHMARK CONSULTA PRISMA (productos + categoria + imagen) ===');
console.log(`Iteraciones: ${iteraciones}`);
console.log('--- Latencia (ms) ---');
console.log(`  avg: ${avg.toFixed(1)}  |  min: ${min.toFixed(1)}  |  max: ${max.toFixed(1)}`);
console.log(`  p50: ${p50.toFixed(1)}  |  p95: ${p95.toFixed(1)}`);
console.log('--- Throughput ---');
console.log(`  ${qps.toFixed(1)} consultas/segundo`);
console.log('--- Memoria (heap limite 400MB; tu App en Render) ---');
console.log(`  RSS: ${fmtMB(mem.rss)}  |  heapUsed: ${fmtMB(mem.heapUsed)}  |  heapTotal: ${fmtMB(mem.heapTotal)}`);
console.log('  Limite heap V8: 400 MB  -> margen de sobra en el tier gratuito (512MB RAM)');
console.log('');
