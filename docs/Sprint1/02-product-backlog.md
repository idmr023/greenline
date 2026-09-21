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

---

## Módulo 8: Iteración posterior al Sprint 1 (Setiembre 2026)

| ID | Historia de Usuario / Requerimiento | Prioridad | Estado |
|---|---|---|---|
| HU-19 | Como visitante, quiero encontrar la **comunidad Green Line** integrada en la web: sección "Únete a la comunidad" en el homepage con enlaces al canal de Instagram y al canal de WhatsApp. | Alta | **Completado** |
| HU-20 | Como visitante, quiero ver el catálogo de setiembre actualizado (campaña de aniversario), incluyendo el nuevo producto **GreenLine X6**, con sus vídeos y manuales mapeados (seed + scripts). | Alta | **Completado** |
| HU-21 | Como usuario, quiero leer los **manuales de uso en modo revista o libro** (visor flipbook de doble página) además de descargar el PDF. | Media | **Completado** |
| HU-22 | Como usuario, quiero encontrar **UPN en "También nos encuentras en"** (ecommerce strip) y ver corregida la lista de tiendas de la **Comunidad UPN** (sin Ate, con Salamanca). | Alta | **Completado** |
| HU-23 | Como usuario UPN, quiero que el **beneficio por referidos** sea válido en todas nuestras tiendas principales (no solo La Molina). | Media | **Completado** |
| HU-24 | Como interesado en la feria, quiero una sección "Próximamente **ExpoChina**" donde pueda pre-inscribirme o contactar por WhatsApp. | Alta | **Completado** |
| HU-25 | Como lector de **Preguntas Frecuentes**, quiero una paleta de colores armonizada en **verde, blanco y negro** (tonos brand + emerald). | Media | **Completado** |
| HU-26 | Como visitante de **Sobre Nosotros**, quiero que el subtítulo "Líderes en movilidad eléctrica en el Perú desde 2017" sea legible (color brand sobre el banner). | Alta | **Completado** |
| HU-27 | Como cliente, quiero ver **SOAT/Placa como "Sí"/"No"/"Consultar"** en las cards del producto (no valores booleanos crudos). | Media | **Completado** |
| HU-28 | Como cliente, quiero que al listar un producto solo aparezcan **los colores correspondientes a ese modelo**. | Alta | **Completado** |
| HU-29 | Como usuario, quiero botones flotantes consistentes (subir / **WhatsApp "Te asesoramos"**) con un único componente reutilizable. | Media | **Completado** |
| HU-30 | Como administración, quiero **almacenar los reclamos en base de datos** y verlos administrados desde `/admin`, con **aviso de respuesta en máximo 15 días hábiles** y remitente dedicado (correo de Mayra). | Alta | **Completado** |
| HU-31 | Como usuario, no quiero ver el texto "La disponibilidad y especificaciones están sujetas a cambios sin previo aviso" (eliminado y justificado). | Media | **Completado** |
| HU-32 | Como usuario del **Libro de Reclamaciones**, quiero que esta sea la única página **sin efecto festivo** (confeti), mientras el resto de la web lo conserva. | Media | **Completado** |
| HU-33 | Como interesado en la red de distribución, quiero un **banner/formulario "Conviértete en distribuidor"** en el homepage, banner o mapas. | Alta | **Pendiente** |
| HU-34 | Como equipo de contenidos, quiero actualizar las **fotos de contacto (sesión de fotos 2026)** y la **foto de la tienda de Surco**. | Media | **Pendiente** |
| HU-35 | Como administración, quiero **revisar el stock** de productos y completar **fotos faltantes (ej. Y5 en plateado)** y **posts de redes por cada producto** en la galería. | Alta | **Pendiente** |
| HU-36 | Como administración, quiero definir (tema legal) si el **Libro de Reclamaciones** tiene un **límite de caracteres**. | Media | **En revisión** |
| HU-37 | Como editora de contenidos, quiero **uniformizar el artículo destacado** (bordes en blanco) en el blog. | Media | **En revisión** |
| HU-38 | Como equipo técnico, quiero **verificar que los vehículos no muestren el motor como rango** en sus fichas técnicas. | Media | **En revisión** |
| HU-39 | Como cliente, quiero opciones de **área de atención en el Libro de Reclamaciones** ajustadas (tiendas profesionales, ecommerce, envíos y tienda Green Line). | Media | **En revisión** |
| HU-40 | Como Dirección, quiero definir el modelo de **visibilidad para distribuidores** (página web propia vs. anonimato) sin canibalizar la venta directa. | Alta | **En diseño** |
