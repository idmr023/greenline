import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenCheck,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  FileSignature,
} from 'lucide-react';
import PageBanner from '../components/PageBanner';
import { CONTACT, BRAND } from '../lib/config';

const DOC_TYPES = ['DNI', 'Carné de extranjería', 'Pasaporte', 'RUC'];
const SERVICIO_OPCIONES = [
  '—Por favor, elige una opción—',
  'VMP / Bicimoto eléctrica',
  'Moto eléctrica',
  'Trimoto eléctrica',
  'Carguero eléctrico',
  'Servicio técnico / repuestos',
  'Otro',
];
const TIPO_OPCIONES = [
  '—Por favor, elige una opción—',
  'Queja',
  'Reclamo',
];

const emptyForm = {
  nombre: '',
  apellidos: '',
  email: '',
  telefono: '',
  tipoDoc: 'DNI',
  numDoc: '',
  direccion: '',
  distrito: '',
  ciudad: '',
  departamento: '',
  producto: '',
  descripcionServicio: '',
  monto: '',
  lugarCompra: '',
  fechaCompra: '',
  modelo: '',
  color: '',
  vin: '',
  numeroMotor: '',
  placa: '',
  tipo: '',
  detalle: '',
  pedido: '',
  observaciones: '',
};

export default function LibroReclamaciones() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const required = [
    'nombre',
    'apellidos',
    'telefono',
    'numDoc',
    'direccion',
    'distrito',
    'ciudad',
    'departamento',
    'producto',
    'descripcionServicio',
    'monto',
    'lugarCompra',
    'fechaCompra',
    'numeroMotor',
    'tipo',
    'detalle',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    required.forEach((k) => {
      if (!String(form[k] || '').trim()) errs[k] = 'Campo obligatorio';
    });
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSent(true);
  };

  const inputCls = (k) =>
    `w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-brand focus:border-brand ${
      errors[k]
        ? 'border-red-400 bg-red-50'
        : 'border-gray-300 bg-white'
    }`;

  return (
    <div>
      <PageBanner
        title="Libro de Reclamaciones"
        subtitle="Presenta tus reclamos y quejas de acuerdo al Código de Protección y Defensa del Consumidor"
        bgClass="bg-gradient-to-br from-brand to-brand-dark"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Marquilla */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <BookOpenCheck className="w-6 h-6 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Libro de Reclamaciones del consumidor</p>
              <p>
                De conformidad con la Ley N° 29571, Código de Protección y Defensa del
                Consumidor, y su Reglamento aprobado por Decreto Supremo N° 011-2011-PCM,
                {BRAND.name} pone a disposición de sus clientes el presente Libro de
                Reclamaciones para la atención de quejas y reclamos presentados de forma
                presencial, telefónica, por escrito o por correo electrónico, así como a
                través de este espacio en su sitio web.
              </p>
            </div>
          </div>
        </div>

        {/* Datos del establecimiento */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Datos del proveedor</h2>
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            {[
              { icon: MapPin, label: 'Razón social', value: `${BRAND.legalName} — ${CONTACT.city}` },
              { icon: MapPin, label: 'Dirección', value: CONTACT.address },
              { icon: Phone, label: 'Teléfono', value: CONTACT.phoneDisplay },
              { icon: Mail, label: 'Correo', value: CONTACT.email },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 px-5 py-3 border-b border-gray-50 last:border-0">
                <Icon className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                  <p className="text-sm text-gray-800">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fecha */}
        <div className="mb-8 text-right">
          <p className="text-sm text-gray-500">
            Fecha: {new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date())}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} noValidate className="space-y-10">
            {/* Sección 1 */}
            <section className="bg-white border border-gray-100 rounded-xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand/10 text-brand text-sm font-bold flex items-center justify-center">1</span>
                Identificación del consumidor reclamante
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Tu Nombre" required err={errors.nombre}>
                  <input className={inputCls('nombre')} placeholder="Tu nombre" value={form.nombre} onChange={set('nombre')} />
                </Field>
                <Field label="Tus Apellidos" required err={errors.apellidos}>
                  <input className={inputCls('apellidos')} placeholder="Tus apellidos" value={form.apellidos} onChange={set('apellidos')} />
                </Field>
                <Field label="Tu correo electrónico">
                  <input type="email" className={inputCls('email')} placeholder="nombre@email.com" value={form.email} onChange={set('email')} />
                </Field>
                <Field label="Teléfono" required err={errors.telefono}>
                  <input className={inputCls('telefono')} placeholder="999 999 999" value={form.telefono} onChange={set('telefono')} />
                </Field>
                <Field label="Tipo documento">
                  <select className={inputCls('tipoDoc')} value={form.tipoDoc} onChange={set('tipoDoc')}>
                    {DOC_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Número de documento" required err={errors.numDoc}>
                  <input className={inputCls('numDoc')} placeholder="12345678" value={form.numDoc} onChange={set('numDoc')} />
                </Field>
                <Field label="Dirección" required err={errors.direccion}>
                  <input className={inputCls('direccion')} placeholder="Tu dirección" value={form.direccion} onChange={set('direccion')} />
                </Field>
                <Field label="Distrito" required err={errors.distrito}>
                  <input className={inputCls('distrito')} placeholder="Tu distrito" value={form.distrito} onChange={set('distrito')} />
                </Field>
                <Field label="Ciudad" required err={errors.ciudad}>
                  <input className={inputCls('ciudad')} placeholder="Tu ciudad" value={form.ciudad} onChange={set('ciudad')} />
                </Field>
                <Field label="Departamento" required err={errors.departamento}>
                  <input className={inputCls('departamento')} placeholder="Tu departamento" value={form.departamento} onChange={set('departamento')} />
                </Field>
              </div>
            </section>

            {/* Sección 2 */}
            <section className="bg-white border border-gray-100 rounded-xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand/10 text-brand text-sm font-bold flex items-center justify-center">2</span>
                Identificación del bien contratado
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Producto / Servicio" required err={errors.producto}>
                  <select className={inputCls('producto')} value={form.producto} onChange={set('producto')}>
                    {SERVICIO_OPCIONES.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Descripción del servicio" required err={errors.descripcionServicio}>
                  <input className={inputCls('descripcionServicio')} placeholder="¿Qué Producto o servicio adquiriste?" value={form.descripcionServicio} onChange={set('descripcionServicio')} />
                </Field>
                <Field label="Monto del servicio" required err={errors.monto}>
                  <input type="number" step="0.01" min="0" className={inputCls('monto')} placeholder="00.00" value={form.monto} onChange={set('monto')} />
                </Field>
                <Field label="Lugar de compra" required err={errors.lugarCompra}>
                  <input className={inputCls('lugarCompra')} placeholder="Lugar de compra" value={form.lugarCompra} onChange={set('lugarCompra')} />
                </Field>
                <Field label="Fecha de compra" required err={errors.fechaCompra}>
                  <input type="date" className={inputCls('fechaCompra')} value={form.fechaCompra} onChange={set('fechaCompra')} />
                </Field>
                <Field label="Modelo">
                  <input className={inputCls('modelo')} placeholder="Modelo" value={form.modelo} onChange={set('modelo')} />
                </Field>
                <Field label="Color">
                  <input className={inputCls('color')} placeholder="Color" value={form.color} onChange={set('color')} />
                </Field>
                <Field label="Número de Vin">
                  <input className={inputCls('vin')} placeholder="Número de Vin" value={form.vin} onChange={set('vin')} />
                </Field>
                <Field label="Número de Motor" required err={errors.numeroMotor}>
                  <input className={inputCls('numeroMotor')} placeholder="Número de Motor" value={form.numeroMotor} onChange={set('numeroMotor')} />
                </Field>
                <Field label="Placa">
                  <input className={inputCls('placa')} placeholder="Placa" value={form.placa} onChange={set('placa')} />
                </Field>
              </div>
            </section>

            {/* Sección 3 */}
            <section className="bg-white border border-gray-100 rounded-xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand/10 text-brand text-sm font-bold flex items-center justify-center">3</span>
                Detalle de la reclamación y pedido del consumidor
              </h2>
              <div className="rounded-lg bg-gray-50 px-4 py-3 mb-5">
                <p className="text-xs text-gray-600">
                  <strong>Queja:</strong> Expresión de insatisfacción por la atención recibida, pero que no guarda
                  relación directa con el producto o servicio adquirido.
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  <strong>Reclamo:</strong> Insatisfacción porque el producto o servicio que se adquirió no se prestó a
                  las condiciones esperadas.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Queja / Reclamo" required err={errors.tipo}>
                  <select className={inputCls('tipo')} value={form.tipo} onChange={set('tipo')}>
                    {TIPO_OPCIONES.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Detalle" required err={errors.detalle}>
                  <textarea className={inputCls('detalle')} rows={4} placeholder="Describe la queja o reclamo" value={form.detalle} onChange={set('detalle')} />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Pedido">
                  <input className={inputCls('pedido')} placeholder="Pedido" value={form.pedido} onChange={set('pedido')} />
                </Field>
              </div>
            </section>

            {/* Sección 4 */}
            <section className="bg-white border border-gray-100 rounded-xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand/10 text-brand text-sm font-bold flex items-center justify-center">4</span>
                Observaciones y acciones adoptadas por el proveedor
              </h2>
              <Field label="Detalles / Observaciones">
                <textarea className={inputCls('observaciones')} rows={3} placeholder="Observaciones" value={form.observaciones} onChange={set('observaciones')} />
              </Field>
              <p className="text-xs text-gray-500 mt-2">(Los campos con * son necesarios)</p>
            </section>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg transition-colors"
              >
                <FileSignature className="w-5 h-5" />
                Enviar reclamación
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
            <CheckCircle2 className="w-14 h-14 text-brand mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Solicitud registrada</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Gracias por contactarnos. Recibirás la respuesta a tu reclamo en un plazo máximo de
              30 días calendario, al medio de contacto que hayas indicado.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-brand text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-brand-dark transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, required, err, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
      {err && <span className="block text-xs text-red-500 mt-1">{err}</span>}
    </label>
  );
}
