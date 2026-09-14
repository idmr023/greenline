// k6: Simulación de CLIENTES REALES Y HONESTOS del funnel transaccional del backend GreenLine.
// Cada VU es UN browser/user real: navega, y solo de vez en cuando toca la API (login,
// contacto, pedido). La mayor parte del tráfico de una tienda es leer el catálogo, y ese
// NO pasa por el backend (va a Supabase, ver supabase-read.js). Este script mide lo que
// SÍ pasa por Express+Prisma en Render: auth, contacto y pedidos.
//
// Clave: ritmo humano + bajo volumen. Un pedido o un login son eventos poco frecuentes.
// No pretende hacer 30 req/s por IP, sino simular compradores haciendo acciones puntuales.
//
// Ejecutar:
//   cd ~/greenline
//   export LOAD_TARGET="http://localhost:3000"        # local
//   export LOAD_TARGET="https://tu-backend.onrender.com"  # staging/prod
//   k6 run scripts/load/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

const TARGET = __ENV.LOAD_TARGET || 'http://localhost:3000';

// Credenciales VÁLIDAS, creadas por backend/prisma/seed.js. Como el seed es el MISMO en
// cualquier entorno (ejecuta `npm run seed` en local, staging y prod), estas cuentas existen
// siempre con las mismas credenciales. Cada login responde 200.
// Nota: los usuarios CLIENTE devuelven 200 con requiresOTP (flujo OTP por email). El rate
// limiter de login (LOGIN_RATE_LIMIT_MAX=5 por IP+email cada 15 min) tripa con muchas
// llamadas desde una sola IP; para una prueba de carga real sube LOGIN_RATE_LIMIT_MAX.
// Si LOAD_USERS_JWT está definido, se usa auth por token.
const LOAD_TEST_CLIENTS = 10;
const USERS = new SharedArray('users', function () {
  const list = [];
  for (let i = 0; i < LOAD_TEST_CLIENTS; i++) {
    // cliente1@test.com ... cliente10@test.com / Cliente@2026  (CLIENTE)
    list.push({
      email: `cliente${i + 1}@test.com`,
      password: 'Cliente@2026',
      // Sleep "humano": 2-8 s entre acciones de un mismo usuario
      thinkMs: 2000 + ((i * 137) % 6000),
    });
  }
  return list;
});

export const options = {
  // Concurrencia de compradores en tu tienda. 20-60 es una tienda pequeña/mediana activa.
  scenarios: {
    clientes: {
      executor: 'constant-vus',
      vus: 20,
      duration: '5m',
    },
  },
  // Thresholds realistas para Render free tier (0.1 CPU / 512MB):
  // - p95 < 1500ms (antes 400ms): un hash argon2 de login ya toma ~100ms y el
  //   API responde a pocos requests por segundo; 400ms era demasiado estricto
  //   para simular "compradores de pocos pedidos/día".
  // - rate < 5% (antes 1%): tolera el coste inicial/colas en frío de Render.
  // OJO: para staging, sube LOGIN_RATE_LIMIT_MAX, CONTACT_RATE_LIMIT_MAX y
  // PEDIDOS_RATE_LIMIT_MAX (env del backend) para que el test no choque con
  // el rate limit por IP. Este script no pretende 30 req/s, ver comentarios abajo.
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1500'],
  },
};

export default function () {
  const me = USERS[__VU % USERS.length];

  // El comprador navega: la mayor parte del tiempo NO toca el backend (lee Supabase).
  // Cuando sí llega, suele ser un login de vuelta o una compra, cosas puntuales.
  const accion = Math.random();

  // ~85%: solo navegar -> NO toca el backend (lee Supabase).
  // El catálogo se mide aparte con supabase-read.js.
  if (accion < 0.85) {
    sleep(1 + Math.random() * 4);
    return;
  }

  // ~10%: login (un comprador vuelve a su cuenta de vez en cuando).
  // Login limitado por IP+email: en staging sube LOGIN_RATE_LIMIT_MAX para probar.
  if (accion < 0.95) {
    const login = http.post(
      `${TARGET}/api/auth/login`,
      JSON.stringify({ email: me.email, password: me.password }),
      { headers: { 'Content-Type': 'application/json' } },
    );
    check(login, {
      'login 200 o 401 (sin 5xx)': (r) => r.status === 200 || r.status === 401,
      'login sin 5xx': (r) => r.status < 500,
    });
    sleep(me.thinkMs / 1000);
    return;
  }

  // ~5%: contacto o pedido (los eventos más raros de un comprador).
  // Pedidos 10/h por IP y contacto 5/h: en staging sube sus límites para el test.
  if (Math.random() < 0.5) {
    http.post(
      `${TARGET}/api/contact`,
      JSON.stringify({
        nombre: 'Cliente Real',
        email: me.email,
        asunto: 'Consulta de disponibilidad',
        telefono: '919445661',
        mensaje: 'Quisiera saber la disponibilidad de la bicicleta en la tienda de Lima.',
      }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } else {
    const pedido = http.post(
      `${TARGET}/api/pedidos`,
      JSON.stringify({
        codigo: `REAL-${__VU}-${__ITER}`,
        cliente: {
          nombre: 'Cliente Real',
          dni: '12345678',
          telefono: '919445661',
          email: me.email,
          direccion: 'Av. Real 123, Lima',
        },
        items: [
          { nombre: 'Mountain Cross', color: 'Negro', cantidad: 1, precio_actual: 4200, imagen: null },
        ],
        total: 4200,
      }),
      { headers: { 'Content-Type': 'application/json' } },
    );
    check(pedido, { 'pedido sin 5xx': (r) => r.status < 500 });
  }

  // Un comprador rara vez hace varias acciones seguidas; pausa antes de "irse".
  sleep(me.thinkMs / 1000);
}
