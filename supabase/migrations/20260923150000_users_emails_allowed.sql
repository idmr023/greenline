-- Consentimiento de emails de marketing / baja de suscripción
-- emails_allowed: true = puede recibir campañas; false = dado de baja (unsubscribe)
-- La baja se aplica desde la página /cancelar-suscripcion vía API backend.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS emails_allowed BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS emails_unsubscribed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_emails_allowed
  ON users (emails_allowed)
  WHERE emails_allowed = true;
