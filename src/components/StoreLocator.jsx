import { useState } from 'react';
import { MapPin, Phone, Clock, ChevronDown } from 'lucide-react';

const stores = [
  {
    id: 1,
    name: 'Sede Lince',
    address: 'Av. Jose Leal 507, Lince',
    phone: '(01) 555-1234',
    hours: 'Lun - Sáb: 9:00 AM - 7:00 PM',
  },
  {
    id: 2,
    name: 'Sede Surco',
    address: 'Av. Surco 790, Santiago de Surco',
    phone: '(01) 555-5678',
    hours: 'Lun - Sáb: 9:00 AM - 7:00 PM',
  },
  {
    id: 3,
    name: 'Sede San Miguel',
    address: 'San Miguel, Lima',
    phone: '(01) 555-9012',
    hours: 'Lun - Sáb: 9:00 AM - 6:00 PM',
  },
  {
    id: 4,
    name: 'Sede La Molina',
    address: 'La Molina, Lima',
    phone: '(01) 555-3456',
    hours: 'Lun - Vie: 9:00 AM - 6:00 PM',
  },
  {
    id: 5,
    name: 'Sede Miraflores',
    address: 'Miraflores, Lima',
    phone: '(01) 555-7890',
    hours: 'Lun - Sáb: 10:00 AM - 8:00 PM',
  },
  {
    id: 6,
    name: 'Sede Comas',
    address: 'Comas, Lima',
    phone: '(01) 555-2345',
    hours: 'Lun - Vie: 9:00 AM - 5:00 PM',
  },
  {
    id: 7,
    name: 'Sede Huancayo',
    address: 'Huancayo, Junín',
    phone: '(064) 555-6789',
    hours: 'Lun - Vie: 9:00 AM - 5:00 PM',
  },
  {
    id: 8,
    name: 'Sede Ate',
    address: 'Ate, Lima',
    phone: '(01) 555-0123',
    hours: 'Lun - Sáb: 9:00 AM - 6:00 PM',
  },
];

export default function StoreLocator() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId(openId === id ? null : id);

  return (
    <section className="py-14 bg-gray-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Encuéntranos cerca de ti
          </h2>
          <p className="text-gray-600 mt-2">
            Visita nuestras sedes en todo el Perú y prueba nuestros vehículos.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggle(store.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{store.name}</p>
                    <p className="text-xs text-gray-500">{store.address}</p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    openId === store.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openId === store.id && (
                <div className="px-5 pb-4 border-t border-gray-50 pt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {store.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {store.hours}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {store.address}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
