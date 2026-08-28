-- ============================================================
-- GreenLine - Testimonios (reviews de clientes)
--
-- El cliente administra los testimonios desde el panel /admin.
-- Lectura pública para el storefront; gestión desde el panel.
--
-- NOTA: el panel admin opera con la anon key (mismo patrón que
-- productos/colores), por lo que se deja acceso de escritura a
-- anon hasta conectar Supabase Auth al panel.
-- ============================================================

CREATE TABLE IF NOT EXISTS testimonios (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  rol TEXT,
  texto TEXT NOT NULL,
  vehiculo TEXT,
  rating INT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  orden INT DEFAULT 0,
  activo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER trg_testimonios_updated_at
  BEFORE UPDATE ON testimonios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS (misma convención que el schema principal)
ALTER TABLE testimonios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de testimonios"
  ON testimonios FOR SELECT USING (true);

CREATE POLICY "Admin puede gestionar testimonios"
  ON testimonios FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Seed: testimonios existentes migrados (el cliente podrá editarlos/desactivarlos)
INSERT INTO testimonios (nombre, rol, texto, vehiculo, rating, orden, activo) VALUES
  ('Carlos Mendoza', 'Cliente desde 2022', 'Compré una VMP P01 para mis trayectos diarios al trabajo. Ahorro más de S/ 400 al mes en combustible. El servicio postventa de Green Line es excelente.', 'VMP P01', 5, 1, true),
  ('María López', 'Cliente desde 2023', 'La trimoto eléctrica cambió mi negocio de delivery. Es silenciosa, eficiente y mis clientes notan la diferencia. 100% recomendada.', 'Trimoto T-15', 5, 2, true),
  ('Roberto Silva', 'Cliente desde 2021', 'Tengo la Sunra E8 y es una maravilla. La batería dura toda la semana con mi uso diario. El equipo de Green Line me asesoró perfecto.', 'Sunra E8', 5, 3, true),
  ('Ana Torres', 'Cliente desde 2024', 'Me encanta mi carguero eléctrico. Lo uso para repartir en mi panadería y es súper práctico. Carga en cualquier enchufe normal.', 'Carguero C-20', 5, 4, true),
  ('Diego Ramírez', 'Cliente desde 2023', 'Excelente relación calidad-precio. El seguro es muy accesible y la matrícula gratuita fue un gran plus. Solo le doy 4 estrellas porque quería más colores disponibles.', 'VMP P01', 4, 5, true),
  ('Luciana Vega', 'Cliente desde 2024', 'Como parte de la comunidad universitaria, obtuve un descuento increíble. La moto es perfecta para ir a la universidad y de paseo los fines de semana.', 'Sunra E5', 5, 6, true);