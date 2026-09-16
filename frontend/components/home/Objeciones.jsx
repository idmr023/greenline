import { Link } from 'react-router-dom';
import FeatureCard from '../ui/general/FeaturedCard';
import { objeciones } from '../../../src/data_json';
import { AngleRight } from '../../lib/icons';

export default function Objecciones() {
  return (
    <section className="py-16 bg-gradient-to-br from-[#008a00] via-[#006400] to-[#022e1c] relative overflow-hidden">
      {/* Decoración sutil de fondo */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-96 h-96 rounded-full bg-brand-light/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-white/15 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            ¿Por qué Green Line?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            ¿Por qué confiar en Green Line?
          </h2>
          <p className="text-emerald-100/90 mt-3 max-w-xl mx-auto">
            Resolvemos tus dudas antes de comprar es nuestra prioridad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {objeciones.map(({ icon, title, text, highlight, link }) => {
            const card = (
              <FeatureCard
                icon={icon}
                title={title}
                text={text}
                badgeText={highlight}
                className="h-full border-gray-100 group-hover:border-brand/40 group-hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]"
              >
                {link && (
                  <span className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white text-sm font-bold rounded-full transition-colors group-hover:bg-brand-dark">
                    Ver más
                    <AngleRight className="w-4 h-4" />
                  </span>
                )}
              </FeatureCard>
            );

            return link ? (
              <Link
                key={title}
                to={link}
                className="block h-full group focus-visible:outline-none"
              >
                {card}
              </Link>
            ) : (
              <div key={title} className="h-full">
                {card}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}