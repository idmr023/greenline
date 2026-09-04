import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import SEOHead from '../components/SEOHead';

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex items-center justify-center py-24 px-4">
      <SEOHead title="Página no encontrada" description="La página que buscas no existe. Vuelve a la página de inicio de Green Line." />
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-brand/20 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Página no encontrada</h1>
        <p className="text-gray-500 mb-8">
          Lo sentimos, la página que buscas no existe o fue movida a otra ubicación.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold hover:bg-brand-dark transition-colors"
          >
            <Home className="w-4 h-4" />
            Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
