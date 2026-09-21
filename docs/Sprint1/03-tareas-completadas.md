# Detalle de Tareas Completadas - Sprint 1 (Greenline Web ERP)

Este documento detalla a nivel técnico los hitos y requerimientos ejecutados durante las 4 semanas del Sprint 1, agrupados por áreas funcionales.

---

## 1. Módulo de E-commerce y Fichas de Producto
- **Fichas Técnicas Enriquecidas:** Implementación de tres cards interactivas al lado de la imagen principal del producto:
  - **Batería Extraíble:** Indicador visual (check / cruz) basado en datos de la base de datos.
  - **Autonomía:** Visualización optimizada en rangos de kilómetros.
  - **Placa y SOAT:** Información legal y de registro del vehículo detallada.
- **Vehículos Cargueros (Capacidad de Carga):** Creación de una pestaña específica para vehículos de carga que detalla el peso máximo soportado y su equivalencia práctica (ej. sacos de papas) para comprensión inmediata del cliente.
- **Correcciones Visuales y de Contenido:**
  - Corrección de asignación de imágenes para el modelo **M3 Eco** (tanto vista frontal como posterior).
  - Ajuste en las descripciones cortas de productos para evitar cortes bruscos, añadiendo interacción de expansión.
- **Migración de Imágenes (Rendimiento):** Migración completa del almacenamiento de imágenes de productos y blogs desde blobs pesados en la Base de Datos hacia carpetas estáticas locales versionadas, mejorando drásticamente el tiempo de carga y evitando compresión destructiva por parte de la BD.

---

## 2. Campaña de Aniversario y Promociones
- **Cronómetro Cuenta Atrás (Countdown):**
  - Implementación de un banner dinámico con cuenta regresiva en color amarillo campaña ubicado en la página principal.
  - Configuración de fases temporales:
    1. Hasta el 15 de Septiembre: Oferta de Aniversario.
    2. Del 15 al 25 de Septiembre: Extensión de Descuentos.
    3. Del 25 a fin de mes: "Última oportunidad".
  - Integración de botón CTA flotante de WhatsApp corporativo (`51919445661`) con mensaje prellenado ("Vengo por mis descuentos").

---

## 3. CMS y Blog Dinámico
- **Editor Enriquecido por Bloques (Tiptap):** Integración de `@tiptap/react` y extensiones (StarterKit, Image, Link, Table, Underline, Placeholder) para permitir a la editora de contenidos (Almudena) componer y reorganizar estructuras de página al estilo WordPress.
- **Formateo de Imágenes en Blog:** Incorporación automática de barras blancas laterales (bounding boxes) en el modal de imágenes del blog para estandarizar proporciones sin deformar el contenido visual.

---

## 4. Expansión Física (Tienda Salamanca)
- **Alta de Nueva Sucursal:**
  - Registro de la tienda en base de datos y componentes frontend.
  - Dirección exacta: *Jr. Inca Garcilazo de la Vega N° 218, 1er piso, Salamanca de Monterrico*.
  - Integración de enlace directo a Google Maps (`https://maps.app.goo.gl/SE1kDkKQZo3uiuHK7`) y actualización de fotografías oficiales de la sede.

---

## 5. Rediseño del Libro de Reclamaciones
- **Validación Estricta de Campos:** Todos los campos marcados como obligatorios a excepción del teléfono.
- **Áreas de Atención y Selección Jerárquica:**
  - Desplegables encadenados: Departamento -> Distrito -> Distribuidor / Tienda.
  - Filtro avanzado de distribuidores por RUC o nombre comercial.
- **Flujo Legal y Automatización de Correos:**
  - Pop-up de confirmación obligatoria previa al envío: *"Estos datos no se podrán editar después... Una vez confirmado este mensaje asume que esta información es verídica..."*.
  - Generación de documento modelo enviado de forma automática al correo del cliente y derivación interna simultánea a administración (Mayra, Mayumi, Richard).

---

## 6. Redirecciones y Continuidad de Canales (QR)
- **Protección de Códigos QR Físicos:**
  - Desarrollo del módulo de redirecciones (`legacyRedirects`) para asegurar que los códigos QR impresos en placas y folletos físicos que apuntaban a la web antigua se mapeen correctamente a las nuevas rutas sin necesidad de reimpresión física en tiendas.
- **Visibilidad de Redes Sociales y Videos:**
  - Mayor protagonismo a videos embebidos de YouTube (`YouTubeEmbed`), indicador de transmisiones en vivo (`LiveIndicator`), Green Tips e historias interactivas de Instagram enlazadas a la sección de testimonios.

---

## 7. Seguridad, Autenticación y Roles (Supabase RLS)
- **Roles y Permisos:**
  - Restricción y configuración de roles `ADMIN` y `DESARROLLADOR_WEB` para garantizar que únicamente usuarios autorizados puedan editar, crear productos o manipular configuraciones críticas.
- **Políticas de Seguridad RLS:**
  - Aplicación y auditoría de políticas Row Level Security en las tablas de Supabase mediante scripts automatizados (`aplicar-audit-rls.mjs`, `security-smoke.mjs`).

---

## 8. Iteración Posterior al Sprint 1 (Catálogo Setiembre, Comunidad y Reclamos)

