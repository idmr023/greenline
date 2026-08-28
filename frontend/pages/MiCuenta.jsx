import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, LogOut, Package, Settings, ExternalLink } from 'lucide-react';
import PageBanner from '../components/PageBanner';

export default function MiCuenta() {
  const { user, logout, isStaff, isAdmin } = useAuth();

  if (!user) return null;

  const rolLabels = {
    ADMIN: 'Administrador',
    DESARROLLADOR_WEB: 'Desarrollador Web',
    GERENTE_TIENDA: 'Gerente de Tienda',
    COLABORADOR_TIENDA: 'Colaborador de Tienda',
    GERENTE_ALMACEN: 'Gerente de Almacén',
    COLABORADOR_ALMACEN: 'Colaborador de Almacén',
    LOGISTICA: 'Logística',
    EDITOR_ARTICULOS: 'Editor de Artículos',
    CLIENTE: 'Cliente',
  };

  return (
    <div>
      <PageBanner
        title="Mi Cuenta"
        subtitle="Gestiona tu perfil y revisa tu actividad"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-brand/10 text-brand flex items-center justify-center mb-3">
                  <User className="w-8 h-8" />
                </div>
                <h2 className="font-bold text-gray-900">{user.nombre} {user.apellido}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span>{rolLabels[user.rol] || user.rol}</span>
                </div>
                {user.telefono && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{user.telefono}</span>
                  </div>
                )}
              </div>

              <hr className="my-4 border-gray-100" />

              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Accesos rápidos */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Accesos rápidos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to="/tienda"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-brand/30 hover:bg-brand/5 transition-colors"
                >
                  <Package className="w-5 h-5 text-brand" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Tienda</p>
                    <p className="text-xs text-gray-500">Explora nuestros productos</p>
                  </div>
                </Link>

                {isStaff && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-brand/30 hover:bg-brand/5 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-brand" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Admin Panel</p>
                      <p className="text-xs text-gray-500">Gestionar productos y más</p>
                    </div>
                  </Link>
                )}

                <Link
                  to="/preguntas-frecuentes"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-brand/30 hover:bg-brand/5 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 text-brand" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Preguntas Frecuentes</p>
                    <p className="text-xs text-gray-500">Resuelve tus dudas</p>
                  </div>
                </Link>

                <Link
                  to="/contacto"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-brand/30 hover:bg-brand/5 transition-colors"
                >
                  <Mail className="w-5 h-5 text-brand" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Contacto</p>
                    <p className="text-xs text-gray-500">Soporte y atención</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Info de cuenta */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Información de cuenta</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Nombre</span>
                  <span className="text-sm font-medium text-gray-900">{user.nombre} {user.apellido}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Email</span>
                  <span className="text-sm font-medium text-gray-900">{user.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Rol</span>
                  <span className="text-sm font-medium text-gray-900">{rolLabels[user.rol] || user.rol}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">Nivel de acceso</span>
                  <span className="text-sm font-medium text-gray-900">{user.nivelAcceso}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500">Estado</span>
                  <span className={`text-sm font-medium ${user.activo ? 'text-green-600' : 'text-red-600'}`}>
                    {user.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
