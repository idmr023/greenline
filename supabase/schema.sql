-- ============================================================
-- GreenLine - Esquema consolidado de Supabase
-- ============================================================
-- Este archivo contiene únicamente estructura: tipos, tablas,
-- índices, funciones, vistas, triggers, RLS y grants.
-- Los datos iniciales están en supabase/seed.sql.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------
-- Catálogo
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS colores (
  id SERIAL PRIMARY KEY,
  nombre TEXT UNIQUE NOT NULL,
  hex_code TEXT
);

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  categoria_id INT REFERENCES categorias(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  precio_original DECIMAL(10,2),
  precio_actual DECIMAL(10,2),
  destacado BOOLEAN NOT NULL DEFAULT false,
  disponible BOOLEAN NOT NULL DEFAULT true,
  video_id TEXT,
  manual_pdf TEXT,
  etiquetas TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prod_color_rel (
  id SERIAL PRIMARY KEY,
  producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  color_id INT NOT NULL REFERENCES colores(id) ON DELETE CASCADE,
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(producto_id, color_id)
);

CREATE TABLE IF NOT EXISTS imagenes (
  id SERIAL PRIMARY KEY,
  producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  url TEXT,
  color TEXT NOT NULL CHECK (btrim(color) <> ''),
  es_principal BOOLEAN NOT NULL DEFAULT false,
  orden INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ficha_tecnica (
  id SERIAL PRIMARY KEY,
  producto_id INT UNIQUE NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
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
  autonomia_km TEXT,
  carga_minima_kg INT,
  carga_maxima_kg INT,
  largo_cm INT,
  ancho_cm INT,
  alto_cm INT
);

CREATE TABLE IF NOT EXISTS info_adicional (
  id SERIAL PRIMARY KEY,
  producto_id INT UNIQUE NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS modelos_3d (
  id SERIAL PRIMARY KEY,
  producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  nombre TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- Usuarios, operaciones y auditoría
-- ------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Rol') THEN
    CREATE TYPE "Rol" AS ENUM (
      'ADMIN', 'EDITORA_BLOG', 'DISTRIBUCION', 'GERENTE_TIENDA',
      'COLABORADOR_TIENDA', 'GERENTE_ALMACEN', 'COLABORADOR_ALMACEN',
      'DESARROLLADOR_WEB', 'CLIENTE'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NivelAcceso') THEN
    CREATE TYPE "NivelAcceso" AS ENUM ('SUPER', 'ALMACEN', 'TIENDA', 'CONTENIDO', 'CLIENTE_N');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS tiendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  tipo TEXT NOT NULL,
  activa BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  telefono TEXT,
  avatar TEXT,
  rol "Rol" NOT NULL,
  nivel_acceso "NivelAcceso" NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT true,
  email_verificado BOOLEAN NOT NULL DEFAULT false,
  emails_allowed BOOLEAN NOT NULL DEFAULT true,
  emails_unsubscribed_at TIMESTAMPTZ,
  two_factor_secret TEXT,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
  two_factor_backup TEXT,
  gerente_id UUID REFERENCES users(id),
  tienda_id UUID REFERENCES tiendas(id),
  intentos_fallidos INTEGER NOT NULL DEFAULT 0,
  bloqueado_hasta TIMESTAMPTZ,
  ultimo_login TIMESTAMPTZ,
  ultimo_login_ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cliente_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  documento TEXT,
  direccion TEXT,
  ciudad TEXT,
  departamento TEXT
);

CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  codigo TEXT NOT NULL,
  tipo TEXT NOT NULL,
  expira_en TIMESTAMPTZ NOT NULL,
  usado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expira_en TIMESTAMPTZ NOT NULL,
  revoked BOOLEAN NOT NULL DEFAULT false,
  ip TEXT,
  user_agent TEXT,
  fingerprint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stock_moves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tienda_id UUID NOT NULL REFERENCES tiendas(id),
  producto_id INTEGER NOT NULL,
  color_id INTEGER,
  cantidad INTEGER NOT NULL,
  tipo TEXT NOT NULL,
  motivo TEXT,
  notas TEXT,
  estado TEXT NOT NULL DEFAULT 'APROBADO',
  aprobado_por UUID REFERENCES users(id),
  aprobado_en TIMESTAMPTZ,
  rechazado_motivo TEXT,
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pending_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitante_id UUID NOT NULL REFERENCES users(id),
  tipo TEXT NOT NULL,
  datos JSONB NOT NULL,
  gerente_id UUID REFERENCES users(id),
  estado TEXT NOT NULL DEFAULT 'pendiente',
  motivo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  accion TEXT NOT NULL,
  tabla TEXT NOT NULL,
  registro_id TEXT,
  datos_antes JSONB,
  datos_despues JSONB,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS panel_acceso (
  rol TEXT PRIMARY KEY,
  otorgado_por UUID,
  otorgado_el TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- Stock, pedidos y testimonios
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS prod_color_stock (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  producto_id INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  color_id INT NOT NULL REFERENCES colores(id) ON DELETE CASCADE,
  tienda_id UUID NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
  stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (producto_id, color_id, tienda_id)
);

CREATE TABLE IF NOT EXISTS pedidos (
  id BIGSERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  cliente JSONB NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  estado TEXT NOT NULL DEFAULT 'NUEVO',
  email_enviado BOOLEAN NOT NULL DEFAULT false,
  email_enviado_at TIMESTAMPTZ,
  email_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS testimonios (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  rol TEXT,
  texto TEXT NOT NULL,
  vehiculo TEXT,
  rating INT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  orden INT NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contactos (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  asunto TEXT NOT NULL DEFAULT '',
  mensaje TEXT NOT NULL DEFAULT '',
  leido BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_logs (
  id BIGSERIAL PRIMARY KEY,
  destinatario TEXT NOT NULL DEFAULT '',
  asunto TEXT NOT NULL DEFAULT '',
  estado TEXT NOT NULL DEFAULT 'ENVIADO',
  error TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- Tiendas, distribuidores y blog
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS greenline_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT NOT NULL DEFAULT 'Perú',
  department TEXT NOT NULL,
  province TEXT NOT NULL,
  district TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  schedule TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  whatsapp_url TEXT,
  maps_url TEXT,
  technical_service BOOLEAN NOT NULL DEFAULT false,
  technical_phone TEXT,
  technical_whatsapp_number TEXT,
  technical_whatsapp_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS greenline_distributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT NOT NULL DEFAULT 'Perú',
  department TEXT NOT NULL,
  province TEXT NOT NULL,
  district TEXT NOT NULL,
  name TEXT NOT NULL,
  ruc TEXT,
  contact_name TEXT,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  coordinate_precision TEXT NOT NULL DEFAULT 'city',
  maps_url TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  whatsapp_url TEXT,
  priority SMALLINT CHECK (priority IN (1, 2, 3)),
  technical_service BOOLEAN,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS greenline_province_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT NOT NULL DEFAULT 'Perú',
  name TEXT NOT NULL DEFAULT 'Ventas provincias',
  phone TEXT,
  whatsapp_number TEXT,
  whatsapp_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS greenline_manuales (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  archivo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT true,
  orden INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS greenline_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS greenline_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES greenline_categories(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  author TEXT NOT NULL DEFAULT 'A. Yeren',
  excerpt TEXT,
  content_html TEXT NOT NULL,
  content_text TEXT NOT NULL,
  image_url TEXT,
  image_alt TEXT,
  published_at DATE NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS greenline_post_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES greenline_posts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_alt TEXT,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------
-- Índices
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_tiendas_tipo ON tiendas(tipo);
CREATE INDEX IF NOT EXISTS idx_users_rol ON users(rol);
CREATE INDEX IF NOT EXISTS idx_users_nivel ON users(nivel_acceso);
CREATE INDEX IF NOT EXISTS idx_users_tienda ON users(tienda_id);
CREATE INDEX IF NOT EXISTS idx_users_activo ON users(activo);
CREATE INDEX IF NOT EXISTS idx_otp_user_codigo ON otp_codes(user_id, codigo);
CREATE INDEX IF NOT EXISTS idx_refresh_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS refresh_tokens_fingerprint_idx ON refresh_tokens(fingerprint) WHERE fingerprint IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_stock_tienda ON stock_moves(tienda_id);
CREATE INDEX IF NOT EXISTS idx_stock_producto ON stock_moves(producto_id);
CREATE INDEX IF NOT EXISTS idx_stock_color ON stock_moves(color_id);
CREATE INDEX IF NOT EXISTS idx_stock_estado ON stock_moves(estado);
CREATE INDEX IF NOT EXISTS idx_stock_created ON stock_moves(created_at);
CREATE INDEX IF NOT EXISTS idx_approval_solicitante ON pending_approvals(solicitante_id);
CREATE INDEX IF NOT EXISTS idx_approval_gerente ON pending_approvals(gerente_id);
CREATE INDEX IF NOT EXISTS idx_approval_estado ON pending_approvals(estado);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_tabla ON audit_logs(tabla);
CREATE INDEX IF NOT EXISTS idx_audit_accion ON audit_logs(accion);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_greenline_stores_country_department ON greenline_stores(country, department);
CREATE INDEX IF NOT EXISTS idx_greenline_stores_department_province ON greenline_stores(department, province);
CREATE INDEX IF NOT EXISTS idx_greenline_distributors_department_province ON greenline_distributors(department, province);
CREATE INDEX IF NOT EXISTS idx_greenline_distributors_priority ON greenline_distributors(priority);
CREATE INDEX IF NOT EXISTS idx_greenline_distributors_active ON greenline_distributors(active);
CREATE INDEX IF NOT EXISTS idx_greenline_posts_category_id ON greenline_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_greenline_posts_published_at ON greenline_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_greenline_posts_active ON greenline_posts(active);
CREATE INDEX IF NOT EXISTS idx_greenline_posts_featured ON greenline_posts(featured);
CREATE INDEX IF NOT EXISTS idx_greenline_post_images_post_id ON greenline_post_images(post_id);
CREATE INDEX IF NOT EXISTS idx_greenline_post_images_order ON greenline_post_images(post_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos(created_at DESC);

-- ------------------------------------------------------------
-- Funciones, triggers y vistas
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_productos_updated_at ON productos;
CREATE TRIGGER trg_productos_updated_at BEFORE UPDATE ON productos
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_pedidos_updated_at ON pedidos;
CREATE TRIGGER trg_pedidos_updated_at BEFORE UPDATE ON pedidos
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_testimonios_updated_at ON testimonios;
CREATE TRIGGER trg_testimonios_updated_at BEFORE UPDATE ON testimonios
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION fn_sync_stock_total()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_producto INT := COALESCE(NEW.producto_id, OLD.producto_id);
  v_color INT := COALESCE(NEW.color_id, OLD.color_id);
BEGIN
  UPDATE prod_color_rel
  SET stock = (
    SELECT COALESCE(SUM(stock), 0)::INT
    FROM prod_color_stock
    WHERE producto_id = v_producto AND color_id = v_color
  )
  WHERE producto_id = v_producto AND color_id = v_color;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_stock_total ON prod_color_stock;
CREATE TRIGGER trg_sync_stock_total
AFTER INSERT OR UPDATE OR DELETE ON prod_color_stock
FOR EACH ROW EXECUTE FUNCTION fn_sync_stock_total();

CREATE OR REPLACE VIEW stock_total AS
SELECT producto_id, COALESCE(SUM(stock), 0) AS total
FROM prod_color_rel GROUP BY producto_id;

CREATE OR REPLACE VIEW v_stock_resumen AS
WITH por_tipo AS (
  SELECT pcs.producto_id, pcs.color_id, t.tipo, SUM(pcs.stock)::INT AS stock_por_tipo
  FROM prod_color_stock pcs
  JOIN tiendas t ON t.id = pcs.tienda_id
  GROUP BY pcs.producto_id, pcs.color_id, t.tipo
)
SELECT pt.*, SUM(pt.stock_por_tipo) OVER (PARTITION BY pt.producto_id, pt.color_id)::INT AS stock_total
FROM por_tipo pt;

CREATE OR REPLACE VIEW productos_completos AS
SELECT p.*, c.nombre AS categoria_nombre, st.total AS stock_total,
  COALESCE(to_jsonb(ft) - 'id' - 'producto_id', '{}'::jsonb) AS ficha_tecnica,
  COALESCE(ia.data, '{}'::jsonb) AS info_adicional
FROM productos p
LEFT JOIN categorias c ON c.id = p.categoria_id
LEFT JOIN stock_total st ON st.producto_id = p.id
LEFT JOIN ficha_tecnica ft ON ft.producto_id = p.id
LEFT JOIN info_adicional ia ON ia.producto_id = p.id;

CREATE OR REPLACE VIEW vista_productos_web
WITH (security_invoker = true) AS
SELECT p.id, p.nombre, p.slug, p.descripcion, p.precio_original, p.precio_actual,
  p.destacado, p.video_id, p.etiquetas, p.created_at, p.updated_at,
  CASE WHEN p.disponible = false THEN 'Fuera de stock' ELSE 'En stock' END AS disponibilidad,
  c.id AS categoria_id, c.nombre AS categoria,
  COALESCE((SELECT json_agg(json_build_object(
    'id', i.id, 'src', i.url, 'color', i.color, 'es_principal', i.es_principal
  ) ORDER BY i.orden, i.id) FROM imagenes i WHERE i.producto_id = p.id), '[]'::json) AS imagenes,
  COALESCE((SELECT json_agg(json_build_object(
    'id', col.id, 'nombre', col.nombre, 'hex_code', col.hex_code,
    'stock', pcr.stock, 'visible', pcr.visible
  ) ORDER BY col.nombre)
  FROM prod_color_rel pcr JOIN colores col ON col.id = pcr.color_id
  WHERE pcr.producto_id = p.id), '[]'::json) AS colores_detalle,
  row_to_json(ft.*) AS ficha_tecnica,
  COALESCE(ia.data, '{}'::jsonb) AS info_adicional
FROM productos p
LEFT JOIN categorias c ON c.id = p.categoria_id
LEFT JOIN ficha_tecnica ft ON ft.producto_id = p.id
LEFT JOIN info_adicional ia ON ia.producto_id = p.id;

CREATE OR REPLACE VIEW greenline_locations_public AS
SELECT id, 'store'::TEXT AS location_type, country, department, province, district, name,
  address, latitude, longitude, NULL::TEXT AS coordinate_precision, schedule, phone,
  whatsapp_number, whatsapp_url, maps_url, NULL::SMALLINT AS priority,
  technical_service, active, sort_order
FROM greenline_stores
UNION ALL
SELECT id, 'distributor'::TEXT, country, department, province, district, name,
  address, latitude, longitude, coordinate_precision, NULL::TEXT, phone,
  whatsapp_number, whatsapp_url, maps_url, priority, technical_service, active, sort_order
FROM greenline_distributors;

CREATE OR REPLACE VIEW greenline_posts_public AS
SELECT p.id, p.title, p.slug, p.author, p.excerpt, p.content_html, p.content_text,
  p.image_url, p.image_alt, p.published_at, p.featured, p.active, p.sort_order,
  c.id AS category_id, c.name AS category, c.slug AS category_slug,
  COALESCE((
    SELECT json_agg(json_build_object(
      'image_url', img.image_url,
      'image_alt', img.image_alt,
      'caption', img.caption,
      'sort_order', img.sort_order
    ) ORDER BY img.sort_order)
    FROM greenline_post_images img
    WHERE img.post_id = p.id
  ), '[]'::json) AS gallery_images
FROM greenline_posts p
JOIN greenline_categories c ON c.id = p.category_id
WHERE p.active = true;

-- ------------------------------------------------------------
-- RLS y autorización del panel
-- ------------------------------------------------------------

ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE colores ENABLE ROW LEVEL SECURITY;
ALTER TABLE prod_color_rel ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ficha_tecnica ENABLE ROW LEVEL SECURITY;
ALTER TABLE info_adicional ENABLE ROW LEVEL SECURITY;
ALTER TABLE modelos_3d ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonios ENABLE ROW LEVEL SECURITY;
ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE libro_reclamaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE prod_color_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE panel_acceso ENABLE ROW LEVEL SECURITY;
ALTER TABLE greenline_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE greenline_distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE greenline_province_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE greenline_manuales ENABLE ROW LEVEL SECURITY;
ALTER TABLE greenline_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE greenline_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE greenline_post_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION es_admin_panel()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users u
    JOIN panel_acceso pa ON pa.rol = u.rol::TEXT
    WHERE u.email = (auth.jwt() ->> 'email') AND u.activo
  );
$$;

CREATE OR REPLACE FUNCTION es_distribucion()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users u
    JOIN panel_acceso pa ON pa.rol = u.rol::TEXT
    WHERE u.email = (auth.jwt() ->> 'email') AND u.activo
      AND u.rol::TEXT IN ('ADMIN', 'DESARROLLADOR_WEB', 'DISTRIBUCION')
  );
$$;

CREATE OR REPLACE FUNCTION es_blog_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users u
    JOIN panel_acceso pa ON pa.rol = u.rol::TEXT
    WHERE u.email = (auth.jwt() ->> 'email') AND u.activo
      AND u.rol::TEXT IN ('ADMIN', 'DESARROLLADOR_WEB', 'EDITORA_BLOG')
  );
$$;

GRANT EXECUTE ON FUNCTION es_admin_panel() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION es_distribucion() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION es_blog_admin() TO anon, authenticated;
GRANT SELECT ON vista_productos_web, productos_completos, stock_total, v_stock_resumen,
  greenline_locations_public, greenline_posts_public TO anon, authenticated;

-- Políticas idempotentes: se eliminan antes de recrearse para que el
-- archivo pueda ejecutarse sobre una base ya existente.
DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'categorias', 'productos', 'colores', 'prod_color_rel', 'imagenes',
        'ficha_tecnica', 'info_adicional', 'modelos_3d', 'testimonios',
        'pedidos', 'prod_color_stock', 'greenline_stores',
        'greenline_distributors', 'greenline_province_sales',
        'greenline_categories', 'greenline_posts', 'greenline_post_images',
        'reclamaciones', 'contactos', 'email_logs', 'libro_reclamaciones'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
  END LOOP;
END $$;

CREATE POLICY "Lectura pública de categorías" ON categorias FOR SELECT USING (true);
CREATE POLICY "Lectura pública de productos" ON productos FOR SELECT USING (true);
CREATE POLICY "Lectura pública de colores" ON colores FOR SELECT USING (true);
CREATE POLICY "Lectura pública de relaciones producto-color" ON prod_color_rel FOR SELECT USING (true);
CREATE POLICY "Lectura pública de imágenes" ON imagenes FOR SELECT USING (true);
CREATE POLICY "Lectura pública de ficha técnica" ON ficha_tecnica FOR SELECT USING (true);
CREATE POLICY "Lectura pública de info adicional" ON info_adicional FOR SELECT USING (true);
CREATE POLICY "Lectura pública de modelos 3D" ON modelos_3d FOR SELECT USING (true);
CREATE POLICY "Lectura pública de testimonios" ON testimonios FOR SELECT USING (true);
CREATE POLICY "Contacto: crear desde la web" ON contactos FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Pedidos: crear desde la web" ON pedidos FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Lectura pública de tiendas" ON greenline_stores FOR SELECT USING (active);
CREATE POLICY "Lectura pública de distribuidores" ON greenline_distributors FOR SELECT USING (active);
CREATE POLICY "Lectura pública de ventas provincias" ON greenline_province_sales FOR SELECT USING (active);
CREATE POLICY "Lectura pública de manuales" ON greenline_manuales FOR SELECT USING (activo);
CREATE POLICY "Lectura pública de categorías blog" ON greenline_categories FOR SELECT USING (true);
CREATE POLICY "Lectura pública de posts" ON greenline_posts FOR SELECT USING (true);
CREATE POLICY "Lectura pública de imágenes blog" ON greenline_post_images FOR SELECT USING (true);

CREATE POLICY "Panel gestiona categorías" ON categorias FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
CREATE POLICY "Panel gestiona productos" ON productos FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
CREATE POLICY "Panel gestiona colores" ON colores FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
CREATE POLICY "Panel gestiona relaciones" ON prod_color_rel FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
CREATE POLICY "Panel gestiona imágenes" ON imagenes FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
CREATE POLICY "Panel gestiona ficha técnica" ON ficha_tecnica FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
CREATE POLICY "Panel gestiona info adicional" ON info_adicional FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
CREATE POLICY "Panel gestiona modelos 3D" ON modelos_3d FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
CREATE POLICY "Panel gestiona testimonios" ON testimonios FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
CREATE POLICY "Panel gestiona contactos" ON contactos FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
CREATE POLICY "Panel gestiona email_logs" ON email_logs FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
CREATE POLICY "Panel gestiona libro_reclamaciones" ON libro_reclamaciones FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
CREATE POLICY "Panel gestiona reclamaciones" ON reclamaciones FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
CREATE POLICY "Panel gestiona manuales" ON greenline_manuales FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
CREATE POLICY "Panel gestiona pedidos" ON pedidos FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
CREATE POLICY "Panel gestiona stock" ON prod_color_stock FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
CREATE POLICY "Distribución gestiona distribuidores" ON greenline_distributors FOR ALL TO authenticated
  USING (es_distribucion()) WITH CHECK (es_distribucion());
CREATE POLICY "Blog gestiona categorías" ON greenline_categories FOR ALL TO authenticated
  USING (es_blog_admin()) WITH CHECK (es_blog_admin());
CREATE POLICY "Blog gestiona posts" ON greenline_posts FOR ALL TO authenticated
  USING (es_blog_admin()) WITH CHECK (es_blog_admin());
CREATE POLICY "Blog gestiona imágenes" ON greenline_post_images FOR ALL TO authenticated
  USING (es_blog_admin()) WITH CHECK (es_blog_admin());

REVOKE ALL ON TABLE users, otp_codes, refresh_tokens, audit_logs, panel_acceso
  FROM anon, authenticated;
