import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, HelpCircle, BookOpen, Search, X, ExternalLink, FileCog, ArrowRight } from '../lib/icons';
import PageBanner from '../components/PageBanner';
import SEOHead, { breadcrumbSchema } from '../components/SEOHead';
import { fetchManuales, MANUALES_LOCALES } from '../lib/manuales';

const BASE = '/assets/manuales_uso/';

export default function ManualesDeUso() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [selectedManual, setSelectedManual] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [manuales, setManuales] = useState(MANUALES_LOCALES);

  useEffect(() => {
    let active = true;
    fetchManuales().then((data) => {
      if (active && data) setManuales(data);
    });
    return () => { active = false; };
  }, []);

  const categories = useMemo(() => [
    'Todas',
    ...Array.from(new Set(manuales.map(m => m.category))).sort((a, b) => a.localeCompare(b, 'es')),
  ], [manuales]);

  const filteredManuals = useMemo(() => {
    return manuales.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'Todas' || m.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [manuales, searchTerm, activeCategory]);

  const openReader = (manual) => {
    setSelectedManual(manual);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeReader = () => {
    setModalOpen(false);
    setSelectedManual(null);
    document.body.style.overflow = '';
  };

  return (
    <div>
      <SEOHead
        title="Manuales de Uso"
        description="Descarga y lee online los manuales de uso de todos los modelos de vehículos eléctricos Green Line: scooters, motos, trimotos, cargueros y más."
        url="/manuales-de-uso"
        keywords={['manual de uso', 'manual scooters eléctricos', 'manual Green Line', 'flipbook manual', 'revista manual']}
        jsonLd={[breadcrumbSchema([
          { name: 'Inicio', url: '/' },
          { name: 'Manuales de Uso', url: '/manuales-de-uso' },
        ])]}
      />
      <PageBanner
        title="Manuales de Uso"
        subtitle="Accede al manual de tu modelo Green Line como revista interactiva o descarga el PDF"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Nota */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">¿No encuentras tu manual?</p>
              <p>
                Usa el buscador o filtra por categoría. Si aún no está disponible,
                tu vehículo incluye una copia impresa.
              </p>
            </div>
        </div>

        {/* Destacado: Fichas Técnicas */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand to-brand-dark text-white shadow-lg mb-8">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -right-6 -bottom-8 h-32 w-32 rounded-full bg-white/5" />
          <div className="relative flex flex-col sm:flex-row items-center gap-5 p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <FileCog className="w-7 h-7" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-light mb-1">Acceso directo</p>
              <h3 className="text-lg font-bold leading-tight">
                Fichas técnicas de los modelos
              </h3>
              <p className="text-sm text-white/80 mt-1">
                Consulta las especificaciones oficiales de tu vehículo en un solo clic.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveCategory('Fichas Técnicas')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-brand text-sm font-bold shadow-md hover:bg-gray-50 transition-colors shrink-0"
            >
              Ver fichas técnicas
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Buscador + Contador */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar modelo, nombre, categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {filteredManuals.length} de {manuales.length} manuales
          </div>
        </div>

        {/* Categoría Tabs */}
        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Categorías de manuales">
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de tarjetas */}
        {filteredManuals.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium">No se encontraron manuales</p>
            <p className="text-sm mt-1">Intenta con otro término de búsqueda o categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredManuals.map((manual) => (
              <div
                key={manual.slug}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand/30 transition-all overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand/10 shrink-0">
                        <FileText className="w-5 h-5 text-brand" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{manual.category}</p>
                        <h3 className="font-semibold text-gray-900 truncate" title={manual.name}>{manual.name}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => openReader(manual)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-dark transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      Leer como revista
                    </button>
                    <a
                      href={BASE + manual.file}
                      download
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:border-brand hover:bg-brand/5 hover:text-brand transition-colors"
                      title="Descargar PDF"
                    >
                      <Download className="w-4 h-4" />
                      Descargar PDF
                    </a>
                  </div>
                </div>
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
                  <span>Archivo: {manual.file}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        )}

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

      {/* Modal Visor Revista */}
      {modalOpen && selectedManual && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeReader}
          role="dialog"
          aria-modal="true"
          aria-labelledby="manual-reader-title"
        >
          <div
            className="relative w-full max-w-6xl max-h-[95vh] flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
              <div className="min-w-0 flex-1">
                <p id="manual-reader-title" className="text-xs font-semibold uppercase tracking-wider text-brand mb-0.5">
                  {selectedManual.category}
                </p>
                <h3 className="font-bold text-gray-900 leading-tight truncate">{selectedManual.name}</h3>
              </div>
              <button
                type="button"
                onClick={closeReader}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors shrink-0"
                aria-label="Cerrar lector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto relative">
              <div
                style={{
                  position: 'relative',
                  paddingTop: 'max(60%, 324px)',
                  width: '100%',
                  height: 0,
                }}
              >
                <iframe
                  style={{
                    position: 'absolute',
                    border: 'none',
                    width: '100%',
                    height: '100%',
                    left: 0,
                    top: 0,
                  }}
                  src={BASE + selectedManual.file}
                  title={selectedManual.name}
                  allowFullScreen
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 shrink-0 bg-gray-50">
              <span className="text-xs text-gray-500">Usa la vista de dos páginas del navegador para experiencia tipo revista</span>
              <a
                href={BASE + selectedManual.file}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand-dark transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}