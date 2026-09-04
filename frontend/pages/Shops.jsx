import PageBanner from '../components/PageBanner';
import SEOHead, { breadcrumbSchema } from '../components/SEOHead';
import StoreLocator from '../components/StoreLocator';

export default function Tiendas() {
  return (
    <div>
      <SEOHead
        title="Tiendas y Distribuidores"
        description="Encuentra la tienda Green Line o distribuidor autorizado más cercano a ti en Lima y todo el Perú."
        url="/tiendas"
        keywords={['tiendas Green Line', 'distribuidores', 'dónde comprar scooters eléctricos', 'tiendas Lima']}
        jsonLd={[breadcrumbSchema([
          { name: 'Inicio', url: '/' },
          { name: 'Tiendas', url: '/tiendas' },
        ])]}
      />
      <PageBanner
        title="Tiendas y Distribuidores"
        subtitle="Encuentra tu sucursal o distribuidor Green Line mǭs cercano"
      />
      <StoreLocator />
    </div>
  );
}