import { CARRUSEL } from "../frontend/lib/images";
import {
  Zap, Gauge, BatteryCharging, Recycle,
  Accessibility, ArrowLeftRight, ShieldCheck,
  Truck, Wrench, HelmetSafety, Shield_,
  BadgeCheck, Award, Package, Target, Users, Briefcase, Heart, TicketPercent,
  Leaf
} from '../frontend/lib/icons';

///////////////////////////////////////////////////////////////////////////////
///               HOME                                                   ////
///////////////////////////////////////////////////////////////////////////////

// Datos del carrousel del home (1er bloque)
export const carrousel_slides = [
  {
    to: '/tienda',
    img: CARRUSEL[1],
  },
  {
    to: '/aniversario',
    img: CARRUSEL[2],
  },
  {
    to: '/tiendas',
    img: CARRUSEL[3],
  },
  {
    to: '/tiendas',
    img: CARRUSEL[0],
  },
  {
    title: 'Nueve años contigo',
    subtitle: 'Mes de locura: celebramos nuestro aniversario con descuentos y promociones por nuestro 9no aniversario.',
    cta: 'Acerca de los descuentos',
    to: '/aniversario',
    reactBanner: true,
  },
  {
    reactBanner: true,
    tiktokBanner: true,
  },
];

// Pilares del hero (Card: Calidad / Confianza / Garantía)
export const pillars = [
  {
    icon: BadgeCheck,
    title: 'Calidad',
    text: 'Conduce en un vehículo de calidad, con repuestos originales y soporte técnico certificado por la marca.',
  },
  {
    icon: ShieldCheck,
    title: 'Confianza',
    text: 'Miles de peruanos ya eligieron Green Line para su movilidad diaria.',
  },
  {
    icon: Award,
    title: 'Garantía',
    text: 'Respaldamos cada modelo con soporte técnico y repuestos originales.',
  },
];

// Datos de la pasarela de pagos, tanto para la versión corta como la larga
export const ecommerce_strip_data = [
  {
    name: 'MercadoLibre',
    img: 'https://guiaimpresion.com/wp-content/uploads/2022/12/4-1.png',
    href: 'https://www.mercadolibre.com.pe/tienda/greenline',
  },
  {
    name: 'Saga Falabella',
    img: 'https://images.falabella.com/v3/assets/bltf4ed0b9a176c126e/blt3729c261c3d95003/65d388aa849f3142f3e97dfb/android_chrome256.png',
    href: 'https://www.falabella.com.pe/falabella-pe/seller/GREENLINE%20PERU',
  },
  {
    name: 'Ripley',
    img: 'https://s3.amazonaws.com/media.greatplacetowork.com/peru/best-workplaces-for-millennials-in-peru/2022/tiendas-ripley/logo-200.png',
    href: 'https://simple.ripley.com.pe/tienda/greenline-group-6049709',
  },
  {
    name: 'Toquea',
    img: 'https://media.licdn.com/dms/image/v2/D4E0BAQHJv4QucESOeA/company-logo_200_200/B4EZ10E2qyGkAI-/0/1775768924397/toquea_logo?e=2147483647&v=beta&t=Ztb7zwvisG3I-FGLgTNvSSqSFW9zycqwTOjpKnKAgog',
    href: 'https://shop.toquea.com/',
  },
  {
    name: 'Agora Shop',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSS7-N8mGJvHi4szzU_kAifloGpnbttfoXKhxNFhDvjhub0O6hUt95rwk&s=10',
    href: 'https://app.agora.pe/',
  },
  {
    name: 'Coolbox',
    img: 'https://coolboxpe.vtexassets.com/assets/vtex/assets-builder/coolboxpe.store-theme/0.0.84/logo___6539742abaf840cb31bc3e646607adf5.svg',
    href: 'https://www.coolbox.pe/greenline',
  },
];

