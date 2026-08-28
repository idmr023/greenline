import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin, Clock, Navigation, MessageCircle, Wrench, Store,
  Loader2, ChevronRight, Phone, MapPinned, Building2,
} from 'lucide-react';
import { fetchStores, fetchDistributors, fetchProvinceSales } from '../lib/locations';

const CENTRO_PERU = [-9.19, -75.015];

// ── Fotos de sedes (por distrito) ──────────────────────────
const STORE_PHOTOS = {
  Lince: '/assets/imagenes/tiendas/tienda_lince.webp',
  Surco: '/assets/imagenes/tiendas/tienda_surco.webp',
  'La Molina': '/assets/imagenes/tiendas/tienda_molina.webp',
  Comas: '/assets/imagenes/tiendas/tienda_comas.jpg',
  Ate: '/assets/imagenes/tiendas/tienda_ate.jpeg',
  Huancayo: '/assets/imagenes/tiendas/tienda_huancayo.jpeg',
};

// ── Pin icons ──────────────────────────────────────────────

function storePin() {
  return L.divIcon({
    className: '',
    html: '<span style="display:block;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#059669;border:2px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.35);"></span>',
    iconSize: [28, 28],
    iconAnchor: [14, 30],
  });
}

function distributorPin() {
  return L.divIcon({
    className: '',
    html: '<span style="display:block;width:22px;height:22px;border-radius:50%;background:#fff;border:2.5px solid #9ca3af;box-shadow:0 1px 4px rgba(0,0,0,.35);"></span>',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

// ── Store Card ─────────────────────────────────────────────

function StoreCard({ store, activa, onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      className={`bg-white rounded-xl border p-4 shadow-sm cursor-pointer transition-all ${
        activa ? 'ring-2 ring-brand border-brand' : 'border-gray-100 hover:shadow-md'
      }`}
    >
      <div className="aspect-video w-full mb-3 rounded-lg bg-gray-bg overflow-hidden flex items-center justify-center">
        {STORE_PHOTOS[store.district] ? (
          <img
            src={STORE_PHOTOS[store.district]}
            alt={store.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <Building2 className="w-6 h-6 text-gray-300" />
        )}
      </div>

      <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
        {store.name}
        {store.technical_service && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded bg-blue-100 text-blue-700">
            <Wrench className="w-2.5 h-2.5" /> Técnico
          </span>
        )}
      </h3>
      <p className="text-[11px] text-gray-400 mt-0.5">{store.country}</p>
      <p className="flex items-start gap-1.5 text-sm text-gray-600 mt-2">
        <MapPin className="w-4 h-4 mt-0.5 text-brand shrink-0" />
        <span>{store.address}, {store.district}</span>
      </p>
      {store.schedule && (
        <p className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
          <Clock className="w-4 h-4 text-brand shrink-0" />
          <span>{store.schedule}</span>
        </p>
      )}
      {store.technical_service && store.technical_whatsapp_url && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-1">Servicio técnico</p>
          <a
            href={store.technical_whatsapp_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-lg px-2.5 py-1.5 hover:bg-blue-100 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp técnico
          </a>
        </div>
      )}
      <div className="flex gap-2 mt-3">
        <a
          href={store.maps_url || (store.coordinates ? `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates[0]},${store.coordinates[1]}` : '#')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors"
        >
          <Navigation className="w-4 h-4 shrink-0" /> Cómo llegar
        </a>
        {store.whatsapp_url && (
          <a
            href={store.whatsapp_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-emerald-500 rounded-lg py-2 hover:bg-emerald-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4 shrink-0" /> WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

// ── Distributor Card ───────────────────────────────────────

function DistributorCard({ d }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 text-sm">{d.name}</h4>
          {d.contact_name && <p className="text-xs text-gray-500 mt-0.5">{d.contact_name}</p>}
          {d.ruc && <p className="text-xs text-gray-400 mt-0.5">RUC: {d.ruc}</p>}
        </div>
      </div>
      <p className="flex items-start gap-1.5 text-sm text-gray-600 mt-3">
        <MapPin className="w-4 h-4 mt-0.5 text-brand shrink-0" />
        <span>{d.address}, {d.district}</span>
      </p>
      {d.phone && (
        <p className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
          <Phone className="w-4 h-4 text-brand shrink-0" />
          <span>{d.phone}</span>
        </p>
      )}
      <div className="flex gap-2 mt-3">
        {d.maps_url && (
          <a
            href={d.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 shrink-0" /> Maps
          </a>
        )}
        {d.whatsapp_url && (
          <a
            href={d.whatsapp_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-emerald-500 rounded-lg py-2 hover:bg-emerald-600 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" /> WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

// ── Accordion ──────────────────────────────────────────────

function DistributorAccordion({ distributors, expandedDept, setExpandedDept, selectedProv, setSelectedProv, filteredDistributors, provinceSales }) {
  const departments = useMemo(
    () => [...new Set(distributors.map((d) => d.department))].sort(),
    [distributors]
  );

  const provincesByDept = useMemo(() => {
    const map = {};
    for (const d of distributors) {
      if (!map[d.department]) map[d.department] = new Set();
      map[d.department].add(d.province);
    }
    for (const k of Object.keys(map)) {
      map[k] = [...map[k]].sort();
    }
    return map;
  }, [distributors]);

  const handleDeptClick = (dept) => {
    setExpandedDept((prev) => (prev === dept ? '' : dept));
    setSelectedProv('');
  };

  const handleProvClick = (dept, prov) => {
    setExpandedDept(dept);
    setSelectedProv((prev) => (prev === prov ? '' : prov));
  };

  return (
    <div className="space-y-1">
      {departments.map((dept) => {
        const isExpanded = expandedDept === dept;
        const provs = provincesByDept[dept] || [];
        return (
          <div key={dept}>
            <button
              type="button"
              onClick={() => handleDeptClick(dept)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isExpanded
                  ? 'bg-brand/10 text-brand'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              {dept}
              <span className="ml-auto text-xs text-gray-400 font-normal">{provs.length}</span>
            </button>

            {isExpanded && (
              <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-brand/10 pl-3">
                {provs.map((prov) => {
                  const isSelected = selectedProv === prov && expandedDept === dept;
                  return (
                    <div key={prov}>
                      <button
                        type="button"
                        onClick={() => handleProvClick(dept, prov)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          isSelected
                            ? 'bg-brand/10 text-brand font-semibold'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {prov}
                      </button>

                      {isSelected && filteredDistributors.length > 0 && (
                        <div className="mt-1 mb-2 space-y-3 pl-3">
                          {filteredDistributors.map((d) => (
                            <DistributorCard key={d.id} d={d} />
                          ))}

                        </div>
                      )}

                      {isSelected && filteredDistributors.length === 0 && (
                        <div className="text-center py-6 text-gray-400">
                          <MapPinned className="w-6 h-6 mx-auto mb-1 opacity-40" />
                          <p className="text-xs">No hay distribuidores en esta provincia.</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────

export default function StoreLocator() {
  const [stores, setStores] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [provinceSales, setProvinceSales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filtro, setFiltro] = useState('tiendas');
  const [activeStore, setActiveStore] = useState(null);
  const [expandedDept, setExpandedDept] = useState('');
  const [selectedProv, setSelectedProv] = useState('');
  const [vistaMovil, setVistaMovil] = useState('lista');

  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const marcadoresRef = useRef([]);

  // ── Fetch data ─────────────────────────────────────────

  useEffect(() => {
    let activo = true;
    Promise.all([fetchStores(), fetchDistributors(), fetchProvinceSales()])
      .then(([s, d, ps]) => {
        if (!activo) return;
        setStores(s);
        setDistributors(d);
        setProvinceSales(ps);
        setActiveStore(s[0]?.id ?? null);
        setLoading(false);
      })
      .catch((err) => {
        if (!activo) return;
        setError(err.message);
        setLoading(false);
      });
    return () => { activo = false; };
  }, []);

  // ── Init map ───────────────────────────────────────────

  useEffect(() => {
    if (loading || mapRef.current || !mapDivRef.current) return;
    const map = L.map(mapDivRef.current, {
      center: CENTRO_PERU,
      zoom: 6,
      scrollWheelZoom: false,
    });
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        subdomains: 'abcd',
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }
    ).addTo(map);
    mapRef.current = map;
    return () => {
      marcadoresRef.current = [];
      mapRef.current = null;
      map.remove();
    };
  }, [loading]);

  const handleTabClick = (key) => {
    setFiltro(key);
    if (key === 'distribuidores') setVistaMovil('distribuidores');
    else if (key === 'tecnico') setVistaMovil('lista');
    else setVistaMovil('lista');
  };

  // ── Filtered data ──────────────────────────────────────

  const tiendasVisibles = useMemo(() => {
    if (filtro === 'distribuidores') return [];
    if (filtro === 'tecnico') return stores.filter((s) => s.technical_service);
    return stores;
  }, [stores, filtro]);

  const filteredDistributors = useMemo(() => {
    if (filtro === 'distribuidores' && expandedDept) {
      let list = distributors.filter((d) => d.department === expandedDept);
      if (selectedProv) {
        list = list.filter((d) => d.province === selectedProv);
      }
      return list.sort((a, b) => a.priority - b.priority || a.district.localeCompare(b.district) || a.name.localeCompare(b.name));
    }
    if (filtro === 'tecnico') {
      return distributors.filter((d) => d.technical_service === true);
    }
    return [];
  }, [distributors, filtro, expandedDept, selectedProv]);

  // ── Sync map markers ───────────────────────────────────

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const container = map.getContainer();
    if (!container || container.clientWidth === 0 || container.clientHeight === 0) return;

    // Clear old markers
    marcadoresRef.current.forEach((m) => m.remove());
    marcadoresRef.current = [];

    const bounds = [];

    // Store markers (green teardrop)
    for (const s of tiendasVisibles) {
      if (!s.coordinates) continue;
      const [lat, lng] = s.coordinates;
      if (Number.isNaN(lat) || Number.isNaN(lng)) continue;
      const m = L.marker(s.coordinates, { icon: storePin() }).addTo(map);
      m.bindTooltip(s.name, { direction: 'top', offset: [0, -16] });
      m.on('click', () => { setFiltro('tiendas'); setActiveStore(s.id); });
      marcadoresRef.current.push(m);
      bounds.push(s.coordinates);
    }

    // Distributor markers (white circle)
    for (const d of filteredDistributors) {
      if (d.latitude == null || d.longitude == null) continue;
      if (Number.isNaN(d.latitude) || Number.isNaN(d.longitude)) continue;
      const m = L.marker([d.latitude, d.longitude], { icon: distributorPin() }).addTo(map);
      m.bindTooltip(d.name, { direction: 'top', offset: [0, -12] });
      marcadoresRef.current.push(m);
      bounds.push([d.latitude, d.longitude]);
    }

    // Fit bounds
    if (bounds.length === 0) {
      map.setView(CENTRO_PERU, 6, { duration: 0.3 });
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 13, { duration: 0.5 });
    } else {
      map.fitBounds(L.latLngBounds(bounds).pad(0.15), { maxZoom: 14, duration: 0.5 });
    }
  }, [tiendasVisibles, filteredDistributors]);

  // ── Fly to active store ────────────────────────────────

  useEffect(() => {
    if (filtro !== 'tiendas') return;
    const store = stores.find((s) => s.id === activeStore);
    const map = mapRef.current;
    if (!store || !map || !store.coordinates) return;
    const container = map.getContainer();
    if (!container || container.clientWidth === 0 || container.clientHeight === 0) return;
    const [lat, lng] = store.coordinates;
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;
    map.flyTo(store.coordinates, Math.max(map.getZoom(), 14), { duration: 0.8 });
  }, [activeStore, stores, filtro]);

  // ── Map resize on mobile toggle ────────────────────────

  useEffect(() => {
    const t = setTimeout(() => mapRef.current?.invalidateSize(), 60);
    return () => clearTimeout(t);
  }, [vistaMovil, filtro]);

  // ── Tab button helper ──────────────────────────────────

  const tabClass = (key, color) => {
    const active = filtro === key;
    if (active && color === 'brand') return 'bg-brand text-white';
    if (active && color === 'blue') return 'bg-blue-600 text-white';
    if (active && color === 'gray') return 'bg-gray-700 text-white';
    const hover = color === 'brand' ? 'hover:border-brand hover:text-brand'
      : color === 'blue' ? 'hover:border-blue-400 hover:text-blue-600'
      : 'hover:border-gray-400 hover:text-gray-700';
    return `bg-white text-gray-600 border border-gray-200 ${hover}`;
  };

  // ── Loading / Error ────────────────────────────────────

  if (loading) {
    return (
      <section className="py-14 bg-gray-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-brand animate-spin" />
          <span className="ml-2 text-gray-500 text-sm">Cargando tiendas y distribuidores...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-14 bg-gray-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <p className="text-red-500 text-sm">Error al cargar datos: {error}</p>
        </div>
      </section>
    );
  }

  // ── Left panel: Tiendas ─────────────────────────────────

  const renderLeftPanel = () => {
    const items = filtro === 'tecnico'
      ? stores.filter((s) => s.technical_service)
      : stores;
    if (items.length === 0) {
      return (
        <div className="text-center py-16 text-gray-400">
          <Wrench className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No hay tiendas con servicio técnico.</p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
          <Store className="w-4 h-4 text-brand" /> Tiendas
          <span className="text-xs font-normal text-gray-400">({items.length})</span>
        </h3>
        {items.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            activa={activeStore === store.id}
            onClick={() => setActiveStore(store.id)}
          />
        ))}
      </div>
    );
  };

  // ── Right panel: Distribuidores ────────────────────────

  const renderRightPanel = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
        <MapPinned className="w-4 h-4 text-gray-600" /> Distribuidores
      </h3>

      {filtro === 'tecnico' ? (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 space-y-1">
            <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wide">Servicio técnico</p>
            <ul className="text-xs text-amber-800/80 space-y-0.5 list-disc list-inside">
              <li>Aplica solo para productos comprados en ese distribuidor.</li>
              <li>Algunos distribuidores aceptan servicio para productos adquiridos en otro punto.</li>
              <li>Para garantía, el servicio siempre es en el distribuidor donde se compró.</li>
            </ul>
          </div>

          {filteredDistributors.length > 0 ? (
            <>
              {filteredDistributors.map((d) => (
                <DistributorCard key={d.id} d={d} />
              ))}

              {provinceSales && (
                <div className="bg-brand/5 border border-brand/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-brand uppercase tracking-wide mb-2">Ventas provincias</p>
                  <p className="text-sm text-gray-700">{provinceSales.phone}</p>
                  {provinceSales.whatsapp_url && (
                    <a
                      href={provinceSales.whatsapp_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-500 rounded-lg px-3 py-1.5 mt-2 hover:bg-emerald-600 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <MapPinned className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No hay distribuidores con servicio técnico.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <DistributorAccordion
            distributors={distributors}
            expandedDept={expandedDept}
            setExpandedDept={setExpandedDept}
            selectedProv={selectedProv}
            setSelectedProv={setSelectedProv}
            filteredDistributors={filteredDistributors}
            provinceSales={provinceSales}
          />

          {!(expandedDept && selectedProv) && (
            <div className="text-center py-10 text-gray-400">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Selecciona un departamento y provincia.</p>
            </div>
          )}
        </>
      )}
    </div>
  );

  // ── Render ─────────────────────────────────────────────

  return (
    <section className="py-14 bg-gray-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Estamos cerca de ti
          </h2>
          <p className="text-gray-600 mt-2">
            Visita nuestras sedes en Perú, Chile y nuestros distribuidores.
          </p>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mt-5 flex-wrap">
            <button
              type="button"
              onClick={() => handleTabClick('tiendas')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${tabClass('tiendas', 'brand')}`}
            >
              <Store className="w-4 h-4" /> Tiendas
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('tecnico')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${tabClass('tecnico', 'blue')}`}
            >
              <Wrench className="w-4 h-4" /> Servicio Técnico
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('distribuidores')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${tabClass('distribuidores', 'gray')}`}
            >
              <MapPinned className="w-4 h-4" /> Distribuidores
            </button>
          </div>
        </div>

        {/* 3-column layout: Tiendas | Mapa | Distribuidores */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-3 items-start">

          {/* ── Left: Tiendas ─────────────────────────────── */}
          <div
            className={`${
              vistaMovil === 'lista' ? 'block' : 'hidden'
            } lg:block lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:sticky lg:top-24 lg:pr-1 transition-opacity duration-300 ${
              filtro === 'distribuidores' ? 'lg:opacity-40 lg:pointer-events-none' : ''
            }`}
          >
            {renderLeftPanel()}
          </div>

          {/* ── Center: Map ───────────────────────────────── */}
          <div className={`${vistaMovil === 'mapa' ? 'block' : 'hidden'} lg:block`}>
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm h-[50vh] lg:h-[calc(100vh-140px)]">
              <div ref={mapDivRef} className="w-full h-full z-0" />
            </div>

              <div className="bg-brand/5 border border-brand/20 rounded-xl p-4 text-center mt-3">
                {provinceSales ? (
                  <>
                    <p className="text-xs font-bold text-brand uppercase tracking-wide mb-2">Ventas provincias</p>
                    <p className="text-sm text-gray-700">{provinceSales.phone}</p>
                    {provinceSales.whatsapp_url && (
                      <a
                        href={provinceSales.whatsapp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-500 rounded-lg px-3 py-1.5 mt-2 hover:bg-emerald-600 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-gray-400">Información de ventas en provincias próximamente.</p>
                )}
              </div>
            
          </div>
          

          {/* ── Right: Distribuidores ─────────────────────── */}
          <div
            className={`${
              vistaMovil === 'distribuidores' ? 'block' : 'hidden'
            } lg:block lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:sticky lg:top-24 lg:pl-1 transition-opacity duration-300 ${
              filtro === 'tiendas' ? 'lg:opacity-40 lg:pointer-events-none' : ''
            }`}
          >
            {renderRightPanel()}
          </div>
        </div>
      </div>

      {/* Mobile toggle */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 z-50">
        <button
          type="button"
          onClick={() => setVistaMovil((v) => {
            if (v === 'lista') return 'mapa';
            if (v === 'mapa') return 'distribuidores';
            return 'lista';
          })}
          className="w-full flex items-center justify-center gap-2 bg-brand text-white font-semibold rounded-full py-3 shadow-lg hover:bg-brand-dark transition-colors"
        >
          <MapPin className="w-4 h-4" />
          {vistaMovil === 'lista' && 'Ver mapa'}
          {vistaMovil === 'mapa' && 'Ver distribuidores'}
          {vistaMovil === 'distribuidores' && 'Ver tiendas'}
        </button>
      </div>
    </section>
  );
}
