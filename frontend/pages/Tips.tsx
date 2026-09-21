import { Link } from 'react-router-dom';
import { Instagram } from '../lib/icons';
import { SOCIAL } from '../lib/config';
import { green_tips } from '../../src/data_json.jsx';
import FeatureCard from '../components/ui/general/FeaturedCard';
import PageBanner from '../components/PageBanner';
import SEOHead, { breadcrumbSchema } from '../components/SEOHead';

export default function Tips() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="GreenTips — Consejos de Movilidad Eléctrica"
        description="Descubre tips de movilidad eléctrica: carga inteligente, presión de neumáticos, cuidado bajo lluvia y mantenimiento preventivo. Conduce mejor, ahorra energía y cuida el planeta."
        url="/tips"
        keywords={['green tips', 'consejos movilidad eléctrica', 'cuidado batería', 'mantenimiento eléctrico', 'Green Line']}
        jsonLd={[breadcrumbSchema([
          { name: 'Inicio', url: '/' },
          { name: 'GreenTips', url: '/tips' },
        ])]}
      />

      <PageBanner
        title="GreenTips"
        subtitle="Consejos verdes para moverte mejor"
        bgClass="bg-gradient-to-br from-brand to-brand-dark"
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-brand text-white rounded-full text-sm font-semibold mb-4">
            GreenTips
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Pequeños hábitos que cuidan tu vehículo, tu bolsillo y el planeta
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Compartimos tips de movilidad eléctrica todos los días para que
            prolongues la vida de tu batería, optimices la autonomía y conduzcas
            con más seguridad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {green_tips.map(({ icon, title, text }) => (
            <FeatureCard
              key={title}
              icon={icon}
              title={title}
              text={text}
            />
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-r from-brand to-green-700 text-white overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                ¿Quieres más tips como estos?
              </h3>
              <p className="text-white/80 text-sm sm:text-base">
                Síguenos en Instagram para recibir consejos de movilidad eléctrica,
                promociones y novedades de Green Line.
              </p>
            </div>
            <a
              href={SOCIAL.instagram_greentips}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 px-6 py-3 bg-white text-brand font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Instagram className="w-5 h-5" />
              @greenline_peru
            </a>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-brand font-medium hover:underline"
          >
            ← Volver al inicio
          </Link>
        </div>
      </section>
    </div>
  );
}