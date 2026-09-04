import { useState, useEffect } from 'react';
import { Play, Square, Settings2, Volume2 } from 'lucide-react';

export default function LectorFichaTecnica({texto}) {
  const [voces, setVoces] = useState([]);
  const [vozSeleccionada, setVozSeleccionada] = useState('');
  const [velocidad, setVelocidad] = useState(1);
  const [volumen, setVolumen] = useState(1);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [mostrarAjustes, setMostrarAjustes] = useState(false);

  // Score de naturalidad: preferimos voces premium/neural/online y español latino
  const calidadDeVoz = (voz) => {
    const nombre = `${voz.name} ${voz.lang}`.toLowerCase();
    let score = 0;
    if (nombre.includes('neural')) score += 60;
    if (nombre.includes('premium')) score += 60;
    if (nombre.includes('online')) score += 30;
    if (nombre.includes('enhanced')) score += 40;
    if (nombre.includes('natural')) score += 40;
    if (nombre.includes('wavenet')) score += 50;
    if (nombre.includes('good') || /google/i.test(nombre)) score += 20;
    if (/microsoft|azure/i.test(nombre)) score += 20;
    if (/apple/i.test(nombre)) score += 20;
    if (/es-419|es-mx|es-us|es-pe|es-cl|es-ar|es-co/i.test(nombre)) score += 15;
    if (/es-us/i.test(nombre)) score += 5;
    return score;
  };

  // 1. Cargar las voces disponibles en el dispositivo cuando el componente se monta
  useEffect(() => {
    const cargarVoces = () => {
      const vocesDisponibles = window.speechSynthesis.getVoices();
      // Filtramos para mostrar idealmente voces en español
      const vocesEsp = vocesDisponibles.filter(voz => voz.lang.startsWith('es'));
      const vocesFinales = vocesEsp.length > 0 ? vocesEsp : vocesDisponibles;
      // Ordenamos de más natural a menos natural
      const ordenadas = [...vocesFinales].sort((a, b) => calidadDeVoz(b) - calidadDeVoz(a));
      setVoces(ordenadas);
      setVozSeleccionada((actual) => actual || ordenadas[0]?.name || '');
    };

    cargarVoces();
    // Algunos navegadores cargan las voces de forma asíncrona, este evento lo detecta
    window.speechSynthesis.onvoiceschanged = cargarVoces;

    // Limpiar al desmontar para que no siga hablando si el usuario cambia de página
    return () => window.speechSynthesis.cancel();
  }, []);

  // 2. La función principal que convierte el código en voz
  const alternarReproduccion = () => {
    if (reproduciendo) {
      window.speechSynthesis.cancel(); // Detiene el audio
      setReproduciendo(false);
    } else {
      // Prepara el texto para ser leído
      const locucion = new SpeechSynthesisUtterance(texto || "No hay texto disponible para leer.");
      
      // Aplica la configuración elegida por el usuario (busca por nombre, robusto ante reordenamientos)
      locucion.voice = voces.find((v) => v.name === vozSeleccionada) || voces[0] || null;
      if (!locucion.voice && voces.length > 0) {
        locucion.lang = voces[0].lang;
      }
      locucion.rate = velocidad;
      locucion.volume = volumen;

      // Evento: cuando termine de hablar, apagamos el botón automáticamente
      locucion.onend = () => setReproduciendo(false);

      // ¡Habla!
      window.speechSynthesis.speak(locucion);
      setReproduciendo(true);
    }
  };

  return (
    <div className="flex bg-white border border-gray-200 rounded-xl p-4 shadow-sm max-w-520">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-gray-700">Lectura en voz alta</span>
        <button 
          onClick={() => setMostrarAjustes(!mostrarAjustes)}
          className="text-gray-400 hover:text-brand transition-colors"
          title="Ajustes de voz"
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      {/* Controles Ocultos/Visibles de Ajustes */}
      {mostrarAjustes && (
        <div className="mb-4 space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 font-medium">Voz:</label>
            <select 
              value={vozSeleccionada}
              onChange={(e) => setVozSeleccionada(e.target.value)}
              className="p-1.5 rounded border-gray-300 outline-none focus:ring-1 focus:ring-[#009000]"
            >
              {voces.map((voz) => (
                <option key={voz.name} value={voz.name}>
                  {voz.name} ({voz.lang})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-gray-600 font-medium w-16">Velocidad:</label>
            <input 
              type="range" min="0.5" max="2" step="0.1" 
              value={velocidad} 
              onChange={(e) => setVelocidad(parseFloat(e.target.value))}
              className="flex-1 accent-brand" 
            />
            <span className="w-8 text-xs">{velocidad}x</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-gray-600 font-medium w-16">Volumen:</label>
            <input 
              type="range" min="0" max="1" step="0.1" 
              value={volumen} 
              onChange={(e) => setVolumen(parseFloat(e.target.value))}
              className="flex-1 accent-[#009000]" 
            />
            <Volume2 className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      )}

      {/* Botón Principal (Play/Stop) */}
      <button 
        onClick={alternarReproduccion}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold transition-all ${
          reproduciendo 
            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
            : 'bg-[#009000] text-white hover:bg-green-700 shadow-md'
        }`}
      >
        {reproduciendo ? (
          <><Square className="w-4 h-4 fill-current" /> Detener lectura</>
        ) : (
          <><Play className="w-4 h-4 fill-current" /> Escuchar texto</>
        )}
      </button>
    </div>
  );
}