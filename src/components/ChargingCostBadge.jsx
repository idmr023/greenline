import { Zap } from 'lucide-react';

export default function ChargingCostBadge({ cost }) {
  if (cost == null) return null;

  return (
    <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-lg px-3 py-2">
      <Zap className="w-4 h-4 shrink-0" />
      <span className="text-xs font-semibold leading-tight">
        Carga completa (8h) por solo S/ {cost.toFixed(2)}
      </span>
    </div>
  );
}