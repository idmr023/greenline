import { useState, useMemo, useEffect } from 'react';
import SEOHead, { organizationSchema, breadcrumbSchema } from '../components/SEOHead';
import HeroCarousel from '../components/home/HeroCarousel.jsx';
import Pillars from '../components/home/Pillars.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import CountdownBanner from '../components/ui/aniversario/CountdownBanner';
import Testimonials from '../components/Testimonials';
import Objecciones from '../components/home/Objeciones.jsx';
import VideoSection from '../components/VideoSection';
import GreenTipsSection from '../components/home/GreenTipsSection.jsx';
import { CATEGORIAS, sortProducts, fetchProductos } from '../lib/productos';
import { isAniversarioActivo } from '../lib/aniversario'; // 1. Importación añadida para fechas
import AnniversaryPromo from '../components/ui/aniversario/AniversaryPromo';
import EcommerceStrip from '../components/EcommerceStrip';
import FeatureCard from '../components/ui/general/FeaturedCard';
import { inclusive_vehicles } from '../../src/data_json.jsx'; // 2. Ruta de importación estandarizada
import { Beneficios } from '../components/home/Beneficios.jsx';
import { LinkButton } from '../components/ui/general/LinkButton.jsx';
import OficialDistributors from '../components/home/OficialDistributors.jsx';


export default function Home() {
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true); // 3. Nuevo estado para manejar la carga

  useEffect(() => {
    fetchProductos()
      .then((data) => {
        setProductos(data);
        setLoading(false); // Apagamos el loading cuando llegan los datos
      })
      .catch((err) => {
        console.error(err);
        setLoading(false); // También lo apagamos si hay error
      });
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

  // 4. Arreglo unificado para los filtros (Principio DRY)
  const filterOptions = ['Todas', ...CATEGORIAS];

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

      { isAniversarioActivo() ? <AnniversaryPromo /> : <CountdownBanner /> }

      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Lo más destacado de nuestra tienda
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* 6. Mapeo limpio de los botones de filtro */}
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilterCategory(option)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  filterCategory === option
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-brand hover:text-brand'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* 7. Skeleton/Indicador de Carga para evitar parpadeos visuales */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
          </div>
        ) : displayed.length === 0 ? (
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

        <LinkButton to="/tienda" text="Ver más productos" />
      </section>

      <VideoSection />

      <OficialDistributors />

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
 

      {/* M-CAR — Inclusive Line */}
      {/* <section className="py-14 bg-[#F3F7F3] text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> */}
          {/* <div className="text-center mb-10">
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
          </div> */}

          {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {inclusive_vehicles.map(({ id, title, desc, icon}) => (
              <FeatureCard
                key={id}
                title={title}
                text={desc}
                icon={icon}
              />
            ))}
          </div>

          <LinkButton to="/tienda?categoria=Cuatrimotos" text="Explorar opciones" />
        </div>
      </section> */}


      <Objecciones />

      {/* <Beneficios /> */}
      
      
      {/* <GreenTipsSection /> */}

      <EcommerceStrip /> 
      
      <Testimonials />
    </>
  );
}