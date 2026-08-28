import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Tag, Minus, Plus, Download, FileText, ShieldCheck } from 'lucide-react';
import ProductImage from '../components/ProductImage';
import { BBVACard } from '../components/BBVACard';
import { costoRecargaDeProducto } from '../utils/batteryCalculator';
import { formatPrice } from '../lib/utils';
import { fetchProductos } from '../lib/productos';
import { useCart } from '../contexts/CartContext';
import { manualUrl } from '../lib/manuales';
import stripHtml, { cleanBateria } from '../utils/stripHtml';

const LazyYouTube = lazy(() => import('../components/YouTubeEmbed'));

const colorDotClass = {
  Blanco: 'bg-white border-gray-300',
  Negro: 'bg-gray-900',
  Gris: 'bg-gray-500',
  'Gris Oscuro': 'bg-gray-700',
  Rojo: 'bg-red-600',
  Verde: 'bg-brand',
  'Verde ligero': 'bg-green-400',
  'Verde Esmeralda': 'bg-emerald-600',
  'Verde Metálico': 'bg-emerald-700',
  Celeste: 'bg-sky-400',
  Azul: 'bg-blue-600',
  Crema: 'bg-orange-100',
  Plata: 'bg-gray-400',
  Morado: 'bg-purple-600',
  Naranja: 'bg-orange-500',
  Plateado: 'bg-gray-400',
  Rosado: 'bg-pink-400',
  Marrón: 'bg-amber-800',
  Camaleón: 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-500',
};

const TAB_LIST = [
  { key: 'descripcion', label: 'Descripción' },
  { key: 'ficha', label: 'Ficha Técnica' },
  { key: 'info', label: 'Información Adicional' },
  { key: 'manuales', label: 'Manuales' },
  { key: 'legal', label: 'Legal' },
];

