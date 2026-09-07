import { useEffect, useState } from 'react';

function diffParts(target) {
  const total = target - Date.now();
  if (total <= 0) return null;
  const segundos = Math.floor(total / 1000);
  return {
    dias: Math.floor(segundos / 86400),
    horas: Math.floor((segundos % 86400) / 3600),
    minutos: Math.floor((segundos % 3600) / 60),
    segundos: segundos % 60,
  };
}

/** Cuenta regresiva a una fecha. Devuelve { dias, horas, minutos, segundos }
 *  o null cuando la cuenta terminó. */
export default function useCountdown(targetDate) {
  const [remaining, setRemaining] = useState(() => (targetDate ? diffParts(targetDate) : null));

  useEffect(() => {
    if (!targetDate) return undefined;
    setRemaining(diffParts(targetDate));
    const id = setInterval(() => setRemaining(diffParts(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return remaining;
}