// Línea inclusiva M-CAR (sección tras el strip)
export const inclusive_vehicles = [
  {
    id: 'inc-1',
    title: 'M-CAR',
    desc: 'Vehículos eléctricos de diseño universal, creados desde fábrica para que cualquier persona se desplace con autonomía y comodidad.',
    icon: Accessibility,
  },
  {
    id: 'inc-2',
    title: 'Fácil de usar',
    desc: 'Transmisión automática, marcha en retroceso y conducción estable: pensadas para el uso diario sin complicaciones.',
    icon: ArrowLeftRight,
  },
  {
    id: 'inc-3',
    title: 'Seguridad y confianza',
    desc: 'Estructura resistente, estabilidad en ruta y soporte de GreenLine en cada etapa de tu compra.',
    icon: ShieldCheck,
  },
];

// Beneficios de comprar en Greenline
export const benefits = [
  {
    icon: HelmetSafety,
    title: 'Casco incluido',
    text: 'En la compra de tu vehículo eléctrico Greenline.',
  },
  {
    icon: Wrench,
    title: 'Conduce sin preocupaciones',
    text: 'Tu seguridad es nuestra prioridad. Disfruta de 2 chequeos integrales cubiertos al 100% durante tus primeros 6 meses en ruta.',
  },
  {
    icon: Truck,
    title: 'Delivery a todo el Perú',
    text: 'Enviamos tu unidad a la puerta de tu casa.',
  },
  {
    icon: Shield_,
    title: 'Garantía',
    text: 'Conduce con confianza. Cobertura específica para motor y batería, con plazos transparentes detallados en tu certificado oficial.',
  },
];

// Objeciones resueltas: ¿Por qué confiar en Green Line?
export const objeciones = [
  {
    icon: Package,
    title: 'Stock garantizado de repuestos',
    text: 'No te preocupes por repuestos. Tenemos inventario propio en almacén para cada modelo que vendemos.',
    highlight: 'Stock propio',
  },
  {
    icon: Wrench,
    title: 'Servicio técnico propio',
    text: 'Talleres propios en tiendas oficiales con técnicos capacitados por la marca.',
    highlight: 'Ocho tiendas propias',
  },
];

// Información de GreenTips, los consejos verdes que se muestran en la sección de tips del home
export const green_tips = [
  {
    icon: Zap,
    title: 'Carga de noche',
    text: 'Las tarifas eléctricas suelen ser más bajas de madrugada. Carga tu batería a esas horas y aligeras la red.',
  },
  {
    icon: Gauge,
    title: 'Presión de llantas',
    text: 'Revisa la presión una vez al mes: un neumático bien calibrado suma autonomía y alarga la vida de la cubierta.',
  },
  {
    icon: BatteryCharging,
    title: 'Cuida la batería',
    text: 'Evita descargarla al 0% o dejarla bajo el sol directo. Cargarla entre el 20% y el 80% alarga su vida útil.',
  },
  {
    icon: Recycle,
    title: 'Recicla y dispón',
    text: 'Lleva las baterías en desuso a un punto de acopio. GreenLine las gestiona de forma responsable.',
  },
];


///////////////////////////////////////////////////////////////////////////////
///               NOSOTROS (Us.jsx)                                      ////
///////////////////////////////////////////////////////////////////////////////

export const nosotros_values = [
  {
    icon: Target,
    title: 'Misión',
    desc: 'Impulsar la revolución sostenible en el Perú ofreciendo soluciones de movilidad eléctrica limpia, eficiente y accesible para todos.',
  },
  {
    icon: Leaf,
    title: 'Sostenibilidad',
    desc: 'Cada vehículo que vendemos reduce la huella de carbono. Creemos en un futuro donde la movilidad no dañe el medio ambiente.',
  },
  {
    icon: Users,
    title: 'Comunidad',
    desc: 'Construimos una comunidad activa de conductores eléctricos que comparten experiencias y promueven la movilidad sostenible.',
  },
  {
    icon: Award,
    title: 'Calidad',
    desc: 'Trabajamos con marcas líderes mundiales como Sunra, Zuboo y Huaihai para garantizar vehículos seguros y duraderos.',
  },
];

