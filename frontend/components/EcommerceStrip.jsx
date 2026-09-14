import {ecommerce_strip_data as stores} from '../../src/data_json.jsx';

function EcommerceCard({ store, variant = 'full' }) {
  const isCompact = variant === 'compact';

  return (
    <a
      href={store.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Comprar en ${store.name}`}
      className={
        isCompact
          ? 'group flex items-center justify-center opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0'
          : 'group flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white px-6 py-4 transition-all hover:border-brand/30 hover:shadow-md'
      }
    >
      <div
        className={
          isCompact
            ? 'flex h-8 items-center justify-center'
            : 'flex h-20 items-center justify-center'
        }
      >
        <img
          src={store.img}
          alt={store.name}
          loading="lazy"
          className={
            isCompact
              ? 'h-8 w-auto object-contain'
              : 'h-16 w-auto max-w-[120px] object-contain'
          }
        />
      </div>

      {!isCompact && (
        <span className="text-sm font-medium text-gray-700 transition-colors group-hover:text-brand">
          {store.name}
        </span>
      )}
    </a>
  );
}

export default function EcommerceStrip({ variant = 'full' }) {
  const isCompact = variant === 'compact';

  if (isCompact) {
    return (
      <div className="mt-8">
        <p className="mb-4 text-center text-xs uppercase tracking-widest text-gray-400">
          También disponible en
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {stores.map((store) => (
            <EcommerceCard
              key={store.name}
              store={store}
              variant="compact"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-14">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">
          También nos encuentras en
        </h2>

        <p className="mx-auto mb-10 text-gray-600">
          Encuentra nuestros productos en las plataformas de e-commerce que prefieras.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {stores.map((store) => (
            <EcommerceCard
              key={store.name}
              store={store}
              variant="full"
            />
          ))}

          <p className="text-xs text-gray-400 mt-8">
            * Precios y disponibilidad pueden variar según la plataforma.
          </p>
        </div>
      </div>
    </section>
  );
}