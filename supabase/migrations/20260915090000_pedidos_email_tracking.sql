-- Rastreo del estado del correo de notificación de pedidos
-- Permite ver en el panel qué pedidos no tienen confirmación de correo enviado,
-- en lugar de que los pedidos queden "pudriéndose" sin que nadie lo note.

ALTER TABLE pedidos
  ADD COLUMN IF NOT EXISTS email_enviado BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_enviado_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_error TEXT;