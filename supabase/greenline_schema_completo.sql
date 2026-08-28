-- ============================================================
-- GreenLine - Schema completo de la base de datos
-- Fecha: 2026-08-26
-- Base de datos: Supabase PostgreSQL (nxcbtcexsakfenjfdarr)
--
-- Este archivo consolida TODO el schema de GreenLine:
--   1. Tablas de productos (creadas por Supabase/migración original)
--   2. Foreign keys de productos (creadas manualmente 2026-08-26)
--   3. Tablas de auth/usuarios/stock/auditoría (creadas manualmente 2026-08-26)
--   4. Seed data (usuarios de prueba)
--   5. Políticas RLS de Supabase
-- ============================================================

-- ============================================================
-- 1. TABLAS EXISTENTES (productos, categorías, etc.)
--    Estas tablas ya existían en Supabase antes del backend.
--    Incluidas aquí solo como referencia.
-- ============================================================

-- categorias (ya existía)
-- productos (ya existía)
-- colores (ya existía)
-- prod_color_rel (ya existía)
-- imagenes (ya existía)
-- ficha_tecnica (ya existía)
-- info_adicional (ya existía)
-- modelos_3d (ya existía)

-- ============================================================
-- 2. FOREIGN KEYS DE PRODUCTOS
--    Creadas manualmente el 2026-08-26 porque Prisma db push
--    falló por conflicto con vistas de Supabase.
-- ============================================================

-- productos → categorias
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'productos_categoria_id_fkey'
  ) THEN
    ALTER TABLE productos
      ADD CONSTRAINT productos_categoria_id_fkey
      FOREIGN KEY (categoria_id) REFERENCES categorias(id)
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- imagenes → productos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'imagenes_producto_id_fkey'
  ) THEN
    ALTER TABLE imagenes
      ADD CONSTRAINT imagenes_producto_id_fkey
      FOREIGN KEY (producto_id) REFERENCES productos(id)
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- prod_color_rel → productos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'prod_color_rel_producto_id_fkey'
  ) THEN
    ALTER TABLE prod_color_rel
      ADD CONSTRAINT prod_color_rel_producto_id_fkey
      FOREIGN KEY (producto_id) REFERENCES productos(id)
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- prod_color_rel → colores
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'prod_color_rel_color_id_fkey'
  ) THEN
    ALTER TABLE prod_color_rel
      ADD CONSTRAINT prod_color_rel_color_id_fkey
      FOREIGN KEY (color_id) REFERENCES colores(id)
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- ficha_tecnica → productos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ficha_tecnica_producto_id_fkey'
  ) THEN
    ALTER TABLE ficha_tecnica
      ADD CONSTRAINT ficha_tecnica_producto_id_fkey
      FOREIGN KEY (producto_id) REFERENCES productos(id)
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- info_adicional → productos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'info_adicional_producto_id_fkey'
  ) THEN
    ALTER TABLE info_adicional
      ADD CONSTRAINT info_adicional_producto_id_fkey
      FOREIGN KEY (producto_id) REFERENCES productos(id)
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- ============================================================
-- 3. TABLAS DE AUTH / USUARIOS / STOCK / AUDITORÍA
--    Creadas el 2026-08-26 para el backend Express + Prisma.
-- ============================================================

