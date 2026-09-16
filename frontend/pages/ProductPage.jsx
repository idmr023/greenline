import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, ChevronUp, Tag,
  Minus, Plus, Download, FileText, ShieldCheck, Star, User,
  Battery, Check, ShieldAlert, X, Weight, Truck, Unplug, Sparkles,
  Gauge, Ruler, MoveHorizontal, ArrowUpDown, Zap, Route,
} from '../lib/icons';
import ProductImage from '../components/product/ProductImage';
import ProductGallery from '../components/product/ProductGallery';
import ProductVideos from '../components/product/ProductVideos';
import SEOHead, { productSchema, breadcrumbSchema } from '../components/SEOHead';
import { BBVACard } from '../components/ui/general/BBVACard';
import { costoRecargaDeProducto } from '../utils/batteryCalculator';
import { formatPrice } from '../lib/utils';
import { fetchProductos } from '../lib/productos';
import { fetchTestimonios } from '../lib/testimonios';
import { useCart } from '../contexts/CartContext';
import { manualUrl } from '../lib/manuales';
import { videosForProduct } from '../data/videosYT';
import stripHtml, { cleanBateria } from '../utils/stripHtml';
import { CONTACT } from '../lib/config';
import { ColorDot } from '../components/ColorDot';
import { capacidadCargaTexto, equivalentesDeCarga } from '../lib/capacidadCarga';
import { product_tab_list as TAB_LIST, product_ficha_labels as FICHA_LABELS } from '../../src/data_json.jsx';

// ── Constantes ──────────────────────────────────────────────────

const MAX_DESC_LINES = 200;

// ── Helpers ─────────────────────────────────────────────────────

function normalizeText(text) {
  return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function formatFichaValue(key, value) {
  if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) return null;
  if (key === 'bateria_extraible') return value ? 'Sí' : 'No';
  if (key === 'requiere_placa_soat') return value ? 'Sí' : 'No';
  if (key === 'tiempo_carga_min') return `${value} horas`;
  if (key === 'velocidad_max_kmh') return `${value} km/h`;
  if (key === 'autonomia_km') {
    const s = String(value).trim();
    return /km/i.test(s) ? s : `${s} km`;
  }
  if (key.includes('_cm')) return `${value} cm`;
  if (key === 'carga_maxima_kg') return `${value} kg`;
  return String(value);
}

// ── Hook: expand/collapse de texto largo ────────────────────────

function useExpandable(ref, deps = [], maxHeight = MAX_DESC_LINES) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setOverflows(el.scrollHeight > maxHeight + 2);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const toggle = useCallback(() => setExpanded((v) => !v), []);

  return { expanded, overflows, toggle };
}

// ── Iconos ──────────────────────────────────────────────────────

function WhatsAppIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

// ── Star Rating ─────────────────────────────────────────────────

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

// Eliminado ImageCarousel local redundante (sustituido por ProductGallery unificado)

// ── Specs Card (Características destacadas) ─────────────────────

