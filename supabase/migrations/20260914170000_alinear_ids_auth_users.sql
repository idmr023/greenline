-- ============================================================
-- Alineación de IDs: public.users.id = auth.users.id
--
-- Problema: Los usuarios del panel se crean con IDs distintos en
--   public.users y auth.users, lo que rompe las llaves foráneas
--   (audit_logs.user_id, stock_moves.user_id, etc.) cuando el
--   trigger de auditoría inserta auth.uid().
--
-- Solución:
--   1. Añadir ON UPDATE CASCADE a todas las FKs que apuntan a users(id)
--      para permitir actualizar el PK sin violar integridad referencial.
--   2. Actualizar public.users.id para que coincida con auth.users.id
--      usando el email como clave de matching.
--   3. Crear un trigger AFTER INSERT en auth.users que sincronice
--      automáticamente los nuevos usuarios a public.users con el
--      mismo UUID.
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. Añadir ON UPDATE CASCADE a las FKs hacia users(id)
-- ------------------------------------------------------------
-- users.gerente_id (auto-referencia)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_gerente_id_fkey;
ALTER TABLE users ADD CONSTRAINT users_gerente_id_fkey FOREIGN KEY (gerente_id) REFERENCES users(id) ON UPDATE CASCADE;

-- cliente_profiles.user_id
ALTER TABLE cliente_profiles DROP CONSTRAINT IF EXISTS cliente_profiles_user_id_fkey;
ALTER TABLE cliente_profiles ADD CONSTRAINT cliente_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- otp_codes.user_id
ALTER TABLE otp_codes DROP CONSTRAINT IF EXISTS otp_codes_user_id_fkey;
ALTER TABLE otp_codes ADD CONSTRAINT otp_codes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- refresh_tokens.user_id
ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_user_id_fkey;
ALTER TABLE refresh_tokens ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- stock_moves.user_id
ALTER TABLE stock_moves DROP CONSTRAINT IF EXISTS stock_moves_user_id_fkey;
ALTER TABLE stock_moves ADD CONSTRAINT stock_moves_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE;

-- stock_moves.aprobado_por
ALTER TABLE stock_moves DROP CONSTRAINT IF EXISTS stock_moves_aprobado_por_fkey;
ALTER TABLE stock_moves ADD CONSTRAINT stock_moves_aprobado_por_fkey FOREIGN KEY (aprobado_por) REFERENCES users(id) ON UPDATE CASCADE;

-- pending_approvals.solicitante_id
ALTER TABLE pending_approvals DROP CONSTRAINT IF EXISTS pending_approvals_solicitante_id_fkey;
ALTER TABLE pending_approvals ADD CONSTRAINT pending_approvals_solicitante_id_fkey FOREIGN KEY (solicitante_id) REFERENCES users(id) ON UPDATE CASCADE;

-- pending_approvals.gerente_id
ALTER TABLE pending_approvals DROP CONSTRAINT IF EXISTS pending_approvals_gerente_id_fkey;
ALTER TABLE pending_approvals ADD CONSTRAINT pending_approvals_gerente_id_fkey FOREIGN KEY (gerente_id) REFERENCES users(id) ON UPDATE CASCADE;

-- audit_logs.user_id
ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;
ALTER TABLE audit_logs ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL;

-- ------------------------------------------------------------
-- 2. Función de sincronización automática (trigger)
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.users (id, email, nombre, apellido, rol, nivel_acceso, activo)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'apellido', 'Sistema'),
    COALESCE((NEW.raw_user_meta_data->>'rol')::"Rol", 'ADMIN'::"Rol"),
    COALESCE((NEW.raw_user_meta_data->>'nivel_acceso')::"NivelAcceso", 'SUPER'::"NivelAcceso"),
    true
  )
  ON CONFLICT (email) DO UPDATE
  SET id = EXCLUDED.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ------------------------------------------------------------
-- 3. Alinear IDs existentes (public.users ← auth.users por email)
-- ------------------------------------------------------------
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.users u
  SET id = a.id
  FROM auth.users a
  WHERE lower(u.email) = lower(a.email)
    AND u.id <> a.id;

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RAISE NOTICE 'IDs alineados: % usuarios actualizados', updated_count;
END $$;

-- ------------------------------------------------------------
-- 4. Sincronizar usuarios de auth.users que no existen en public.users
-- ------------------------------------------------------------
INSERT INTO public.users (id, email, nombre, apellido, rol, nivel_acceso, activo)
SELECT
  a.id,
  a.email,
  COALESCE(a.raw_user_meta_data->>'nombre', 'Usuario'),
  COALESCE(a.raw_user_meta_data->>'apellido', 'Sistema'),
  COALESCE((a.raw_user_meta_data->>'rol')::"Rol", 'ADMIN'::"Rol"),
  COALESCE((a.raw_user_meta_data->>'nivel_acceso')::"NivelAcceso", 'SUPER'::"NivelAcceso"),
  true
FROM auth.users a
WHERE NOT EXISTS (
  SELECT 1 FROM public.users u WHERE lower(u.email) = lower(a.email)
);

COMMIT;