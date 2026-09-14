-- ============================================================
-- GreenLine - WORM Audit Triggers (Write-Once, Read-Many)
-- Ejecutar en el SQL Editor de Supabase DESPUÉS de las migraciones
--
-- Estos triggers capturan cada INSERT/UPDATE/DELETE en tablas
-- críticas y los registran en audit_logs. La tabla audit_logs
-- tiene permisos REVOKE para UPDATE/DELETE/TRUNCATE.
-- ============================================================

-- ============================================================
-- 1. Función genérica de auditoría
-- ============================================================
CREATE OR REPLACE FUNCTION fn_audit_trigger()
RETURNS TRIGGER AS $$
DECLARE
  v_operacion TEXT;
  v_registro_id TEXT;
  v_datos_antes JSONB;
  v_datos_despues JSONB;
BEGIN
  -- Determinar operación
  v_operacion := TG_OP;

  -- Obtener ID del registro
  IF TG_OP = 'DELETE' THEN
    v_registro_id := COALESCE(OLD.id::text, 'N/A');
  ELSE
    v_registro_id := COALESCE(NEW.id::text, 'N/A');
  END IF;

  -- Serializar datos antes/después
  CASE TG_OP
    WHEN 'INSERT' THEN
      v_datos_antes := NULL;
      v_datos_despues := to_jsonb(NEW);
    WHEN 'UPDATE' THEN
      v_datos_antes := to_jsonb(OLD);
      v_datos_despues := to_jsonb(NEW);
    WHEN 'DELETE' THEN
      v_datos_antes := to_jsonb(OLD);
      v_datos_despues := NULL;
  END CASE;

  -- Insertar en audit_logs
  INSERT INTO audit_logs (
    user_id, accion, tabla, registro_id,
    datos_antes, datos_despues,
    ip, user_agent, created_at
  ) VALUES (
    -- Intentar obtener el usuario de la sesión JWT si está disponible
    NULLIF(current_setting('request.jwt.claims', true)::json->> 'sub', '')::uuid,
    v_operacion,
    TG_TABLE_NAME,
    v_registro_id,
    v_datos_antes,
    v_datos_despues,
    NULLIF(current_setting('request.jwt.claims', true)::json->> 'ip', ''),
    NULL,
    now()
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 2. Crear triggers para cada tabla crítica
-- ============================================================

-- Users
DROP TRIGGER IF EXISTS trg_audit_users ON users;
CREATE TRIGGER trg_audit_users
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

-- Stock Moves
DROP TRIGGER IF EXISTS trg_audit_stock_moves ON stock_moves;
CREATE TRIGGER trg_audit_stock_moves
  AFTER INSERT OR UPDATE OR DELETE ON stock_moves
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

-- Pending Approvals
DROP TRIGGER IF EXISTS trg_audit_pending_approvals ON pending_approvals;
CREATE TRIGGER trg_audit_pending_approvals
  AFTER INSERT OR UPDATE OR DELETE ON pending_approvals
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

-- Productos
DROP TRIGGER IF EXISTS trg_audit_productos ON productos;
CREATE TRIGGER trg_audit_productos
  AFTER INSERT OR UPDATE OR DELETE ON productos
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

-- Greenline Posts (blog)
DROP TRIGGER IF EXISTS trg_audit_greenline_posts ON greenline_posts;
CREATE TRIGGER trg_audit_greenline_posts
  AFTER INSERT OR UPDATE OR DELETE ON greenline_posts
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

-- Pedidos
DROP TRIGGER IF EXISTS trg_audit_pedidos ON pedidos;
CREATE TRIGGER trg_audit_pedidos
  AFTER INSERT OR UPDATE OR DELETE ON pedidos
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

-- Testimonios
DROP TRIGGER IF EXISTS trg_audit_testimonios ON testimonios;
CREATE TRIGGER trg_audit_testimonios
  AFTER INSERT OR UPDATE OR DELETE ON testimonios
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

-- OTPs (seguridad: quién generó/consumió códigos)
DROP TRIGGER IF EXISTS trg_audit_otp_codes ON otp_codes;
CREATE TRIGGER trg_audit_otp_codes
  AFTER INSERT OR UPDATE OR DELETE ON otp_codes
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

-- Refresh tokens (seguridad: emisión/uso/revocación de sesiones)
DROP TRIGGER IF EXISTS trg_audit_refresh_tokens ON refresh_tokens;
CREATE TRIGGER trg_audit_refresh_tokens
  AFTER INSERT OR UPDATE OR DELETE ON refresh_tokens
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

-- Libro de reclamaciones (PII del cliente + cumplimiento legal)
DROP TRIGGER IF EXISTS trg_audit_libro_reclamaciones ON libro_reclamaciones;
CREATE TRIGGER trg_audit_libro_reclamaciones
  AFTER INSERT OR UPDATE OR DELETE ON libro_reclamaciones
  FOR EACH ROW EXECUTE FUNCTION fn_audit_trigger();

-- ============================================================
-- 3. WORM: Revocar permisos de modificación en audit_logs
-- ============================================================
-- La tabla audit_logs NO puede ser modificada o eliminada
-- por ninguna cuenta de la aplicación. Solo INSERT y SELECT.

-- Revocar UPDATE, DELETE, TRUNCATE para todos los roles
REVOKE UPDATE, DELETE, TRUNCATE ON audit_logs FROM authenticated;
REVOKE UPDATE, DELETE, TRUNCATE ON audit_logs FROM anon;
REVOKE UPDATE, DELETE, TRUNCATE ON audit_logs FROM service_role;

-- Si usas un rol específico para la app
-- REVOKE UPDATE, DELETE, TRUNCATE ON audit_logs FROM your_app_role;

-- ============================================================
-- 4. Limpiar OTPs expirados (ejecutar periódicamente con pg_cron)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'limpiar-otps-expirados',
  '0 * * * *',  -- cada hora
  $$DELETE FROM otp_codes WHERE expira_en < now() AND usado = true$$
);

-- ============================================================
-- 5. Limpiar refresh tokens revocados (ejecutar periódicamente)
-- ============================================================
SELECT cron.schedule(
  'limpiar-refresh-tokens',
  '0 3 * * *',  -- diario a las 3am
  $$DELETE FROM refresh_tokens WHERE revoked = true AND created_at < now() - interval '30 days'$$
);

-- ============================================================
-- 6. Soft delete de blog posts después de 30 días
-- ============================================================
-- Para implementar la papelera de 30 días del blog:
-- Ejecutar periódicamente para eliminar posts inactivos hace >30 días
-- DELETE FROM greenline_post_images WHERE post_id IN (
--   SELECT id FROM greenline_posts WHERE active = false AND updated_at < now() - interval '30 days'
-- );
-- DELETE FROM greenline_posts WHERE active = false AND updated_at < now() - interval '30 days';
