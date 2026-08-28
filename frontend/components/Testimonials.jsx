import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { fetchTestimonios } from '../lib/testimonios';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
        />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-4/5 bg-gray-200 rounded" />
      </div>
      <div className="pt-3 border-t border-gray-200">
        <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
        <div className="h-3 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchTestimonios().then((data) => {
      if (!cancelled) {
        setReviews(data);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-brand/10 text-brand text-sm font-semibold rounded-full mb-3">
            Testimonios
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-gray-600">
            Más de 5000 clientes confían en Green Line para su movilidad diaria.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              Aún no tenemos testimonios publicados.
            </p>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 text-brand font-semibold hover:text-brand-dark transition-colors"
            >
              Comparte tu experiencia con nosotros
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <StarRating rating={r.rating} />
                <p className="text-gray-700 text-sm leading-relaxed mt-3 mb-4">
                  &ldquo;{r.texto}&rdquo;
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{r.nombre}</p>
                    {r.rol && <p className="text-xs text-gray-500">{r.rol}</p>}
                  </div>
                  {r.vehiculo && (
                    <span className="text-xs font-semibold text-brand bg-brand/10 px-2 py-1 rounded">
                      {r.vehiculo}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}