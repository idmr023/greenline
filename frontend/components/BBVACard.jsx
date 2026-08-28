export function BBVACard() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#004481]/15 bg-[#004481]/5 px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#004481]">
        <span className="text-xs font-bold text-white">BBVA</span>
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900">
          Compra con tarjetas BBVA
        </p>
        <p className="text-xs text-gray-600">
          Accede a descuentos y beneficios exclusivos.
        </p>
      </div>
    </div>
  );
}
