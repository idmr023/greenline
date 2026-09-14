import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Scale } from '../../lib/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { LOGO } from '../../lib/images';
import { CartButton } from './CartButton';
import { CommunityButton } from './CommunityButton';
import { NavDropdown } from './NavDropdown';
import { DesktopUserMenu } from './DesktopUserMenu';
import { MobileUserMenu } from './MobileUserMenu';
import { MobileSubmenu } from './MobileSubmenu';
import LiveIndicator from '../LiveIndicator';

/* -------------------------------------------------------------------------- */
/*                              NAVIGATION DATA                               */
/* -------------------------------------------------------------------------- */

const NAVIGATION = {
  tienda: {
    label: 'Tienda',
    links: [
      { label: 'Novedades', to: '/tienda' },
      { label: 'Bicimotos y VMP', to: '/tienda?categoria=VMP' },
      { label: 'Motos eléctricas', to: '/tienda?categoria=Motos%20El%C3%A9ctricas' },
      { label: 'Trimotos eléctricas', to: '/tienda?categoria=Trimotos%20El%C3%A9ctricas' },
      { label: 'Cargueros', to: '/tienda?categoria=Cargueros' },
      { label: 'Cuatrimotos', to: '/tienda?categoria=Cuatrimotos' },
      { label: 'Repuestos', to: '/proximamente' },
    ],
  },

  contacto: {
    label: 'Contacto',
    links: [
      { label: 'Contáctanos', to: '/contacto' },
      { label: 'Tiendas y Distribuidores', to: '/tiendas' },
    ],
  },

  direct: [
    { label: 'Nosotros', to: '/nosotros' },
    { label: 'Blog', to: '/blog' },
    { label: 'Preguntas frecuentes', to: '/preguntas-frecuentes' },
  ],
};

/* -------------------------------------------------------------------------- */
/*                                MAIN NAVBAR                                 */
/* -------------------------------------------------------------------------- */

export default function Navbar({ onCommunityOpen }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState(null);

  const { user, isStaff, logout } = useAuth();
  const { count, openCart } = useCart();

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileSection(null);
  };

  const handleMobileToggle = () => {
    setMobileOpen((current) => !current);
    setMobileSection(null);
  };

  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center"
            aria-label="Green Line - Inicio"
          >
            <img
              src={LOGO}
              alt="Green Line"
              className="h-16"
            />
          </Link>

          {/* DESKTOP */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-700">
            <NavDropdown
              label={NAVIGATION.tienda.label}
              links={NAVIGATION.tienda.links}
            />

            <NavDropdown
              label={NAVIGATION.contacto.label}
              links={NAVIGATION.contacto.links}
            />

            {NAVIGATION.direct.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="hover:text-brand transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/comparar"
              className="hover:text-brand transition-colors flex items-center"
              title="Comparar vehículos"
              aria-label="Comparar vehículos"
            >
              <Scale className="w-5 h-5" />
            </Link>

            <CartButton
              count={count}
              onClick={openCart}
            />

            <CommunityButton
              onClick={onCommunityOpen}
            />

            <DesktopUserMenu
              user={user}
              isStaff={isStaff}
              onLogout={handleLogout}
            />

            <LiveIndicator />
          </div>

          {/* MOBILE ACTIONS */}
          <div className="lg:hidden flex items-center gap-2">
            <CartButton
              count={count}
              onClick={openCart}
              mobile
            />

            <CommunityButton
              onClick={onCommunityOpen}
              mobile
            />

            <button
              type="button"
              className="p-2 text-gray-700"
              onClick={handleMobileToggle}
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-4">
          {mobileSection ? (
            <MobileSubmenu
              navigationSection={NAVIGATION[mobileSection]}
              onBack={() => setMobileSection(null)}
              onNavigate={closeMobileMenu}
            />
          ) : (
            <>
              <div className="py-2">
                <LiveIndicator />
              </div>

              <button
                type="button"
                onClick={() => setMobileSection('tienda')}
                className="block py-2 font-semibold text-brand text-left w-full"
              >
                Tienda →
              </button>

              <button
                type="button"
                onClick={() => setMobileSection('contacto')}
                className="block py-2 font-semibold text-brand text-left w-full"
              >
                Contacto →
              </button>

              {NAVIGATION.direct.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="block py-2 font-medium"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                to="/comparar"
                className="block py-2 font-medium flex items-center gap-2"
                onClick={closeMobileMenu}
              >
                <Scale className="w-4 h-4" />
                Comparar
              </Link>

              <div className="border-t border-gray-100 mt-2 pt-2">
                <MobileUserMenu
                  user={user}
                  isStaff={isStaff}
                  onLogout={handleLogout}
                  onNavigate={closeMobileMenu}
                />
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
