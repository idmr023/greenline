-- ============================================================
-- Reparación: faltaban 3 tablas en Supabase (nunca se aplicó el DDL de
-- schema.sql). Sin ellas, POST /api/reclamaciones no podía persistir,
-- el panel no mostraba nada y email_logs (usado por AdminEmails) no existía.
--
-- Nota: contactos/email_logs usan SERIAL (integer) para ser compatibles con
-- los modelos Prisma `Int @id @default(autoincrement())` de schema.prisma
-- (schema.sql original decía BIGSERIAL, incompatible con prisma.contact.create
-- y prisma.emailLog.create).
-- ============================================================

-- 1) Libro de reclamaciones (derivada 1:1 de backend/prisma/schema.prisma)
CREATE TABLE IF NOT EXISTS libro_reclamaciones (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token                TEXT NOT NULL UNIQUE,
  correlativo_anio     INTEGER NOT NULL,
  correlativo_numero   INTEGER NOT NULL,
  correlativo          TEXT NOT NULL,
  estado               TEXT NOT NULL DEFAULT 'PENDIENTE',
  respuesta            TEXT,
  respondido_en        TIMESTAMPTZ,
  nombre               TEXT NOT NULL,
  apellidos            TEXT NOT NULL,
  email                TEXT NOT NULL,
  telefono             TEXT,
  tipo_doc             TEXT NOT NULL,
  num_doc              TEXT NOT NULL,
  direccion            TEXT NOT NULL,
  distrito             TEXT NOT NULL,
  ciudad               TEXT NOT NULL,
  departamento         TEXT NOT NULL,
  producto             TEXT NOT NULL,
  descripcion_servicio TEXT NOT NULL,
  monto                TEXT NOT NULL,
  lugar_compra         TEXT NOT NULL,
  fecha_compra         TEXT NOT NULL,
  modelo               TEXT NOT NULL,
  color                TEXT NOT NULL,
  vin                  TEXT NOT NULL,
  numero_motor         TEXT NOT NULL,
  placa                TEXT NOT NULL,
  tipo                 TEXT NOT NULL,
  detalle              TEXT NOT NULL,
  pedido               TEXT NOT NULL,
  observaciones        TEXT NOT NULL,
  area                 TEXT NOT NULL,
  area_departamento    TEXT NOT NULL,
  area_distrito        TEXT NOT NULL,
  area_entidad_id      TEXT,
  area_entidad_nombre  TEXT NOT NULL,
  area_entidad_ruc     TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS libro_reclamaciones_correlativo_anio_idx ON libro_reclamaciones (correlativo_anio);
CREATE INDEX IF NOT EXISTS libro_reclamaciones_estado_idx ON libro_reclamaciones (estado);
CREATE INDEX IF NOT EXISTS libro_reclamaciones_created_at_idx ON libro_reclamaciones (created_at DESC);

-- 2) Contactos del formulario público
CREATE TABLE IF NOT EXISTS contactos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  asunto TEXT NOT NULL DEFAULT '',
  mensaje TEXT NOT NULL DEFAULT '',
  leido BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3) Log de correos (AdminEmails + email.queue)
CREATE TABLE IF NOT EXISTS email_logs (
  id SERIAL PRIMARY KEY,
  destinatario TEXT NOT NULL DEFAULT '',
  asunto TEXT NOT NULL DEFAULT '',
  estado TEXT NOT NULL DEFAULT 'ENVIADO',
  error TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4) RLS (schema.sql L596-598)
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE libro_reclamaciones ENABLE ROW LEVEL SECURITY;

-- 5) Políticas idempotentes (patrón de schema.sql: DROP + CREATE)
DROP POLICY IF EXISTS "Contacto: crear desde la web" ON contactos;
CREATE POLICY "Contacto: crear desde la web" ON contactos
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Panel gestiona contactos" ON contactos;
CREATE POLICY "Panel gestiona contactos" ON contactos FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());

DROP POLICY IF EXISTS "Panel gestiona email_logs" ON email_logs;
CREATE POLICY "Panel gestiona email_logs" ON email_logs FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());

DROP POLICY IF EXISTS "Panel gestiona libro_reclamaciones" ON libro_reclamaciones;
CREATE POLICY "Panel gestiona libro_reclamaciones" ON libro_reclamaciones FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());

-- 6) Audit trail (mismo patrón que pedidos/users en esta BD: la función que
-- realmente existe en producción es fn_audit_row_change(); fn_audit_trigger()
-- de audit-triggers.sql nunca se aplicó).
DROP TRIGGER IF EXISTS trg_audit_libro_reclamaciones ON libro_reclamaciones;
CREATE TRIGGER trg_audit_libro_reclamaciones
  AFTER INSERT OR UPDATE OR DELETE ON libro_reclamaciones
  FOR EACH ROW EXECUTE FUNCTION fn_audit_row_change();
