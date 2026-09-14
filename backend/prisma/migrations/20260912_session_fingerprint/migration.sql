-- ============================================================
-- GreenLine - Session fingerprint (bind de dispositivo)
-- Añade fingerprint a refresh_tokens para detectar reutilización
-- de sesiones desde otro navegador/dispositivo.
-- ============================================================

ALTER TABLE refresh_tokens ADD COLUMN IF NOT EXISTS fingerprint TEXT;
CREATE INDEX IF NOT EXISTS refresh_tokens_fingerprint_idx ON refresh_tokens(fingerprint) WHERE fingerprint IS NOT NULL;