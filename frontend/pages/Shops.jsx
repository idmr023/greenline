import PageBanner from '../components/PageBanner';
import StoreLocator from '../components/StoreLocator';

export default function Tiendas() {
  return (
    <div>
      <PageBanner
        title="Tiendas y Distribuidores"
        subtitle="Encuentra tu sucursal o distribuidor Green Line más cercano"
      />
      <StoreLocator />
    </div>
  );
}