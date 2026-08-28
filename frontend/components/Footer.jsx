import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  TiktokIcon,
} from './SocialIcons';

const col1 = [
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Novedades', to: '/tienda' },
  { label: 'Trabaja con nosotros', to: '/trabaja-con-nosotros' },
];

const col2 = [
  { label: 'Contáctanos', to: '/contacto' },
  { label: 'Tiendas y Distribuidores', to: '/tiendas' },
  { label: 'Preguntas Frecuentes', to: '/preguntas-frecuentes' },
  { label: 'Manuales de uso', to: '/manuales-de-uso' },
];

const socials = [
  { icon: FacebookIcon, label: 'Facebook', link: 'https://www.facebook.com/GreenLinePeru/' },
  { icon: InstagramIcon, label: 'Instagram', link: 'https://www.instagram.com/greenline_peru/' },
  { icon: YoutubeIcon, label: 'YouTube', link: 'https://www.youtube.com/@GreenLinePeru' },
  { icon: LinkedinIcon, label: 'LinkedIn', link: 'https://www.linkedin.com/company/greenline-peru/' },
  { icon: TiktokIcon, label: 'TikTok', link: 'https://www.tiktok.com/@greenline_peru' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-brand-light">Nuestra Empresa</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {col1.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-brand-light">Soporte</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {col2.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-2 text-justify">
            <h3 className="font-bold text-lg mb-4 text-brand-light">Sobre Nosotros</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              GreenLine💚 es una empresa líder en movilidad eléctrica en Perú y Chile, especializada en la comercialización de motos y vehículos eléctricos eficientes, sostenibles y accesibles para uso urbano y comercial. ✅ La Marca Nº 1 de Motos Eléctricas en Perú. ✅ Más de 9 años de experiencia en movilidad eléctrica. ✅ Puntos de Venta y Servicio Técnico a nivel nacional (más de 80 distribuidores).
            </p>
            <br />
            <p className="text-sm text-gray-400 leading-relaxed">
              Trabajamos con una de las principales fábricas de vehículos eléctricos de China (Top 3 y Top 4 del sector), garantizando calidad, confiabilidad y respaldo en cada unidad, junto con un servicio de postventa especializado. Descubre todos los beneficios que tenemos para ti. ¡Activa tu GreenMode y únete a la familia GreenLine! 🛵⚡
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Green Line. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, label, link }) => (
              <a
                key={label}
                href={link}
                target="_blank"
                aria-label={label}
                className="p-2 rounded-full bg-gray-800 hover:bg-brand transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Libro de Reclamaciones — destacado */}
        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <p className="text-xs text-gray-500">¿Tienes una queja o reclamo? Cuéntanoslo a través de nuestro</p>
          <Link
            to="/libro-de-reclamaciones"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-light text-white text-base font-bold rounded-xl shadow-lg transition-colors"
          >
            <FileText className="w-5 h-5" />
            Libro de Reclamaciones
          </Link>
          <Link
            to="/politica-privacidad"
            className="mt-2 text-xs text-gray-500 hover:text-white transition-colors"
          >
            Política de Privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
