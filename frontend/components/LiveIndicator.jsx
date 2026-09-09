import { useState, useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { API_URL } from '../lib/api';

const CHECK_INTERVAL = 5 * 60 * 1000;
const RETRY_INTERVAL = 60 * 1000;

export default function LiveIndicator() {
  const [isLive, setIsLive] = useState(false);
  const [liveUrl, setLiveUrl] = useState('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const scheduleNextCheck = (delay) => {
      timeoutRef.current = setTimeout(checkLive, delay);
    };

    const checkLive = async () => {
      try {
        const res = await fetch(`${API_URL}/tiktok-live`);
        const data = await res.json();
        if (cancelled) return;
        setIsLive(Boolean(data.isLive));
        setLiveUrl(data.liveUrl || '');
        scheduleNextCheck(CHECK_INTERVAL);
      } catch (err) {
        console.error('Live check failed:', err);
        scheduleNextCheck(RETRY_INTERVAL);
      }
    };

    checkLive();

    return () => {
      cancelled = true;
      clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!isLive) return null;

  return (
    <a
      href={liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-bold tracking-wide rounded-full shadow-md hover:bg-red-500 hover:scale-105 transition-all whitespace-nowrap"
      title="¡Estamos en vivo en TikTok, Greenlover!"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
      </span>
      EN VIVO
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}
