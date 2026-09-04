import { Briefcase, Users, Heart, Zap, Mail, MapPin, ArrowRight } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import SEOHead, { breadcrumbSchema } from '../components/SEOHead';

const beneficios = [
  {
    icon: Zap,
    titulo: 'Mobilitad eléctrica',
    descripcion: 'Forma parte del futuro de la transporte sostenible en Perú.',
  },
  {
    icon: Users,
    titulo: 'Equipo joven',
    descripcion: 'Trabaja con personas apasionadas, creativas y en constante crecimiento.',
  },
  {
    icon: Heart,
    titulo: 'Beneficios',
    descripcion: 'Descuentos en productos, capacitaciones y ambiente de trabajo flexible.',
  },
  {
    icon: Briefcase,
    titulo: 'Crecimiento',
    descripcion: 'Oportunidades reales de desarrollo profesional y ascenso.',
  },
];

const areas = [
  {
    titulo: 'Ventas y Atención al Cliente',
    descripcion: 'Asesores de tienda, soporte post-venta y atención al cliente.',
    icono: '🏪',
  },
  {
    titulo: 'Logística y Almacén',
    descripcion: 'Gestión de inventario, despacho y control de stock.',
    icono: '📦',
  },
  {
    titulo: 'Marketing y Contenido',
    descripcion: 'Redes sociales, contenido digital, diseño gráfico y community management.',
    icono: '📱',
  },
  {
    titulo: 'Tecnología e Ingeniería',
    descripcion: 'Desarrollo web, sistemas, ingeniería de producto y soporte técnico.',
    icono: '💻',
  },
  {
    titulo: 'Administración y Finanzas',
    descripcion: 'Contabilidad, tesorería, análisis financiero y control administrativo.',
    icono: '📊',
  },
];

export default function TrabajaConNosotros() {
  return (
    <div>
      <SEOHead
        title="Trabaja con Nosotros"
        description="Únete al equipo de Green Line, líderes en movilidad eléctrica en Perú. Revisa nuestras vacantes y envía tu postulación."
        url="/trabaja-con-nosotros"
        keywords={['trabaja con nosotros', 'Green Line', 'empleo', 'movilidad eléctrica']}
        jsonLd={[breadcrumbSchema([
          { name: 'Inicio', url: '/' },
          { name: 'Trabaja con Nosotros', url: '/trabaja-con-nosotros' },
        ])]}
      />
      <PageBanner
        title="Trabaja con Nosotros"
        subtitle="Únete al equipo que está transformando la movilidad en Perú"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Intro */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Sé parte del cambio
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            En Green Line estamos buscando personas comprometidas que quieran crecer profesionalmente mientras contribuyen a la movilidad eléctrica sostenible en Perú. Si te apasiona la innovación, el medio ambiente y el trabajo en equipo, ¡queremos conocerte!
          </p>
        </div>

        {/* Beneficios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {beneficios.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.titulo} className="bg-white rounded-xl border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{b.titulo}</h3>
                <p className="text-sm text-gray-500">{b.descripcion}</p>
              </div>
            );
          })}
        </div>

        {/* Áreas disponibles */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Áreas disponibles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {areas.map((area) => (
              <div key={area.titulo} className="bg-white rounded-xl border border-gray-100 p-5 hover:border-brand/30 transition-colors">
                <div className="text-2xl mb-3">{area.icono}</div>
                <h3 className="font-bold text-gray-900 mb-1">{area.titulo}</h3>
                <p className="text-sm text-gray-500">{area.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-brand to-brand-dark rounded-2xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">¿Te interesa?</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Envíanos tu CV indicando el área de tu interés. Siempre estamos abiertos a conocer nuevos talentos.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:rrhh@greenlineperu.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Mail className="w-4 h-4" />
              rrhh@greenlineperu.com
            </a>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <MapPin className="w-4 h-4" />
              Lima, Perú
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
