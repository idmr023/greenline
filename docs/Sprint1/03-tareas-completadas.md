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
