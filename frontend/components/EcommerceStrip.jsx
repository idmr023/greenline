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

export default function EcommerceStrip() {
  return (
    <div className="mt-12 border-t border-gray-100 pt-6">
      <p className="text-center text-xs uppercase tracking-widest text-gray-400 mb-4">
        También disponible en
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {stores.map((s) => (
          <a
            key={s.name}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-45 grayscale transition hover:opacity-100 hover:grayscale-0"
            aria-label={s.name}
          >
            <img src={s.img} alt={s.name} className="h-8 w-auto" loading="lazy" />
          </a>
        ))}
      </div>
    </div>
  );
}
