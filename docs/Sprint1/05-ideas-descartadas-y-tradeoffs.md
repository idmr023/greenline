# Ideas Descartadas, Decisiones y Trade-offs - Sprint 1

Durante el desarrollo del Sprint 1 se evaluaron diversas propuestas y características avanzadas que, tras un análisis técnico y de negocio, fueron descartadas o pospuestas para fases posteriores. Este documento registra dichas decisiones y sus justificaciones.

---

## 1. Ideas Descartadas

### A. Visor 360° para Productos
- **Propuesta Original:** Implementar un visor interactivo de rotación en 360 grados para cada modelo de vehículo eléctrico en su vista detallada.
- **Motivo de Descarte:**
  - Alto costo y tiempo de producción requerido para generar las secuencias fotográficas de alta resolución para cada modelo del catálogo.
  - Impacto negativo en el rendimiento de carga inicial y consumo de ancho de banda en dispositivos móviles.
- **Alternativa Implementada:** Se optó por un sistema de zoom avanzado de alta calidad (`react-inner-image-zoom`) acompañado de cards de especificaciones técnicas clave (batería, autonomía, placa/SOAT) que aportan mayor valor comercial directo.

### B. Uso de GIFs Animados para Rotación de Imágenes
- **Propuesta Original:** Utilizar animaciones GIF en las tarjetas de productos de la tienda para mostrar distintas perspectivas del vehículo al pasar el cursor.
- **Motivo de Descarte:**
  - Los archivos GIF presentan un tamaño excesivo de peso en bytes, degradando la velocidad de renderizado de la tienda online (E-commerce Core Web Vitals).
  - Falta de control responsive y pérdida de calidad en pantallas Retina / de alta densidad de píxeles.
- **Alternativa Implementada:** Uso de galerías estáticas con transiciones limpias en Tailwind CSS y carga optimizada de imágenes estáticas.

### C. Reimpresión Física Masiva de Códigos QR en Tiendas
- **Propuesta Original:** Descartar los códigos QR antiguos impresos en las tiendas físicas y mandar a fabricar nuevas placas y material publicitario con las nuevas URLs.
- **Motivo de Descarte:**
  - Elevado costo logístico y económico para la empresa al tener que reemplazar material físico distribuido en múltiples sedes a nivel nacional.
- **Alternativa Implementada:** Desarrollo de un sistema de redirecciones lógicas en el enrutador (`legacyRedirects`), permitiendo que cualquier escaneo de códigos QR antiguos redirija de forma transparente e instantánea a la nueva estructura de la web.

---

## 2. Decisiones Arquitectónicas y Trade-offs

- **Almacenamiento de Imágenes en BD vs. Archivos Locales:**
  - *Trade-off:* Centralizar imágenes en base de datos facilitaba respaldos unificados, pero corrompía la calidad por compresión y enlentecía las consultas SQL.
  - *Decisión:* Migrar a carpetas locales versionadas respaldadas por scripts de sincronización (`sincronizar-imagenes-greenline.mjs`), priorizando la velocidad de respuesta y la nitidez visual.
- **Autenticación y Roles Estrictos (RLS):**
  - *Trade-off:* Implementar permisos personalizados requería mayor complejidad en las políticas de seguridad de Supabase.
  - *Decisión:* Se estructuraron roles claros (`ADMIN` y `DESARROLLADOR_WEB`) mediante Row Level Security, asegurando que la gestión de inventario y blogs esté protegida ante accesos no autorizados.

---

## 3. Decisiones y Trade-offs de la Iteración Posterior (Setiembre 2026)

- **"Conviértete en distribuidor" (público):**
  - *Estado:* Pendiente. Existe la gestión interna de distribuidores (`AdminDistribuidores`) y el directorio anónimo en `StoreLocator`, pero aún no hay banner/formulario público de captación de distribuidores (homepage, banners o mapas).
- **Visibilidad de distribuidores sin canibalizar la venta directa:**
  - *Debate:* ¿Página web propia por distribuidor o exposición pública? Se priorizó **mantener el anonimato parcial** del distribuidor en el Store Locator (solo razón social/dirección) para evitar hacerse competencia con la venta directa; el modelo definitivo sigue en diseño.
- **Aviso "La disponibilidad y especificaciones están sujetas a cambios sin previo aviso":**
  - *Decisión:* Eliminado por riesgo de imagen y por el enfoque de transparencia en fichas técnicas reales; se mantienen rangos honestos de autonomía y motores con valores puntuales.
- **SOAT/Placa como Sí/No:**
  - *Decisión:* Reemplazar valores booleanos crudos (`true`/`false`) por etiquetas "Sí"/"No"/"Consultar" en la vista cliente.
- **Unificación de botones flotantes (subir / WhatsApp):**
  - *Decisión técnica:* Consolidar los estilos duplicados en un único `FloatingActionButton` reutilizable y centralizar la construcción de enlaces `wa.me` en `buildWhatsAppLink` (DRY).
