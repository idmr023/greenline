# Greenline Web ERP 🌿⚡

Plataforma web de E-commerce y Sistema de Gestión (ERP) para vehículos eléctricos Greenline.

---

## 🚀 Características Principales (Sprint 1)
- **Catálogo Avanzado de Vehículos:** Fichas técnicas detalladas con indicadores de batería extraíble, autonomía en rangos, requerimientos de placa/SOAT y capacidad de carga para cargueros.
- **CMS y Blog Dinámico:** Editor enriquecido (Tiptap) que permite al equipo de contenidos componer y reorganizar páginas y artículos al estilo WordPress con previsualización en tiempo real.
- **Campaña de Aniversario:** Cronómetro cuenta atrás dinámico de color amarillo campaña con fases promocionales y enlace directo a WhatsApp corporativo.
- **Red de Tiendas y Geolocalización:** Inserción de la nueva tienda en Salamanca (Jr. Inca Garcilazo de la Vega N° 218) con mapas y fotografías.
- **Libro de Reclamaciones Automatizado:** Validaciones estrictas, selección jerárquica de distribuidores/tiendas y reenvío automático de copias a clientes y administración.
- **Sistema de Redirecciones (QR):** Mitigación de pérdida de tráfico asegurando que los códigos QR físicos antiguos apunten correctamente a las nuevas rutas.

---

## 🛠️ Stack Tecnológico
- **Frontend:** React 19, Vite, React Router DOM v7, Tailwind CSS v4, Lucide Icons, FontAwesome, Tiptap.
- **Backend / Base de Datos:** Supabase (PostgreSQL con Row Level Security - RLS).
- **Automatización y Scripts:** Node.js, Sharp (procesamiento de imágenes).

---

## 📦 Scripts Disponibles (`package.json`)

```bash
# Iniciar servidor de desarrollo (Vite)
npm run dev

# Compilar para producción
npm run build

# Ejecutar linter (Oxlint)
npm run lint

# Sincronizar imágenes locales
npm run sync_image

# Generar manuales
npm run generate-manuales
```

---

## 📂 Documentación del Proyecto
Toda la documentación detallada correspondiente al **Sprint 1** se encuentra en la carpeta [`docs/Sprint1/`](./docs/Sprint1/), incluyendo:
- [01. Alcance del Sprint](./docs/Sprint1/01-alcance-sprint1.md)
- [02. Product Backlog](./docs/Sprint1/02-product-backlog.md)
- [03. Tareas Completadas](./docs/Sprint1/03-tareas-completadas.md)
- [04. Reuniones y Seguimiento](./docs/Sprint1/04-reuniones-y-seguimiento.md)
- [05. Ideas Descartadas y Trade-offs](./docs/Sprint1/05-ideas-descartadas-y-tradeoffs.md)

---

## 📄 Licencia
Privado © Greenline Perú.
