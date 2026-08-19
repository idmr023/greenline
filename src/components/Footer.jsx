import { Link } from 'react-router-dom';
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  TiktokIcon,
} from './SocialIcons';

const col1 = [
  { label: 'Nosotros', to: '/proximamente' },
  { label: 'GreenLine Perú', to: '/proximamente' },
  { label: 'Novedades', to: '/tienda' },
  { label: 'Nuestros Aliados', to: '/proximamente' },
  { label: 'Trabaja con nosotros', to: '/proximamente' },
  { label: 'GreenLine Chile', to: '/proximamente' },
];

const col2 = [
  { label: 'Contáctanos', to: '/proximamente' },
  { label: 'Manuales de uso', to: '/proximamente' },
  { label: 'Preguntas Frecuentes', to: '/proximamente' },
  { label: 'Libro de reclamaciones', to: '/proximamente' },
];

const col3 = [
  'Sede Lince (Av. Jose Leal 507)',
  'Sede Surco (Av. Surco 790)',
  'Sede San Miguel',
  'Sede La Molina',
  'Sede Miraflores',
  'Sede Comas',
  'Sede Huancayo',
  'Sede Ate',
];

const col4 = [
  { label: 'Falabella', to: '/proximamente' },
  { label: 'Ripley', to: '/proximamente' },
  { label: 'Coolbox', to: '/proximamente' },
  { label: 'Mercado Libre', to: '/proximamente' },
  { label: 'Puntos Autorizados', to: '/proximamente' },
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
          <div>
            <h3 className="font-bold text-lg mb-4 text-brand-light">Sedes Principales</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {col3.map((sede) => (
                <li key={sede}>{sede}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-brand-light">Encuéntranos También</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {col4.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
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
      </div>
    </footer>
  );
}
