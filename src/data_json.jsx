import { CARRUSEL, SOCIAL_MEDIA_GRID_IMAGENES } from "../frontend/lib/images";
import {
  Zap,
  Accessibility, ArrowLeftRight, ShieldCheck,
  Truck, Wrench, HelmetSafety, Shield_,
  BadgeCheck, Award, Package, Target, Users, Briefcase, Heart, TicketPercent,
  Leaf,
  Lightbulb,
  Gauge,
  BatteryCharging
} from '../frontend/lib/icons';

///////////////////////////////////////////////////////////////////////////////
///               HOME                                                   ////
///////////////////////////////////////////////////////////////////////////////

// Datos del carrousel del home (1er bloque)
export const carrousel_slides = [
  {
    to: '/tiendas',
    img: CARRUSEL[0],
  }, 
  {
    to: '/tienda',
    img: CARRUSEL[1],
  },
  {
    to: 'https://www.tiktok.com/@greenline_peru',
    img: CARRUSEL[2],
  },
  {
    to: '/tiendas',
    img: CARRUSEL[3],
  },
  {
    to: 'https://docs.google.com/forms/d/e/1FAIpQLSdoHJmTM4v8FBXJmmCH9r5gf9AhYmGX4RLEcWe-qv78M59gzA/viewform',
    img: CARRUSEL[4],
  },
  {
    to: '#',
    img: CARRUSEL[5],
  },
];

