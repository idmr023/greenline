import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Carlos Mendoza',
    role: 'Cliente desde 2022',
    rating: 5,
    text: 'Compré una VMP P01 para mis trayectos diarios al trabajo. Ahorro más de S/ 400 al mes en combustible. El servicio postventa de Green Line es excelente.',
    vehicle: 'VMP P01',
  },
  {
    id: 2,
    name: 'María López',
    role: 'Cliente desde 2023',
    rating: 5,
    text: 'La trimoto eléctrica cambió mi negocio de delivery. Es silenciosa, eficiente y mis clientes notan la diferencia. 100% recomendada.',
    vehicle: 'Trimoto T-15',
  },
  {
    id: 3,
    name: 'Roberto Silva',
    role: 'Cliente desde 2021',
    rating: 5,
    text: 'Tengo la Sunra E8 y es una maravilla. La batería dura toda la semana con mi uso diario. El equipo de Green Line me asesoró perfecto.',
    vehicle: 'Sunra E8',
  },
  {
    id: 4,
    name: 'Ana Torres',
    role: 'Cliente desde 2024',
    rating: 5,
    text: 'Me encanta mi carguero eléctrico. Lo uso para repartir en mi panadería y es súper práctico. Carga en cualquier enchufe normal.',
    vehicle: 'Carguero C-20',
  },
  {
    id: 5,
    name: 'Diego Ramírez',
    role: 'Cliente desde 2023',
    rating: 4,
    text: 'Excelente relación calidad-precio. El seguro es muy accesible y la matrícula gratuita fue un gran plus. Solo le doy 4 estrellas porque quería más colores disponibles.',
    vehicle: 'VMP P01',
  },
  {
    id: 6,
    name: 'Luciana Vega',
    role: 'Cliente desde 2024',
    rating: 5,
    text: 'Como parte de la comunidad universitaria, obtuve un descuento increíble. La moto es perfecta para ir a la universidad y de paseo los fines de semana.',
    vehicle: 'Sunra E5',
  },
];

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

export default function Testimonials() {
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
          <p className="text-gray-600 max-w-xl mx-auto">
            Más de 500 clientes confían en Green Line para su movilidad diaria.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <StarRating rating={r.rating} />
              <p className="text-gray-700 text-sm leading-relaxed mt-3 mb-4">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.role}</p>
                </div>
                <span className="text-xs font-semibold text-brand bg-brand/10 px-2 py-1 rounded">
                  {r.vehicle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
