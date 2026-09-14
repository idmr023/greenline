-- ============================================================
-- Unificación de seguridad, RLS y auditoría
--
-- Esta migración consolida las reglas de seguridad que estaban
-- fragmentadas en schema.sql, backend/prisma/audit-triggers.sql,
-- migraciones anteriores y scripts antiguos.
--
-- Incluye:
--   1) Funciones de autorización unificadas (es_admin_panel(),
--      es_distribucion(), es_blog_admin())
--   2) Políticas RLS unificadas para todas las tablas críticas
--   3) Funciones de auditoría unificadas (fn_audit_row_change)
--   4) Triggers de auditoría consistentes en todas las tablas
--   5) Revisión de permisos sobre audit_logs (WORM)
--   6) Políticas específicas para ficha_tecnica (fix del error
--      "new row violates row-level security policy")
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1) Funciones de autorización unificadas
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION es_admin_panel()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM users u
    JOIN panel_acceso pa ON pa.rol = u.rol::TEXT
    WHERE u.email = (auth.jwt() ->> 'email')
      AND u.activo
      AND u.rol::TEXT IN ('ADMIN', 'DESARROLLADOR_WEB')
  );
$$;

CREATE OR REPLACE FUNCTION es_distribucion()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM users u
    JOIN panel_acceso pa ON pa.rol = u.rol::TEXT
    WHERE u.email = (auth.jwt() ->> 'email')
      AND u.activo
      AND u.rol::TEXT IN ('ADMIN', 'DESARROLLADOR_WEB', 'DISTRIBUCION')
  );
$$;

CREATE OR REPLACE FUNCTION es_blog_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM users u
    JOIN panel_acceso pa ON pa.rol = u.rol::TEXT
    WHERE u.email = (auth.jwt() ->> 'email')
      AND u.activo
      AND u.rol::TEXT IN ('ADMIN', 'DESARROLLADOR_WEB', 'EDITORA_BLOG')
  );
$$;

-- ------------------------------------------------------------
-- 2) Funciones de auditoría unificadas
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_audit_row_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_row JSONB;
  v_id TEXT;
BEGIN
  v_row := CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END;
  v_id := COALESCE(v_row ->> 'id', v_row ->> 'producto_id', v_row ->> 'user_id');

  INSERT INTO audit_logs (
    user_id, accion, tabla, registro_id, datos_antes, datos_despues,
    objeto_tipo, objeto_nombre, transaction_id, metadata
  )
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    v_id,
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) END,
    'TABLE',
    TG_TABLE_SCHEMA || '.' || TG_TABLE_NAME,
    txid_current(),
    jsonb_build_object('trigger', TG_NAME)
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION fn_register_price_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.precio_original IS DISTINCT FROM OLD.precio_original
     OR NEW.precio_actual IS DISTINCT FROM OLD.precio_actual THEN
    INSERT INTO precio_historial (
      producto_id,
      precio_original_anterior,
      precio_original_nuevo,
      precio_actual_anterior,
      precio_actual_nuevo,
      user_id
    )
    VALUES (
      NEW.id,
      OLD.precio_original,
      NEW.precio_original,
      OLD.precio_actual,
      NEW.precio_actual,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$;

-- ------------------------------------------------------------
-- 3) Triggers de auditoría en todas las tablas críticas
-- ------------------------------------------------------------

DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'categorias', 'productos', 'colores', 'prod_color_rel', 'imagenes',
    'ficha_tecnica', 'info_adicional', 'modelos_3d', 'testimonios',
    'pedidos', 'prod_color_stock', 'greenline_stores',
    'greenline_distributors', 'greenline_province_sales',
    'greenline_categories', 'greenline_posts', 'greenline_post_images',
    'greenline_manuales'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', 'trg_audit_' || table_name, table_name);
    EXECUTE format(
      'CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE ON %I
       FOR EACH ROW EXECUTE FUNCTION fn_audit_row_change()',
      'trg_audit_' || table_name,
      table_name
    );
  END LOOP;
