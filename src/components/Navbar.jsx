import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Leaf } from 'lucide-react';

const shopLinks = [
  { label: 'Novedades', to: '/tienda' },
  { label: 'Bicimotos y VMP', to: '/tienda?categoria=VMP' },
  { label: 'Motos eléctricas', to: '/tienda?categoria=Motos%20Eléctricas' },
  { label: 'Trimotos eléctricas', to: '/tienda?categoria=Trimotos%20Eléctricas' },
  { label: 'Cargueros', to: '/tienda?categoria=Cargueros' },
  { label: 'Repuestos', to: '/proximamente' },
];

const accountLinks = [
  { label: 'Lista de deseos', to: '/proximamente' },
  { label: 'Mi cuenta', to: '/proximamente' },
];

const mainLinks = [
  { label: 'Blog', to: '/proximamente' },
  { label: 'Contacto', to: '/proximamente' },
  { label: 'Nosotros', to: '/proximamente' },
  { label: 'Distribuidores', to: '/proximamente' },
  { label: 'Preguntas frecuentes', to: '/proximamente' },
  { label: 'Comparar', to: '/proximamente' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-brand font-bold text-xl">
            <Leaf className="w-7 h-7" />
            <span>Green Line</span>
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link to="/" className="hover:text-brand transition-colors">Inicio</Link>

            <div className="relative group">
              <button type="button" className="flex items-center gap-1 hover:text-brand transition-colors outline-none">
                Tienda <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {shopLinks.map((l) => (
                  <Link key={l.label} to={l.to} className="block px-4 py-2 hover:bg-gray-100 hover:text-brand text-sm text-left">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>

            {mainLinks.map((l) => (
              <Link key={l.label} to={l.to} className="hover:text-brand transition-colors">
                {l.label}
              </Link>
            ))}

            <div className="relative group">
              <button type="button" className="flex items-center gap-1 hover:text-brand transition-colors outline-none">
                Cuenta <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {accountLinks.map((l) => (
                  <Link key={l.label} to={l.to} className="block px-4 py-2 hover:bg-gray-100 hover:text-brand text-sm text-left">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile toggle */}
          <button type="button" className="lg:hidden p-2 text-gray-700" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-4">
          <Link to="/" className="block py-2 font-medium" onClick={() => setMobileOpen(false)}>Inicio</Link>
          <p className="py-2 font-semibold text-brand">Tienda</p>
          {shopLinks.map((l) => (
            <Link key={l.label} to={l.to} className="block pl-4 py-2 text-sm text-gray-600" onClick={() => setMobileOpen(false)}>
              {l.label}
            </Link>
          ))}
          {mainLinks.map((l) => (
            <Link key={l.label} to={l.to} className="block py-2 font-medium" onClick={() => setMobileOpen(false)}>
              {l.label}
            </Link>
          ))}
          <p className="py-2 font-semibold text-brand">Cuenta</p>
          {accountLinks.map((l) => (
            <Link key={l.label} to={l.to} className="block pl-4 py-2 text-sm text-gray-600" onClick={() => setMobileOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
