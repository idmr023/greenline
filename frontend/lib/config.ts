/**
 * Configuración central de Green Line
 *
 * Fuente única de datos de contacto, redes sociales y valores de negocio.
 * Los textos de las páginas deben leer de aquí en lugar de duplicar literales.
 */

export const CONTACT = {
  /** Teléfono principal para mostrar en el sitio */
  phoneDisplay: '+51 919 445 661',
  /** Teléfono en formato E.164 (sin espacios) */
  phone: '+51919445661',
  /** Número de WhatsApp sin código de país (para wa.me) */
  whatsappNumber: '51919445661',
  whatsappUrl: 'https://wa.me/51919445661',
  /** Correo principal. TODO: reemplazar por el correo oficial de la empresa */
  email: 'contacto@greenlineperu.com',
  emailSoporte: 'soporte@greenlineperu.com',
  emailRRHH: 'rrhh@greenlineperu.com',
  emailPrivacidad: 'privacidad@greenlineperu.com',
  address: 'Av. La Marina 2890, San Martín de Porres, Lima',
  city: 'Lima, Perú',
};

export const SOCIAL = {
  facebook: 'https://www.facebook.com/GreenLinePeru/',
  instagram: 'https://www.instagram.com/greenline_peru/',
  youtube: 'https://www.youtube.com/@GreenLinePeru',
  linkedin: 'https://www.linkedin.com/company/greenline-peru/',
  tiktok: 'https://www.tiktok.com/@greenline_peru',
};

export const BRAND = {
  name: 'GreenLine',
  legalName: 'Green Line SAC',
  founded: 2017,
};