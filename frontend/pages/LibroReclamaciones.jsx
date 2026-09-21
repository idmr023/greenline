import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenCheck, MapPin, Phone, Mail, CheckCircle2, Search, X, Loader2 } from '../lib/icons';
import PageBanner from '../components/PageBanner';
import SEOHead, { breadcrumbSchema } from '../components/SEOHead';
import { CONTACT, BRAND } from '../lib/config';
import { fetchStores, fetchDistributors } from '../lib/locations';
import { fetchProductos } from '../lib/productos';
import { API_URL } from '../lib/api';
import COLOR_DOT_CLASS, { colorDotClassFor, colorDotStyle } from '../lib/colores';
import { libro_doc_types as DOC_TYPES, libro_servicio_opciones as SERVICIO_OPCIONES, libro_tipo_opciones as TIPO_OPCIONES } from '../../src/data_json.jsx';
import ubigeo from '../data/ubigeo.json';

const emptyForm = {
  nombre: '',
  apellidos: '',
  email: '',
  telefono: '',
  tipoDoc: 'DNI',
  numDoc: '',
  direccion: '',
  departamento: '',
  provincia: '',
  distrito: '',
  ciudad: '',
  servicio: '',
  producto: '',
  modeloEspecifico: '',
  descripcionServicio: '',
  precio: '',
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
  tienda: '',
  distribuidor: '',
  empresa: '',
};

