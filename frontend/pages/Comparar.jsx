import { useEffect, useState } from 'react';
import VersusComparator from '../components/VersusComparator';
import { fetchProductos } from '../lib/productos';

export default function Comparar() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProductos()
      .then(setProductos)
      .catch((err) =>
        console.error('Error cargando productos para comparar:', err)
      );
  }, []);

  return (
    <section className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
        Comparar vehículos
      </h1>
      <p className="text-gray-600 text-sm mb-6">
        Elige dos modelos y descubre cuál se ajusta mejor a lo que necesitas.
      </p>
      <VersusComparator productos={productos} />
    </section>
  );
}
