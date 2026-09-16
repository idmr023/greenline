-- Respaldo en base de datos del Libro de Reclamaciones.
-- El origen de verdad sigue siendo el Google Sheet (numero_reclamo es asignado
-- por el backend en orden secuencial). Esta tabla guarda una copia "por si acaso"
-- y permite ver los reclamos en /admin sin depender del Sheet.
CREATE TABLE IF NOT EXISTS reclamaciones (
  id BIGSERIAL PRIMARY KEY,
  numero_reclamo INTEGER NOT NULL UNIQUE,
  fecha TEXT NOT NULL DEFAULT '',
  nombre TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  telefono TEXT NOT NULL DEFAULT '',
  tienda TEXT NOT NULL DEFAULT '',
  motivo TEXT NOT NULL DEFAULT '',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reclamaciones_created_at ON reclamaciones (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reclamaciones_numero ON reclamaciones (numero_reclamo);

ALTER TABLE reclamaciones ENABLE ROW LEVEL SECURITY;

-- Solo el backend escribe (service role, que salta RLS).
-- El panel lee con su sesión autenticada de staff vía es_admin_panel().
CREATE POLICY "Panel lee reclamos" ON reclamaciones
  FOR SELECT TO authenticated
  USING (es_admin_panel());