END $$;

-- Trigger específico para historial de precios
DROP TRIGGER IF EXISTS trg_productos_price_history ON productos;
CREATE TRIGGER trg_productos_price_history
AFTER UPDATE OF precio_original, precio_actual ON productos
FOR EACH ROW EXECUTE FUNCTION fn_register_price_change();

-- ------------------------------------------------------------
-- 4) Políticas RLS unificadas para tablas críticas
-- ------------------------------------------------------------

-- 4.1 Funciones auxiliares para políticas específicas
CREATE OR REPLACE FUNCTION es_admin_panel()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM users u
    JOIN panel_acceso pa ON pa.rol = u.rol::TEXT
    WHERE u.email = (auth.jwt() ->> 'email')
      AND u.activo
      AND u.rol::TEXT IN ('ADMIN', 'DESARROLLADOR_WEB')
  );
$$;

CREATE OR REPLACE FUNCTION es_distribucion()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM users u
    JOIN panel_acceso pa ON pa.rol = u.rol::TEXT
    WHERE u.email = (auth.jwt() ->> 'email')
      AND u.activo
      AND u.rol::TEXT IN ('ADMIN', 'DESARROLLADOR_WEB', 'DISTRIBUCION')
  );
$$;

CREATE OR REPLACE FUNCTION es_blog_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM users u
    JOIN panel_acceso pa ON pa.rol = u.rol::TEXT
    WHERE u.email = (auth.jwt() ->> 'email')
      AND u.activo
      AND u.rol::TEXT IN ('ADMIN', 'DESARROLLADOR_WEB', 'EDITORA_BLOG')
  );
$$;

-- 4.2 Políticas públicas de lectura
DROP POLICY IF EXISTS "Lectura pública de categorías" ON categorias;
CREATE POLICY "Lectura pública de categorías" ON categorias FOR SELECT USING (true);
DROP POLICY IF EXISTS "Lectura pública de productos" ON productos;
CREATE POLICY "Lectura pública de productos" ON productos FOR SELECT USING (true);
DROP POLICY IF EXISTS "Lectura pública de colores" ON colores;
CREATE POLICY "Lectura pública de colores" ON colores FOR SELECT USING (true);
DROP POLICY IF EXISTS "Lectura pública de relaciones producto-color" ON prod_color_rel;
CREATE POLICY "Lectura pública de relaciones producto-color" ON prod_color_rel FOR SELECT USING (true);
DROP POLICY IF EXISTS "Lectura pública de imágenes" ON imagenes;
CREATE POLICY "Lectura pública de imágenes" ON imagenes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Lectura pública de ficha técnica" ON ficha_tecnica;
CREATE POLICY "Lectura pública de ficha técnica" ON ficha_tecnica FOR SELECT USING (true);
DROP POLICY IF EXISTS "Lectura pública de info adicional" ON info_adicional;
CREATE POLICY "Lectura pública de info adicional" ON info_adicional FOR SELECT USING (true);
DROP POLICY IF EXISTS "Lectura pública de modelos 3D" ON modelos_3d;
CREATE POLICY "Lectura pública de modelos 3D" ON modelos_3d FOR SELECT USING (true);
DROP POLICY IF EXISTS "Lectura pública de testimonios" ON testimonios;
CREATE POLICY "Lectura pública de testimonios" ON testimonios FOR SELECT USING (true);
DROP POLICY IF EXISTS "Pedidos: crear desde la web" ON pedidos;
CREATE POLICY "Pedidos: crear desde la web" ON pedidos FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Lectura pública de tiendas" ON greenline_stores;
CREATE POLICY "Lectura pública de tiendas" ON greenline_stores FOR SELECT USING (active);
DROP POLICY IF EXISTS "Lectura pública de distribuidores" ON greenline_distributors;
CREATE POLICY "Lectura pública de distribuidores" ON greenline_distributors FOR SELECT USING (active);
DROP POLICY IF EXISTS "Lectura pública de ventas provincias" ON greenline_province_sales;
CREATE POLICY "Lectura pública de ventas provincias" ON greenline_province_sales FOR SELECT USING (active);
DROP POLICY IF EXISTS "Lectura pública de manuales" ON greenline_manuales;
CREATE POLICY "Lectura pública de manuales" ON greenline_manuales FOR SELECT USING (activo);
DROP POLICY IF EXISTS "Lectura pública de categorías blog" ON greenline_categories;
CREATE POLICY "Lectura pública de categorías blog" ON greenline_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Lectura pública de posts" ON greenline_posts;
CREATE POLICY "Lectura pública de posts" ON greenline_posts FOR SELECT USING (active = true);
DROP POLICY IF EXISTS "Lectura pública de imágenes blog" ON greenline_post_images;
CREATE POLICY "Lectura pública de imágenes blog" ON greenline_post_images FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM greenline_posts p
    WHERE p.id = greenline_post_images.post_id
      AND p.active = true
  )
);

