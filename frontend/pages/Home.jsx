import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Accessibility, ArrowLeftRight, ShieldCheck } from 'lucide-react';
import SEOHead, { organizationSchema, breadcrumbSchema } from '../components/SEOHead';
import HeroCarousel from '../components/HeroCarousel';
import Pillars from '../components/Pillars';
import ProductCard from '../components/ProductCard';
import CountdownBanner from '../components/ui/aniversario/CountdownBanner';
import Benefits from '../components/Benefits';
import Testimonials from '../components/Testimonials';
import Objecciones from '../components/Objeciones';
import VideoSection from '../components/VideoSection';
import GreenTipsSection from '../components/ui/greenTips/GreenTipsSection';
import { CATEGORIAS, sortProducts } from '../lib/utils';
import { fetchProductos } from '../lib/productos';
import AnniversaryPromo from '../components/ui/aniversario/AniversaryPromo';
import EcommerceStrip from '../components/EcommerceStrip';

const inclusiveVehicles = [
  {
    id: 'inc-1',
    title: 'M-CAR',
    desc: 'Vehículos eléctricos de diseño universal, creados desde fábrica para que cualquier persona se desplace con autonomía y comodidad.',
    icon: Accessibility,
  },
  {
    id: 'inc-2',
    title: 'Fácil de usar',
    desc: 'Transmisión automática, marcha en retroceso y conducción estable: pensadas para el uso diario sin complicaciones.',
    icon: ArrowLeftRight,
  },
  {
    id: 'inc-3',
    title: 'Seguridad y confianza',
    desc: 'Estructura resistente, estabilidad en ruta y soporte de GreenLine en cada etapa de tu compra.',
    icon: ShieldCheck,
  },
];

export default function Home() {
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [productos, setProductos] = useState([]);
  const [fechaActual, setFechaActual] = useState(new Date());

  useEffect(() => {
    fetchProductos().then(setProductos).catch(console.error);
  }, []);

  // COMENTADO (temporal — "últimas unidades" por números):
  // const lowStockProducts = useMemo(
  //   () =>
  //     productos.filter(
  //       (p) =>
  //         p.disponibilidad !== 'Fuera de stock' &&
  //         p.unidades != null &&
  //         p.unidades < 4,
  //     ),
  //   [productos],
  // );

  const displayed = useMemo(() => {
    let list = [...productos];
    if (filterCategory !== 'Todas') {
      list = list.filter((p) => p.categoria === filterCategory);
    }
    list = sortProducts(list, 'price_asc');
    return list.slice(0, 12);
  }, [productos, filterCategory]);

  return (
    <>
      <SEOHead
        title="Vehículos de Movilidad Eléctrica en Perú"
        description="Green Line es la tienda de vehículos de movilidad eléctrica en Perú. Scooters, motos, trimotos, bicicletas eléctricas y más. Compra online con envío a todo el Perú."
        url="/"
        keywords={['movilidad eléctrica', 'scooter eléctrico', 'moto eléctrica', 'bicicleta eléctrica', 'trimoto eléctrica', 'vehículos eléctricos Perú', 'Green Line']}
        jsonLd={[organizationSchema(), breadcrumbSchema([{ name: 'Inicio', url: '/' }])]}
      />
      <h1 className="sr-only">Green Line - Vehículos de Movilidad Eléctrica en Perú</h1>
      
      <HeroCarousel />

      <Pillars /> 

      { fechaActual.getMonth() === 8 && fechaActual.getDate() >= 1 && fechaActual.getDate() <= 24 ? <AnniversaryPromo /> : <CountdownBanner /> }

      {/* Organic Grid - Destacados */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Lo más destacado de nuestra tienda
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilterCategory('Todas')}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                filterCategory === 'Todas'
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-brand hover:text-brand'
              }`}
            >
              Todas
            </button>
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilterCategory(c)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  filterCategory === c
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-brand hover:text-brand'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {displayed.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            No hay productos en esta categoría.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayed.map((p) => (
              <ProductCard key={p.id} producto={p} featured={p.destacado} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/tienda"
            className="inline-block px-8 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg transition-colors"
          >
            Ver más productos
          </Link>
        </div>
      </section>

      {/* COMENTADO (temporal — Zona "Últimas unidades disponibles"):
      {lowStockProducts.length > 0 && (
        <section className="py-14 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Últimas unidades disponibles
              </h2>
            </div>
            <p className="text-gray-600 mb-8 ml-6">
              Estos modelos se están agotando. No dejes pasar la oportunidad.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {lowStockProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  producto={p}
                />
              ))}
            </div>
          </div>
        </section>
      )} */}

      <EcommerceStrip />  

      {/* M-CAR — Inclusive Line */}
      <section className="py-14 bg-[#F3F7F3] text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 bg-brand text-white rounded-full text-sm font-semibold mb-4">
              M-CAR — Movilidad para todos
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Diseño universal, libertad sin límites
            </h2>
            <p className="text-gray-600 mx-auto">
              Las M-CAR son vehículos eléctricos creados con diseño universal: pensados
              desde fábrica para que personas con capacidades diversas se desplacen con
              autonomía, comodidad y total acceso igualitario.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {inclusiveVehicles.map(({ id, title, desc, icon: Icon }) => (
              <div
                key={id}
                className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-brand/10 mb-4">
                  <Icon className="w-7 h-7 text-brand" />
                </div>
                <h3 className="font-bold mb-2 text-lg text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/tienda?categoria=Cuatrimotos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
            >
              Explorar opciones
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <VideoSection />
        
      <Benefits />
      <Objecciones />

      <GreenTipsSection />

      <Testimonials />
    </>
  );
}
