import { useState } from 'react';
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
import Home from '../frontend/pages/Home';
import Shop from '../frontend/pages/Shop';
import Nosotros from '../frontend/pages/Us';
import Tiendas from '../frontend/pages/Shops';
import Contactanos from '../frontend/pages/Contact';
import Comparar from '../frontend/pages/Comparar';
import StubPage from '../frontend/pages/StubPage';
import ProductPage from '../frontend/pages/ProductPage';
import PreguntasFrecuentes from '../frontend/pages/PreguntasFrecuentes';
import LoginPage from '../frontend/pages/LoginPage';
import PoliticaPrivacidad from '../frontend/pages/PoliticaPrivacidad';
import TrabajaConNosotros from '../frontend/pages/TrabajaConNosotros';
import ManualesDeUso from '../frontend/pages/ManualesDeUso';
import LibroReclamaciones from '../frontend/pages/LibroReclamaciones';
import NotFoundPage from '../frontend/pages/NotFoundPage';
import MiCuenta from '../frontend/pages/MiCuenta';
import Checkout from '../frontend/pages/Checkout';

import AdminPanel from '../frontend/components/admin/AdminPanel';
import CartDrawer from '../frontend/components/CartDrawer';
import NovedadesPage from '../frontend/pages/NovedadesPage';
import NovedadDetalle from '../frontend/pages/NovedadDetalle';

function Layout() {
  const [communityOpen, setCommunityOpen] = useState(false);

  return (
    <>
      <Navbar onCommunityOpen={() => setCommunityOpen(true)} />
      <main className="flex-1">
        <Outlet />
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
          <Route path="/login" element={<LoginPage />} />
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
              <AdminPanel />
            </ProtectedRoute>
          } />
        </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
