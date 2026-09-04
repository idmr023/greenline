import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from '../frontend/contexts/AuthContext';
import { CartProvider } from '../frontend/contexts/CartContext';
import Navbar from '../frontend/components/Navbar';
import Footer from '../frontend/components/Footer';
import ScrollTopButton from '../frontend/components/ScrollTopButton';
import ScrollToTop from '../frontend/components/ScrollToTop';
import WelcomeBanner from '../frontend/components/WelcomeBanner';
import WhatsAppButton from '../frontend/components/WhatsAppButton';
import CommunityDrawer from '../frontend/components/CommunityDrawer';
import ProtectedRoute, { ADMIN_ROLES } from '../frontend/components/ProtectedRoute';
import CartDrawer from '../frontend/components/CartDrawer';
import AnniversaryTheme from '../frontend/components/AnniversaryTheme';

const Home = lazy(() => import('../frontend/pages/Home'));
const Shop = lazy(() => import('../frontend/pages/Shop'));
const Nosotros = lazy(() => import('../frontend/pages/Us'));
const Tiendas = lazy(() => import('../frontend/pages/Shops'));
const Contactanos = lazy(() => import('../frontend/pages/Contact'));
const Comparar = lazy(() => import('../frontend/pages/Comparar'));
const StubPage = lazy(() => import('../frontend/pages/StubPage'));
const ProductPage = lazy(() => import('../frontend/pages/ProductPage'));
const PreguntasFrecuentes = lazy(() => import('../frontend/pages/PreguntasFrecuentes'));
const LoginPage = lazy(() => import('../frontend/pages/LoginPage'));
const PoliticaPrivacidad = lazy(() => import('../frontend/pages/PoliticaPrivacidad'));
const TrabajaConNosotros = lazy(() => import('../frontend/pages/TrabajaConNosotros'));
const ManualesDeUso = lazy(() => import('../frontend/pages/ManualesDeUso'));
const LibroReclamaciones = lazy(() => import('../frontend/pages/LibroReclamaciones'));
const NotFoundPage = lazy(() => import('../frontend/pages/NotFoundPage'));
const MiCuenta = lazy(() => import('../frontend/pages/MiCuenta'));
const Checkout = lazy(() => import('../frontend/pages/Checkout'));
const AdminPanel = lazy(() => import('../frontend/components/admin/AdminPanel'));
const NovedadesPage = lazy(() => import('../frontend/pages/NovedadesPage'));
const NovedadDetalle = lazy(() => import('../frontend/pages/NovedadDetalle'));
const Aniversario = lazy(() => import('../frontend/pages/Aniversario'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Cargando...</p>
      </div>
    </div>
  );
}

function Layout() {
  const [communityOpen, setCommunityOpen] = useState(false);

  return (
    <>
      <Navbar onCommunityOpen={() => setCommunityOpen(true)} />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ScrollTopButton />
      <WelcomeBanner />
      <WhatsAppButton />
      <CommunityDrawer
        open={communityOpen}
        onClose={() => setCommunityOpen(false)}
      />
      <CartDrawer />
      <AnniversaryTheme />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <Routes>
          <Route path="/login" element={
            <Suspense fallback={<PageLoader />}>
              <LoginPage />
            </Suspense>
          } />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="tienda" element={<Shop />} />
            <Route path="nosotros" element={<Nosotros />} />
            <Route path="tiendas" element={<Tiendas />} />
            <Route path="contacto" element={<Contactanos />} />
            <Route path="comparar" element={<Comparar />} />
            <Route path="preguntas-frecuentes" element={<PreguntasFrecuentes />} />
            <Route path="blog" element={<NovedadesPage />} />
            <Route path="novedades/:slug" element={<NovedadDetalle />} />
            <Route path="producto/:slug" element={<ProductPage />} />
            <Route path="proximamente" element={<StubPage />} />
            <Route path="politica-privacidad" element={<PoliticaPrivacidad />} />
            <Route path="trabaja-con-nosotros" element={<TrabajaConNosotros />} />
            <Route path="aniversario" element={<Aniversario />} />
            <Route path="manuales-de-uso" element={<ManualesDeUso />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="libro-de-reclamaciones" element={<LibroReclamaciones />} />
            <Route path="mi-cuenta" element={
              <ProtectedRoute>
                <MiCuenta />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/admin" element={
            <ProtectedRoute requiredRoles={ADMIN_ROLES}>
              <Suspense fallback={<PageLoader />}>
                <AdminPanel />
              </Suspense>
            </ProtectedRoute>
          } />
        </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