### 8.1 Comunidad y Redes Sociales integradas en la web
- **Sección "Únete a la comunidad Green Line"** en el homepage (`frontend/components/home/CommunitySection.jsx`) entre el ecommerce strip y los testimonios, con dos tarjetas:
  - **Instagram:** enlace al canal de la comunidad (`SOCIAL.instagram_comunidad`).
  - **WhatsApp:** enlace al canal de WhatsApp (`SOCIAL.whatsapp_comunidad`).
- **Fuente única de datos:** constantes sociales centralizadas en `frontend/lib/config.ts` (`SOCIAL.*`, `CONTACT.*`) y helper `buildWhatsAppLink(mensaje)` para enlaces `wa.me` con texto prellenado (usado también por el botón flotante).

### 8.2 Refactor: botones flotantes unificados
- Nuevo componente genérico `frontend/components/ui/general/FloatingActionButton.jsx` (acepta `href` → `<a>` o `onClick` → `<button>`, `icon`, `ariaLabel`, `visible`, `pulse`, `className`).
- `ScrollTopButton.jsx` y `WhatsAppButton.jsx` pasan a ser wrappers finos sobre el mismo componente (misma forma circular, `bg-brand` = `#009000`, sombra y escala al hover). El botón flotante de WhatsApp conserva su `aria-label` de asesoría ("Volver arriba" / "Te asesoramos por WhatsApp").

### 8.3 Catálogo de Setiembre y producto GreenLine X6
- **Alta del producto GreenLine X6** en `supabase/seed.sql` (id 36, motor 1200W / 1600W máx, 72V/28AH, 50 km/h, autonomía 50–60 km, carga 150 kg, 184×75×114 cm) con ficha técnica, información adicional y colores (Rojo, Plateado, Negro).
- **Script re-ejecutable** (SQL editor de Supabase) para insertar/actualizar el X6 sin duplicar por slug, pendiente de imágenes por `/admin`.
- **Mapeo de vídeos y manuales por modelo:** actualizaciones por regex de `video_id` en el seed (incluye X6/X6PRO, MX6) y asignación de `manual_pdf` (Manual X6, Manual de uso X6 Pro, Manual de uso MX6, etc.).

### 8.4 Manuales en modo revista/libro
- `frontend/pages/ManualesDeUso.jsx` con acción **"Leer como revista"** y `frontend/components/PdfFlipViewer.jsx` con vista de **doble página (tipo libro/revista abierto)** sobre PDF.js, además de descarga directa del PDF.

### 8.5 Página ExpoChina "Próximamente"
- `frontend/pages/ExpoChina.tsx` (ruta `/expochina`): sección promocional de la feria con beneficios, **formulario de pre-inscripción** (`id="registro"`), CTA de contacto por WhatsApp y descuentos para inscritos.

### 8.6 UPN, referidos y tiendas
- **UPN en "También nos encuentras en":** `UPN` presente en el ecommerce strip (`ecommerce_strip_data`).
- **Comunidad UPN corregida:** barra lateral (`UPN_SlideBar.jsx`) lista "Surco, La Molina, San Miguel, Lince, Comas, **Salamanca** y Miraflores" (eliminada Ate).
- **Referidos:** nota a pie aclaratoria "* El beneficio por referidos es válido en nuestras tiendas principales" (UPN_SlideBar).

### 8.7 Refinamientos de UX de producto
- **SOAT / Placa en "Sí" / "No" / "Consultar"** en las cards de producto (`ProductPage.jsx`), evitando mostrar valores booleanos crudos.
- **Colores por modelo:** al listar un producto se muestran únicamente sus colores (`ColorDot` + `product.colores_detalle`).
- **Vídeos por producto:** pestaña de Videos condicionada a `videoId`/`videosForProduct(product)` (`ProductVideos`, `data/videosYT.js`).
- **Preguntas Frecuentes:** paleta armonizada en verdes de marca + emerald sobre blanco/negro (`PreguntasFrecuentes.tsx`).
- **Sobre Nosotros:** subtítulo "Líderes en movilidad eléctrica en el Perú desde 2017" con `text-brand` (verde) sobre el banner para garantizar legibilidad (`Us.jsx`).
- **Eliminado** el texto "La disponibilidad y especificaciones están sujetas a cambios sin previo aviso" (no presente en el proyecto actual).

### 8.8 Libro de Reclamaciones (legal, BD y admin)
- **Almacenamiento en base de datos**: los reclamos se persisten (Supabase) además de enviarse a la hoja de cálculo (`backend/src/routes/reclamaciones.routes.js`).
- **Vista en `/admin`**: módulo `AdminReclamaciones.jsx` dentro del Admin Panel para gestionar los reclamos registrados.
- **Aviso legal de plazo**: el correo de confirmación al consumidor indica respuesta en **máximo 15 días hábiles** (aprobado por dirección).
- **Remitente dedicado**: los correos del Libro de Reclamaciones usan `RECLAMACIONES_EMAIL_FROM` / SMTP dedicados vía `.env` (correo de Mayra como sender principal).

### 8.9 Efecto festivo excluido solo en el Libro de Reclamaciones
- Eliminado el confeti propio de `LibroReclamaciones.jsx` y excluida la ruta `/libro-reclamaciones` del confeti global de cambio de ruta en `src/App.jsx`, manteniendo el efecto festivo en el resto de páginas.
