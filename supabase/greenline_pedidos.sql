-- ============================================================
-- GreenLine - Pedidos realizados desde la tienda web
--
-- El checkout público inserta pedidos (anónimo).
-- El cliente gestiona el flujo de estados desde /admin ("Pedidos").
-- ============================================================

CREATE TABLE IF NOT EXISTS pedidos (
  id BIGSERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  cliente JSONB NOT NULL,          -- { nombre, telefono, email }
  items JSONB NOT NULL,            -- [{ slug, nombre, color, cantidad, precio_actual }]
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  estado TEXT NOT NULL DEFAULT 'NUEVO',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos (estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos (created_at DESC);

CREATE TRIGGER trg_pedidos_updated_at
  BEFORE UPDATE ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS: inserción pública para el checkout; gestión para el admin.
-- El panel admin actual opera con la anon key (mismo patrón que productos/colores),
-- por lo que se deja acceso de escritura a anon hasta conectar Supabase Auth.
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pedidos: crear desde la web"
  ON pedidos FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Pedidos: gestionar"
  ON pedidos FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);