import { useEffect, useMemo, useRef, useState } from 'react';
import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';

const FACTOR_CARRETERA = 1.3;

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

function CajaLugar({ etiqueta, idInput, onCoordenada }) {
  const [texto, setTexto] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [abierta, setAbierta] = useState(false);
  const places = useMapsLibrary('places');
  const contenedorRef = useRef(null);

  useEffect(() => {
    if (!places || texto.trim().length < 3 || !abierta) {
      setSugerencias([]);
      return;
    }
    let activo = true;
    const timer = setTimeout(async () => {
      try {
        const { suggestions } =
          await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: texto,
            includedPrimaryTypes: ['geocode'],
          });
        if (activo) setSugerencias(suggestions);
      } catch (e) {
        console.error('Error buscando direcciones:', e);
      }
    }, 250);
    return () => {
      activo = false;
      clearTimeout(timer);
    };
  }, [texto, places, abierta]);

  useEffect(() => {
    const cerrar = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setAbierta(false);
      }
    };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, []);

  const elegir = async (sugerencia) => {
    if (!sugerencia.placePrediction) return;
    const place = sugerencia.placePrediction.toPlace();
    try {
      await place.fetchFields({ fields: ['location'] });
      if (place.location && onCoordenada) {
        onCoordenada(place.location.toJSON());
      }
      setTexto(sugerencia.placePrediction.text.text);
    } catch (e) {
      console.error('Error obteniendo ubicación:', e);
    }
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
        placeholder="Escribe una dirección..."
        id={idInput}
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          setAbierta(true);
        }}
        onFocus={() => setAbierta(true)}
        className="w-full mt-0.5 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none"
      />

      {abierta && sugerencias.length > 0 && (
        <ul className="absolute z-30 left-0 right-0 top-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-auto">
          {sugerencias.map((s, i) => (
            <li
              key={i}
              onClick={() => elegir(s)}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-brand/5 cursor-pointer"
            >
              {s.placePrediction?.text?.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LineaRuta({ puntos }) {
  const map = useMap();
  const mapsLib = useMapsLibrary('maps');
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!mapsLib || !map) return;
    polylineRef.current = new mapsLib.Polyline({
      path: [],
      strokeColor: '#059669',
      strokeOpacity: 0.9,
      strokeWeight: 4,
    });
    polylineRef.current.setMap(map);
    return () => {
      polylineRef.current?.setMap(null);
      polylineRef.current = null;
    };
  }, [mapsLib, map]);

  useEffect(() => {
    const path = puntos.filter(Boolean);
    polylineRef.current?.setPath(path);
    if (path.length >= 2 && mapsLib && map) {
      const bounds = new mapsLib.LatLngBounds();
      path.forEach((p) => bounds.extend(p));
      map.fitBounds(bounds, 60);
    }
  }, [puntos, mapsLib, map]);

  return null;
}

export default function KilometerMaps({ km, onKmChange }) {
  const [paradas, setParadas] = useState(() => [
    { id: 1, coordenada: null },
    { id: 2, coordenada: null },
  ]);
  const siguienteId = useRef(3);

  const etiquetaDe = (i) =>
    i === 0 ? 'Punto de partida' : i === paradas.length - 1 ? 'Destino final' : `Parada ${i}`;

  const agregarParada = () =>
    setParadas((prev) => [...prev, { id: siguienteId.current++, coordenada: null }]);

  const quitarParada = (id) =>
    setParadas((prev) => (prev.length > 2 ? prev.filter((p) => p.id !== id) : prev));

  const setCoordenada = (id, c) =>
    setParadas((prev) => prev.map((p) => (p.id === id ? { ...p, coordenada: c } : p)));

  const coords = paradas.map((p) => p.coordenada).filter(Boolean);

  const kmRuta = useMemo(() => {
    let total = 0;
    for (let i = 1; i < coords.length; i++) {
      total += haversineKm(coords[i - 1], coords[i]);
    }
    return total * FACTOR_CARRETERA;
  }, [paradas]);

  useEffect(() => {
    if (coords.length >= 2 && kmRuta > 0) {
      onKmChange?.(Math.min(100, Math.max(5, Math.round(kmRuta))));
    }
  }, [kmRuta]);

  return (
    <div className="w-full rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-white p-3 space-y-2">
        {paradas.map((p, i) => (
          <div key={p.id} className="flex items-start gap-2">
            <CajaLugar
              etiqueta={etiquetaDe(i)}
              idInput={`dir-${p.id}`}
              onCoordenada={(c) => setCoordenada(p.id, c)}
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
              Tu ruta: {kmRuta.toFixed(1)} km/día
            </span>
          )}
        </div>
      </div>

      <div className="h-72">
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <LineaRuta puntos={coords} />
          <Map
            defaultZoom={13}
            defaultCenter={{ lat: -12.046374, lng: -77.042793 }}
            className="w-full h-full"
          />
        </APIProvider>
      </div>
    </div>
  );
}
