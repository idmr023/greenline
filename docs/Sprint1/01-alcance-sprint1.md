# Alcance del Sprint 1 - Greenline Web ERP

## 1. Información General
- **Proyecto:** Greenline Web ERP (E-commerce y Plataforma de Gestión de Vehículos Eléctricos)
- **Sprint:** Sprint 1
- **Duración:** 4 semanas
- **Rol / Enfoque:** Desarrollo Web Fullstack (Junior Developer perspective)
- **Propósito:** Modernizar la plataforma web, optimizar la experiencia de usuario (UX), implementar capacidades CMS para edición de contenido (estilo WordPress), añadir la nueva tienda en Salamanca, estructurar fichas técnicas avanzadas con rangos de autonomía e indicadores de batería/SOAT/placa, optimizar el rendimiento de imágenes (migración de BD a carpetas locales), y rediseñar el Libro de Reclamaciones con flujos automatizados.

---

## 2. Objetivos Principales del Sprint
1. **CMS y Blog Dinámico:** Otorgar autonomía al equipo de marketing (Almudena) para reorganizar secciones y bloques de contenido al estilo WordPress, asegurando una previsualización fluida.
2. **Optimización de E-commerce y Fichas de Producto:**
   - Incorporar cards de características clave al lado de la imagen del producto (Batería extraíble, Autonomía, Placa/SOAT).
   - Mostrar rangos de autonomía en lugar de valores estáticos únicos.
   - Pestaña especial de capacidad de carga máxima para vehículos cargueros (ej. equivalente a sacos de papas).
   - Corrección exhaustiva de imágenes de vehículos (ej. M3 Eco).
3. **Campaña de Aniversario:**
   - Creación de banner y cronómetro cuenta atrás dinámico de color amarillo campaña (fases: hasta el 15 sep, 15-25 sep, 25-fin de mes), con llamada a la acción hacia WhatsApp corporativo.
4. **Expansión Física (Tienda Salamanca):**
   - Incorporación oficial de la tienda de Salamanca (Jr. Inca Garcilazo de la Vega N° 218, 1er piso, Salamanca de Monterrico) en la sección de tiendas, base de datos y mapas.
5. **Rediseño del Libro de Reclamaciones:**
   - Campos estrictamente obligatorios (excepto teléfono).
   - Selección jerárquica: Departamento -> Distrito -> Distribuidor/Tienda.
   - Pop-up de confirmación legal previa al envío con previsualización del documento modelo y reenvío automático de copia al correo del cliente y administración (Mayra / Mayumi / Richard).
6. **Rendimiento e Infraestructura:**
   - Migración masiva de imágenes almacenadas en base de datos hacia carpetas locales versionadas para evitar pérdida de calidad por compresión y acelerar la carga de la página.
   - Mitigación de pérdida de tráfico por códigos QR físicos existentes mediante sistema de redirecciones lógicas (`legacyRedirects`).
   - Gestión de roles de usuario (`ADMIN` y `DESARROLLADOR_WEB`) con permisos completos en políticas RLS de Supabase.

---

## 3. Stack Tecnológico Utilizado
- **Frontend:** React 19, Vite, React Router DOM v7, Tailwind CSS v4, Lucide Icons, FontAwesome.
- **CMS / Enriquecimiento:** Tiptap Editor (`@tiptap/react`, starter-kit, table, image, link, placeholder).
- **Backend / Base de Datos:** Supabase (PostgreSQL con Row Level Security - RLS).
- **Herramientas de Automatización y Scripts (Node.js):** Sharp (procesamiento de imágenes), scripts de sincronización (`sincronizar-imagenes-greenline.mjs`, `generate-manuales.mjs`, `security-smoke.mjs`).
- **Control de Versiones y Despliegue:** Git / GitHub, Vercel / Render.

---

## 4. Actualización Posterior al Sprint 1 (Setiembre 2026)

Iteración de perfeccionamiento y contenido ejecutada después del cierre del Sprint 1. Documentada en `03-tareas-completadas.md` (sección 8) y en el Product Backlog (Módulo 8).

**Objetivos cubiertos:**
- Integración de la **comunidad Green Line** dentro de la web (canal de Instagram + canal de WhatsApp) con sección dedicada en el homepage y botón flotante unificado.
- Ampliación del **catálogo de setiembre** (campaña de aniversario con el nuevo producto **GreenLine X6**, mapeo de vídeos y manuales por modelo).
- **Manuales en modo revista/libro** (visor flipbook de doble página).
- **Página ExpoChina** "Próximamente" con pre-inscripción de interesados.
- **Libro de Reclamaciones**: almacenamiento en base de datos, vista desde `/admin`, remitente dedicado (correo de Mayra) y aviso legal de respuesta en **máximo 15 días hábiles**.
- Refinamientos de UX (SOAT en Sí/No, colores por producto, FAQ con paleta verde/blanco/negro, subtítulo legible en Sobre Nosotros) y exclusión del efecto festivo solo en `/libro-reclamaciones`.
