import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift, TicketPercent, Truck, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { aniversarioNumero } from '../lib/aniversario';
import { SOCIAL } from '../lib/config';
import SEOHead from '../components/SEOHead';
import { ANIVERSARIO_VIDEO } from '../lib/images';
import { TiktokIcon } from '../components/SocialIcons';
import DynamicForm from '../components/ui/Form';
import PromoDivider from '../components/ui/aniversario/PromoDivider';
import { supabase } from '../lib/supabase';

const CONFETTI_COLORS = ['#009000', '#006400', '#2eb82e', '#ffffff', '#ffd400'];

export default function Aniversario() {
  const numero = aniversarioNumero();
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const manejarEnvio = async (formData) => {
    setEnviando(true);
    setExito(false);
    setErrorMsg('');
    try {
      const payload = {
        nombre: `${formData.nombre || ''} ${formData.apellido || ''}`.trim(),
        rol: `DNI: ${formData.dni || 'N/A'} - Tel: ${formData.telefono || 'N/A'} - Email: ${formData.email || 'N/A'}`,
        texto: formData.testimonio,
        vehiculo: 'Cliente Green Line',
        rating: 5,
        activo: false // pending review by admin
      };

      const { error } = await supabase.from('testimonios').insert([payload]);
      if (error) throw error;

      // Enviar notificación por correo a greenlinemoto@gmail.com vía backend
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      await fetch(`${apiBase}/contact/testimonio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          dni: formData.dni,
          email: formData.email,
          testimonio: formData.testimonio,
        }),
      }).catch((emailErr) => {
        console.warn('No se pudo enviar el correo de notificación:', emailErr);
      });

      setExito(true);
    } catch (err) {
      console.error(err);
      setErrorMsg('Hubo un error al enviar tu testimonio. Por favor intenta de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  useEffect(() => {
    const duration = 2500;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 90,
        spread: 70,
        origin: { x: Math.random(), y: 0 },
        colors: CONFETTI_COLORS,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();

    const burst = window.setTimeout(() => {
      confetti({ particleCount: 140, spread: 100, origin: { y: 0.6 }, colors: CONFETTI_COLORS });
    }, 500);

    return () => window.clearTimeout(burst);
  }, []);

  const perks = [
    { icon: TicketPercent, title: 'Descuentos de aniversario', desc: `Durante todo setiembre tendremos el 50% de nuestro catálogo en descuento por nuestro ${numero}° aniversario.` },
    { icon: ShieldCheck, title: 'Promociones y activaciones', desc: 'Durante todo el mes de Septiembre estaremos lanzando promociones, descuentos y activaciones. Atento a nuestras redes sociales.' },
  ];

  const datosForm = [
    { id: 'nombre', label: 'Tu nombre:', type: 'text', placeholder: 'Nombre', required: true },
    { id: 'apellido', label: 'Tu apellido:', type: 'text', placeholder: 'Apellido', required: true },
    { id: 'telefono', label: 'Tu número de teléfono:', type: 'text', placeholder: 'Número de teléfono', required: true },
    { id: 'dni', label: 'Tu DNI:', type: 'text', placeholder: 'DNI', required: true },
    { id: 'email', label: 'Tu email:', type: 'email', placeholder: 'Email', required: true },
    { id: 'testimonio', label: 'Tu testimonio:', type: 'textarea', placeholder: 'Escribe tu testimonio aquí...', required: true }
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <SEOHead
        title="Aniversario Green Line"
        description="Celebra el aniversario de Green Line con ofertas especiales en vehículos de movilidad eléctrica."
        url="/aniversario"
      />
      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Encabezado */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-greenline text-white-legible rounded-full text-sm font-bold mb-20">
              <Gift className="w-4 h-4" />
              MES DE LOCURA · {numero}° ANIVERSARIO
            </span>
            <h1 className="text-4xl sm:text-6xl font-black mb-4 leading-tight">
              ¡{numero} años{' '}
              <span className="bg-greenline text-white-legible px-2 inline-block rotate-[-2deg]">
                moviendo al Perú
              </span>
              !
            </h1>
            <br />
            <p className="text-lg text-gray-600 mb-8 mt-20">
              Celebra con nosotros: vehículos eléctricos accesibles, ofertas de aniversario
              y toda la energía Green Line.
            </p>
          </div>

        <div className='columns-2 p-5'>
          {/* video de aniversario */}
          <div className="mx-auto max-w-md mb-12">
              <a
                href={SOCIAL.tiktok_aniversario}
                target="_blank"
                rel="noopener noreferrer"
              >
              <img
                src={ANIVERSARIO_VIDEO}
                alt={`${numero}° aniversario Green Line`}
                className="w-full h-auto"
                loading="lazy"
              />
              <div className="flex top-0 items-center justify-center bg-black/30 text-white w-full">
                <TiktokIcon className="w-4 h-4 mr-1.5" />
                Video explicativo en nuestro TikTok
              </div>
              </a>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 mb-12">
            {perks.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-gray-50 rounded-2xl p-6 text-left border border-gray-100 shadow-sm"
              >
                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-greenline/10 mb-4">
                  <Icon className="w-6 h-6 text-greenline" />
                </div>
                <h3 className="font-bold mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>

          {/* CTAs tienda */}
        </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              to="/tienda"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-greenline text-white-legible font-bold rounded-full shadow-lg hover:bg-greenline-dark transition-colors"
            >
              <TicketPercent className="w-5 h-5" />
              Ver ofertas en la tienda
            </Link>
            <a
              href={SOCIAL.instagram_aniversario}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-yellow-electric text-black-contrast font-bold rounded-full hover:bg-yellow-electric/90 transition-colors"
            >
              Gracias por estos 9 años, GreenLover
            </a>
          </div>

          <div className="w-full flex justify-center py-10">
            <div className="w-3/4 h-1 bg-gradient-to-r from-transparent via-brand to-transparent animate-pulse drop-shadow-[0_0_8px_rgba(0,144,0,0.8)] rounded-full"></div>
          </div>

          <PromoDivider/>

          <div
            className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center mx-auto max-w-3xl" id="testimonios"
          >
            <h3 className="font-bold mb-4 text-center text-2xl">La opinión de nuestros clientes es la más importante</h3>
            <p className="text-sm text-gray-600 mb-8 text-center">
              Te animamos a compartir tu experiencia a través del siguiente formulario. Una vez nuestro equipo lo revise, nos pondremos en contacto contigo. Además, sube una foto con tu vehículo a tus redes sociales y etiquetanos <a href="https://www.instagram.com/greenline_peru/" className="text-brand hover:underline" target="_blank" rel="noopener noreferrer">@greenline_peru</a> para participar de regalos que tenemos para nuestros clientes más fieles.
            </p>

            {exito ? (
              <div className="w-full max-w-lg p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-emerald-900 shadow-sm">
                <h4 className="font-bold text-lg mb-2">🎉 ¡Gracias por tu testimonio!</h4>
                <p className="text-sm">Tu experiencia ha sido registrada con éxito y será publicada próximamente tras la revisión de nuestro equipo.</p>
              </div>
            ) : (
              <>
                {errorMsg && (
                  <div className="w-full max-w-lg mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center">
                    {errorMsg}
                  </div>
                )}
                <DynamicForm 
                  fields={datosForm} 
                  onSubmit={manejarEnvio} 
                  buttonText={enviando ? 'Enviando testimonio...' : 'Dejar mi Testimonio'}
                />
              </>
            )}
          </div>
      </div>
    </main>
  );
}