-- 4.3 Políticas de panel (ADMIN, DESARROLLADOR_WEB)
DROP POLICY IF EXISTS "Panel gestiona categorías" ON categorias;
CREATE POLICY "Panel gestiona categorías" ON categorias FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
DROP POLICY IF EXISTS "Panel gestiona productos" ON productos;
CREATE POLICY "Panel gestiona productos" ON productos FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
DROP POLICY IF EXISTS "Panel gestiona colores" ON colores;
CREATE POLICY "Panel gestiona colores" ON colores FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
DROP POLICY IF EXISTS "Panel gestiona relaciones" ON prod_color_rel;
CREATE POLICY "Panel gestiona relaciones" ON prod_color_rel FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
DROP POLICY IF EXISTS "Panel gestiona imágenes" ON imagenes;
CREATE POLICY "Panel gestiona imágenes" ON imagenes FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
DROP POLICY IF EXISTS "Panel gestiona ficha técnica" ON ficha_tecnica;
CREATE POLICY "Panel gestiona ficha técnica" ON ficha_tecnica FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
DROP POLICY IF EXISTS "Panel gestiona info adicional" ON info_adicional;
CREATE POLICY "Panel gestiona info adicional" ON info_adicional FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
DROP POLICY IF EXISTS "Panel gestiona modelos 3D" ON modelos_3d;
CREATE POLICY "Panel gestiona modelos 3D" ON modelos_3d FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
DROP POLICY IF EXISTS "Panel gestiona testimonios" ON testimonios;
CREATE POLICY "Panel gestiona testimonios" ON testimonios FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
DROP POLICY IF EXISTS "Panel gestiona pedidos" ON pedidos;
CREATE POLICY "Panel gestiona pedidos" ON pedidos FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
DROP POLICY IF EXISTS "Panel gestiona stock" ON prod_color_stock;
CREATE POLICY "Panel gestiona stock" ON prod_color_stock FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());
DROP POLICY IF EXISTS "Panel gestiona manuales" ON greenline_manuales;
CREATE POLICY "Panel gestiona manuales" ON greenline_manuales FOR ALL TO authenticated
  USING (es_admin_panel()) WITH CHECK (es_admin_panel());

-- 4.4 Políticas específicas por rol
DROP POLICY IF EXISTS "Distribución gestiona distribuidores" ON greenline_distributors;
CREATE POLICY "Distribución gestiona distribuidores" ON greenline_distributors FOR ALL TO authenticated
  USING (es_distribucion()) WITH CHECK (es_distribucion());
DROP POLICY IF EXISTS "Blog gestiona categorías" ON greenline_categories;
CREATE POLICY "Blog gestiona categorías" ON greenline_categories FOR ALL TO authenticated
  USING (es_blog_admin()) WITH CHECK (es_blog_admin());
