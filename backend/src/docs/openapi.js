import { z } from 'zod';
import { reclamoSchema } from '../routes/reclamaciones.routes.js';
import { contactSchema } from '../routes/contact.routes.js';
import { pedidoSchema } from '../routes/pedidos.routes.js';
import { loginSchema } from '../routes/auth.routes.js';

// ============================================================
// Documentación OpenAPI generada desde los schemas Zod reales
// (misma fuente que valida `validate()` en cada endpoint).
// Usa z.toJSONSchema() nativo de Zod v4: sin parches de prototipo,
// sin riesgo de doble instancia de zod.
// Servida en /api/docs (Scalar UI) y /api/docs.json.
// Para documentar un endpoint nuevo: exporta su schema y regístralo aquí.
// ============================================================

function jsonSchemaOf(schema) {
  const { $schema: _omit, ...rest } = z.toJSONSchema(schema);
  return rest;
}

function bodyOf(schema) {
  return jsonSchemaOf(schema.shape.body);
}

const ReclamoInput = { ...bodyOf(reclamoSchema), title: 'ReclamoInput' };
const ContactInput = { ...bodyOf(contactSchema), title: 'ContactInput' };
const PedidoInput = { ...bodyOf(pedidoSchema), title: 'PedidoInput' };
const LoginInput = { ...bodyOf(loginSchema), title: 'LoginInput' };

const jsonBody = (schema) => ({
  content: { 'application/json': { schema } },
});

function path(method, summary, schema, okSchema, auth) {
  const responses = {
    200: { description: 'OK', ...(okSchema ? { content: { 'application/json': { schema: okSchema } } } : {}) },
    400: { description: 'Validación fallida' },
  };
  if (auth) responses[401] = { description: 'No autorizado' };
  return {
    [method]: {
      summary,
      ...(schema ? { requestBody: { required: true, ...jsonBody(schema) } } : {}),
      ...(auth ? { security: [{ bearerAuth: [] }] } : {}),
      responses,
    },
  };
}

const OkReclamo = {
  type: 'object',
  properties: { ok: { type: 'boolean' }, numeroReclamo: { type: 'number' } },
};

const OkValidate = {
  type: 'object',
  properties: {
    ok: { type: 'boolean' },
    valid: { type: 'boolean' },
    dryRun: { type: 'boolean' },
    numeroReclamoPreview: { type: 'number' },
    correlativoPreview: { type: 'string' },
  },
};

const Health = {
  type: 'object',
  properties: { status: { type: 'string' }, timestamp: { type: 'string' } },
};

let cached = null;

export function getOpenApiDocument() {
  if (!cached) {
    cached = {
      openapi: '3.0.0',
      info: {
        title: 'GreenLine API',
        version: '1.0.0',
        description: 'API pública de GreenLine Web ERP (esquemas generados desde Zod).',
      },
      servers: [{ url: '/', description: 'Mismo origen' }],
      components: {
        securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
        schemas: { ReclamoInput, ContactInput, PedidoInput, LoginInput },
      },
      paths: {
        '/health': {
          get: { summary: 'Health check', responses: { 200: { description: 'Servicio operativo', content: { 'application/json': { schema: Health } } } } },
        },
        '/api/reclamaciones': path('post', 'Registrar reclamo (Libro de Reclamaciones)', { $ref: '#/components/schemas/ReclamoInput' }, OkReclamo),
        '/api/reclamaciones/validate': path('post', 'Validar reclamo sin registrar (modo prueba, sin efectos)', { $ref: '#/components/schemas/ReclamoInput' }, OkValidate),
        '/api/contact': path('post', 'Enviar mensaje de contacto', { $ref: '#/components/schemas/ContactInput' }),
        '/api/pedidos': path('post', 'Notificar un pedido (público)', { $ref: '#/components/schemas/PedidoInput' }),
        '/api/auth/login': path('post', 'Login unificado (staff + clientes)', { $ref: '#/components/schemas/LoginInput' }, undefined, true),
      },
    };
  }
  return cached;
}
