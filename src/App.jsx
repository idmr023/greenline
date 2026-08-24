import { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollTopButton from './components/ScrollTopButton';
import CommunityDrawer from './components/CommunityDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Nosotros from './pages/Us';
import Tiendas from './pages/Shops';
import Contactanos from './pages/Contact';
import StubPage from './pages/StubPage';
import ProductPage from './pages/ProductPage';
import AdminPanel from './components/admin/AdminPanel';

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
      <CommunityDrawer
        open={communityOpen}
        onClose={() => setCommunityOpen(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tienda" element={<Shop />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="tiendas" element={<Tiendas />} />
          <Route path="contacto" element={<Contactanos />} />
          <Route path="producto/:slug" element={<ProductPage />} />
          <Route path="proximamente" element={<StubPage />} />
          <Route path="*" element={<StubPage />} />
        </Route>
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