DROP POLICY IF EXISTS "Blog gestiona posts" ON greenline_posts;
CREATE POLICY "Blog gestiona posts" ON greenline_posts FOR ALL TO authenticated
  USING (es_blog_admin()) WITH CHECK (es_blog_admin());
DROP POLICY IF EXISTS "Blog gestiona imágenes" ON greenline_post_images;
CREATE POLICY "Blog gestiona imágenes" ON greenline_post_images FOR ALL TO authenticated
  USING (es_blog_admin()) WITH CHECK (es_blog_admin());

-- 4.5 Permisos sobre tablas sensibles
REVOKE ALL ON TABLE users, otp_codes, refresh_tokens, audit_logs, panel_acceso
  FROM anon, authenticated;

-- ------------------------------------------------------------
-- 5) Permisos sobre auditoría y reportes
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_audit_ddl()
RETURNS EVENT_TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  command RECORD;
BEGIN
  FOR command IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    INSERT INTO audit_logs (
      user_id, accion, tabla, registro_id, objeto_tipo, objeto_nombre,
      transaction_id, metadata
    )
    VALUES (
      auth.uid(),
      'DDL',
      COALESCE(command.object_type, 'UNKNOWN'),
      command.object_identity,
      command.object_type,
      command.object_identity,
      txid_current(),
      jsonb_build_object(
        'schema', command.schema_name,
        'command_tag', tg_tag
      )
    );
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION fn_audit_sql_drop()
RETURNS EVENT_TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  dropped RECORD;
BEGIN
  FOR dropped IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    INSERT INTO audit_logs (
      user_id, accion, tabla, registro_id, objeto_tipo, objeto_nombre,
      transaction_id, metadata
    )
    VALUES (
      auth.uid(),
      'DROP',
      COALESCE(dropped.object_type, 'UNKNOWN'),
      dropped.object_identity,
      dropped.object_type,
      dropped.object_identity,
      txid_current(),
      jsonb_build_object(
        'schema', dropped.schema_name,
        'is_temporary', dropped.is_temporary
      )
    );
  END LOOP;
END;
$$;

DROP EVENT TRIGGER IF EXISTS trg_audit_ddl;
CREATE EVENT TRIGGER trg_audit_ddl ON ddl_command_end EXECUTE FUNCTION fn_audit_ddl();

DROP EVENT TRIGGER IF EXISTS trg_audit_sql_drop;
CREATE EVENT TRIGGER trg_audit_sql_drop ON sql_drop EXECUTE FUNCTION fn_audit_sql_drop();

REVOKE ALL ON FUNCTION fn_audit_row_change() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION fn_register_price_change() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION fn_audit_ddl() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION fn_audit_sql_drop() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE VIEW greenline_locations_public
WITH (security_invoker = true) AS
SELECT id, 'store'::TEXT AS location_type, country, department, province, district, name,
  address, latitude, longitude, NULL::TEXT AS coordinate_precision, schedule, phone,
  whatsapp_number, whatsapp_url, maps_url, NULL::SMALLINT AS priority,
  technical_service, active, sort_order
FROM greenline_stores
WHERE active = true
UNION ALL
SELECT id, 'distributor'::TEXT, country, department, province, district, name,
  address, latitude, longitude, coordinate_precision, NULL::TEXT, phone,
  whatsapp_number, whatsapp_url, maps_url, priority, technical_service, active, sort_order
FROM greenline_distributors
WHERE active = true;

CREATE OR REPLACE VIEW greenline_posts_public
WITH (security_invoker = true) AS
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

REVOKE SELECT ON productos_completos, stock_total, v_stock_resumen
  FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION es_admin_panel() FROM anon;
GRANT EXECUTE ON FUNCTION es_admin_panel() TO authenticated;

