import { useState, useEffect } from 'react';

export default function AnniversaryPromo() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const today = new Date();
    // Fechas clave
    const midSept = new Date(today.getFullYear(), 8, 15); // 15 de Sept (Mes 8 en JS)
    const lateSept = new Date(today.getFullYear(), 8, 24); // 24 de Sept (Última semana)
    const endSept = new Date(today.getFullYear(), 8, 30, 23, 59, 59); // Fin de mes

    if (today < midSept) {
      setCurrentPhase(1); // Hasta el 14
    } else if (today >= midSept && today < lateSept) {
      setCurrentPhase(2); // Del 15 al 23
    } else {
      setCurrentPhase(3); // Última semana
      // Lógica simple de cronómetro
      const timer = setInterval(() => {
        const now = new Date();
        const diff = endSept - now;
        if (diff > 0) {
          const d = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const m = Math.floor((diff / 1000 / 60) % 60);
          setTimeLeft(`${d}d ${h}h ${m}m`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, []);

  const whatsappMessage = "¡Hola! Quisiera acceder al descuento por el aniversario Greenline 🎉🥳🛵";
  const whatsappUrl = `https://wa.me/51919445661?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-linear-to-r from-amber-200 to-yellow-electric p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 shadow-lg border border-brand/20">
      
      {/* Textos dinámicos según la fecha */}
      {currentPhase === 1 && (
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
          ¡Aprovecha las ofertas antes de que se acaben! 🚨
        </h3>
      )}
      
      {currentPhase === 2 && (
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
          Queda muy poco tiempo, no te quedes sin tu Greenline ⚡
        </h3>
      )}

      {currentPhase === 3 && (
        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-bold text-red-600">
            Última oportunidad. Aprovecha antes que los descuentos se vayan ⏳
          </h3>
          <p className="text-4xl font-black text-gray-900 animate-pulse">{timeLeft}</p>
        </div>
      )}

      {/* Botón de WhatsApp Amarillo SIEMPRE VISIBLE */}
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 bg-yellow-electric text-gray-900 font-extrabold text-lg px-8 py-4 rounded-full shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300 flex items-center gap-2 border-2"
      >
        Haz click aquí para acceder a tu descuento 🎁
      </a>
    </div>
  );
}