export default function LibroReclamaciones() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [claimNumber, setClaimNumber] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [stores, setStores] = useState([]);
  const [techStores, setTechStores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [_loading, setLoading] = useState(true);
  const [distributors, setDistributors] = useState([]);
  const [buscarDistribuidor, setBuscarDistribuidor] = useState('');

  const provinciasDe = (depto) => Object.keys(ubigeo[depto] || {});
  const distritosDe = (depto, prov) => Object.keys(ubigeo[depto]?.[prov] || {});

  const elegirDepartamento = (e) => {
    const depto = e.target.value;
    setForm((f) => ({ ...f, departamento: depto, provincia: '', distrito: '', ciudad: '' }));
    setErrors((er) => ({ ...er, departamento: undefined, provincia: undefined, distrito: undefined, ciudad: undefined }));
  };

  const elegirProvincia = (e) => {
    const prov = e.target.value;
    setForm((f) => ({ ...f, provincia: prov, distrito: '', ciudad: prov }));
    setErrors((er) => ({ ...er, provincia: undefined, distrito: undefined, ciudad: undefined }));
  };

  const elegirDistrito = (e) => {
    const dist = e.target.value;
    setForm((f) => ({ ...f, distrito: dist }));
    setErrors((er) => ({ ...er, distrito: undefined }));
  };

  const elegirDistribuidor = (nombre) => {
    setForm((f) => ({ ...f, distribuidor: nombre }));
    setBuscarDistribuidor('');
  };

  const distribuidoresFiltrados = buscarDistribuidor.trim()
    ? distributors.filter((d) =>
        String(d.name || '').toLowerCase().includes(buscarDistribuidor.toLowerCase().trim())
      )
    : distributors;

  const etiquetaComprobante =
    form.servicio === 'Servicio técnico' ? 'Ficha de salida' : 'Orden de compra';
  const selectedProduct = productos.find((p) => p.nombre === form.producto);
  const availableColors = selectedProduct
    ? [...new Set(selectedProduct.imagenes.map((img) => img.color).filter(Boolean))]
    : [];

  useEffect(() => {
    Promise.all([fetchStores(), fetchDistributors(), fetchProductos()])
      .then(([storesData, distributorsData, prodsData]) => {
        setStores(storesData);
        setTechStores(storesData.filter((s) => s.technical_service));
        setDistributors(distributorsData);
        setProductos(prodsData);
      })
      .catch((err) => {
        console.error('Error al obtener datos:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const selectColor = (color) => {
    setForm((f) => ({ ...f, color }));
    setErrors((er) => ({ ...er, color: undefined }));
  };

  const required = [
    'nombre',
    'apellidos',
    'email',
    'numDoc',
    'direccion',
    'distrito',
    'departamento',
    'servicio',
    'producto',
    ...(form.producto === 'Otros' ? ['modeloEspecifico'] : []),
    'precio',
    'fechaCompra',
    'tipo',
    'detalle',
    ...(form.servicio === 'Distribución' ? ['distribuidor'] : ['tienda']),
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    const errs = {};
    required.forEach((k) => {
      if (!String(form[k] || '').trim()) errs[k] = 'Campo obligatorio';
    });
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const fechaHoy = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date());
    const productoFinal = form.producto === 'Otros' ? form.modeloEspecifico : form.producto;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/reclamaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha: fechaHoy,
          nombre: form.nombre,
          apellidos: form.apellidos,
          email: form.email,
          telefono: form.telefono,
          tipoDoc: form.tipoDoc,
          numDoc: form.numDoc,
          direccion: form.direccion,
          distrito: form.distrito,
          ciudad: form.ciudad,
          departamento: form.departamento,
          servicio: form.servicio,
          producto: productoFinal,
          descripcionServicio: form.descripcionServicio,
          tienda: form.servicio === 'Distribución' ? form.distribuidor : form.tienda,
          distribuidor: form.distribuidor,
          precio: form.precio,
          fechaCompra: form.fechaCompra,
          modelo: form.modelo,
          color: form.color,
          numeroMotor: form.numeroMotor,
          placa: form.placa,
          tipoQueja: form.tipo,
          detalle: form.detalle,
          pedido: form.pedido,
          observaciones: form.observaciones,
          empresa: form.empresa,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Error al guardar el reclamo');
      }

      const data = await res.json();
      setClaimNumber(data.numeroReclamo);
      setSent(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (k) =>
    `w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-brand focus:border-brand ${
      errors[k]
        ? 'border-red-400 bg-red-50'
        : 'border-gray-300 bg-white'
    }`;

  return (
    <div>
      <SEOHead
        title="Libro de Reclamaciones"
        description="Presenta tu queja o reclamo en el Libro de Reclamaciones de Green Line conforme al Código de Protección y Defensa del Consumidor."
        url="/libro-reclamaciones"
        keywords={['libro de reclamaciones', 'quejas', 'reclamos', 'Green Line']}
        jsonLd={[breadcrumbSchema([
          { name: 'Inicio', url: '/' },
          { name: 'Libro de Reclamaciones', url: '/libro-reclamaciones' },
        ])]}
      />
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
              <p className="text-justify">
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
            {/* Honeypot: campo oculto que los bots rellenan automáticamente */}
            <input
              type="text"
              name="empresa"
              value={form.empresa}
              onChange={set('empresa')}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
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
                <Field label="Tu correo electrónico" required err={errors.email}>
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
                <Field label="Departamento" required err={errors.departamento}>
                  <select className={inputCls('departamento')} value={form.departamento} onChange={elegirDepartamento}>
                    <option value="">—Selecciona un departamento—</option>
                    {Object.keys(ubigeo).sort((a, b) => a.localeCompare(b, 'es')).map((dep) => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Provincia" err={errors.provincia}>
                  <select className={inputCls('provincia')} value={form.provincia} onChange={elegirProvincia} disabled={!form.departamento}>
                    <option value="">—Selecciona una provincia—</option>
                    {provinciasDe(form.departamento).sort((a, b) => a.localeCompare(b, 'es')).map((prov) => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Distrito" required err={errors.distrito}>
                  <select className={inputCls('distrito')} value={form.distrito} onChange={elegirDistrito} disabled={!form.provincia}>
                    <option value="">—Selecciona un distrito—</option>
                    {distritosDe(form.departamento, form.provincia).sort((a, b) => a.localeCompare(b, 'es')).map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
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
                <Field label="Tipo de Servicio" required err={errors.servicio}>
                  <select className={inputCls('servicio')} value={form.servicio} onChange={set('servicio')}>
                    {SERVICIO_OPCIONES.map((o) => (
                      <option key={o} value={o === SERVICIO_OPCIONES[0] ? '' : o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Producto" required err={errors.producto}>
                  <select className={inputCls('producto')} value={form.producto} onChange={set('producto')}>
                    <option value="">—Selecciona un producto—</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.nombre}>{p.nombre}</option>
                    ))}
                    <option value="Otros">Otros</option>
                  </select>
                </Field>

                {form.producto === 'Otros' && (
                  <Field label="Especificar modelo exacto" required err={errors.modeloEspecifico}>
                    <input className={inputCls('modeloEspecifico')} placeholder="Escribe el modelo exacto" value={form.modeloEspecifico} onChange={set('modeloEspecifico')} />
                  </Field>
                )}

                {form.servicio === "Servicio técnico" || form.servicio?.startsWith("Atención al cliente") ? (
                    <Field label="Tienda" required err={errors.tienda}>
                      <select 
                        className={inputCls('tienda')} 
                        value={form.tienda} 
                        onChange={set('tienda')}
                      >
                        <option value="">Selecciona una tienda...</option>
                        {(form.servicio === 'Servicio técnico' ? techStores : stores).map((store) => (
                          <option key={store.id} value={store.name}>
                            {store.name} {store.district ? `(${store.district})` : ''}
                          </option>
                        ))}
                      </select>
                    </Field>
                ) : 
                  form.servicio === 'Distribución' && (
                    <Field label="Buscar Distribuidor" required err={errors.distribuidor}>
                      {form.distribuidor ? (
                        <div className="flex items-center justify-between rounded-lg border border-brand/30 bg-brand/5 px-3 py-2">
                          <span className="text-sm text-gray-800 font-medium">{form.distribuidor}</span>
                          <button
                            type="button"
                            onClick={() => { setForm((f) => ({ ...f, distribuidor: '' })); setBuscarDistribuidor(''); }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Quitar distribuidor"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            className={inputCls('distribuidor')}
                            placeholder="Busca tu distribuidor..."
                            value={buscarDistribuidor}
                            onChange={(e) => setBuscarDistribuidor(e.target.value)}
                          />
                          {buscarDistribuidor.trim() && (
                            <ul className="absolute z-20 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                              {distribuidoresFiltrados.length === 0 ? (
                                <li className="px-3 py-2.5 text-xs text-gray-400">No se encontraron distribuidores</li>
                              ) : (
                                distribuidoresFiltrados.map((distributor) => (
                                  <li key={distributor.id}>
                                    <button
                                      type="button"
                                      onClick={() => elegirDistribuidor(distributor.name)}
                                      className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-brand/5 transition-colors"
                                    >
                                      {distributor.name}
                                    </button>
                                  </li>
                                ))
                              )}
                            </ul>
                          )}
                        </div>
                      )}
                    </Field>
                  )
                }

                <Field label="Precio del producto" required err={errors.precio}>
                  <input type="number" step="0.01" min="0" className={inputCls('precio')} placeholder="00.00" value={form.precio} onChange={set('precio')} />
                </Field>
                <Field label="Fecha de compra" required err={errors.fechaCompra}>
                  <input type="date" className={inputCls('fechaCompra')} value={form.fechaCompra} onChange={set('fechaCompra')} />
                </Field>
                <Field label="Color">
                  {availableColors.length > 0 ? (
                    // Tiene colores → muestra los puntitos
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {Object.entries(COLOR_DOT_CLASS)
                        .filter(([nombre]) => availableColors.some((c) => c.toLowerCase() === nombre.toLowerCase()))
                        .map(([nombre]) => {
                          const selected = form.color === nombre;
                          return (
                            <button
                              type="button"
                              key={nombre}
                              title={nombre}
                              aria-label={`Color ${nombre}`}
                              aria-pressed={selected}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => selectColor(nombre)}
                              style={colorDotStyle(selectedProduct?.colores_detalle, nombre)}
                              className={`w-5 h-5 rounded-full border border-gray-200 ${colorDotClassFor(nombre)} transition ${
                                selected ? 'ring-2 ring-brand ring-offset-1' : 'hover:scale-110'
                              }`}
                            />
                          );
                        })}
                    </div>
                  ) : (
                    // No tiene colores → muestra input de texto
                    <input
                      className={inputCls('color')}
                      placeholder="Color (o elige un punto)"
                      value={form.color}
                      onChange={set('color')}
                    />
                  )}
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
                    {TIPO_OPCIONES.map((o) => (
                      <option key={o} value={o === TIPO_OPCIONES[0] ? '' : o}>{o}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Detalle" required err={errors.detalle}>
                  <textarea className={inputCls('detalle')} rows={4} maxLength={7000} placeholder="Describe la queja o reclamo" value={form.detalle} onChange={set('detalle')} />
                  <div className="mt-1 text-right text-[11px] text-gray-400">
                    {form.detalle.length} / 7000
                  </div>
                </Field>
              </div>
              <div className="mt-4">
                <Field label={etiquetaComprobante}>
                  <input className={inputCls('pedido')} maxLength={200} placeholder={`N° de ${etiquetaComprobante.toLowerCase()} (opcional)`} value={form.pedido} onChange={set('pedido')} />
                </Field>
              </div>
              <p className='p-2 text-xs'>Los campos marcados como obligatorios (*) son necesarios para procesar su solicitud y contactarnos.</p>
            </section>

            {submitError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            <div className="flex items-center justify-end gap-4 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-brand text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Enviando...
                  </>
                ) : (
                  'Enviar reclamación'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
            <CheckCircle2 className="w-14 h-14 text-brand mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Solicitud registrada</h2>
            {claimNumber && (
              <p className="text-lg font-bold text-brand mb-3">
                N° de Reclamo: {claimNumber}
              </p>
            )}
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Gracias por contactarnos. Recibirás la respuesta a tu reclamo al medio de contacto que hayas indicado.
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
