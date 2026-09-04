/**
 * Catálogo de componentes base de UI (Green Line)
 *
 * Página de demostración para visualizar los building blocks reutilizables
 * disponibles en components/ui. No es una ruta productiva; se usa como
 * referencia de desarrollo.
 *
 * Importaciones desde components/ui:
 *   - Button (variants: primary, secondary, outline, ghost, dark)
 *   - Card   (padding: none, sm, md, lg, xl)
 *   - SectionHeading (eyebrow + title + subtitle + align)
 */
import PageBanner from './PageBanner';
import Button from './ui/Button';
import Card from './ui/Card';
import SectionHeading from './ui/SectionHeading';

export default function Demo() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageBanner
        title="Catálogo de componentes base"
        subtitle="Building blocks reutilizables de la interfaz Green Line"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <section>
          <SectionHeading
            eyebrow="Botones"
            title="Variantes y tamaños"
            subtitle="Usa el componente Button con to (Link) u onClick (button)."
            align="left"
          />
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primario</Button>
            <Button variant="secondary">Secundario</Button>
            <Button variant="outline">Contorno</Button>
            <Button variant="ghost">Fantasma</Button>
            <Button variant="dark">Oscuro</Button>
            <Button size="sm" variant="outline">
              Chico
            </Button>
            <Button size="lg">Grande</Button>
            <Button to="/tienda">Como enlace</Button>
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Cards"
            title="Contenedores"
            subtitle="Card con distintos niveles de padding."
            align="left"
          />
          <div className="grid grid-cols-2 gap-4">
            <Card padding="sm">
              <p className="text-sm text-gray-700">Card padding=sm</p>
            </Card>
            <Card padding="md">
              <p className="text-sm text-gray-700">Card padding=md</p>
            </Card>
            <Card padding="lg">
              <p className="text-sm text-gray-700">Card padding=lg</p>
            </Card>
            <Card padding="xl">
              <p className="text-sm text-gray-700">Card padding=xl</p>
            </Card>
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Encabezados"
            title="SectionHeading en acción"
            subtitle="Con eyebrow, título y subtítulo, alineación centrada o izquierda."
          />
        </section>
      </div>
    </div>
  );
}
