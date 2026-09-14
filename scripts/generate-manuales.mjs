import fs from 'node:fs';
import path from 'node:path';

const dirPath = './public/assets/manuales_uso';
const outputPath = './frontend/data/manuales_db.json';

const files = fs.readdirSync(dirPath).filter(f => f.toLowerCase().endsWith('.pdf'));

function contains(str, arr) {
  return arr.some(k => str.toLowerCase().includes(k.toLowerCase()));
}

function categoriaDeArchivo(file) {
  const f = file.toLowerCase();
  if (f.startsWith('ficha-tecnica')) return 'Fichas Técnicas';
  if (contains(f, ['tc2', 'tc1', 'cargueros', 'carguero', 'pionero'])) return 'Cargueros';
  if (contains(f, ['m-car', 'mcar'])) return 'Cuatrimotos';
  if (contains(f, ['tm', 'tmt', 'lion', 'leopard', 'j120'])) return 'Trimotos Eléctricas';
  if (contains(f, ['vmp', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's9', 'p01', 'p12', 'l1', 'l2', 'l3', 'l24', 'fl2', 't3', 't4', 'f6', 'y3', 'a4', 'runner', 'm2'])) return 'VMP';
  return 'Motos Eléctricas';
}

function extraerAnio(cleanName) {
  const yearMatch = cleanName.match(/(20\d{2})|(\d{2}-\d{2}-\d{2})|(\d{8})/);
  if (!yearMatch) return '';
  const rawDate = yearMatch[0];
  if (rawDate.length === 4) return ` (${rawDate})`;
  if (rawDate.includes('-')) {
    const parts = rawDate.split('-');
    const y = parts[2];
    const anio = y?.length === 2 ? `20${y}` : y;
    return ` (${anio})`;
  }
  return '';
}

function normalizarPalabra(word) {
  if (['VMP', 'TM', 'TC', 'UPN', 'TAILG'].includes(word.toUpperCase())) {
    return word.toUpperCase();
  }
  if (word.toLowerCase() === 'y' || word.toLowerCase() === 'de') return word.toLowerCase();
  if (word.toLowerCase() === 'pro') return 'Pro';
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function limpiarNombre(rawName) {
  let name = rawName
    .replace(/^GreenLine[-_]Manual[-_]de[-_]uso[-_]Modelo[-_]/i, '')
    .replace(/^GreenLine[-_]Manual[-_]de[-_]uso[-_]/i, '')
    .replace(/^GreenLine[-_]Manual[-_]Uso[-_]/i, '')
    .replace(/^GreenLine[-_]Manual[-_]uso[-_]/i, '')
    .replace(/^Manual[-_]de[-_]uso[-_]/i, '')
    .replace(/^Manual[-_]de[-_]Uso[-_]/i, '')
    .replace(/^Manual[-_]modelo[-_]/i, '')
    .replace(/^Manual[-_]/i, '')
    .replace(/^FICHA[-_]TECNICA[-_]/i, 'Ficha Técnica ');

  name = name
    .replace(/[-_]\d{2}[-_]\d{2}[-_]\d{2,4}/g, '')
    .replace(/[-_]\d{8}/g, '')
    .replace(/[-_]20\d{2}/g, '')
    .replace(/[-_]compressed/gi, '')
    .replace(/[-_]comp/gi, '')
    .replace(/\s*\(?\d+\)?$/g, '')
    .replace(/[-_]\d+$/g, '')
    .replace(/[-_]/g, ' ')
    .trim();

  const lowercase = name.toLowerCase();
  if (lowercase.startsWith('ficha tecnica')) {
    name = name.replace(/ficha tecnica/i, 'Ficha Técnica');
  } else if (!lowercase.startsWith('manual') && !lowercase.startsWith('ficha')) {
    name = 'Manual ' + name;
  }

  return name
    .split(' ')
    .map(normalizarPalabra)
    .join(' ');
}

function construirEntrada(file) {
  const rawName = file.replace(/\.pdf$/i, '');
  const yearStr = extraerAnio(rawName);
  const base = limpiarNombre(rawName);
  const name = yearStr && !base.includes(yearStr.trim()) ? base + yearStr : base;
  const slug = file.toLowerCase().replace(/\.pdf$/i, '').replace(/[^a-z0-9]+/g, '-');
  return {
    file,
    name,
    category: categoriaDeArchivo(file),
    slug,
  };
}

const results = files.map(construirEntrada);

results.sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
console.log(`Generated ${results.length} manuals in ${outputPath}`);