function SpecsCard({ ficha }) {
  const cards = useMemo(() => {
    if (!ficha) return [];
    const {
      velocidad_max_kmh: vel, motor, autonomia_km: aut, largo_cm: lar,
      ancho_cm: anc, alto_cm: alt, bateria_extraible: ext,
      requiere_placa_soat: placa, bateria,
    } = ficha;

    return [
      aut && { Icon: Route, label: 'Autonomía', value: /km/i.test(String(aut)) ? String(aut) : `${aut} km` },
      vel && { Icon: Gauge, label: 'Velocidad Máx', value: /km\/h/i.test(String(vel)) ? String(vel) : `${vel} km/h` },
      motor && { Icon: Zap, label: 'Motor', value: motor },
      bateria && { Icon: Battery, label: 'Batería', value: cleanBateria(bateria) || bateria },
      ext != null && { Icon: Unplug, label: 'Batería extraíble', value: ext ? 'Sí' : 'No' },
      lar && { Icon: Ruler, label: 'Largo', value: `${lar} cm` },
      anc && { Icon: MoveHorizontal, label: 'Ancho', value: `${anc} cm` },
      alt && { Icon: ArrowUpDown, label: 'Alto', value: `${alt} cm` },
      { Icon: ShieldAlert, label: 'Placa / SOAT', value: placa === true ? 'Sí' : placa === false ? 'No' : 'Consultar' },
    ].filter(Boolean);
  }, [ficha]);

  if (!cards.length) return null;

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-brand to-emerald-800 text-white shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-electric text-black shadow-md">
          <Sparkles className="w-4 h-4 fill-current" />
        </span>
        <h3 className="font-extrabold text-base sm:text-lg tracking-wide text-yellow-electric">
          ¡Características Destacadas!
        </h3>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 text-center">
        {cards.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1 px-1.5 py-3 bg-white rounded-xl hover:shadow-md transition-shadow"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand/10 mb-1">
              <item.Icon className="w-4 h-4 text-brand" />
            </span>
            <span className="text-[10px] sm:text-xs text-gray-500 font-medium leading-tight">{item.label}</span>
            <span className="text-xs sm:text-sm font-bold text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Ficha Técnica ──────────────────────────────────────────

function FichaTecnicaTab({ ficha }) {
  const entries = Object.entries(ficha || {}).filter(
    ([k, v]) => formatFichaValue(k, v) != null && k !== 'id' && k !== 'producto_id' && k !== 'carga_minima_kg',
  );

  if (!entries.length) {
    return <p className="text-gray-500">No hay información de ficha técnica disponible.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
      {entries.map(([key, value]) => (
        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-500">{FICHA_LABELS[key] || key}</span>
          <span className="text-sm font-medium text-gray-900 text-right">
            {key === 'carga_maxima_kg'
              ? `${capacidadCargaTexto(ficha) || formatFichaValue(key, value)} kg`
              : formatFichaValue(key, value)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Tab: Capacidad de Carga ─────────────────────────────────────

function CapacidadCargaTab({ ficha }) {
  const texto = capacidadCargaTexto(ficha);
  const equivalencias = equivalentesDeCarga(ficha);
  const esRango = ficha?.carga_minima_kg && ficha.carga_minima_kg !== ficha.carga_maxima_kg;

  if (!texto) {
    return (
      <p className="text-gray-500">
        La capacidad de carga de este modelo se indica en la ficha técnica. Contacta a tu
        asesor para conocerla en detalle.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-brand text-white">
        <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white/15 shrink-0">
          <Weight className="w-6 h-6" />
        </span>
        <div>
          <p className="text-white/80 text-xs font-semibold uppercase tracking-wide">Capacidad de carga</p>
          <p className="text-3xl sm:text-4xl font-extrabold leading-tight">
            {texto} <span className="text-xl font-bold text-white/90">kg</span>
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
        Cuánto peso puede cargar tu {esRango ? `entre ${texto} kg` : `hasta ${texto} kg`} sin
        afectar la seguridad ni el rendimiento del vehículo. Para que lo veas fácil, lo
        comparamos con cosas de todos los días:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {equivalencias.map((e) => (
          <div key={e.nombre} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand/10 shrink-0">
              <Truck className="w-5 h-5 text-brand" />
            </span>
            <div>
              <p className="text-[11px] text-gray-500">Equivale aproximadamente a</p>
              <p className="font-bold text-gray-900 text-sm">{e.texto}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 max-w-3xl">
        * Referencias aproximadas para que dimensiones la carga (saco de papas 50 kg, garrafón de
        agua 20 kg, costal de abono 25 kg, persona adulta ≈70 kg). Siempre carga repartida y dentro
        de los límites indicados por el fabricante.
      </p>
    </div>
  );
}

// ── Tab: Info Adicional ──────────────────────────────────────────

function InfoAdicionalTab({ info }) {
  const entries = Object.entries(info || {}).filter(
    ([key, v]) => key !== 'ideal_para' && v != null && v !== '' && !(Array.isArray(v) && v.length === 0),
  );

  if (!entries.length) {
    return <p className="text-gray-500">No hay información adicional disponible.</p>;
  }

  return (
    <div className="space-y-4">
      {entries.map(([key, value]) => (
        <div key={key}>
          <h4 className="font-semibold text-gray-900 mb-1 capitalize">{key.replace(/_/g, ' ')}</h4>
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

// ── Tab: Manuales ───────────────────────────────────────────────

function ManualesTab({ producto }) {
  const manualBase = '/assets/manuales_uso/';
  const href = producto?.manual_pdf
    ? manualBase + producto.manual_pdf
    : manualUrl(producto?.slug);
  const btnClass = 'inline-flex items-center gap-1.5 bg-brand text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-brand-dark transition-colors whitespace-nowrap';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white">
        <FileText className="w-8 h-8 text-brand shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-gray-900">Manual de uso</p>
          <p className="text-xs text-gray-500">Descarga el manual de tu {producto?.nombre}</p>
        </div>
        {href ? (
          <a href={href} download title="Descargar manual de uso" className={btnClass}>
            <Download className="w-3.5 h-3.5" />
            Descargar
          </a>
        ) : (
          <span title="Descargar manual de uso" className={btnClass}>
            <Download className="w-3.5 h-3.5" />
            Descargar
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white">
        <ShieldCheck className="w-8 h-8 text-brand shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-gray-900">Garantía</p>
          <p className="text-xs text-gray-500">Descargar certificado de garantía</p>
        </div>
        <a href="/assets/certificado_garantia_2026.pdf" target="_blank" rel="noopener noreferrer" download>
          <span title="Descargar" className={btnClass}>
            <ShieldCheck className="w-3.5 h-3.5" />
            Descargar
          </span>
        </a>
      </div>
    </div>
  );
}

// ── Descripción SEO ─────────────────────────────────────────────

function construirSeoDescription(product, cleanDescription) {
  if (cleanDescription) return cleanDescription.slice(0, 155);
  const total = product.ficha_tecnica?.autonomia_km;
  let textoAutonomia = '';
  if (total) {
    const usaKm = /km/i.test(String(total));
    const textoKm = usaKm ? String(total) : `${total} km`;
    textoAutonomia = `Autonomía ${textoKm}.`;
  }
  return `${product.nombre} - Vehículo de movilidad eléctrica GreenLine. ${textoAutonomia} Compra online o visita nuestras tiendas en Lima.`;
}

// ── Panel lateral: info esencial + CTA ───────────────────────────

function PanelInfoProducto({
  product,
  currentColor,
  onColorChange,
  availableColors,
  cleanDescription,
  idealParaList,
  outOfStock,
  cantidad,
  setCantidad,
  onAgregar,
  whatsappCotizarHref,
}) {
  const precioEnPromo =
    product.precio_original && product.precio_actual < product.precio_original;

  const selectorCantidad = (
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
  );

  const botonComprar = (
    <button
      type="button"
      disabled={outOfStock}
      onClick={onAgregar}
      className={`flex-1 py-3.5 rounded-lg font-semibold text-base transition-colors ${
        outOfStock ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-brand text-white hover:bg-brand-dark'
      }`}
    >
      {outOfStock ? 'Agotado' : 'Agregar al carrito'}
    </button>
  );

  const botonWhatsapp = (
    <a
      href={whatsappCotizarHref}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-base bg-[#25D366] text-white hover:bg-[#1eb355] transition-colors"
    >
      <WhatsAppIcon />
      Te asesoramos
    </a>
  );

  return (
    <div className="order-1 md:order-2 flex flex-col gap-5">
      {/* Título + Precio — siempre arriba, nunca debajo de la imagen */}
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
            {product.categoria}
          </span>
          {precioEnPromo && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-[11px] font-bold text-green-700">
              <Tag className="w-3 h-3" />
              -{Math.round((1 - product.precio_actual / product.precio_original) * 100)}%
            </span>
          )}
          {outOfStock ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-red-100 text-[11px] font-bold text-red-600">
              Agotado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-600">
              <Check className="w-3 h-3" />
              Disponible
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{product.nombre}</h1>
        <div className="flex items-baseline gap-3">
          {precioEnPromo && (
            <span className="text-gray-400 line-through text-lg">{formatPrice(product.precio_original)}</span>
          )}
          <span className="text-brand font-bold text-3xl">{formatPrice(product.precio_actual)}</span>
        </div>
      </div>

      {/* Colores */}
      {availableColors.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Colores disponibles</p>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onColorChange(c)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  currentColor === c
                    ? 'border-brand bg-brand/5 text-brand font-semibold'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                <ColorDot nombre={c} coloresDetalle={product.colores_detalle} className="w-3 h-3" />
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Descripción breve */}
      {cleanDescription && (
        <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{cleanDescription}</div>
      )}

      {/* Ideal para */}
      {idealParaList.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ideal para</p>
          <div className="flex flex-wrap gap-2">
            {idealParaList.map((persona) => (
              <span
                key={persona}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-brand/10 text-brand-dark"
              >
                <User className="w-3.5 h-3.5" />
                {persona}
              </span>
            ))}
          </div>
        </div>
      )}

      <BBVACard />

      {/* CTA sticky (solo desktop) */}
      <div className="hidden md:block sticky top-4 z-30">
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-lg space-y-3">
          <div className="flex items-stretch gap-3">
            {selectorCantidad}
            {botonComprar}
          </div>
          {botonWhatsapp}
        </div>
      </div>

      {/* CTA normal (mobile) */}
      <div className="md:hidden space-y-3">
        <div className="flex items-stretch gap-3">
          {selectorCantidad}
          {botonComprar}
        </div>
        {botonWhatsapp}
      </div>
    </div>
  );
}

// ── Tab: Descripción expandible ─────────────────────────────────

function DescripcionTab({
  cleanDescription,
  descRef,
  descExpandida,
  descExcedida,
  toggleDesc,
  currentColor,
  productNombre,
}) {
  const esCamaleon =
    /camale[oó]n/i.test(currentColor || '') ||
    (/gl3/i.test(productNombre || '') && /azul/i.test(currentColor || ''));

  if (!cleanDescription) {
    return <p className="text-gray-500">No hay descripción disponible para este producto.</p>;
  }

  return (
    <>
      <div
        ref={descRef}
        className={!descExpandida && descExcedida ? 'relative max-h-[200px] overflow-hidden' : ''}
      >
        <p className="whitespace-pre-line">{cleanDescription}</p>
        {!descExpandida && descExcedida && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>
      {descExcedida && (
        <button
          type="button"
          onClick={toggleDesc}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
        >
          {descExpandida ? (
            <><ChevronUp className="w-4 h-4" /> Ver menos</>
          ) : (
            <><ChevronDown className="w-4 h-4" /> Ver más</>
          )}
        </button>
      )}
      {esCamaleon && (
        <p className="mt-3 text-sm text-gray-600">
          El color azul de la GL3 es un tono que cambia dependiendo del punto de referencia.
        </p>
      )}
    </>
  );
}

// ── Sección Tabs ────────────────────────────────────────────────

function SeccionTabs({
  tabs,
  activeTab,
  setActiveTab,
  product,
  cleanDescription,
  descRef,
  descExpandida,
  descExcedida,
  toggleDesc,
  currentColor,
}) {
  return (
    <div className="border-t border-gray-200 pt-8">
      <div className="flex gap-1 overflow-x-auto border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
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

      <div className="min-h-200px">
        {activeTab === 'descripcion' && (
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            <DescripcionTab
              cleanDescription={cleanDescription}
              descRef={descRef}
              descExpandida={descExpandida}
              descExcedida={descExcedida}
              toggleDesc={toggleDesc}
              currentColor={currentColor}
              productNombre={product.nombre}
            />
          </div>
        )}

        {activeTab === 'ficha' && <FichaTecnicaTab ficha={product.ficha_tecnica} />}
        {activeTab === 'capacidad' && <CapacidadCargaTab ficha={product.ficha_tecnica} />}
        {activeTab === 'info' && <InfoAdicionalTab info={product.info_adicional} />}
        {activeTab === 'manuales' && <ManualesTab producto={product} />}
        {activeTab === 'videos' && <ProductVideos product={product} />}

        {activeTab === 'legal' && (
          <div className="text-sm text-gray-500 space-y-3 text-justify">
            <p>Los precios indicados incluyen IGV.</p>
            <p>Las imágenes son referenciales. El producto final puede variar ligeramente en color y acabado.</p>
            <p>Garantía según términos y condiciones de GreenLine. Consulte en tienda para más detalles.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sección Testimonios ─────────────────────────────────────────

function SeccionTestimonios({ testimonios }) {
  return (
    <section className="mt-12">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Lo que dicen nuestros clientes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonios.map((t) => (
          <div
            key={t.id}
            className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <StarRating rating={t.rating} />
            <p className="text-gray-700 text-sm leading-relaxed mt-3 mb-4">&ldquo;{t.texto}&rdquo;</p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div>
                <p className="font-semibold text-gray-900 text-sm">{t.nombre}</p>
                {t.rol && <p className="text-xs text-gray-500">{t.rol}</p>}
              </div>
              {t.vehiculo && (
                <span className="text-xs font-semibold text-brand bg-brand/10 px-2 py-1 rounded">
                  {t.vehiculo}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Página principal ────────────────────────────────────────────

export default function ProductPage() {
  const { slug } = useParams();
  const [productos, setProductos] = useState([]);
  const [testimonios, setTestimonios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('descripcion');
  const [activeColor, setActiveColor] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const { addItem, openCart } = useCart();
  const [showVideo, setShowVideo] = useState();

  const descFullRef = useRef(null);

  const {
    expanded: descExpandida,
    overflows: descExcedida,
    toggle: toggleDesc,
  } = useExpandable(descFullRef, [slug, activeTab], MAX_DESC_LINES);

  // ── Data fetching ──

  useEffect(() => {
    fetchProductos().then(setProductos).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTestimonios().then(setTestimonios).catch(console.error);
  }, []);

  // ── Derived data ──

  const product = useMemo(() => productos.find((p) => p.slug === slug), [productos, slug]);

  const cleanDescription = useMemo(
    () => (product?.descripcion ? stripHtml(product.descripcion) : ''),
    [product?.descripcion],
  );

  const tabs = useMemo(() => {
    const list = TAB_LIST.filter((t) => t.key !== 'capacidad');
    if (product?.categoria === 'Cargueros') {
      const idx = list.findIndex((t) => t.key === 'ficha');
      list.splice(idx + 1, 0, { key: 'capacidad', label: 'Capacidad de Carga' });
    }
    const tieneVideos =
      product && (Boolean(product.videoId) || videosForProduct(product).length > 0);
    if (tieneVideos) {
      const idx = list.findIndex((t) => t.key === 'manuales');
      list.splice(idx >= 0 ? idx : list.length, 0, { key: 'videos', label: 'Videos' });
    }
    return list;
  }, [product]);

  const availableColors = useMemo(() => {
    if (!product?.imagenes?.length) return [];
    const seen = new Set();
    return product.imagenes
      .filter((img) => img.color && !seen.has(img.color) && seen.add(img.color))
      .map((img) => img.color);
  }, [product?.imagenes]);

  const currentColor = activeColor || availableColors[0] || null;

  const outOfStock = product?.disponibilidad === 'Fuera de stock';

  const displayedImages = useMemo(() => {
    if (!product?.imagenes?.length) return [];
    if (!currentColor) return product.imagenes;
    return product.imagenes.filter((img) => img.color === currentColor);
  }, [product?.imagenes, currentColor]);

  const testimoniosRelacionados = useMemo(() => {
    if (!product || !testimonios.length) return [];
    const nombre = normalizeText(product.nombre);
    return testimonios.filter((t) => {
      const veh = normalizeText(t.vehiculo);
      if (!veh) return false;
      return veh.includes(nombre) || nombre.includes(veh);
    });
  }, [product, testimonios]);

  const idealParaList = useMemo(() => {
    const raw = product?.info_adicional?.ideal_para;
    if (Array.isArray(raw)) return raw.filter(Boolean);
    if (typeof raw === 'string') return raw.split(',').map((s) => s.trim()).filter(Boolean);
    return [];
  }, [product]);

  // ── Reset on slug change ──

  useEffect(() => {
    setActiveColor(null);
    setActiveTab('descripcion');
    setCantidad(1);
    setShowVideo(false);
    window.scrollTo(0, 0);
  }, [slug]);

  // ── Loading / not found ──

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
        <Link to="/tienda" className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const hasRealImages = displayedImages.length > 0;

  const whatsappCotizarHref = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(
    `¡Hola! Vi la ${product.nombre}${currentColor ? ` en color ${currentColor}` : ''} en su web y me interesa. ¿Me pasan precio y disponibilidad?`,
  )}`;

  // ── SEO ──

  const seoDescription = construirSeoDescription(product, cleanDescription);

  const onAgregar = () => {
    addItem(product, { color: currentColor, cantidad });
    openCart();
  };

  // ── Render ──

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEOHead
        title={product.nombre}
        description={seoDescription}
        url={`/producto/${product.slug}`}
        image={product.imagenes?.[0]?.src}
        type="product"
        keywords={[product.nombre, product.categoria, 'movilidad eléctrica', 'Green Line', 'venta de scooters', 'Perú']}
        jsonLd={[
          productSchema(product),
          breadcrumbSchema([
            { name: 'Inicio', url: '/' },
            { name: 'Tienda', url: '/tienda' },
            { name: product.nombre, url: `/producto/${product.slug}` },
          ]),
        ]}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-brand transition-colors">Inicio</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/tienda" className="hover:text-brand transition-colors">Tienda</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium truncate">{product.nombre}</span>
      </nav>

      {/* ════════════════════════════════════════════════════════════
          HERO — 2 columnas en desktop, 1 columna en mobile
          Mobile : título → precio → colores → descripción → imagen
          Desktop: imagen (izq) | info esencial + CTA sticky (der)
          ⚠ La "tablita" de specs va FUERA de la columna, full-width.
         ════════════════════════════════════════════════════════════ */}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_minmax(0,0.9fr)] gap-8 lg:gap-10 mb-8">
        {/* ── RIGHT (DOM primero): info esencial — primera en mobile ── */}
        <PanelInfoProducto
          product={product}
          currentColor={currentColor}
          onColorChange={setActiveColor}
          availableColors={availableColors}
          cleanDescription={cleanDescription}
          idealParaList={idealParaList}
          outOfStock={outOfStock}
          cantidad={cantidad}
          setCantidad={setCantidad}
          onAgregar={onAgregar}
          whatsappCotizarHref={whatsappCotizarHref}
        />

        {/* ── LEFT (DOM segundo): imagen + video — primera en desktop ── */}
        <div className="order-2 md:order-1 flex flex-col">
          {hasRealImages ? (
            <ProductGallery images={displayedImages} product={product} nombre={product.nombre} />
          ) : (
            <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
              <ProductImage nombre={product.nombre} width={600} height={450} className="w-full h-full" />
            </div>
          )}
        </div>
      </div>

      {/* FULL-WIDTH: "Características Destacadas" (la tablita) */}
      <div className="mb-10">
        <SpecsCard ficha={product.ficha_tecnica} />
      </div>

      {/* ════════════════════════════════════════════════════════════
          TABS — descripción, ficha técnica, info adicional, etc.
         ════════════════════════════════════════════════════════════ */}
      <SeccionTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        product={product}
        cleanDescription={cleanDescription}
        descRef={descFullRef}
        descExpandida={descExpandida}
        descExcedida={descExcedida}
        toggleDesc={toggleDesc}
        currentColor={currentColor}
      />

      {/* ════════════════════════════════════════════════════════════
          TESTIMONIOS
         ════════════════════════════════════════════════════════════ */}
      {testimoniosRelacionados.length > 0 && (
        <SeccionTestimonios testimonios={testimoniosRelacionados} />
      )}
    </div>
  );
}