function ManualesTab({ producto }) {
  const href = manualUrl(producto?.slug);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white">
        <FileText className="w-8 h-8 text-brand shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-gray-900">Manual de uso</p>
          <p className="text-xs text-gray-500">Descarga el manual de tu {producto?.nombre}</p>
        </div>
        {href ? (
          <a
            href={href}
            download
            title="Descargar manual de uso"
            className="inline-flex items-center gap-1.5 bg-brand text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-brand-dark transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar
          </a>
        ) : (
          <span
            title="Descargar garantía"
            className="inline-flex items-center gap-1.5 bg-brand text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-brand-dark transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white">
        <ShieldCheck className="w-8 h-8 text-gray-300 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-gray-900">Garantía</p>
          <p className="text-xs text-gray-500">Descargar certificado de garantía</p>
        </div>
        <a href="/assets/certificado_garantia_2026.pdf" blank="_blank" rel="noopener noreferrer" download>
          <span
          title="Descargar"
          className="inline-flex items-center gap-1.5 bg-brand text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-brand-dark transition-colors whitespace-nowrap"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Descargar
        </span>
        </a>
      </div>
    </div>
  );
}

// ── Carousel de imágenes (adaptado de ProductModal) ────────────
function ImageCarousel({ images, nombre }) {
  const [idx, setIdx] = useState(0);
  const total = images.length;

  const next = () => setIdx((i) => (i + 1) % total);
  const prev = () => setIdx((i) => (i - 1 + total) % total);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [total]);

  if (!total) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden group select-none">
        {images.map((img, i) => (
          <picture
            key={`${img.src}-${i}`}
            className={`absolute inset-0 block w-full h-full transition-opacity duration-300 ${
              i === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={img.src}
              alt={`${nombre} ${img.color || ''} ${i + 1}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </picture>
        ))}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </>
        )}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {images.map((_, i) =>
            total > 1 && (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === idx ? 'bg-brand' : 'bg-white/60'
                }`}
              />
            ),
          )}
        </div>
      </div>

      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                i === idx ? 'border-brand' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img src={img.src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tab: Ficha Técnica ────────────────────────────────────────
const FICHA_LABELS = {
  tipo_motor: 'Tipo de motor',
  potencia_motor: 'Potencia del motor',
  torque_maximo: 'Torque máximo',
  potencia_bateria: 'Potencia de batería',
  tipo_bateria: 'Tipo de batería',
  bateria_extraible: 'Batería extraíble',
  capacidad_bateria: 'Capacidad de batería',
  vida_util_bateria: 'Vida útil batería',
  tipo_toma_corriente: 'Tipo de toma de corriente',
  tiempo_carga_min: 'Tiempo de carga',
  velocidad_max_kmh: 'Velocidad máxima',
  autonomia_km: 'Autonomía',
  carga_maxima_kg: 'Carga máxima',
  largo_cm: 'Largo',
  ancho_cm: 'Ancho',
  alto_cm: 'Alto',
};

function formatFichaValue(key, value) {
  if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) return null;
  if (key === 'bateria_extraible') return value ? 'Sí' : 'No';
  if (key === 'tiempo_carga_min') return `${value} min`;
  if (key === 'velocidad_max_kmh') return `${value} km/h`;
  if (key === 'autonomia_km') return `${value} km`;
  if (key.includes('_cm')) return `${value} cm`;
  if (key === 'carga_maxima_kg') return `${value} kg`;
  return String(value);
}

function FichaTecnicaTab({ ficha }) {
  const entries = Object.entries(ficha || {})
    .filter(([k, v]) => formatFichaValue(k, v) != null && k !== 'id' && k !== 'producto_id');

  if (!entries.length) {
    return <p className="text-gray-500">No hay información de ficha técnica disponible.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
      {entries.map(([key, value]) => (
        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-500">{FICHA_LABELS[key] || key}</span>
          <span className="text-sm font-medium text-gray-900 text-right">
            {formatFichaValue(key, value)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Tab: Info Adicional ────────────────────────────────────────
function InfoAdicionalTab({ info }) {
  const entries = Object.entries(info || {}).filter(
    ([, v]) => v != null && v !== '' && !(Array.isArray(v) && v.length === 0),
  );

  if (!entries.length) {
    return <p className="text-gray-500">No hay información adicional disponible.</p>;
  }

  return (
    <div className="space-y-4">
      {entries.map(([key, value]) => (
        <div key={key}>
          <h4 className="font-semibold text-gray-900 mb-1 capitalize">
            {key.replace(/_/g, ' ')}
          </h4>
          {typeof value === 'string' ? (
            <p className="text-sm text-gray-600 whitespace-pre-line">{stripHtml(value)}</p>
          ) : Array.isArray(value) ? (
            <ul className="list-disc list-inside text-sm text-gray-600">
              {value.map((item, i) => (
                <li key={i}>{typeof item === 'string' ? stripHtml(item) : JSON.stringify(item)}</li>
              ))}
            </ul>
          ) : typeof value === 'object' ? (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(value).map(([k, v]) => (
                <div key={k} className="text-sm">
                  <span className="text-gray-500">{k.replace(/_/g, ' ')}:</span>{' '}
                  <span className="font-medium text-gray-900">{String(v)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">{String(value)}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Página principal ───────────────────────────────────────────
export default function ProductPage() {
  const { slug } = useParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('descripcion');
  const [activeColor, setActiveColor] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const { addItem, openCart } = useCart();

  useEffect(() => {
    fetchProductos()
      .then(setProductos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const product = useMemo(
    () => productos.find((p) => p.slug === slug),
    [productos, slug],
  );

  useEffect(() => {
    setActiveColor(null);
    setActiveTab('descripcion');
    setCantidad(1);
    setShowVideo(false);
    window.scrollTo(0, 0);
  }, [slug]);

  const availableColors = useMemo(() => {
    if (!product?.imagenes?.length) return [];
    const seen = new Set();
    return product.imagenes
      .filter((img) => img.color && !seen.has(img.color) && seen.add(img.color))
      .map((img) => img.color);
  }, [product?.imagenes]);

  const currentColor = activeColor || availableColors[0] || null;

  // COMENTADO (temporal — stock por color, por números):
  // const colorStock = useMemo(() => {
  //   if (!product?.colores_detalle?.length || !currentColor) return null;
  //   const found = product.colores_detalle.find((c) => c.nombre === currentColor);
  //   return typeof found?.stock === 'number' ? found.stock : null;
  // }, [product, currentColor]);

  const outOfStock =
    product?.disponibilidad === 'Fuera de stock'; // COMENTADO: || colorStock === 0

  const displayedImages = useMemo(() => {
    if (!product?.imagenes?.length) return [];
    if (!currentColor) return product.imagenes;
    return product.imagenes.filter((img) => img.color === currentColor);
  }, [product?.imagenes, currentColor]);

  const chargingCost = useMemo(
    () => costoRecargaDeProducto(product),
    [product],
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-600">Producto no encontrado</p>
        <Link
          to="/tienda"
          className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const cleanDescription = stripHtml(product.descripcion);
  const hasRealImages = displayedImages.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-brand transition-colors">Inicio</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/tienda" className="hover:text-brand transition-colors">Tienda</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">{product.nombre}</span>
      </nav>

      {/* Top: 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 mb-10">
        {/* Left: Carousel */}
        <div>
          {hasRealImages ? (
            <ImageCarousel images={displayedImages} nombre={product.nombre} />
          ) : (
            <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
              <ProductImage
                nombre={product.nombre}
                width={600}
                height={450}
                className="w-full h-full"
              />
            </div>
          )}

          {/* Video */}
          {product.videoId && (
            <div className="mt-4">
              {!showVideo ? (
                <button
                  type="button"
                  onClick={() => setShowVideo(true)}
                  className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center gap-3 text-white hover:bg-gray-800 transition-colors group"
                >
                  <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 ml-0.5" fill="white" />
                  </div>
                  <span className="font-semibold">Ver video del producto</span>
                </button>
              ) : (
                <div className="aspect-video rounded-xl overflow-hidden">
                  <Suspense
                    fallback={
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    }
                  >
                    <LazyYouTube videoId={product.videoId} />
                  </Suspense>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          {/* Nombre */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            {product.nombre}
          </h1>

          {/* Precio */}
          <div className="flex items-baseline gap-3 mb-4">
            {product.precio_original && product.precio_actual < product.precio_original && (
              <span className="text-gray-400 line-through text-lg">
                {formatPrice(product.precio_original)}
              </span>
            )}
            <span className="text-brand font-bold text-3xl">
              {formatPrice(product.precio_actual)}
            </span>
          </div>

          {/* Descripción breve */}
          {cleanDescription && (
            <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-4">
              {cleanDescription}
            </p>
          )}

          {/* Colores */}
          {availableColors.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Colores disponibles
              </p>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setActiveColor(c)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      currentColor === c
                        ? 'border-brand bg-brand/5 text-brand font-semibold'
                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full border border-gray-200 ${
                        colorDotClass[c] || 'bg-gray-300'
                      }`}
                    />
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categoría + Etiquetas */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {product.categoria && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                {product.categoria}
              </span>
            )}
            {product.etiquetas?.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full text-white ${
                  tag === 'Hot' ? 'bg-red-500' : 'bg-bbva'
                }`}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Batería y motor rápidos */}
          <div className="space-y-1.5 text-sm text-gray-600 mb-5">
            {product.motor && (
              <p><span className="font-semibold">Motor:</span> {product.motor}</p>
            )}
            {product.bateria && (
              <p><span className="font-semibold">Batería:</span> {cleanBateria(product.bateria) || product.bateria}</p>
            )}
          </div>

          <BBVACard />

          {/* CTA */}
          <div className="mt-auto pt-6 space-y-3">
            <div className="flex items-stretch gap-3">
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-1">
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  className="p-2.5 text-gray-500 hover:text-brand transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold w-8 text-center">{cantidad}</span>
                <button
                  type="button"
                  onClick={() => setCantidad((c) => c + 1)}
                  className="p-2.5 text-gray-500 hover:text-brand transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                disabled={outOfStock}
                onClick={() => {
                  addItem(product, { color: currentColor, cantidad });
                  openCart();
                }}
                className={`flex-1 py-3.5 rounded-lg font-semibold text-base transition-colors ${
                  outOfStock
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-brand text-white hover:bg-brand-dark'
                }`}
              >
                {outOfStock ? 'Agotado' : 'Agregar al carrito'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Tabs — full width */}
      <div className="border-t border-gray-200 pt-8">
        {/* Tab headers */}
        <div className="flex gap-1 overflow-x-auto border-b border-gray-200 mb-6">
          {TAB_LIST.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-brand text-brand'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="min-h-[200px]">
          {activeTab === 'descripcion' && (
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
              {cleanDescription ? (
                <p className="whitespace-pre-line">{cleanDescription}</p>
              ) : (
                <p className="text-gray-500">No hay descripción disponible para este producto.</p>
              )}
            </div>
          )}

          {activeTab === 'ficha' && (
            <FichaTecnicaTab ficha={product.ficha_tecnica} />
          )}

          {activeTab === 'info' && (
            <InfoAdicionalTab info={product.info_adicional} />
          )}

          {activeTab === 'manuales' && (
            <ManualesTab producto={product} />
          )}

          {activeTab === 'legal' && (
            <div className="text-sm text-gray-500 space-y-3">
              <p>
                Los precios indicados incluyen IGV. La disponibilidad y especificaciones
                están sujetas a cambios sin previo aviso.
              </p>
              <p>
                Las imágenes son referenciales. El producto final puede variar ligeramente
                en color y acabado.
              </p>
              <p>
                Garantía según términos y condiciones de GreenLine. Consulte en tienda
                para más detalles.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