CREATE OR REPLACE VIEW reporte_pedidos_rollup
WITH (security_invoker = true) AS
WITH base AS (
  SELECT EXTRACT(YEAR FROM created_at)::INT AS anio,
         EXTRACT(MONTH FROM created_at)::INT AS mes,
         estado,
         total
  FROM pedidos
)
SELECT
  CASE WHEN GROUPING(anio) = 1 THEN 'Total corporativo' ELSE anio::TEXT END AS anio,
  CASE WHEN GROUPING(mes) = 1 THEN 'Subtotal anual' ELSE LPAD(mes::TEXT, 2, '0') END AS mes,
  CASE WHEN GROUPING(estado) = 1 THEN 'Subtotal' ELSE estado END AS estado,
  COUNT(*) AS pedidos,
  COALESCE(SUM(total), 0)::DECIMAL(12,2) AS total,
  GROUPING(anio, mes, estado) AS grouping_id
FROM base
GROUP BY ROLLUP (anio, mes, estado);

CREATE OR REPLACE VIEW reporte_stock_cube
WITH (security_invoker = true) AS
SELECT
  CASE WHEN GROUPING(t.ciudad) = 1 THEN 'Total corporativo' ELSE COALESCE(t.ciudad, 'Sin ciudad') END AS region,
  CASE WHEN GROUPING(c.nombre) = 1 THEN 'Total categoría' ELSE COALESCE(c.nombre, 'Sin categoría') END AS categoria,
  CASE WHEN GROUPING(p.nombre) = 1 THEN 'Total producto' ELSE COALESCE(p.nombre, 'Sin producto') END AS producto,
  SUM(pcs.stock)::INT AS stock,
  GROUPING(t.ciudad, c.nombre, p.nombre) AS grouping_id
FROM prod_color_stock pcs
JOIN tiendas t ON t.id = pcs.tienda_id
JOIN productos p ON p.id = pcs.producto_id
LEFT JOIN categorias c ON c.id = p.categoria_id
GROUP BY CUBE (t.ciudad, c.nombre, p.nombre);

CREATE OR REPLACE VIEW reporte_pedidos_grouping_sets
WITH (security_invoker = true) AS
WITH base AS (
  SELECT EXTRACT(YEAR FROM created_at)::INT AS anio,
         EXTRACT(MONTH FROM created_at)::INT AS mes,
         estado,
         total
  FROM pedidos
)
SELECT
  CASE WHEN GROUPING(anio) = 1 THEN 'Todos' ELSE anio::TEXT END AS anio,
  CASE WHEN GROUPING(mes) = 1 THEN 'Todos' ELSE LPAD(mes::TEXT, 2, '0') END AS mes,
  CASE WHEN GROUPING(estado) = 1 THEN 'Todos' ELSE estado END AS estado,
  COUNT(*) AS pedidos,
  COALESCE(SUM(total), 0)::DECIMAL(12,2) AS total,
  GROUPING(anio, mes, estado) AS grouping_id
FROM base
GROUP BY GROUPING SETS ((anio, mes), (estado), (anio, mes, estado), ());

REVOKE ALL ON reporte_pedidos_rollup, reporte_stock_cube, reporte_pedidos_grouping_sets
  FROM PUBLIC, anon, authenticated;
GRANT SELECT ON reporte_pedidos_rollup, reporte_stock_cube, reporte_pedidos_grouping_sets
  TO authenticated;

CREATE OR REPLACE PROCEDURE purgar_auditoria(p_before TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT es_admin_panel() THEN
    RAISE EXCEPTION 'Solo un administrador puede purgar auditoría';
  END IF;
  IF p_before IS NULL OR p_before >= now() THEN
    RAISE EXCEPTION 'La fecha de corte debe estar en el pasado';
  END IF;
  DELETE FROM audit_logs WHERE created_at < p_before;
END;
$$;

REVOKE ALL ON PROCEDURE purgar_auditoria(TIMESTAMPTZ) FROM PUBLIC, anon;
GRANT EXECUTE ON PROCEDURE purgar_auditoria(TIMESTAMPTZ) TO authenticated;

COMMIT;
