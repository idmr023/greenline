import { Link } from 'react-router-dom';
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
  { label: 'Trabaja con nosotros', to: '/proximamente' },
];

const col2 = [
  { label: 'Contáctanos', to: '/contacto' },
  { label: 'Tiendas', to: '/tiendas' },
  { label: 'Preguntas Frecuentes', to: '/proximamente' },
  { label: 'Manuales de uso', to: '/proximamente' },
];

const socials = [
  { icon: FacebookIcon, label: 'Facebook' },
  { icon: InstagramIcon, label: 'Instagram' },
  { icon: YoutubeIcon, label: 'YouTube' },
  { icon: LinkedinIcon, label: 'LinkedIn' },
  { icon: TiktokIcon, label: 'TikTok' },
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

          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="font-bold text-lg mb-4 text-brand-light">Sobre Nosotros</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              GreenLine es una empresa peruana líder en movilidad eléctrica. Desde 2017,
              nos especializamos en la importación y distribución de vehículos menores
              eléctricos de alta calidad, con marcas reconocidas como Sunra, Zuboo y Huaihai.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nuestra misión es impulsar la revolución sostenible en el Perú, ofreciendo
              soluciones de movilidad limpia, eficiente y accesible para todos.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Green Line. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="p-2 rounded-full bg-gray-800 hover:bg-brand transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-800 text-center">
          <Link
            to="/proximamente"
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            Libro de Reclamaciones
          </Link>
        </div>
      </div>
    </footer>
  );
}
