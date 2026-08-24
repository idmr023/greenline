import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminProductos from './AdminProductos';
import AdminProductoForm from './AdminProductoForm';
import AdminColores from './AdminColores';
import { LayoutDashboard, Package, Palette, LogOut } from 'lucide-react';

const VIEWS = {
  DASHBOARD: 'dashboard',
  PRODUCTOS: 'productos',
  PRODUCTO_FORM: 'producto_form',
  COLORES: 'colores',
};

const NAV_ITEMS = [
  { key: VIEWS.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { key: VIEWS.PRODUCTOS, label: 'Productos', icon: Package },
  { key: VIEWS.COLORES, label: 'Colores', icon: Palette },
];

export default function AdminPanel() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState(VIEWS.DASHBOARD);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const navigateTo = (target, id = null) => {
    setEditingId(id);
    setView(target);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm">Cargando...</div>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onLogin={setSession} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">GL</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">GreenLine</p>
              <p className="text-[10px] text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = view === item.key || (item.key === VIEWS.PRODUCTOS && view === VIEWS.PRODUCTO_FORM);
            return (
              <button
                key={item.key}
                onClick={() => navigateTo(item.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-brand/10 text-brand font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {view === VIEWS.DASHBOARD && <AdminDashboard onNavigate={navigateTo} />}
        {view === VIEWS.PRODUCTOS && (
          <AdminProductos
            onEdit={(id) => navigateTo(VIEWS.PRODUCTO_FORM, id)}
            onNew={() => navigateTo(VIEWS.PRODUCTO_FORM)}
          />
        )}
        {view === VIEWS.PRODUCTO_FORM && (
          <AdminProductoForm
            productoId={editingId}
            onBack={() => navigateTo(VIEWS.PRODUCTOS)}
            onSaved={() => navigateTo(VIEWS.PRODUCTOS)}
          />
        )}
        {view === VIEWS.COLORES && <AdminColores />}
      </main>
    </div>
  );
}
