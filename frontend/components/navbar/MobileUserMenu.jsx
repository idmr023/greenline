import { Link } from 'react-router-dom';
import { User, ExternalLink, LogIn, LogOut } from '../../lib/icons';

const MI_CUENTA_URL = 'https://glperu.com/mi-cuenta/';

export function MobileUserMenu({ user, isStaff, onLogout, onNavigate }) {
  if (!user) {
    return import.meta.env.PROD ? (
      <a
        href={MI_CUENTA_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className="block py-2 text-sm text-brand font-medium flex items-center gap-2"
      >
        <User className="w-4 h-4" />
        Cuenta <ExternalLink className="w-3.5 h-3.5" />
      </a>
    ) : (
      <Link
        to="/login"
        onClick={onNavigate}
        className="block py-2 text-sm text-brand font-medium flex items-center gap-2"
      >
        <LogIn className="w-4 h-4" />
        Iniciar sesión
      </Link>
    );
  }

  return (
    <>
      <div className="py-2">
        <p className="text-sm font-medium text-gray-900">
          {user.nombre} {user.apellido}
        </p>

        <p className="text-xs text-gray-500">
          {user.email}
        </p>
      </div>

      <Link
        to="/mi-cuenta"
        className="block py-2 text-sm text-gray-600"
        onClick={onNavigate}
      >
        Mi cuenta
      </Link>

      {isStaff && (
        <Link
          to="/admin"
          className="block py-2 text-sm text-gray-600"
          onClick={onNavigate}
        >
          {user.rol === 'EDITORA_BLOG' ? 'Editar Blog' : 'Admin'}
        </Link>
      )}

      <button
        type="button"
        onClick={onLogout}
        className="block py-2 text-sm text-red-600 flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Cerrar sesión
      </button>
    </>
  );
}