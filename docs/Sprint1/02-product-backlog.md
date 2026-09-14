# Product Backlog - Sprint 1 (Greenline Web ERP)

Este Product Backlog recopila las historias de usuario y tareas priorizadas y ejecutadas a lo largo de las 4 semanas del Sprint 1.

---

## Módulo 1: CMS y Blog (Gestión de Contenidos)
| ID | Historia de Usuario / Requerimiento | Prioridad | Estado |
|---|---|---|---|
| HU-01 | Como editora de contenidos (Almudena), quiero poder estructurar y arrastrar secciones del blog a mi gusto (estilo WordPress) con previsualización en tiempo real. | Alta | **Completado** |
| HU-02 | Como usuario lector del Blog, quiero que las imágenes mantengan un formato visual limpio mediante barras blancas laterales automáticas cuando sea necesario para evitar recortes indeseados. | Media | **Completado** |
| HU-03 | Como administrador, quiero subir imágenes de blog de forma robusta con validación y compresión mediante Sharp. | Alta | **Completado** |

---

## Módulo 2: E-commerce y Catálogo de Vehículos
| ID | Historia de Usuario / Requerimiento | Prioridad | Estado |
|---|---|---|---|
| HU-04 | Como cliente, quiero ver en la vista detallada de producto 3 cards informativas con iconos al lado de la imagen: Batería extraíble (check/tachado), Autonomía y Necesidad de Placa/SOAT. | Alta | **Completado** |
| HU-05 | Como cliente buscando vehículos de carga (cargueros), quiero ver una pestaña dedicada indicando el peso máximo soportado de forma gráfica y amigable (ej. equivalente a sacos de papas). | Alta | **Completado** |
| HU-06 | Como cliente, quiero ver los rangos de autonomía actualizados correctamente en la ficha técnica de cada vehículo (extraídos de la BD). | Alta | **Completado** |
| HU-07 | Como usuario, quiero que la descripción corta de los productos no se corte bruscamente y permita expandir para ver la información completa. | Media | **Completado** |
| HU-08 | Como administrador, quiero que todas las imágenes del sistema apunten directamente a carpetas estáticas locales en lugar de blobs pesados en la BD para evitar pérdida de calidad y latencia. | Alta | **Completado** |
| HU-09 | Como cliente, quiero poder comparar vehículos mediante la herramienta de comparación de modelos (Versus Comparator). | Media | **Completado** |

---

## Módulo 3: Campaña de Aniversario y Promociones
| ID | Historia de Usuario / Requerimiento | Prioridad | Estado |
|---|---|---|---|
| HU-10 | Como visitante, quiero ver un cronómetro cuenta atrás en la página principal (en color amarillo campaña) que indique el tiempo restante de las ofertas de aniversario (Fases: hasta 15 sep, 15-25 sep, 25-fin de mes) con botón de WhatsApp directo. | Alta | **Completado** |

---

## Módulo 4: Red de Tiendas y Geolocalización
| ID | Historia de Usuario / Requerimiento | Prioridad | Estado |
|---|---|---|---|
| HU-11 | Como cliente, quiero encontrar la nueva tienda de Salamanca (Jr. Inca Garcilazo de la Vega N° 218, Salamanca de Monterrico) en la sección de tiendas con su respectiva foto y mapa de referencia. | Alta | **Completado** |
| HU-12 | Como cliente, quiero comunicarme instantáneamente con soporte de ventas mediante el enlace directo de WhatsApp oficial (`wa.link/kb8ur1` / `51919445661`). | Alta | **Completado** |

---

## Módulo 5: Libro de Reclamaciones y Servicio al Cliente
| ID | Historia de Usuario / Requerimiento | Prioridad | Estado |
|---|---|---|---|
| HU-13 | Como cliente insatisfecho, quiero rellenar un Libro de Reclamaciones moderno con campos obligatorios validados, selección jerárquica (Departamento -> Distrito -> Distribuidor/Tienda) y búsqueda por RUC/nombre. | Alta | **Completado** |
| HU-14 | Como cliente, quiero ver un pop-up de confirmación legal antes de enviar mi reclamo ("Estos datos no se podrán editar después...") y recibir una copia automática en mi correo. | Alta | **Completado** |
| HU-15 | Como administración (Mayra, Mayumi, Richard), quiero recibir las quejas estructuradas automáticamente en correos y hojas de cálculo para agilizar la respuesta. | Alta | **Completado** |

---

## Módulo 6: Redirecciones y Continuidad de Canales (QR)
| ID | Historia de Usuario / Requerimiento | Prioridad | Estado |
|---|---|---|---|
| HU-16 | Como administrador, quiero asegurar que los códigos QR físicos impresos previamente en tiendas no se rompan ante el cambio de rutas de la nueva web, mediante redirecciones inteligentes (`legacyRedirects`). | Alta | **Completado** |
| HU-17 | Como visitante, quiero encontrar acceso directo y gran visibilidad a los lives de YouTube, historias de Instagram y Green Tips desde la barra de navegación y secciones dedicadas. | Media | **Completado** |

---

## Módulo 7: Seguridad y Roles (Admin / ERP)
| ID | Historia de Usuario / Requerimiento | Prioridad | Estado |
|---|---|---|---|
| HU-18 | Como administrador y desarrollador web, quiero contar con permisos exclusivos (`ADMIN` y `DESARROLLADOR_WEB`) validados por RLS en Supabase para gestionar productos, blogs y configuraciones de forma segura. | Alta | **Completado** |
