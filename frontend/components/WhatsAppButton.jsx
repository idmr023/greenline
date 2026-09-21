import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { buildWhatsAppLink } from '../lib/config';
import FloatingActionButton from './ui/general/FloatingActionButton';

const WHATSAPP_MESSAGE =
  '¡Hola! Les escribo desde la web de GreenLine. Tenía una consulta sobre sus vehículos eléctricos. ¿Me pueden ayudar?';

export default function WhatsAppButton() {
  return (
    <FloatingActionButton
      href={buildWhatsAppLink(WHATSAPP_MESSAGE)}
      icon={<FontAwesomeIcon icon={faWhatsapp} className="text-2xl text-white" />}
      ariaLabel="Te asesoramos por WhatsApp"
      pulse
    />
  );
}