// Pilares del hero (Card: Calidad / Confianza / Garantía)
export const pillars = [
  { icon: BadgeCheck, title: 'Calidad', text: 'Conduce en un vehículo de calidad, con repuestos originales y soporte técnico certificado por la marca.', },
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
  {
    name: 'UPN',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2rwE7vFcKtGYODXjpAzQtBclnf3sUV_6xFGCOsMfxMobziLUJKGb6qGM&s=10',
    href: 'https://www.upn.edu.pe/vida-universitaria/promociones-con-id-card/greenline',
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
  {
    icon: Lightbulb,
    title: 'GreenTips: consejos de movilidad eléctrica',
    text: 'Descubre consejos prácticos para cargar tu vehículo en los horarios más económicos, optimizar su autonomía, cuidar las llantas y el motor, prolongar la vida útil de la batería y saber cómo disponer correctamente de ella cuando llegue al final de su ciclo.',
    highlight: 'Tips de movilidad',
    haveButton: true,
    link: "/tips",
  },
  {
    icon: ShieldCheck,
    title: 'Diseño universal, libertad sin límites',
    text: 'Las M-CAR son vehículos eléctricos creados con diseño universal: pensados desde fábrica para que personas con capacidades diversas se desplacen conautonomía, comodidad y total acceso igualitario..',
    highlight: 'Movilidad para todos',
    haveButton: true,
    link: "/tienda?categoria=Cuatrimotos",
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
///               SOCIAL_CARD (Shop.tsx)         ////
///////////////////////////////////////////////////////////////////////////////

export const TIKTOK_LINK = 'https://www.tiktok.com/@greenline_peru';

export const SOCIAL_GRID_ITEMS = [
  {
    id: 'fl2_tiktok',
    modelo: 'FL2',
    image: SOCIAL_MEDIA_GRID_IMAGENES[0],
    network: 'TikTok',
    caption: 'FL2 en acción',
    href: TIKTOK_LINK + '/7623553103710735636',
  },
  {
    id: 't6_tiktok',
    modelo: 'T6',
    image: SOCIAL_MEDIA_GRID_IMAGENES[2],
    network: 'TikTok',
    caption: 'T6 en acción',
    href: TIKTOK_LINK + '/7652131725300043016',
  },
  {
    id: 'sr_tiktok',
    modelo: 'SR',
    image: SOCIAL_MEDIA_GRID_IMAGENES[3],
    network: 'TikTok',
    caption: 'SR en acción',
    href: TIKTOK_LINK + '/7607596869321002260',
  },
  {
    id: 'mx6_tiktok',
    modelo: 'MX6',
    image: SOCIAL_MEDIA_GRID_IMAGENES[4],
    network: 'TikTok',
    caption: 'MX6 en acción',
    href: TIKTOK_LINK + '/7652870935887858965',
  },
  {
    id: 'tm9_tiktok',
    modelo: 'TM9',
    image: SOCIAL_MEDIA_GRID_IMAGENES[5],
    network: 'TikTok',
    caption: 'TM9 en acción',
    href: TIKTOK_LINK + '/7611655443374411028',
  },
  {
    id: 'tm7_v2026_tiktok',
    modelo: 'TM7 v2026',
    image: SOCIAL_MEDIA_GRID_IMAGENES[6],
    network: 'TikTok',
    caption: 'TM7 v2026 en acción',
    href: TIKTOK_LINK + '/7653278433492897044',
  },
  {
    id: 'h3_pro_tiktok',
    modelo: 'H3 Pro',
    image: SOCIAL_MEDIA_GRID_IMAGENES[7],
    network: 'TikTok',
    caption: 'H3 Pro en acción',
    href: TIKTOK_LINK + '/7659950348374641941',
  },
  {
    id: 'v9_pro_tiktok',
    modelo: 'V9 Pro',
    image: SOCIAL_MEDIA_GRID_IMAGENES[8],
    network: 'TikTok',
    caption: 'V9 Pro en acción',
    href: TIKTOK_LINK + '/7627261537614449940',
  },
  {
    id: 'm3_pro_tiktok',
    modelo: 'M3 Pro',
    image: SOCIAL_MEDIA_GRID_IMAGENES[9],
    network: 'TikTok',
    caption: 'M3 Pro en acción',
    href: TIKTOK_LINK + '/7619467712401657108',
  },
  {
    id: 'tm6_pro_tiktok',
    modelo: 'TM6 PRO',
    image: SOCIAL_MEDIA_GRID_IMAGENES[10],
    network: 'TikTok',
    caption: 'TM6 PRO en acción',
    href: TIKTOK_LINK + '/7637697265486007572',
  },
  {
    id: 'vmp_s9_tiktok',
    modelo: 'VMP S9',
    image: SOCIAL_MEDIA_GRID_IMAGENES[11],
    network: 'TikTok',
    caption: 'VMP S9 en acción',
    href: TIKTOK_LINK + '/7634727490824441108',
  },
  {
    id: 'tc2_180a_tiktok',
    modelo: 'TC2-180A',
    image: SOCIAL_MEDIA_GRID_IMAGENES[12],
    network: 'TikTok',
    caption: 'TC2-180A en acción',
    href: '',
  },
  {
    id: 'vmp_l3_pro_tiktok',
    modelo: 'VMP L3 Pro',
    image: SOCIAL_MEDIA_GRID_IMAGENES[13],
    network: 'TikTok',
    caption: 'VMP L3 Pro en acción',
    href: TIKTOK_LINK + '/7658481684840647957',
  },
  {
    id: 'tc_bus_tiktok',
    modelo: 'TC-BUS',
    image: SOCIAL_MEDIA_GRID_IMAGENES[14],
    network: 'TikTok',
    caption: 'TC-BUS en acción',
    href: TIKTOK_LINK + '/7645084543929568533',
  },
  {
    id: 'tc2_110a_tiktok',
    modelo: 'TC2-110A',
    image: SOCIAL_MEDIA_GRID_IMAGENES[15],
    network: 'TikTok',
    caption: 'TC2-110A en acción',
    href: TIKTOK_LINK + '/7643979651479522580',
  },
  {
    id: 'f4_pro_tiktok',
    modelo: 'F4 Pro',
    image: SOCIAL_MEDIA_GRID_IMAGENES[16],
    network: 'TikTok',
    caption: 'F4 Pro en acción',
    href: TIKTOK_LINK + '/7678097081168366868',
  },
  {
    id: 'gl3_tiktok',
    modelo: 'GL3',
    image: SOCIAL_MEDIA_GRID_IMAGENES[17],
    network: 'TikTok',
    caption: 'GL3 en acción',
    href: TIKTOK_LINK + '/7670323110121442581',
  },
  {
    id: 'vmp_p01_tiktok',
    modelo: 'VMP P01',
    image: SOCIAL_MEDIA_GRID_IMAGENES[18],
    network: 'TikTok',
    caption: 'VMP P01 en acción',
    href: TIKTOK_LINK + '/7563825633701268792',
  },
  {
    id: 'vmp_s6_pro_tiktok',
    modelo: 'VMP S6 Pro',
    image: SOCIAL_MEDIA_GRID_IMAGENES[19],
    network: 'TikTok',
    caption: 'VMP S6 Pro en acción',
    href: TIKTOK_LINK + '/7663704160361106709',
  },
  {
    id: 'vmp_s4_pro_tiktok',
    modelo: 'VMP S4 Pro',
    image: SOCIAL_MEDIA_GRID_IMAGENES[20],
    network: 'TikTok',
    caption: 'VMP S4 Pro en acción',
    href: TIKTOK_LINK + '/7670732904653212948',
  },
  {
    id: 'vmp_t4_tiktok',
    modelo: 'VMP T4',
    image: SOCIAL_MEDIA_GRID_IMAGENES[21],
    network: 'TikTok',
    caption: 'VMP T4 en acción',
    href: TIKTOK_LINK + '/7617988299616947477',
  },
  {
    id: 'y5_tiktok',
    modelo: 'Y5',
    image: SOCIAL_MEDIA_GRID_IMAGENES[22],
    network: 'TikTok',
    caption: 'Y5 en acción',
    href: TIKTOK_LINK + '/7663274816421596436',
  },
  {
    id: 'tc2_160a_tiktok',
    modelo: 'TC2-160A',
    image: SOCIAL_MEDIA_GRID_IMAGENES[23],
    network: 'TikTok',
    caption: 'TC2-160A en acción',
    href: TIKTOK_LINK + '/7569005157531372812',
  },
  {
    id: 'tc2_160_con_techo_tiktok',
    modelo: 'TC2-160 con Techo',
    image: SOCIAL_MEDIA_GRID_IMAGENES[24],
    network: 'TikTok',
    caption: 'TC2-160 con Techo en acción',
    href: TIKTOK_LINK + '/7507028534876032262?lang=es',
  },
  {
    id: 'm_car_1_tiktok',
    modelo: 'M-CAR 1',
    image: SOCIAL_MEDIA_GRID_IMAGENES[25],
    network: 'TikTok',
    caption: 'M-CAR 1 en acción',
    href: TIKTOK_LINK + '/7676254668829658388',
  },
  {
    id: 'm_car_2_tiktok',
    modelo: 'M-CAR 2',
    image: SOCIAL_MEDIA_GRID_IMAGENES[26],
    network: 'TikTok',
    caption: 'M-CAR 2 en acción',
    href: TIKTOK_LINK + '/7676254668829658388',
  },
  {
    id: 'm_car_3_tiktok',
    modelo: 'M-CAR 3',
    image: SOCIAL_MEDIA_GRID_IMAGENES[27],
    network: 'TikTok',
    caption: 'M-CAR 3 en acción',
    href: TIKTOK_LINK + '/7676254668829658388',
  },
  {
    id: 'm_car_4_tiktok',
    modelo: 'M-CAR 4',
    image: SOCIAL_MEDIA_GRID_IMAGENES[28],
    network: 'TikTok',
    caption: 'M-CAR 4 en acción',
    href: TIKTOK_LINK + '/7676254668829658388',
  },
  {
    id: 'm_car_5_tiktok',
    modelo: 'M-CAR 5',
    image: SOCIAL_MEDIA_GRID_IMAGENES[29],
    network: 'TikTok',
    caption: 'M-CAR 5 en acción',
    href: TIKTOK_LINK + '/7676254668829658388',
  },
  {
    id: 'gl4_tiktok',
    modelo: 'GL4',
    image: SOCIAL_MEDIA_GRID_IMAGENES[30],
    network: 'TikTok',
    caption: 'GL4 en acción',
    href: TIKTOK_LINK + '/7684065232901147924',
  },
  {
    id: 'h5_tiktok',
    modelo: 'H5',
    image: SOCIAL_MEDIA_GRID_IMAGENES[31],
    network: 'TikTok',
    caption: 'H5 en acción',
    href: TIKTOK_LINK + '/7608711278210714900',
  },
  {
    // No hay en TikTok, solo en Instagram
    id: 'tc2_160_power_pro_ig',
    modelo: 'TC2-160 Power PRO',
    image: SOCIAL_MEDIA_GRID_IMAGENES[32],
    network: 'Instagram',
    caption: 'TC2-160 Power PRO en acción',
    href: "https://www.instagram.com/reel/DQXsamrDRTN/?hl=es",
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
  requiere_placa_soat: 'Requiere Placa / SOAT',
};


///////////////////////////////////////////////////////////////////////////////
///               LIBRO DE RECLAMACIONES (LibroReclamaciones.jsx)        ////
///////////////////////////////////////////////////////////////////////////////

export const libro_doc_types = ['DNI', 'Carné de extranjería', 'Pasaporte', 'RUC'];

export const libro_servicio_opciones = [
  '—Por favor, elige una opción—',
  'Atención al cliente - Tiendas principales',
  'Atención al cliente - Ecommerce / ventas online',
  'Atención al cliente - Envíos',
  'Servicio técnico',
  'Distribución',
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


export const green_tips = [
  {
    icon: '🔋',
    title: 'Carga inteligente',
    text: 'Evita dejar tu batería conectada toda la noche una vez que llegue al 100% para prolongar su vida útil.',
  },
  {
    icon: '🛞',
    title: 'Presión de neumáticos',
    text: 'Revisa la presión de tus llantas cada 2 semanas; una presión adecuada mejora la autonomía y seguridad.',
  },
  {
    icon: '🌧️',
    title: 'Cuidado bajo lluvia',
    text: 'Aunque nuestros vehículos son resistentes a salpicaduras, evita sumergirlos en pozos profundos de agua.',
  },
  {
    icon: '🛠️',
    title: 'Mantenimiento preventivo',
    text: 'Realiza una revisión técnica periódica de frenos y conexiones cada 6 meses en nuestros talleres autorizados.',
  },
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