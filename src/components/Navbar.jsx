import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, GraduationCap, Scale } from 'lucide-react';

const shopLinks = [
  { label: 'Novedades', to: '/tienda' },
  { label: 'Bicimotos y VMP', to: '/tienda?categoria=VMP' },
  { label: 'Motos eléctricas', to: '/tienda?categoria=Motos%20El%C3%A9ctricas' },
  { label: 'Trimotos eléctricas', to: '/tienda?categoria=Trimotos%20El%C3%A9ctricas' },
  { label: 'Cargueros', to: '/tienda?categoria=Cargueros' },
  { label: 'Repuestos', to: '/proximamente' },
];

const contactLinks = [
  { label: 'Contáctanos', to: '/contacto' },
  { label: 'Tiendas', to: '/tiendas' },
];

const accountLinks = [
  { label: 'Lista de deseos', to: '/proximamente' },
  { label: 'Mi cuenta', to: '/proximamente' },
];

const flatLinks = [
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Blog', to: '/proximamente' },
  { label: 'Preguntas frecuentes', to: '/proximamente' },
];

export default function Navbar({ onCommunityOpen }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSub, setMobileSub] = useState(null);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <picture>
              <img src="/assets/imagenes/logos/logo_final.png" alt="Green Line" className="h-8" />
            </picture>
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
            <div className="relative group">
              <button type="button" className="flex items-center gap-1 hover:text-brand transition-colors outline-none">
                Tienda <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {shopLinks.map((l) => (
                  <Link key={l.label} to={l.to} className="block px-4 py-2 hover:bg-gray-100 hover:text-brand text-sm text-left">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative group">
              <button type="button" className="flex items-center gap-1 hover:text-brand transition-colors outline-none">
                Contacto <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {contactLinks.map((l) => (
                  <Link key={l.label} to={l.to} className="block px-4 py-2 hover:bg-gray-100 hover:text-brand text-sm text-left">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {flatLinks.map((l) => (
              <Link key={l.label} to={l.to} className="hover:text-brand transition-colors">
                {l.label}
              </Link>
            ))}

            <Link
              to="/proximamente"
              className="hover:text-brand transition-colors flex items-center"
              title="Comparar vehículos"
            >
              <Scale className="w-5 h-5" />
            </Link>

            <button
              type="button"
              onClick={onCommunityOpen}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand text-sm font-semibold rounded-full hover:bg-brand/20 transition-colors"
            >
              <GraduationCap className="w-4 h-4" />
              Comunidad
            </button>

            <div className="relative group">
              <button type="button" className="flex items-center gap-1 hover:text-brand transition-colors outline-none">
                Cuenta <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {accountLinks.map((l) => (
                  <Link key={l.label} to={l.to} className="block px-4 py-2 hover:bg-gray-100 hover:text-brand text-sm text-left">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={onCommunityOpen}
              className="p-2 text-brand"
              aria-label="Comunidad UPN"
            >
              <GraduationCap className="w-5 h-5" />
            </button>
            <button type="button" className="p-2 text-gray-700" onClick={() => { setMobileOpen(!mobileOpen); setMobileSub(null); }}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-4">
          {mobileSub === 'tienda' ? (
            <>
              <button type="button" onClick={() => setMobileSub(null)} className="block py-2 font-semibold text-brand text-sm flex items-center gap-1">
                ← Tienda
              </button>
              {shopLinks.map((l) => (
                <Link key={l.label} to={l.to} className="block pl-4 py-2 text-sm text-gray-600" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              ))}
            </>
          ) : mobileSub === 'contacto' ? (
            <>
              <button type="button" onClick={() => setMobileSub(null)} className="block py-2 font-semibold text-brand text-sm flex items-center gap-1">
                ← Contacto
              </button>
              {contactLinks.map((l) => (
                <Link key={l.label} to={l.to} className="block pl-4 py-2 text-sm text-gray-600" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              ))}
            </>
          ) : (
            <>
              <button type="button" onClick={() => setMobileSub('tienda')} className="block py-2 font-semibold text-brand">
                Tienda →
              </button>
              <button type="button" onClick={() => setMobileSub('contacto')} className="block py-2 font-semibold text-brand">
                Contacto →
              </button>
              {flatLinks.map((l) => (
                <Link key={l.label} to={l.to} className="block py-2 font-medium" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              ))}
              <Link to="/proximamente" className="block py-2 font-medium flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <Scale className="w-4 h-4" /> Comparar
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
