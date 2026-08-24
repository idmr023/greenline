import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import PageBanner from '../components/PageBanner';

const stores = [
  {
    id: 1,
    name: 'Green Line – Sede Principal',
    address: 'Av. La Marina 2890, San Martín de Porres, Lima',
    phone: '(01) 555 1234',
    hours: 'Lun – Sáb: 9:00 a.m. – 7:00 p.m.',
    mapUrl: '#',
  },
  {
    id: 2,
    name: 'Green Line – Surco',
    address: 'Av. Benavides 4550, Santiago de Surco, Lima',
    phone: '(01) 555 5678',
    hours: 'Lun – Sáb: 10:00 a.m. – 6:00 p.m.',
    mapUrl: '#',
  },
  {
    id: 3,
    name: 'Green Line – Miraflores',
    address: 'Av. La Paz 680, Miraflores, Lima',
    phone: '(01) 555 9012',
    hours: 'Lun – Sáb: 10:00 a.m. – 7:00 p.m.',
    mapUrl: '#',
  },
  {
    id: 4,
    name: 'Green Line – Arequipa',
    address: 'Av. Dolores 1101, Cayma, Arequipa',
    phone: '(054) 555 3456',
    hours: 'Lun – Sáb: 9:00 a.m. – 6:00 p.m.',
    mapUrl: '#',
  },
  {
    id: 5,
    name: 'Green Line – Trujillo',
    address: 'Av. Mansiche 1201, Trujillo, La Libertad',
    phone: '(044) 555 7890',
    hours: 'Lun – Sáb: 9:00 a.m. – 6:00 p.m.',
    mapUrl: '#',
  },
  {
    id: 6,
    name: 'Green Line – Piura',
    address: 'Av. Piura 520, Castilla, Piura',
    phone: '(073) 555 2345',
    hours: 'Lun – Sáb: 9:00 a.m. – 5:00 p.m.',
    mapUrl: '#',
  },
  {
    id: 7,
    name: 'Green Line – Cusco',
    address: 'Av. El Sol 801, Wanchaq, Cusco',
    phone: '(084) 555 6789',
    hours: 'Lun – Sáb: 9:00 a.m. – 6:00 p.m.',
    mapUrl: '#',
  },
  {
    id: 8,
    name: 'Green Line – Chiclayo',
    address: 'Av. Balta 1401, Chiclayo, Lambayeque',
    phone: '(074) 555 0123',
    hours: 'Lun – Sáb: 9:00 a.m. – 6:00 p.m.',
    mapUrl: '#',
  },
];

export default function Tiendas() {
  return (
    <div>
      <PageBanner
        title="Nuestras Tiendas"
        subtitle="Encuentra tu sucursal Green Line más cercana"
        bgClass="bg-gradient-to-br from-bbva to-bbva-dark"
      />

      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-gray-900 mb-3 text-sm">{store.name}</h3>

              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-brand shrink-0" />
                  <span>{store.address}</span>
                </p>
                {store.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand shrink-0" />
                    <span>{store.phone}</span>
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand shrink-0" />
                  <span>{store.hours}</span>
                </p>
              </div>

              <a
                href={store.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block text-center text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
              >
                Ver en mapa →
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            ¿No encuentras tu tienda?
          </h2>
          <p className="text-gray-600 mb-5">
            Contáctanos y te ayudaremos a encontrar la sucursal más cercana o a
            coordinar una prueba de manejo.
          </p>
          <a
            href="mailto:contacto@greenline.com.pe"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors"
          >
            <Mail className="w-4 h-4" />
            Escribirnos
          </a>
        </div>
      </section>
    </div>
  );
}