export const nosotros_milestones = [
  { 
    year: '2017', 
    text: 'Nace GreenLine en el Perú con la visión de transformar la movilidad.' 
  },
  { 
    year: '2021', 
    text: 'Abrimos nuestra primera tienda en Lima, en Lince, acercando la movilidad eléctrica a más personas.' 
  },
  { 
    year: '2023', 
    text: 'Expandimos nuestra visión a Sudamérica: GreenLine inicia operaciones en Chile.' 
  },
  { 
    year: '2025', 
    text: 'Impulsamos una nueva generación de movilidad junto a la comunidad universitaria de la UPN.' 
  },
  { 
    year: '2025', 
    text: 'Llevamos nuestra visión a nuevos espacios: participamos en la Cumbre Perú Sostenible y ExpoChina.' 
  },
  {
    year: '2025', 
    text: 'Iniciamos un convenio con el BBVA para ofrecer financiamiento a nuestros clientes, facilitando el acceso a la movilidad eléctrica.' 
  },
  { 
    year: '2026', 
    text: 'Seguimos creciendo: llegamos a Comas y Ate en Lima, y expandimos nuestra presencia hasta Huancayo.' 
  },
  {  
    year: '2026', 
    text: 'Somos invitados a una ponencia en la UPN donde hablamos acerca de la importancia de la movilidad eléctrica en el desarrollo sostenible.' 
  },
  { 
    year: '2026', 
    text: 'Celebramos el inicio de ciclo junto a la UPN Breña, conectando movilidad, innovación y comunidad con los estudiantes.' 
  },
];


///////////////////////////////////////////////////////////////////////////////
///               TRABAJA CON NOSOTROS (TrabajaConNosotros.jsx)          ////
///////////////////////////////////////////////////////////////////////////////

export const trabaja_beneficios = [
  {
    icon: Zap,
    titulo: 'Mobilitad eléctrica',
    descripcion: 'Forma parte del futuro de la transporte sostenible en Perú.',
  },
  {
    icon: Users,
    titulo: 'Equipo joven',
    descripcion: 'Trabaja con personas apasionadas, creativas y en constante crecimiento.',
  },
  {
    icon: Heart,
    titulo: 'Beneficios',
    descripcion: 'Descuentos en productos, capacitaciones y ambiente de trabajo flexible.',
  },
  {
    icon: Briefcase,
    titulo: 'Crecimiento',
    descripcion: 'Oportunidades reales de desarrollo profesional y ascenso.',
  },
];

export const trabaja_areas = [
  {
    titulo: 'Ventas y Atención al Cliente',
    descripcion: 'Asesores de tienda, soporte post-venta y atención al cliente.',
    icono: '🏪',
  },
  {
    titulo: 'Logística y Almacén',
    descripcion: 'Gestión de inventario, despacho y control de stock.',
    icono: '📦',
  },
  {
    titulo: 'Marketing y Contenido',
    descripcion: 'Redes sociales, contenido digital, diseño gráfico y community management.',
    icono: '📱',
  },
  {
    titulo: 'Tecnología e Ingeniería',
    descripcion: 'Desarrollo web, sistemas, ingeniería de producto y soporte técnico.',
    icono: '💻',
  },
  {
    titulo: 'Administración y Finanzas',
    descripcion: 'Contabilidad, tesorería, análisis financiero y control administrativo.',
    icono: '📊',
  },
];


///////////////////////////////////////////////////////////////////////////////
///               PREGUNTAS FRECUENTES (PreguntasFrecuentes.tsx)         ////
///////////////////////////////////////////////////////////////////////////////

export const faq_sections = [
  {
    id: 'motos-electricas',
    questions: [
      'cómo funciona una moto eléctrica',
      'diferencia entre las motos eléctricas y los de gasolina',
      'dónde puedo cargar los productos eléctricos',
      'cuánto tiempo tiene que recargar las baterías',
      'qué tipo de batería llevan las motos eléctricas y cuál es la vida útil',
      'cuántos caballos de fuerza equivale un watt',
    ],
  },
  {
    id: 'costos',
    questions: [
      'cuánto es el costo en consumo de energía',
      'es costoso mantener una moto eléctrica',
      'cuánto cuestan las baterías',
      'es costoso los repuestos de la moto eléctrica',
    ],
  },
  {
    id: 'mantenimiento',
    questions: [
      'qué tipo de mantenimiento o revisión necesitan las motos eléctricas',
      'cuál es la diferencia entre mantenimiento y revisión técnica',
    ],
  },
  {
    id: 'garantia',
    questions: [
      'a quién debo acudir en caso de requerir alguna asistencia técnica',
      'cuál es la garantía de greenline',
    ],
  },
];


