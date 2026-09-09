import fs from 'node:fs';
import path from 'node:path';

const dirPath = './public/assets/manuales_uso';
const outputPath = './frontend/data/manuales_db.json';

const files = fs.readdirSync(dirPath).filter(f => f.toLowerCase().endsWith('.pdf'));

const results = [];

function contains(str, arr) {
  return arr.some(k => str.toLowerCase().includes(k.toLowerCase()));
}

files.forEach(file => {
  let category = 'Motos Eléctricas';

  if (file.toLowerCase().startsWith('ficha-tecnica')) {
    category = 'Fichas Técnicas';
  } else if (contains(file, ['tc2', 'tc1', 'cargueros', 'carguero', 'pionero'])) {
    category = 'Cargueros';
  } else if (contains(file, ['m-car', 'mcar'])) {
    category = 'Cuatrimotos';
  } else if (contains(file, ['tm', 'tmt', 'lion', 'leopard', 'j120'])) {
    category = 'Trimotos Eléctricas';
  } else if (contains(file, ['vmp', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's9', 'p01', 'p12', 'l1', 'l2', 'l3', 'l24', 'fl2', 't3', 't4', 'f6', 'y3', 'a4', 'runner', 'm2'])) {
    category = 'VMP';
  }

  let cleanName = file.replace(/\.pdf$/i, '');
  
  let yearMatch = cleanName.match(/(20\d{2})|(\d{2}-\d{2}-\d{2})|(\d{8})/);
  let yearStr = '';
  if (yearMatch) {
    let rawDate = yearMatch[0];
    if (rawDate.length === 4) {
      yearStr = ` (${rawDate})`;
    } else if (rawDate.includes('-')) {
      let parts = rawDate.split('-');
      let y = parts[2];
      if (y && y.length === 2) y = '20' + y;
      yearStr = ` (${y})`;
    }
  }

  cleanName = cleanName
    .replace(/^GreenLine[-_]Manual[-_]de[-_]uso[-_]Modelo[-_]/i, '')
    .replace(/^GreenLine[-_]Manual[-_]de[-_]uso[-_]/i, '')
    .replace(/^GreenLine[-_]Manual[-_]Uso[-_]/i, '')
    .replace(/^GreenLine[-_]Manual[-_]uso[-_]/i, '')
    .replace(/^Manual[-_]de[-_]uso[-_]/i, '')
    .replace(/^Manual[-_]de[-_]Uso[-_]/i, '')
    .replace(/^Manual[-_]modelo[-_]/i, '')
    .replace(/^Manual[-_]/i, '')
    .replace(/^FICHA[-_]TECNICA[-_]/i, 'Ficha Técnica ');

  cleanName = cleanName
    .replace(/[-_]\d{2}[-_]\d{2}[-_]\d{2,4}/g, '')
    .replace(/[-_]\d{8}/g, '')
    .replace(/[-_]20\d{2}/g, '')
    .replace(/[-_]compressed/gi, '')
    .replace(/[-_]comp/gi, '')
    .replace(/\s*\(?\d+\)?$/g, '')
    .replace(/[-_]\d+$/g, '')
    .replace(/[-_]/g, ' ')
    .trim();

  if (cleanName.toLowerCase().startsWith('ficha tecnica')) {
    cleanName = cleanName.replace(/ficha tecnica/i, 'Ficha Técnica');
  } else {
    if (!cleanName.toLowerCase().startsWith('manual') && !cleanName.toLowerCase().startsWith('ficha')) {
      cleanName = 'Manual ' + cleanName;
    }
  }

  cleanName = cleanName
    .split(' ')
    .map(word => {
      if (word.toUpperCase() === 'VMP' || word.toUpperCase() === 'TM' || word.toUpperCase() === 'TC' || word.toUpperCase() === 'UPN' || word.toUpperCase() === 'TAILG') {
        return word.toUpperCase();
      }
      if (word.toLowerCase() === 'y' || word.toLowerCase() === 'de') return word.toLowerCase();
      if (word.toLowerCase() === 'pro') return 'Pro';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');

  if (yearStr && !cleanName.includes(yearStr.trim())) {
    cleanName += yearStr;
  }

  const slug = file.toLowerCase().replace(/\.pdf$/i, '').replace(/[^a-z0-9]+/g, '-');
  results.push({
    file,
    name: cleanName,
    category,
    slug,
  });
});

results.sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
console.log(`Generated ${results.length} manuals in ${outputPath}`);
