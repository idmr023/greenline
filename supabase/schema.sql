-- ============================================================
-- GreenLine - Supabase Schema
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- 1. Categorías
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nombre TEXT UNIQUE NOT NULL
);

INSERT INTO categorias (nombre) VALUES
  ('VMP'),
  ('Motos Eléctricas'),
  ('Trimotos Eléctricas'),
  ('Cargueros'),
  ('Accesorios');

-- 2. Productos (tabla central)
CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  categoria_id INT REFERENCES categorias(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  precio_original DECIMAL(10,2),
  precio_actual DECIMAL(10,2),
  destacado BOOLEAN DEFAULT false,
  video_id TEXT,
  etiquetas TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_productos_updated_at
  BEFORE UPDATE ON productos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 3. Colores (catálogo maestro)
CREATE TABLE colores (
  id SERIAL PRIMARY KEY,
  nombre TEXT UNIQUE NOT NULL,
  hex_code TEXT
);

INSERT INTO colores (nombre, hex_code) VALUES
  ('Blanco', '#FFFFFF'),
  ('Negro', '#1a1a1a'),
  ('Gris', '#808080'),
  ('Gris Oscuro', '#404040'),
  ('Rojo', '#DC2626'),
  ('Verde', '#009000'),
  ('Verde ligero', '#4ade80'),
  ('Verde Esmeralda', '#059669'),
  ('Verde Metálico', '#047857'),
  ('Celeste', '#38bdf8'),
  ('Azul', '#2563eb'),
  ('Crema', '#fef3c7'),
  ('Rosado', '#f472b6'),
  ('Plateado', '#9ca3af'),
  ('Marrón', '#92400e'),
  ('Naranja', '#f97316'),
  ('Camaleón', NULL);

-- 4. Relación Producto-Color (N:M + stock)
CREATE TABLE prod_color_rel (
  id SERIAL PRIMARY KEY,
  producto_id INT REFERENCES productos(id) ON DELETE CASCADE,
  color_id INT REFERENCES colores(id) ON DELETE CASCADE,
  stock INT DEFAULT 0 CHECK (stock >= 0),
  UNIQUE(producto_id, color_id)
);

-- 5. Imágenes
CREATE TABLE imagenes (
  id SERIAL PRIMARY KEY,
  producto_id INT REFERENCES productos(id) ON DELETE CASCADE,
  url TEXT,
  color TEXT,
  es_principal BOOLEAN DEFAULT false,
  orden INT DEFAULT 0
);

-- 6. Ficha técnica (1:1 con productos vehiculares)
CREATE TABLE ficha_tecnica (
  id SERIAL PRIMARY KEY,
  producto_id INT UNIQUE REFERENCES productos(id) ON DELETE CASCADE,
  tipo_motor TEXT,
  potencia_motor TEXT,
  torque_maximo TEXT,
  potencia_bateria TEXT,
  tipo_bateria TEXT,
  bateria_extraible BOOLEAN,
  capacidad_bateria TEXT,
  vida_util_bateria TEXT,
  tipo_toma_corriente TEXT,
  tiempo_carga_min INT,
  velocidad_max_kmh INT,
  autonomia_km INT,
  condiciones_autonomia TEXT,
  capacidad_escalada_pct INT,
  carga_maxima_kg INT,
  largo_cm INT,
  ancho_cm INT,
  alto_cm INT,
  accesorios JSONB DEFAULT '[]'::jsonb
);

-- 7. Info adicional (JSONB flexible)
CREATE TABLE info_adicional (
  id SERIAL PRIMARY KEY,
  producto_id INT UNIQUE REFERENCES productos(id) ON DELETE CASCADE,
  data JSONB DEFAULT '{}'::jsonb
);

-- 8. Modelos 3D (opcional)
CREATE TABLE modelos_3d (
  id SERIAL PRIMARY KEY,
  producto_id INT UNIQUE REFERENCES productos(id) ON DELETE CASCADE,
  glb_url TEXT,
  hotspots JSONB DEFAULT '[]'::jsonb
);

-- ============================================================
-- Vistas útiles
-- ============================================================

-- Stock total por producto (suma de stock por color)
CREATE VIEW stock_total AS
SELECT
  producto_id,
  COALESCE(SUM(stock), 0) AS total
FROM prod_color_rel
GROUP BY producto_id;

-- Productos con todo incluido (para el frontend)
CREATE VIEW productos_completos AS
SELECT
  p.*,
  c.nombre AS categoria_nombre,
  st.total AS stock_total,
  COALESCE(to_jsonb(ft) - 'id' - 'producto_id', '{}'::jsonb) AS ficha_tecnica,
  COALESCE(ia.data, '{}'::jsonb) AS info_adicional
FROM productos p
LEFT JOIN categorias c ON c.id = p.categoria_id
LEFT JOIN stock_total st ON st.producto_id = p.id
LEFT JOIN ficha_tecnica ft ON ft.producto_id = p.id
LEFT JOIN info_adicional ia ON ia.producto_id = p.id;

-- ============================================================
-- RLS (Row Level Security) - Opcional pero recomendado
-- ============================================================

-- Por ahora, lectura pública para el storefront
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE colores ENABLE ROW LEVEL SECURITY;
ALTER TABLE prod_color_rel ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ficha_tecnica ENABLE ROW LEVEL SECURITY;
ALTER TABLE info_adicional ENABLE ROW LEVEL SECURITY;
ALTER TABLE modelos_3d ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública
CREATE POLICY "Lectura pública de categorías"
  ON categorias FOR SELECT USING (true);

CREATE POLICY "Lectura pública de productos"
  ON productos FOR SELECT USING (true);

CREATE POLICY "Lectura pública de colores"
  ON colores FOR SELECT USING (true);

CREATE POLICY "Lectura pública de relaciones producto-color"
  ON prod_color_rel FOR SELECT USING (true);

CREATE POLICY "Lectura pública de imágenes"
  ON imagenes FOR SELECT USING (true);

CREATE POLICY "Lectura pública de ficha técnica"
  ON ficha_tecnica FOR SELECT USING (true);

CREATE POLICY "Lectura pública de info adicional"
  ON info_adicional FOR SELECT USING (true);

CREATE POLICY "Lectura pública de modelos 3D"
  ON modelos_3d FOR SELECT USING (true);

-- Políticas de escritura solo para authenticated users (admin)
CREATE POLICY "Admin puede gestionar productos"
  ON productos FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede gestionar categorías"
  ON categorias FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede gestionar colores"
  ON colores FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede gestionar relaciones producto-color"
  ON prod_color_rel FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede gestionar imágenes"
  ON imagenes FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede gestionar ficha técnica"
  ON ficha_tecnica FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede gestionar info adicional"
  ON info_adicional FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede gestionar modelos 3D"
  ON modelos_3d FOR ALL USING (auth.role() = 'authenticated');
