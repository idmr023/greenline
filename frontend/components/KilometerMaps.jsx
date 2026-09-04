import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const FACTOR_CARRETERA = 1.3;
const CENTRO_INICIAL = [-12.046374, -77.042793];
const PHOTON_URL = 'https://photon.komoot.io';
const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving';

function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function direccionDe(feature) {
  const p = feature.properties || {};
  const calle = [p.street, p.housenumber].filter(Boolean).join(' ');
  return [p.name, calle, p.locality, p.district, p.city, p.state, p.country]
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .join(', ');
}

async function obtenerDireccion(lat, lng) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    limit: '1',
  });
  for (let intento = 0; intento < 2; intento++) {
    if (intento > 0) {
      await new Promise((resolver) => setTimeout(resolver, 700));
    }
    try {
      const res = await fetch(`${PHOTON_URL}/reverse?${params.toString()}`);
      if (!res.ok) continue;
      const data = await res.json();
      const feature = data.features?.[0];
      if (feature) return direccionDe(feature);
    } catch (err) {
      console.error('Error obteniendo dirección del mapa:', err);
    }
  }
  return null;
}

function CajaLugar({ etiqueta, idInput, direccion, sesgo, onSeleccion }) {
  const [texto, setTexto] = useState(direccion || '');
  const [sugerencias, setSugerencias] = useState([]);
  const [abierta, setAbierta] = useState(false);
  const contenedorRef = useRef(null);

  useEffect(() => {
    if (direccion) setTexto(direccion);
  }, [direccion]);

  useEffect(() => {
    const consulta = texto.trim();
    if (consulta.length < 3 || !abierta) {
      setSugerencias([]);
      return;
    }
    let activo = true;
    const timer = setTimeout(async () => {
      try {
        const centro = sesgo || { lat: CENTRO_INICIAL[0], lng: CENTRO_INICIAL[1] };
        const params = new URLSearchParams({
          q: consulta,
          limit: '5',
          lat: String(centro.lat),
          lon: String(centro.lng),
        });
        const res = await fetch(`${PHOTON_URL}/api/?${params.toString()}`);
        const data = await res.json();
        if (activo) {
          setSugerencias(Array.isArray(data.features) ? data.features : []);
        }
      } catch (err) {
        console.error('Error buscando direcciones:', err);
      }
    }, 500);
    return () => {
      activo = false;
      clearTimeout(timer);
    };
  }, [texto, abierta, sesgo]);

  useEffect(() => {
    const cerrar = (ev) => {
      if (contenedorRef.current && !contenedorRef.current.contains(ev.target)) {
        setAbierta(false);
      }
    };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, []);

  const elegir = (feature) => {
    const [lng, lat] = feature.geometry?.coordinates || [];
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const etiquetaDir = direccionDe(feature);
    setTexto(etiquetaDir);
    onSeleccion({ coordenada: { lat, lng }, direccion: etiquetaDir });
    setSugerencias([]);
    setAbierta(false);
  };

  return (
    <div ref={contenedorRef} className="relative flex-1">
      <label htmlFor={idInput} className="text-xs font-medium text-gray-600">
        {etiqueta}
      </label>
      <input
        type="text"
        placeholder="Escribe una dirección o haz clic en el mapa..."
        id={idInput}
        value={texto}
        onChange={(ev) => {
          setTexto(ev.target.value);
          setAbierta(true);
        }}
        onFocus={() => setAbierta(true)}
        autoComplete="off"
        className="w-full mt-0.5 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none"
      />

      {abierta && sugerencias.length > 0 && (
        <ul className="absolute z-30 left-0 right-0 top-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-auto">
          {sugerencias.map((s, i) => (
            <li
              key={`${s.properties?.osm_id ?? i}-${i}`}
              onClick={() => elegir(s)}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-brand/5 cursor-pointer"
            >
              {direccionDe(s)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function KilometerMaps({ abierto = true, onKmChange, view = 'full' }) {
  const [paradas, setParadas] = useState(() => [
    { id: 1, coordenada: null, direccion: '' },
    { id: 2, coordenada: null, direccion: '' },
  ]);
  const [buscandoDireccion, setBuscandoDireccion] = useState(false);
  const [calculandoRuta, setCalculandoRuta] = useState(false);
  const [avisoCoordenadas, setAvisoCoordenadas] = useState(false);
  const [ruta, setRuta] = useState(null);
  const siguienteId = useRef(3);
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const marcadoresRef = useRef([]);
  const lineaRef = useRef(null);
  const clickHandlerRef = useRef(null);

  const etiquetaDe = (i) =>
    i === 0
      ? 'Punto de partida'
      : i === paradas.length - 1
        ? 'Destino final'
        : `Parada ${i}`;

  const agregarParada = () =>
    setParadas((prev) => [
      ...prev,
      { id: siguienteId.current++, coordenada: null, direccion: '' },
    ]);

  const quitarParada = (id) =>
    setParadas((prev) =>
      prev.length > 2 ? prev.filter((p) => p.id !== id) : prev
    );

  const setParada = (id, cambios) =>
    setParadas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...cambios } : p))
    );

  const asignarDesdeMapa = ({ coordenada, direccion }) => {
    const indiceLibre = paradas.findIndex((p) => !p.coordenada);
    if (indiceLibre !== -1) {
      setParadas((prev) =>
        prev.map((p, i) =>
          i === indiceLibre ? { ...p, coordenada, direccion } : p
        )
      );
    } else {
      const nueva = { id: siguienteId.current++, coordenada, direccion };
      setParadas((prev) => [...prev, nueva]);
    }
  };

  const alHacerClicEnMapa = async (evento) => {
    if (buscandoDireccion) return;
    const { lat, lng } = evento.latlng || {};
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    let direccion = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    let usoCoordenadas = true;
    setBuscandoDireccion(true);
    try {
      const resuelta = await obtenerDireccion(lat, lng);
      if (resuelta) {
        direccion = resuelta;
        usoCoordenadas = false;
      }
    } finally {
      setBuscandoDireccion(false);
    }
    setAvisoCoordenadas(usoCoordenadas);
    asignarDesdeMapa({ coordenada: { lat, lng }, direccion });
  };

  useEffect(() => {
    clickHandlerRef.current = alHacerClicEnMapa;
  });

  useEffect(() => {
    const map = L.map(mapDivRef.current, {
      center: CENTRO_INICIAL,
      zoom: 13,
    });
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
      }
    ).addTo(map);
    map.on('tileerror', () => {
      map.getContainer().classList.add('map-tile-fallback');
    });
    lineaRef.current = L.polyline([], {
      color: '#059669',
      weight: 4,
      opacity: 0.9,
    }).addTo(map);
    map.on('click', (ev) => clickHandlerRef.current?.(ev));
    mapRef.current = map;
    return () => {
      marcadoresRef.current = [];
      lineaRef.current = null;
      mapRef.current = null;
      map.remove();
    };
  }, []);

  const coords = useMemo(
    () => paradas.map((p) => p.coordenada).filter(Boolean),
    [paradas]
  );

  useEffect(() => {
    if (!abierto) return undefined;
    const t = setTimeout(() => mapRef.current?.invalidateSize(), 60);
    return () => clearTimeout(t);
  }, [abierto]);

  const puntosPreviosRef = useRef(0);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !abierto) return;
    marcadoresRef.current.forEach((m) => m.remove());
    marcadoresRef.current = coords.map((c, i) => {
      const icono = L.divIcon({
        className: '',
        html: `<span style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:9999px;background:#059669;color:#fff;font-size:12px;font-weight:700;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);">${
          i + 1
        }</span>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });
      return L.marker([c.lat, c.lng], { icon: icono }).addTo(map);
    });
    const agregoPunto = coords.length > puntosPreviosRef.current;
    puntosPreviosRef.current = coords.length;
    if (!agregoPunto) return;
    if (coords.length >= 2) {
      map.fitBounds(
        L.latLngBounds(coords.map((c) => [c.lat, c.lng])).pad(0.2),
        { maxZoom: 16 }
      );
    } else if (coords.length === 1) {
      map.panTo([coords[0].lat, coords[0].lng]);
    }
  }, [coords, abierto]);

  useEffect(() => {
    if (!lineaRef.current) return;
    const trazo =
      ruta?.linea && ruta.linea.length > 1
        ? ruta.linea
        : coords.map((c) => [c.lat, c.lng]);
    lineaRef.current.setLatLngs(trazo);
  }, [ruta, coords]);

  useEffect(() => {
    if (coords.length < 2) {
      setCalculandoRuta(false);
      setRuta(null);
      return;
    }
    let activo = true;
    setCalculandoRuta(true);
    fetch(
      `${OSRM_URL}/${coords
        .map((c) => `${c.lng},${c.lat}`)
        .join(';')}?overview=full&geometries=geojson`
    )
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error('OSRM no disponible'))
      )
      .then((data) => {
        if (!activo) return;
        const mejor = data.routes?.[0];
        if (mejor?.geometry?.coordinates?.length) {
          setRuta({
            linea: mejor.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
            kmReales: mejor.distance / 1000,
          });
        } else {
          setRuta(null);
        }
      })
      .catch((err) => {
        console.error('Error trazando ruta por calles:', err);
        if (activo) setRuta(null);
      })
      .finally(() => {
        if (activo) setCalculandoRuta(false);
      });
    return () => {
      activo = false;
    };
  }, [coords]);

  const kmRuta = useMemo(() => {
    if (ruta?.kmReales > 0) return ruta.kmReales;
    let total = 0;
    for (let i = 1; i < coords.length; i++) {
      total += haversineKm(coords[i - 1], coords[i]);
    }
    return total * FACTOR_CARRETERA;
  }, [coords, ruta]);

  const kmEsAproximado = !(ruta?.kmReales > 0);

  useEffect(() => {
    if (coords.length >= 2 && kmRuta > 0) {
      onKmChange?.(Math.round(kmRuta))
    }
  }, [kmRuta]);

  const showAddresses = view === 'full' || view === 'addresses' || view === 'split';
  const showMap = view === 'full' || view === 'map' || view === 'split';
  const isSplit = view === 'split';

  const addressesBlock = showAddresses && (
    <div className={`bg-white p-3 space-y-2 ${isSplit ? 'rounded-xl border border-gray-200' : ''}`}>
      {paradas.map((p, i) => (
        <div key={p.id} className="flex items-start gap-2">
          <CajaLugar
            etiqueta={etiquetaDe(i)}
            idInput={`dir-${p.id}`}
            direccion={p.direccion}
            sesgo={coords[coords.length - 1] || null}
            onSeleccion={(sel) => {
              setAvisoCoordenadas(false);
              setParada(p.id, sel);
            }}
          />
          {paradas.length > 2 && (
            <button
              type="button"
              onClick={() => quitarParada(p.id)}
              title="Quitar parada"
              className="mt-5 w-8 h-8 shrink-0 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors"
            >
              ×
            </button>
          )}
        </div>
      ))}

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={agregarParada}
          className="text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
        >
          + Agregar parada
        </button>
        {coords.length >= 2 && (
          <span className="text-xs font-bold text-white bg-brand rounded-full px-3 py-1">
            Tu ruta{kmEsAproximado ? ' (aprox)' : ''}:{' '}
            {kmRuta.toFixed(1)} km/día
          </span>
        )}
      </div>
    </div>
  );

  const mapBlock = showMap && (
    <div className={`relative h-64 ${isSplit ? 'rounded-xl border border-gray-200 overflow-hidden' : showAddresses ? 'mt-2' : ''}`}>
      <div ref={mapDivRef} className="w-full h-full z-0" />
      {(buscandoDireccion || calculandoRuta) && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 pointer-events-none">
          <span className="bg-white text-xs font-semibold text-gray-700 rounded-full px-4 py-2 shadow-md">
            {buscandoDireccion
              ? 'Buscando dirección...'
              : 'Trazando ruta por calles...'}
          </span>
        </div>
      )}
      {avisoCoordenadas && !buscandoDireccion && (
        <div className="absolute bottom-2 left-2 right-2 z-20">
          <p className="bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-lg px-3 py-2 shadow-sm">
            No pudimos resolver la dirección exacta del punto; se usaron sus
            coordenadas.
          </p>
        </div>
      )}
    </div>
  );

  if (isSplit) {
    return (
      <>
        {addressesBlock}
        {mapBlock}
      </>
    );
  }

  return (
    <div className={`w-full ${!isSplit ? 'rounded-xl border border-gray-200 overflow-hidden' : ''}`}>
      {addressesBlock}
      {mapBlock}
    </div>
  );
}
