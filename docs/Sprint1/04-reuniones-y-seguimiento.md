# Bitácora de Reuniones y Seguimiento - Sprint 1 (Greenline Web ERP)

Este documento registra la cadencia de reuniones, alineaciones semanales, sesiones con la dirección y la retroalimentación recibida durante el desarrollo del Sprint 1 (4 semanas).

---

## 1. Cadencia de Reuniones

### A. Reuniones Semanales de Planificación (Todos los Lunes)
- **Participantes:** Equipo completo de desarrollo y producto.
- **Dinámica:**
  - Apertura de la semana revisando el cumplimiento de las metas del periodo anterior.
  - Asignación de tareas y estimación de esfuerzo para los entregables de los siguientes 7 días.
  - Identificación temprana de bloqueos técnicos (ej. problemas con compresión de imágenes, sincronización de base de datos con Supabase, validación de rutas de QR).

### B. Reuniones de Seguimiento con Jefatura / Dirección (Semanales)
- **Participantes:** Líder de proyecto / Desarrollador y Jefatura (Dirección de Greenline).
- **Dinámica:**
  - Demostración en entorno de pruebas (staging/preview) de los avances de interfaz y nuevas funcionalidades.
  - Revisión de aprobaciones visuales para campañas (ej. tonos amarillos y textos del cronómetro de aniversario).
  - Validación de requerimientos legales y operativos para el Libro de Reclamaciones y aperturas de nuevas tiendas (Salamanca).

---

## 2. Retroalimentación (Feedback) y Lecciones Aprendidas

### A. Feedback del Previo Encargado de la Web
- **Diagnóstico Inicial:** El sistema anterior almacenaba archivos pesados (imágenes de vehículos y catálogos) directamente en columnas binarias o URLs de base de datos, lo que generaba latencia y pérdida de calidad visual ante redimensionamientos automáticos.
- **Acción Tomada:** Migración hacia un esquema de almacenamiento estático en carpetas locales versionadas (`sync_image`), optimizando tiempos de carga y manteniendo la fidelidad gráfica de los vehículos.
- **Gestión de QRs:** Se advirtió el riesgo económico y operativo de reimprimir los códigos QR en placas físicas repartidas en todas las tiendas a nivel nacional. Se diseñó una estrategia de redirección por rutas (`legacyRedirects`) para redirigir el tráfico antiguo al nuevo árbol de rutas sin costo adicional.

### B. Feedback del Equipo de Marketing y Contenido (Almudena, Mayra, Mayumi)
- **Módulo de Blog (Almudena):** Se solicitó mayor flexibilidad tipo WordPress para ordenar las secciones del blog. Se implementó el editor Tiptap con bloques arrastrables y previsualización.
- **Atención al Cliente (Mayra / Mayumi):** Se ajustaron los flujos del Libro de Reclamaciones para asegurar que ningún campo crítico quede vacío y que el cliente firme digitalmente mediante un pop-up de asunción de veracidad antes de despachar el correo automático a administración.

---

## 3. Conclusiones del Sprint 1
El Sprint 1 cerró de manera exitosa cumpliendo con el 100% de los entregables críticos planteados en el alcance de 4 semanas, logrando un producto web moderno, rápido, seguro y adaptado a las necesidades comerciales de Greenline.

---

## 4. Bitácora de la Iteración Posterior (Setiembre 2026)

### Registro de Feedback y Acuerdos
- **Mayumi (Ack):** Se aprueba incluir en el Libro de Reclamaciones el aviso de respuesta en **máximo 15 días hábiles**. Se coordina con Jenifer la operativa de respuesta.
- **Dirección / Mayra:** El **remitente** de los correos del Libro de Reclamaciones debe ser el **correo de Mayra** (configurado vía `.env` → `EMAIL_FROM` / `RECLAMACIONES_EMAIL_FROM`) para que cualquier consulta llegue a ella.
- **Marketing / Contenido:** Se pide integrar la **comunidad** (canal Instagram + WhatsApp) en la web y priorizar **TikTok** en la galería de publicaciones por producto. Quedan pendientes de contenido: fotos 2026 para contacto, foto de Surco, fotos del Y5 plateado y posts faltantes por producto.
- **Legal (en revisión):** Definir si el Libro de Reclamaciones debe tener un **límite de caracteres** en el campo de detalle.

### Seguimiento de Pendientes
- Banner/formulario público **"Conviértete en distribuidor"** (homepage, banners o mapas).
- **Revisión de stock** de productos.
- Verificar que **el motor no figure como rango** en las fichas técnicas.
- Uniformizar los **bordes blancos del artículo destacado** del blog.
- Validar texto de las **áreas de atención** del Libro de Reclamaciones (tiendas profesionales, ecommerce, envíos, tienda Green Line).
