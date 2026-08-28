interface Columna {
  label: string;
  highlight?: boolean;
}

interface Fila {
  cells: string[];
  highlight?: boolean;
}

interface TablaComparativaProps {
  titulo?: string;
  columnas: Columna[];
  filas: Fila[];
  nota?: string;
  compact?: boolean;
}

export default function TablaComparativa({
  titulo,
  columnas,
  filas,
  nota,
  compact,
}: TablaComparativaProps) {
  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
      {titulo && (
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <h4 className="text-sm font-bold text-gray-900">{titulo}</h4>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {columnas.map((col, i) => (
                <th
                  key={i}
                  className={`px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider ${
                    col.highlight ? 'text-brand' : 'text-gray-600'
                  } ${compact ? 'px-2 py-1.5' : 'px-4 py-3'}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filas.map((fila, i) => (
              <tr
                key={i}
                className={`transition-colors ${
                  fila.highlight
                    ? 'bg-brand/5'
                    : 'hover:bg-gray-50/50'
                }`}
              >
                {fila.cells.map((cell, j) => (
                  <td
                    key={j}
                    className={`text-gray-700 ${
                      compact ? 'px-2 py-1.5 text-xs' : 'px-4 py-3'
                    } ${j === 0 ? 'font-medium' : ''}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {nota && (
        <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-2.5">
          <p className="text-[11px] text-gray-500 italic">{nota}</p>
        </div>
      )}
    </div>
  );
}
