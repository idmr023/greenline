import { useState, useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';

// Tiempos en milisegundos
const CHECK_INTERVAL = 15 * 60 * 1000; // 15 minutos (búsqueda normal o pausa local)
const LIVE_HOLD_INTERVAL = 90 * 60 * 1000; // 1.5 horas (cuando ya lo encontró)

export default function LiveIndicator() {
  const [isLive, setIsLive] = useState(false);
  const [liveUrl, setLiveUrl] = useState('');
  const timeoutRef = useRef(null);

  // Define la ventana exacta de búsqueda (Límite de 1 hora)
  const isSearchWindow = () => {
    const now = new Date();
    const limaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Lima" }));
    
    const day = limaTime.getDay();
    const hours = limaTime.getHours();
    const minutes = limaTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    const isSaturday = day === 6;

    // Horario Lunes a Viernes (y sábados tarde): 2:30 PM a 3:30 PM
    const everydayStart = 14 * 60 + 30; // 14:30
    const everydayEnd = 15 * 60 + 30;   // 15:30 (Límite de 1 hora)

    // Horario extra Sábados: 9:30 AM a 10:30 AM
    const saturdayStart = 9 * 60 + 30;  // 09:30
    const saturdayEnd = 10 * 60 + 30;   // 10:30 (Límite de 1 hora)

    // Valida si estamos dentro de la hora límite del sábado por la mañana
    if (isSaturday && totalMinutes >= saturdayStart && totalMinutes <= saturdayEnd) return true;
    
    // Valida si estamos dentro de la hora límite de las tardes
    if (totalMinutes >= everydayStart && totalMinutes <= everydayEnd) return true;

    return false;
  };

  useEffect(() => {
    const scheduleNextCheck = (delay) => {
      timeoutRef.current = setTimeout(checkLive, delay);
    };

    const checkLive = async () => {
      // 1. Si no estamos en la "ventana de 1 hora", el frontend duerme. NO llama a la API.
      if (!isSearchWindow()) {
        setIsLive(false); 
        scheduleNextCheck(CHECK_INTERVAL);
        return;
      }

      try {
        // 2. Solo llega aquí si estamos dentro de la hora de búsqueda permitida
        const res = await fetch('/api/tiktok-live');
        const data = await res.json();

        if (data.isLive) {
          setIsLive(true);
          setLiveUrl(data.liveUrl);
          // ¡Lo encontró! Pausa la búsqueda por 1.5 horas
          scheduleNextCheck(LIVE_HOLD_INTERVAL);
        } else {
          setIsLive(false);
          setLiveUrl('');
          // Sigue buscando (cada 15 mins) porque aún estamos dentro de la hora límite
          scheduleNextCheck(CHECK_INTERVAL);
        }
      } catch (err) {
        console.error('Live check failed:', err);
        scheduleNextCheck(CHECK_INTERVAL);
      }
    };

    checkLive();

    return () => clearTimeout(timeoutRef.current);
  }, []);

  if (!isLive) return null;

  return (
    <a
      href={liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-[#00f2fe] text-black text-sm font-bold rounded-full shadow-[0_0_15px_rgba(0,242,254,0.5)] animate-pulse hover:bg-[#00d2fe] transition-all hover:scale-105"
      title="¡Ir al en vivo de TikTok!"
    >
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full rounded-full bg-black opacity-75 animate-ping" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-black" />
      </span>
      <span>Almudena EN VIVO</span>
      <ExternalLink className="w-4 h-4 ml-1" />
    </a>
  );
}