import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollTopButton from './components/ScrollTopButton';
import Home from './pages/Home';
import Shop from './pages/Shop';
import StubPage from './pages/StubPage';

function Layout() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollTopButton />
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
          <Route path="proximamente" element={<StubPage />} />
          <Route path="*" element={<StubPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