///////////////////////////////////////////////////////////////////////////////
///               PRODUCT PAGE (ProductPage.jsx)                         ////
///////////////////////////////////////////////////////////////////////////////

export const product_tab_list = [
  { key: 'descripcion', label: 'Descripción' },
  { key: 'ficha', label: 'Ficha Técnica' },
  { key: 'info', label: 'Información Adicional' },
  { key: 'manuales', label: 'Manuales' },
  { key: 'legal', label: 'Legal' },
];

export const product_ficha_labels = {
  tipo_motor: 'Tipo de motor',
  potencia_motor: 'Potencia del motor',
  torque_maximo: 'Torque máximo',
  potencia_bateria: 'Potencia de batería',
  tipo_bateria: 'Tipo de batería',
  bateria_extraible: 'Batería extraíble',
  capacidad_bateria: 'Capacidad de batería',
  vida_util_bateria: 'Vida útil batería',
  tipo_toma_corriente: 'Tipo de toma de corriente',
  tiempo_carga_min: 'Tiempo de carga',
  velocidad_max_kmh: 'Velocidad máxima',
  autonomia_km: 'Autonomía',
  carga_maxima_kg: 'Carga máxima',
  largo_cm: 'Largo',
  ancho_cm: 'Ancho',
  alto_cm: 'Alto',
};


///////////////////////////////////////////////////////////////////////////////
///               LIBRO DE RECLAMACIONES (LibroReclamaciones.jsx)        ////
///////////////////////////////////////////////////////////////////////////////

export const libro_doc_types = ['DNI', 'Carné de extranjería', 'Pasaporte', 'RUC'];

export const libro_servicio_opciones = [
  '—Por favor, elige una opción—',
  'Atención al cliente',
  'Servicio técnico',
  'Distribución'
];

export const libro_tipo_opciones = [
  '—Por favor, elige una opción—',
  'Queja',
  'Reclamo',
];


///////////////////////////////////////////////////////////////////////////////
///               LOGIN PAGE (LoginPage.jsx)                             ////
///////////////////////////////////////////////////////////////////////////////

export const login_staff_roles = [
  'ADMIN', 'EDITORA_BLOG', 'DISTRIBUCION', 'GERENTE_TIENDA',
  'COLABORADOR_TIENDA', 'GERENTE_ALMACEN', 'COLABORADOR_ALMACEN', 'DESARROLLADOR_WEB',
];


///////////////////////////////////////////////////////////////////////////////
///               ANIVERSARIO (Aniversario.jsx)                          ////
///////////////////////////////////////////////////////////////////////////////

export const aniversario_perks = [
  { icon: TicketPercent, title: 'Descuentos de aniversario', desc: 'Durante todo setiembre tendremos el 50% de nuestro catálogo en descuento.' },
  { icon: ShieldCheck, title: 'Promociones y activaciones', desc: 'Durante todo el mes de Septiembre estaremos lanzando promociones, descuentos y activaciones. Atento a nuestras redes sociales.' },
];

export const aniversario_datos_form = [
  { id: 'nombre', label: 'Tu nombre:', type: 'text', placeholder: 'Nombre', required: true },
  { id: 'apellido', label: 'Tu apellido:', type: 'text', placeholder: 'Apellido', required: true },
  { id: 'telefono', label: 'Tu número de teléfono:', type: 'text', placeholder: 'Número de teléfono', required: true },
  { id: 'dni', label: 'Tu DNI:', type: 'text', placeholder: 'DNI', required: true },
  { id: 'email', label: 'Tu email:', type: 'email', placeholder: 'Email', required: true },
  { id: 'testimonio', label: 'Tu testimonio:', type: 'textarea', placeholder: 'Escribe tu testimonio aquí...', required: true }
];
