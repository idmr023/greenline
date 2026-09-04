import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, ShieldCheck, Loader2, HelpCircle } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import SEOHead, { breadcrumbSchema } from '../components/SEOHead';
import { supabase } from '../lib/supabase';
import { CONTACT } from '../lib/config';
import { manualUrl } from '../lib/manuales';

function BotonManual({ href }) {
  if (href) {
    return (
      <a
        href={href}
        download
        title="Descargar manual de uso"
        className="inline-flex items-center gap-1.5 bg-brand text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-brand-dark transition-colors"
      >
        <Download className="w-3.5 h-3.5" />
        Manual de uso
      </a>
    );
  }
  return (
    <span
      title="Próximamente"
      className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-400 text-xs font-semibold px-3 py-2 rounded-lg cursor-not-allowed"
    >
      <Download className="w-3.5 h-3.5" />
      Manual de uso
    </span>
  );
}

function BotonGarantia() {
  return (
    <span
      title="Disponible próximamente"
      className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-400 text-xs font-semibold px-3 py-2 rounded-lg cursor-not-allowed"
    >
      <ShieldCheck className="w-3.5 h-3.5" />
      Garantía
    </span>
  );
}

export default function ManualesDeUso() {
  const [productos, setProductos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    supabase
      .from('productos')
      .select('slug, nombre')
      .order('nombre')
      .then(({ data, error: err }) => {
        if (!alive) return;
        if (err) {
          setError('No se pudieron cargar los modelos. Inténtalo de nuevo en unos momentos.');
          setProductos([]);
          return;
        }
        setProductos(data || []);
      });
    return () => {
      alive = false;
    };
  }, []);

  const disponibles = (productos ?? []).filter((p) => manualUrl(p.slug)).length;
  const total = productos ? (productos ?? []).length : 0;

  return (
    <div>
      <SEOHead
        title="Manuales de Uso"
        description="Descarga los manuales de uso de todos los modelos de vehículos eléctricos Green Line: scooters, motos, trimotos y más."
        url="/manuales-de-uso"
        keywords={['manual de uso', 'manual scooters eléctricos', 'manual Green Line']}
        jsonLd={[breadcrumbSchema([
          { name: 'Inicio', url: '/' },
          { name: 'Manuales de Uso', url: '/manuales-de-uso' },
        ])]}
      />
      <PageBanner
        title="Manuales de Uso"
        subtitle="Descarga el manual de uso de tu modelo Green Line"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Nota */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold mb-1">¿No encuentras tu manual?</p>
            <p>
              Descarga el manual de uso de tu modelo desde la tabla. Si aún no está disponible,
              tu vehículo incluye una copia impresa dentro del empaque. Para más ayuda
              contáctanos en{' '}
              <a href={`mailto:${CONTACT.emailSoporte}`} className="underline font-medium">{CONTACT.emailSoporte}</a>.
            </p>
          </div>
        </div>

        {/* Tabla de manuales por modelo */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wide text-gray-500">
            <span>Modelo</span>
            <span className="w-36">Manual de uso</span>
            <span className="w-28">Garantía</span>
          </div>

          {productos === null ? (
            <div className="flex items-center justify-center gap-2 px-5 py-10 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Cargando modelos...
            </div>
          ) : productos.length === 0 ? (
            <div className="px-5 py-10 text-sm text-gray-500 text-center">{error || 'Sin modelos disponibles.'}</div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {productos.map((p) => {
                const manual = manualUrl(p.slug);
                return (
                  <li key={p.slug} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 sm:gap-4 px-5 py-4 items-center">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-brand shrink-0" />
                      <span className="text-sm font-medium text-gray-900 truncate" title={p.nombre}>
                        {p.nombre}
                      </span>
                    </div>
                    <div className="w-36 sm:text-left">
                      <BotonManual href={manual} />
                    </div>
                    <div className="w-28 sm:text-left">
                      <BotonGarantia />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {productos !== null && (
            <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
              {disponibles} de {total} manuales disponibles para descargar.
            </div>
          )}
        </div>

        {/* Contacto */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda con tu producto?{' '}
            <Link to="/contacto" className="text-brand font-semibold hover:underline">
              Contáctanos
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}