import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';

export default function StubPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-24 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand/10 text-brand flex items-center justify-center">
          <Construction className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-3 text-gray-900">Próximamente</h1>
        <p className="text-gray-600 mb-6">
          Esta sección está en construcción. Muy pronto tendrás más contenido de
          Green Line.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
