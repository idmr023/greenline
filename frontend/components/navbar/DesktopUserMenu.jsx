import { Link } from 'react-router-dom';
import { User, ExternalLink, LogIn, ChevronDown, LogOut } from '../../lib/icons';

const MI_CUENTA_URL = 'https://glperu.com/mi-cuenta/';

export function DesktopUserMenu({ user, isStaff, onLogout }) {
  if (!user) {
    return import.meta.env.PROD ? (
      <a
        href={MI_CUENTA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 hover:text-brand transition-colors"
      >
        <User className="w-4 h-4" />
        Cuenta <ExternalLink className="w-3.5 h-3.5" />
      </a>
    ) : (
      <Link
        to="/login"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-brand/10 text-brand text-sm font-semibold rounded-full hover:bg-brand/20 transition-colors"
      >
        <LogIn className="w-4 h-4" />
        Iniciar sesión
      </Link>
    );
  }

  return (
    <div className="relative group">
      <button
        type="button"
        className="flex items-center gap-1 hover:text-brand transition-colors outline-none"
      >
        <User className="w-4 h-4" />
        {user.nombre} <ChevronDown className="w-4 h-4" />
      </button>

      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="px-4 py-2 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900">
            {user.nombre} {user.apellido}
          </p>

          <p className="text-xs text-gray-500">
            {user.email}
          </p>
        </div>

        <Link
          to="/mi-cuenta"
          className="block px-4 py-2 hover:bg-gray-100 hover:text-brand text-sm text-left"
        >
          Mi cuenta
        </Link>

        {isStaff && (
          <Link
            to="/admin"
            className="block px-4 py-2 hover:bg-gray-100 hover:text-brand text-sm text-left"
          >
            {user.rol === 'EDITORA_BLOG' ? 'Editar Blog' : 'Admin'}
          </Link>
        )}

        <button
          type="button"
          onClick={onLogout}
          className="w-full text-left px-4 py-2 hover:bg-red-50 hover:text-red-600 text-sm flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
