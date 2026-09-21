import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from '../frontend/contexts/AuthContext';
import { CartProvider } from '../frontend/contexts/CartContext';
import Navbar from '../frontend/components/navbar/Navbar';
import Footer from '../frontend/components/ui/general/Footer';
import ScrollTopButton from '../frontend/components/ScrollTopButton';
import ScrollToTop from '../frontend/components/ScrollToTop';
import WelcomeBanner from '../frontend/components/WelcomeBanner';
import WhatsAppButton from '../frontend/components/WhatsAppButton';
import ProtectedRoute, { ADMIN_ROLES } from '../frontend/components/ProtectedRoute';
import LegacyRedirect from '../frontend/components/LegacyRedirect';
import CartDrawer from '../frontend/components/CartDrawer';
import AnniversaryTheme from '../frontend/components/aniversario/AnniversaryTheme';
import confetti from 'canvas-confetti';
import { CONFETTI_COLORS } from '../frontend/lib/aniversario';
import UPN_SlideBar from '../frontend/components/UPN_SlideBar';
import { buildRoutes } from './routes';
import PageLoader from './PageLoader';

// ==== Reservados: registro manual (fuera del auto-scan de src/routes.jsx) ====
const Home = lazy(() => import('../frontend/pages/Home'));
const LoginPage = lazy(() => import('../frontend/pages/LoginPage'));
const NotFoundPage = lazy(() => import('../frontend/pages/NotFoundPage'));
const StubPage = lazy(() => import('../frontend/pages/StubPage'));
const AdminPanel = lazy(() => import('../frontend/components/admin/AdminPanel'));
const Fase2Implementacion = lazy(() => import('../frontend/pages/Fase2Implementacion'));

// Rutas generadas automáticamente desde frontend/pages/*
const AUTO_ROUTES = buildRoutes();

function Layout() {
  const [communityOpen, setCommunityOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/libro-reclamaciones') return;

    const duration = 2500;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 90,
        spread: 70,
        origin: { x: Math.random(), y: 0 },
        colors: CONFETTI_COLORS,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    const burst = window.setTimeout(() => {
      confetti({ particleCount: 140, spread: 100, origin: { y: 0.6 }, colors: CONFETTI_COLORS });
    }, 500);

    return () => window.clearTimeout(burst);
  }, [location.pathname]);

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
      <UPN_SlideBar
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
      <LegacyRedirect />
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
            {AUTO_ROUTES.map(({ path, Component, protected: isProtected }) => (
              <Route
                key={path}
                path={path}
                element={
                  isProtected ? (
                    <ProtectedRoute>
                      <Component />
                    </ProtectedRoute>
                  ) : (
                    <Component />
                  )
                }
              />
            ))}
            <Route path="proximamente" element={<StubPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRoles={ADMIN_ROLES}>
              <Suspense fallback={<PageLoader />}>
                <AdminPanel />
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="/fase-2-implementacion" element={
            <ProtectedRoute requiredRoles={ADMIN_ROLES}>
              <Suspense fallback={<PageLoader />}>
                <Fase2Implementacion />
              </Suspense>
            </ProtectedRoute>
          } />
        </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
