const stores = [
  {
    name: 'MercadoLibre',
    img: 'https://guiaimpresion.com/wp-content/uploads/2022/12/4-1.png',
    href: 'https://www.mercadolibre.com.pe/tienda/greenline',
  },
  {
    name: 'Saga Falabella',
    img: 'https://images.falabella.com/v3/assets/bltf4ed0b9a176c126e/blt3729c261c3d95003/65d388aa849f3142f3e97dfb/android_chrome256.png',
    href: 'https://www.falabella.com.pe/falabella-pe/seller/GREENLINE%20PERU',
  },
  {
    name: 'Ripley',
    img: 'https://s3.amazonaws.com/media.greatplacetowork.com/peru/best-workplaces-for-millennials-in-peru/2022/tiendas-ripley/logo-200.png',
    href: 'https://simple.ripley.com.pe/tienda/greenline-group-6049709',
  },
  {
    name: 'Toquea',
    img: 'https://media.licdn.com/dms/image/v2/D4E0BAQHJv4QucESOeA/company-logo_200_200/B4EZ10E2qyGkAI-/0/1775768924397/toquea_logo?e=2147483647&v=beta&t=Ztb7zwvisG3I-FGLgTNvSSqSFW9zycqwTOjpKnKAgog',
    href: 'https://shop.toquea.com/',
  },
  {
    name: 'Agora Shop',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSS7-N8mGJvHi4szzU_kAifloGpnbttfoXKhxNFhDvjhub0O6hUt95rwk&s=10',
    href: 'https://app.agora.pe/',
  },
  {
    name: 'Coolbox',
    img: 'https://coolboxpe.vtexassets.com/assets/vtex/assets-builder/coolboxpe.store-theme/0.0.84/logo___6539742abaf840cb31bc3e646607adf5.svg',
    href: 'https://www.coolbox.pe/greenline',
  },
];

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