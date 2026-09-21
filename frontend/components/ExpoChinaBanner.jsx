import { Calendar, ArrowRight } from '../lib/icons';

export default function ExpoChinaBanner() {
  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-gradient-to-br from-[#064e3b] via-[#022c22] to-black">
      {/* Sombra de fondo / marca de agua */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-end pr-[5%] font-black leading-none select-none opacity-5"
        style={{
          fontSize: 'min(35vw, 35vh)',
          color: 'white',
        }}
      >
        EXPO
      </span>

      {/* Resplandor sutil */}
      <div
        aria-hidden="true"
        className="absolute -right-1/4 -top-1/4 h-[65%] w-[65%] rounded-full bg-emerald-500/20 blur-3xl"
      />

      {/* Contenido */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-14 lg:px-24">
        <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-black uppercase tracking-wider text-white shadow-lg">
          <Calendar className="h-4 w-4" />
          Próximamente · Feria Internacional
        </span>

        <h2 className="max-w-2xl text-[clamp(1.75rem,4vw,3.25rem)] font-black leading-tight text-white">
          Green Line en <span className="text-emerald-400">ExpoChina</span>
        </h2>

        <p className="mt-3 max-w-xl text-[clamp(0.9rem,1.4vw,1.1rem)] font-medium text-white/90">
          Acompáñanos en la feria de innovación y movilidad eléctrica. Pre-inscríbete y accede a{' '}
          <span className="font-bold text-emerald-300">descuentos y beneficios exclusivos</span>.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-emerald-400">
          <span>Inscríbete y conoce más</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
