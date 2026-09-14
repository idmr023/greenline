import { Link } from 'react-router-dom';
import { ArrowRight, Target, Leaf, Users, Award } from '../lib/icons';
import PageBanner from '../components/PageBanner';
import SEOHead, { organizationSchema, breadcrumbSchema } from '../components/SEOHead';
import { NOSOTROS_HEADER, NOSOTROS_CARRUSEL } from '../lib/images';
import { nosotros_values as values, nosotros_milestones as milestones } from '../../src/data_json.jsx';

export default function Nosotros() {
  return (
    <div>
      <SEOHead
        title="Sobre Nosotros"
        description="Green Line es la empresa líder en movilidad eléctrica en el Perú desde 2017. Scooters, motos, trimotos y más vehículos eléctricos con garantía y servicio técnico."
        url="/nosotros"
        keywords={['Green Line', 'movilidad eléctrica', 'sobre nosotros', 'empresa vehículos eléctricos Perú']}
        jsonLd={[organizationSchema(), breadcrumbSchema([
          { name: 'Inicio', url: '/' },
          { name: 'Nosotros', url: '/nosotros' },
        ])]}
      />
      <div className="relative h-[40vh] min-h-280px max-h-420px overflow-hidden">
          <PageBanner
            title="Sobre Nosotros" 
            subtitle="Líderes en movilidad eléctrica en el Perú desde 2017"
            image={NOSOTROS_HEADER}
          />
      </div>

      {/* Story */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-3 py-1 bg-brand/10 text-brand text-sm font-semibold rounded-full mb-4">
              Nuestra historia
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Transformando la movilidad urbana en el Perú
            </h2>
            <div className="space-y-3 text-gray-600 leading-relaxed text-justify">
              <p>
                Green Line nació con la visión de hacer accesible la movilidad eléctrica
                en el Perú. Desde nuestra sede en Lima, hemos trabajado incansablemente para
                ofrecer vehículos menores eléctricos de primera calidad a clientes en todo
                el país.
              </p>
              <p>
                Nos especializamos en la importación y distribución de marcas reconocidas
                internacionalmente como <strong>Sunra</strong>, <strong>Zuboo</strong> y
                <strong> Huaihai</strong>, garantizando estándares de seguridad y
                rendimiento excepcionales.
              </p>
              <p>
                Con presencia en <strong>8 ciudades</strong> del Perú y más de <strong>5000
                clientes activos</strong>, seguimos creciendo con el compromiso de
                construir un futuro más limpio y sostenible.
              </p>
            </div>
          </div>

          <div className="relative w-xs mx-auto">
            <picture>
              <img
                src={NOSOTROS_CARRUSEL(1)}
                alt="Equipo Green Line"
                className="rounded-xl shadow-lg w-full object-cover"
                loading="lazy"
              />
            </picture>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand/10 rounded-xl -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-brand/5 rounded-lg -z-10" />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
            Nuestro recorrido
          </h2>
          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-brand/20 -translate-x-px" />
            {milestones.map((m, i) => (
              <div key={`${m.year}-${i}`} className={`relative flex items-start gap-4 mb-8 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                <div className="hidden sm:block sm:w-1/2" />
                <div className="absolute left-4 sm:left-1/2 w-3 h-3 bg-brand rounded-full -translate-x-1.5 mt-1.5 ring-4 ring-white z-10" />
                <div className="pl-10 sm:pl-0 sm:w-1/2">
                  <span className="inline-block px-2.5 py-0.5 bg-brand/10 text-brand text-xs font-bold rounded mb-1">
                    {m.year}
                  </span>
                  <p className="text-gray-700 text-sm">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
            Nuestros valores
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-shadow">
                  <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-brand/10 mb-4">
                    <Icon className="w-6 h-6 text-brand" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
            Nuestros productos en acción
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 10 }, (_, i) => (
              <picture key={i} className="rounded-lg overflow-hidden aspect-square">
                <img
                  src={NOSOTROS_CARRUSEL(i + 1)}
                  alt={`Green Line equipo ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </picture>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-brand-dark text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            ¿Listo para unirte a la revolución eléctrica?
          </h2>
          <p className="text-white/80 mb-6">
            Conoce nuestro catálogo completo de vehículos eléctricos y encuentra
            tu modelo ideal.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/tienda"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-dark font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Ver tienda
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