-- 3.1 tiendas
CREATE TABLE IF NOT EXISTS tiendas (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre    TEXT NOT NULL,
  direccion TEXT NOT NULL,
  ciudad    TEXT NOT NULL,
  tipo      TEXT NOT NULL,
  activa    BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_tiendas_tipo ON tiendas(tipo);

-- 3.2 users
CREATE TABLE IF NOT EXISTS users (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email              TEXT UNIQUE NOT NULL,
  password_hash      TEXT NOT NULL,
  nombre             TEXT NOT NULL,
  apellido           TEXT NOT NULL,
  telefono           TEXT,
  avatar             TEXT,
  rol                TEXT NOT NULL,
  nivel_acceso       TEXT NOT NULL,
  activo             BOOLEAN NOT NULL DEFAULT true,
  email_verificado   BOOLEAN NOT NULL DEFAULT false,
  two_factor_secret  TEXT,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
  two_factor_backup  TEXT,
  gerente_id         UUID REFERENCES users(id),
  tienda_id          UUID REFERENCES tiendas(id),
  intentos_fallidos  INTEGER NOT NULL DEFAULT 0,
  bloqueado_hasta    TIMESTAMPTZ,
  ultimo_login       TIMESTAMPTZ,
  ultimo_login_ip    TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_rol    ON users(rol);
CREATE INDEX IF NOT EXISTS idx_users_nivel  ON users(nivel_acceso);
CREATE INDEX IF NOT EXISTS idx_users_tienda ON users(tienda_id);
CREATE INDEX IF NOT EXISTS idx_users_activo ON users(activo);

-- 3.3 cliente_profiles
CREATE TABLE IF NOT EXISTS cliente_profiles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  documento    TEXT,
  direccion    TEXT,
  ciudad       TEXT,
  departamento TEXT
);

-- 3.4 otp_codes (necesario para login de clientes)
CREATE TABLE IF NOT EXISTS otp_codes (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  codigo    TEXT NOT NULL,
  tipo      TEXT NOT NULL,
  expira_en TIMESTAMPTZ NOT NULL,
  usado     BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_otp_user_codigo ON otp_codes(user_id, codigo);

-- 3.5 refresh_tokens (necesario para login de todos los usuarios)
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT UNIQUE NOT NULL,
  expira_en  TIMESTAMPTZ NOT NULL,
  revoked    BOOLEAN NOT NULL DEFAULT false,
  ip         TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_refresh_user    ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_token   ON refresh_tokens(token);

-- 3.6 audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  accion       TEXT NOT NULL,
  tabla        TEXT NOT NULL,
  registro_id  TEXT,
  datos_antes  JSONB,
  datos_despues JSONB,
  ip           TEXT,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_user      ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_tabla     ON audit_logs(tabla);
CREATE INDEX IF NOT EXISTS idx_audit_accion    ON audit_logs(accion);
CREATE INDEX IF NOT EXISTS idx_audit_created   ON audit_logs(created_at);

-- 3.7 stock_moves
CREATE TABLE IF NOT EXISTS stock_moves (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tienda_id       UUID NOT NULL REFERENCES tiendas(id),
  producto_id     INTEGER NOT NULL,
  color_id        INTEGER,
  cantidad        INTEGER NOT NULL,
  tipo            TEXT NOT NULL,
  motivo          TEXT,
  notas           TEXT,
  estado          TEXT NOT NULL DEFAULT 'APROBADO',
  aprobado_por    UUID REFERENCES users(id),
  aprobado_en     TIMESTAMPTZ,
  rechazado_motivo TEXT,
  user_id         UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stock_tienda    ON stock_moves(tienda_id);
CREATE INDEX IF NOT EXISTS idx_stock_producto  ON stock_moves(producto_id);
CREATE INDEX IF NOT EXISTS idx_stock_color     ON stock_moves(color_id);
CREATE INDEX IF NOT EXISTS idx_stock_estado    ON stock_moves(estado);
CREATE INDEX IF NOT EXISTS idx_stock_created   ON stock_moves(created_at);

-- 3.8 pending_approvals
CREATE TABLE IF NOT EXISTS pending_approvals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitante_id  UUID NOT NULL REFERENCES users(id),
  tipo            TEXT NOT NULL,
  datos           JSONB NOT NULL,
  gerente_id      UUID REFERENCES users(id),
  estado          TEXT NOT NULL DEFAULT 'pendiente',
  motivo          TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at      TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_approval_solicitante ON pending_approvals(solicitante_id);
CREATE INDEX IF NOT EXISTS idx_approval_gerente     ON pending_approvals(gerente_id);
CREATE INDEX IF NOT EXISTS idx_approval_estado      ON pending_approvals(estado);

-- ============================================================
-- 4. SEED DATA — Usuarios de prueba
--    Generados con: node prisma/seed.js (2026-08-26)
-- ============================================================

-- 4.1 Tiendas
INSERT INTO tiendas (id, nombre, direccion, ciudad, tipo, activa)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'GreenLine Almacén Central',  'Av. Industrial 123',      'Lima',     'almacen', true),
  ('00000000-0000-0000-0000-000000000002', 'GreenLine Tienda Lince',     'Av. José Leal 507',      'Lima',     'tienda',  true),
  ('00000000-0000-0000-0000-000000000003', 'GreenLine Tienda Surco',     'Av. Surco 790',          'Lima',     'tienda',  true),
  ('00000000-0000-0000-0000-000000000004', 'GreenLine Tienda Huancayo',  'Av. Huancavelica 290',   'Huancayo', 'tienda',  true)
ON CONFLICT (id) DO NOTHING;

-- 4.2 Usuarios (contraseñas hasheadas con argon2id)
-- admin@greenline.com / GreenLine@2026
INSERT INTO users (id, email, password_hash, nombre, apellido, rol, nivel_acceso, email_verificado, activo)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  'admin@greenline.com',
  '$argon2id$v=19$m=65536,t=4,p=4$d2hhdGV2ZXI$placeholder',
  'Admin', 'GreenLine',
  'ADMIN', 'SUPER',
  true, true
)
ON CONFLICT (email) DO NOTHING;

-- gerente.lince@greenline.com / Gerente@2026
INSERT INTO users (id, email, password_hash, nombre, apellido, rol, nivel_acceso, tienda_id, email_verificado, activo)
VALUES (
  '10000000-0000-0000-0000-000000000002',
  'gerente.lince@greenline.com',
  '$argon2id$v=19$m=65536,t=4,p=4$d2hhdGV2ZXI$placeholder',
  'Carlos', 'Mendoza',
  'GERENTE_TIENDA', 'TIENDA',
  '00000000-0000-0000-0000-000000000002',
  true, true
)
ON CONFLICT (email) DO NOTHING;

-- colaborador.lince@greenline.com / Colab@2026
INSERT INTO users (id, email, password_hash, nombre, apellido, rol, nivel_acceso, tienda_id, gerente_id, email_verificado, activo)
VALUES (
  '10000000-0000-0000-0000-000000000003',
  'colaborador.lince@greenline.com',
  '$argon2id$v=19$m=65536,t=4,p=4$d2hhdGV2ZXI$placeholder',
  'María', 'García',
  'COLABORADOR_TIENDA', 'TIENDA',
  '00000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000002',
  true, true
)
ON CONFLICT (email) DO NOTHING;

-- cliente@test.com / Cliente@2026
INSERT INTO users (id, email, password_hash, nombre, apellido, rol, nivel_acceso, email_verificado, activo)
VALUES (
  '10000000-0000-0000-0000-000000000004',
  'cliente@test.com',
  '$argon2id$v=19$m=65536,t=4,p=4$d2hhdGV2ZXI$placeholder',
  'Juan', 'Pérez',
  'CLIENTE', 'CLIENTE_N',
  true, true
)
ON CONFLICT (email) DO NOTHING;

-- ivan.manrique@greenline.com / greenlinwerb34$
INSERT INTO users (id, email, password_hash, nombre, apellido, rol, nivel_acceso, email_verificado, activo)
VALUES (
  '10000000-0000-0000-0000-000000000005',
  'ivan.manrique@greenline.com',
  '$argon2id$v=19$m=65536,t=4,p=4$d2hhdGV2ZXI$placeholder',
  'Ivan Daniel', 'Manrique Roa',
  'DESARROLLADOR_WEB', 'SUPER',
  true, true
)
ON CONFLICT (email) DO NOTHING;

-- 4.3 Perfil del cliente de prueba
INSERT INTO cliente_profiles (user_id, documento, direccion, ciudad, departamento)
VALUES (
  '10000000-0000-0000-0000-000000000004',
  '12345678',
  'Av. Primavera 123',
  'Lima', 'Lima'
)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================
-- NOTA: Los passwords en este archivo son PLACEHOLDERS.
-- Los hashes reales se generan con `node prisma/seed.js`.
-- Ejecutar ese script después de aplicar este SQL para
-- sobrescribir los hashes placeholder con los reales.
-- ============================================================

-- ============================================================
-- 5. RECARGAR SCHEMA CACHE DE SUPABASE (PostgREST)
-- ============================================================
SELECT pg_notify('pgrst', 'reload schema');

-- ============================================================
-- FIN
-- ============================================================
