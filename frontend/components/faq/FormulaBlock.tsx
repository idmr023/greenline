import type { ReactNode } from 'react';
import { Calculator } from 'lucide-react';

interface FormulaBlockProps {
  formula: ReactNode;
  nota?: string;
}

export default function FormulaBlock({ formula, nota }: FormulaBlockProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-5 text-white">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="h-4 w-4 text-brand" />
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Fórmula
        </span>
      </div>
      <p className="text-base sm:text-lg font-bold text-center leading-relaxed">
        {formula}
      </p>
      {nota && (
        <p className="mt-3 text-center text-xs text-gray-400 italic">
          {nota}
        </p>
      )}
    </div>
  );
}
