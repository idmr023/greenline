import { Gift } from 'lucide-react';

export default function PromoDivider() {
  return (
    <section className="w-full py-20 overflow-hidden bg-white flex flex-col items-center justify-center relative">
      
      {/* 1. Fondo decorativo: Círculo verde sutil (como en tu referencia) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-50 rounded-full opacity-60 -z-10 pointer-events-none"></div>

      <div className="relative flex flex-col items-center z-10 w-full px-4 max-w-6xl">
        {/* 3. El Bloque Principal (Texto fuera + Caja inclinada) */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full gap-2 md:gap-4">
          
          {/* Texto oscuro exterior */}
          <h2 className="text-5xl md:text-7xl font-black text-[#111827] tracking-tighter text-center md:text-right drop-shadow-sm">
            ¡Alto ahí,
          </h2>

          {/* Caja verde inclinada (El impacto) */}
          <div className="bg-[#009000] px-8 md:px-10 py-2 md:py-4 transform -rotate-3 hover:-rotate-1 transition-transform duration-300 shadow-2xl">
            <h3 className="text-5xl md:text-7xl font-black text-white tracking-tight text-center">
              GreenLover!
            </h3>
          </div>
        </div>

        {/* 4. Subtítulo dinámico con el amarillo de la marca */}
        <div className="mt-6 md:mt-8 transform rotate-1">
          <p className="text-2xl md:text-4xl font-extrabold text-gray-800 text-center">
            tenemos{' '}
            <span className="bg-yellow-electric px-3 py-1 text-gray-900 rounded-sm inline-block transform -skew-x-12 shadow-sm">
              más beneficios
            </span>{' '}
            para ti
          </p>
        </div>

      </div>
    </section>
  );
}