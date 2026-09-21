import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 1. Configuración de rutas
const TIKTOK_LINK = 'https://www.tiktok.com/@greenline_peru/video';
const DIRECTORIO_DESTINO = './public/assets/imagenes/social';

// 2. Tu arreglo de datos
const SOCIAL_GRID_ITEMS = [
  { id: 'fl2_tiktok', href: TIKTOK_LINK + '/7623553103710735636', network: 'TikTok' },
  { id: 't6_tiktok', href: TIKTOK_LINK + '/7652131725300043016', network: 'TikTok' },
  { id: 'sr_tiktok', href: TIKTOK_LINK + '/7607596869321002260', network: 'TikTok' },
  { id: 'mx6_tiktok', href: TIKTOK_LINK + '/7652870935887858965', network: 'TikTok' },
  { id: 'tm9_tiktok', href: TIKTOK_LINK + '/7611655443374411028', network: 'TikTok' },
  { id: 'tm7_v2026_tiktok', href: TIKTOK_LINK + '/7653278433492897044', network: 'TikTok' },
  { id: 'h3_pro_tiktok', href: TIKTOK_LINK + '/7659950348374641941', network: 'TikTok' },
  { id: 'v9_pro_tiktok', href: TIKTOK_LINK + '/7627261537614449940', network: 'TikTok' },
  { id: 'm3_pro_tiktok', href: TIKTOK_LINK + '/7619467712401657108', network: 'TikTok' },
  { id: 'tm6_pro_tiktok', href: TIKTOK_LINK + '/7637697265486007572', network: 'TikTok' },
  { id: 'vmp_s9_tiktok', href: TIKTOK_LINK + '/7634727490824441108', network: 'TikTok' },
  { id: 'tc2_180a_tiktok', href: '', network: 'TikTok' }, // Vacío, el script lo saltará
  { id: 'vmp_l3_pro_tiktok', href: TIKTOK_LINK + '/7658481684840647957', network: 'TikTok' },
  { id: 'tc_bus_tiktok', href: TIKTOK_LINK + '/7645084543929568533', network: 'TikTok' },
  { id: 'tc2_110a_tiktok', href: TIKTOK_LINK + '/7643979651479522580', network: 'TikTok' },
  { id: 'f4_pro_tiktok', href: TIKTOK_LINK + '/7678097081168366868', network: 'TikTok' },
  { id: 'gl3_tiktok', href: TIKTOK_LINK + '/7670323110121442581', network: 'TikTok' },
  { id: 'vmp_p01_tiktok', href: TIKTOK_LINK + '/7563825633701268792', network: 'TikTok' },
  { id: 'vmp_s6_pro_tiktok', href: TIKTOK_LINK + '/7663704160361106709', network: 'TikTok' },
  { id: 'vmp_s4_pro_tiktok', href: TIKTOK_LINK + '/7670732904653212948', network: 'TikTok' },
  { id: 'vmp_t4_tiktok', href: TIKTOK_LINK + '/7617988299616947477', network: 'TikTok' },
  { id: 'y5_tiktok', href: TIKTOK_LINK + '/7663274816421596436', network: 'TikTok' },
  { id: 'tc2_160a_tiktok', href: TIKTOK_LINK + '/7569005157531372812', network: 'TikTok' },
  { id: 'tc2_160_con_techo_tiktok', href: TIKTOK_LINK + '/7507028534876032262', network: 'TikTok' },
  { id: 'm_car_1_tiktok', href: TIKTOK_LINK + '/7676254668829658388', network: 'TikTok' },
  { id: 'm_car_2_tiktok', href: TIKTOK_LINK + '/7676254668829658388', network: 'TikTok' },
  { id: 'm_car_3_tiktok', href: TIKTOK_LINK + '/7676254668829658388', network: 'TikTok' },
  { id: 'm_car_4_tiktok', href: TIKTOK_LINK + '/7676254668829658388', network: 'TikTok' },
  { id: 'm_car_5_tiktok', href: TIKTOK_LINK + '/7676254668829658388', network: 'TikTok' },
  { id: 'gl4_tiktok', href: TIKTOK_LINK + '/7684065232901147924', network: 'TikTok' },
  { id: 'h5_tiktok', href: TIKTOK_LINK + '/7608711278210714900', network: 'TikTok' },
  { id: 'tc2_160_power_pro_ig', href: "https://www.instagram.com/reel/DQXsamrDRTN/?hl=es", network: 'Instagram' }
];

async function descargarMiniaturas() {
  console.log('🔍 Iniciando descarga masiva de miniaturas de TikTok...');

  // Crear la carpeta si no existe
  if (!fs.existsSync(DIRECTORIO_DESTINO)) {
    fs.mkdirSync(DIRECTORIO_DESTINO, { recursive: true });
  }

  for (const item of SOCIAL_GRID_ITEMS) {
    // Saltamos enlaces vacíos o de Instagram
    if (!item.href || item.network !== 'TikTok') {
      console.log(`⏩ Saltando ${item.id} (No es TikTok o no tiene enlace válido)`);
      continue;
    }

    // Limpiamos parámetros extra de la URL (como ?lang=es)
    const cleanUrl = item.href.split('?')[0];
    const oembedUrl = `https://www.tiktok.com/oembed?url=${cleanUrl}`;

    try {
      console.log(`⏳ Procesando ${item.id}...`);
      
      // 1. Consultar la API de TikTok
      const response = await fetch(oembedUrl);
      const data = await response.json();

      if (data.thumbnail_url) {
        // 2. Descargar la imagen
        const imgResponse = await fetch(data.thumbnail_url);
        const arrayBuffer = await imgResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 3. Convertir a WebP y guardar
        const nombreArchivo = `${item.id}.webp`;
        const rutaFinal = path.join(DIRECTORIO_DESTINO, nombreArchivo);

        await sharp(buffer)
          .webp({ quality: 80 }) // Balance perfecto entre peso y calidad
          .toFile(rutaFinal);

        console.log(`✅ Guardado con éxito: ${nombreArchivo}`);
      } else {
        console.log(`⚠️ No se encontró miniatura para ${item.id}`);
      }
    } catch (error) {
      console.error(`❌ Error procesando ${item.id}:`, error.message);
    }
  }
  
  console.log('🎉 ¡Todas las miniaturas de TikTok han sido procesadas!');
}

descargarMiniaturas();