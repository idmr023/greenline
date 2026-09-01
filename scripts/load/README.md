# Kit de prueba de carga — GreenLine

Valida si el sistema soporta tus usuarios reales antes de producción. Divide la carga en
los dos destinos reales de tu arquitectura:

| Qué prueba | Endpoint | Responsable de la carga |
|---|---|---|
| `supabase-read.js` | Catálogo público (productos/imágenes/categorías) | **Supabase** (leer vía anon key) |
| `load-test.js` | Login, contacto, pedidos, health | **Backend Express en Render** |

El catálogo es la mayor parte del tráfico y va a Supabase (serverless, escala solo).
El cuello de botella real está en lo que pasa por Render (auth, pedidos, stock).

## Requisitos

- [k6](https://k6.io) instalado y en el PATH.
- Variables de entorno del `.env` del backend (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).

## 1) Probar el catálogo (Supabase) — la carga principal

```powershell
$env:SUPABASE_URL="https://xxxx.supabase.co"
$env:SUPABASE_ANON_KEY="eyJ...anon"
k6 run scripts/load/supabase-read.js
```

Sube solo a **100-200 usuarios simultáneos** navegando. Supabase debe responder p95 < 300ms.

## 2) Probar el backend transaccional (Render)

Apúntalo primero a un entorno de **staging** (no toques producción todavía):

```powershell
$env:LOAD_TARGET="https://tu-backend-staging.onrender.com"
k6 run scripts/load/load-test.js
```

Rampas por defecto: 5 → 20 → 50 VU. Observa en vivo con las métricas del backend:

```powershell
# con un token ADMIN
curl -H "Authorization: Bearer <TOKEN_ADMIN>" https://tu-backend-staging.onrender.com/api/metrics
```

### Ojo con los rate limiters (importante)

Los endpoints de escritura tienen límite estricto por IP:
- login: 5/15min · contacto: 5/h · pedidos: 10/h.

En una prueba real desde una sola IP, el test **cortará con 429** rápido. Para medir tras la
validación correctamente, en el entorno de **staging** sube temporalmente
`LOGIN_RATE_LIMIT_MAX`, `CONTACT_RATE_LIMIT_MAX` y `PEDIDOS_RATE_LIMIT_MAX` en Render.
También puedes lanzar k6 con `--iterations` distribuidos. NO hagas esto en producción.

## 3) Monitoreo en vivo durante el test

El endpoint `GET /api/metrics` (protegido con rol ADMIN o DESARROLLADOR_WEB) devuelve:
- Memoria: `rss`, `heapUsed`, `heapTotal` (límite 400MB) → AQUÍ ves si el heap se llena.
- Requests: total, en vuelo, por status, latencia média/max.
- Heap por debajo de **~350MB** = margen sano en el tier de 512MB.
- Con `p95` subiendo sobre 400ms o `5xx` >0 mientras sube el heap → cuello de botella.

## Criterios de aceptación

| Métrica | Umbral objetivo | Qué revisar si fallas |
|---|---|---|
| p95 latencia (backend) | < 400ms | Heap/RAM cerca del límite, plan de Render insuficiente |
| p95 latencia (Supabase) | < 300ms | Índices en `productos`/`imagenes`, paginación |
| Tasa de error HTTP | < 1% | 5xx de Render, timeouts, rate limiters muy bajos |
| RAM (heapUsed) | < 350MB estable | Config de `node --max-old-space-size=400`, conexiones DB |

## Rendimiento medido en local (referencia)

`scripts/bench.mjs` (consulta Prisma real, productos+categoría+imagen):
- Latencia: avg ~250ms, p95 ~380ms.
- RAM: RSS ~90-97MB, heap ~24MB → **margen enorme** con el heap acotado a 400MB.

## Escalado para tráfico alto/estable

El free tier de Render (512MB, CPU throttled, duerme inactivo) **no basta** para tráfico alto
estable. Orden de acciones recomendado:

1. **Quitar el sleep** — cron a `/health` cada 5 min (o plan de pago que lo desactiva).
2. **Subir de plan en Render** (Starter o Standard) — elimina throttling de CPU y aumenta RAM.
   Es el cambio más eficaz para auth/pedidos.
3. **Reducir carga en Render** — verificar que la tienda pública **nunca** llame al backend
   salvo checkout/login (el catálogo ya va a Supabase directo).
4. **Pedidos asíncronos** — el orden ya se inserta en Supabase; el email puede ir en segundo
   plano para no bloquear la respuesta con el envío SMTP.
5. **Cache** — Vercel/CDN ya sirve los estáticos del SPA; asegúrate de cachear el catálogo.

## Referencia rápida de comandos k6

```powershell
# Volcado JSON + reporte HTML por ejecución (para comparar antes/después)
$env:K6_JSON="reports/carga-$(Get-Date -Format yyyyMMdd-HHmm).json"
$env:K6_WEB_DASHBOARD=true
k6 run scripts/load/load-test.js
```

Instala k6 en Windows: descarga el `.exe` de https://k6.io y añádelo al PATH (o `winget install k6i`).