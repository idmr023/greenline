import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 1. Credenciales
const supabaseUrl = 'https://nxcbtcexsakfenjfdarr.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54Y2J0Y2V4c2FrZmVuamZkYXJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzI0NTE3MCwiZXhwIjoyMTAyODIxMTcwfQ.bLq_WAU9n0DsPwtC-trzM_8iporhYLg2_ZX7o8yGcDg'; 
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Rutas
const BUCKET = 'Greenline_database';
// Supabase creará las carpetas automáticamente basadas en esta ruta
const RUTA_SUPABASE = 'assets/imagenes/'; 
const CARPETA_LOCAL = "C:\\Users\\Marketing\\greenline\\public\\assets\\";

// Función recursiva para leer todas las subcarpetas
function explorarArchivos(dir, listaArchivos = []) {
  const archivos = fs.readdirSync(dir);
  for (const archivo of archivos) {
    const rutaAbsoluta = path.join(dir, archivo);
    if (fs.statSync(rutaAbsoluta).isDirectory()) {
      explorarArchivos(rutaAbsoluta, listaArchivos);
    } else {
      listaArchivos.push(rutaAbsoluta);
    }
  }
  return listaArchivos;
}

async function subirCarpetaMasiva() {
  console.log('🔍 Iniciando rastreo de carpetas y subcarpetas...');
  
  try {
    const todosLosArchivos = explorarArchivos(CARPETA_LOCAL);
    console.log(`📁 Se encontraron ${todosLosArchivos.length} archivos. Iniciando conversión y subida...`);

    for (const rutaCompleta of todosLosArchivos) {
      // 1. Calcular la estructura de carpetas original
      // Esto saca la diferencia entre la carpeta base y donde está la foto realmente
      let rutaRelativa = path.relative(CARPETA_LOCAL, rutaCompleta);
      
      // Normalizar las barras invertidas de Windows (\) a barras normales (/) para Supabase
      rutaRelativa = rutaRelativa.split(path.sep).join('/');

      // Asegurarnos de procesar solo imágenes (ignoramos archivos ocultos como .DS_Store o thumbs.db)
      const extensionOriginal = path.extname(rutaCompleta).toLowerCase();
      const extensionesValidas = ['.jpg', '.jpeg', '.png', '.webp'];

      if (!extensionesValidas.includes(extensionOriginal)) {
        console.log(`⏩ Saltando archivo no soportado: ${rutaRelativa}`);
        continue;
      }

      // 2. Cambiar el nombre del archivo final para que termine en .webp
      const rutaDestinoWebp = rutaRelativa.replace(/\.[^/.]+$/, '.webp');
      const rutaFinalSupabase = `${RUTA_SUPABASE}${rutaDestinoWebp}`;

      console.log(`⚙️  Convirtiendo y subiendo: ${rutaDestinoWebp}...`);

      try {
        // 3. Convertir a WebP en la memoria RAM (sin crear archivos basura en tu PC)
        const fileBuffer = await sharp(rutaCompleta)
          .webp({ quality: 80 }) // 80 es el balance perfecto entre peso y calidad
          .toBuffer();

        // 4. Subir a Supabase
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(rutaFinalSupabase, fileBuffer, {
            upsert: true,
            contentType: 'image/webp'
          });

        if (error) {
          console.error(`❌ Error en Supabase con ${rutaDestinoWebp}:`, error.message);
        } else {
          console.log(`✅ Éxito: ${rutaDestinoWebp}`);
        }
      } catch (sharpError) {
        console.error(`❌ Error al convertir la imagen ${rutaRelativa}:`, sharpError.message);
      }
    }
    
    console.log('🎉 ¡Proceso de conversión masiva y subida finalizado!');
  } catch (err) {
    console.error('❌ Error fatal al leer directorios:', err.message);
  }
}

subirCarpetaMasiva();