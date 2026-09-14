# Instrucciones para Agentes de IA y Desarrolladores (Greenline Web ERP)

Este documento establece las directrices técnicas, convenciones y normas operativas para cualquier agente de inteligencia artificial o desarrollador que colabore en el repositorio **Greenline Web ERP**.

---

## 1. Convenciones de Código y Estilo
- **Frameworks y Librerías:** Respetar el stack establecido (React 19, Vite, Tailwind CSS v4, Supabase). No introducir librerías de terceros sin justificación explícita y verificación en `package.json`.
- **Componentes y Modularidad:** Mantener la separación de responsabilidades entre componentes de UI (`frontend/components/`), páginas (`frontend/pages/`), hooks (`frontend/hooks/`) y utilidades (`frontend/lib/`).
- **Nomenclatura:** Seguir el estándar existente en el proyecto (camelCase para variables/funciones, PascalCase para componentes React y archivos de páginas/componentes).

## 2. Manejo de Base de Datos y Supabase
- Las consultas y mutaciones deben realizarse a través de los clientes y adaptadores configurados en `frontend/lib/supabase.js` o `api.js`.
- Respetar las políticas de Row Level Security (RLS) implementadas en las migraciones SQL dentro de la carpeta `supabase/`.
- No exponer credenciales, claves de API o secretos en el código fuente.

## 3. Gestión de Imágenes y Assets
- Las imágenes de productos, banners y blogs deben gestionarse mediante almacenamiento estático local sincronizado con los scripts de utilidad (`npm run sync_image`) para evitar degradación de rendimiento y compresión por parte de la base de datos.

## 4. Control de Calidad y Verificación
- Antes de proponer cambios mayores, ejecutar las pruebas de humo y validaciones disponibles:
  - `npm run lint` (Oxlint)
  - `npm run security-smoke`
  - `npm run build`
- Mantener la concisión y la precisión técnica en las respuestas y documentación.
