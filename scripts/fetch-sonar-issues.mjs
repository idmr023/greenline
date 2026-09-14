import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

loadEnv({ path: path.resolve(root, 'backend/.env') });

const SONAR_HOST = process.env.SONAR_HOST_URL || 'http://localhost:9000';
const PROJECT_KEY = process.env.SONAR_PROJECT_KEY || 'Greenline';
const SONAR_TOKEN = process.env.SONAR_TOKEN;
const OUTPUT_DIR = path.resolve(root, 'backend/tests/SonarQube');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'sonar-errors.md');

if (!SONAR_TOKEN) {
  console.error('❌ [SonarQube] SONAR_TOKEN no está definida.');
  console.error('   Defínela en backend/.env o en el entorno (nunca en el código):');
  console.error('   SONAR_TOKEN=sqp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  process.exit(1);
}

console.log(`[SonarQube] Fetching issues for project '${PROJECT_KEY}' from ${SONAR_HOST}...`);

const url = `${SONAR_HOST}/api/issues/search?componentKeys=${encodeURIComponent(PROJECT_KEY)}&severities=BLOCKER,CRITICAL,MAJOR&statuses=OPEN,CONFIRMED,REOPENED&ps=500`;

try {
  const authHeader = 'Basic ' + Buffer.from(SONAR_TOKEN + ':').toString('base64');
  const response = await fetch(url, {
    headers: {
      'Authorization': authHeader
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const issues = data.issues || [];

  console.log(`[SonarQube] Found ${issues.length} open issues (BLOCKER, CRITICAL, MAJOR).`);

  let markdown = `# Reporte de Incidencias SonarQube - ${new Date().toISOString()}\n\n`;
  markdown += `**Proyecto:** ${PROJECT_KEY}  \n`;
  markdown += `**Total de errores encontrados:** ${issues.length}\n\n`;
  markdown += `---\n\n`;

  if (issues.length === 0) {
    markdown += `*No se encontraron incidencias con severidad BLOCKER, CRITICAL o MAJOR.*\n`;
  } else {
    issues.forEach((issue, index) => {
      const severity = issue.severity || 'UNKNOWN';
      const component = issue.component || 'N/A';
      const line = issue.line ? `L${issue.line}` : 'General';
      const message = issue.message || 'Sin mensaje';
      const rule = issue.rule || 'N/A';
      const status = issue.status || 'OPEN';

      markdown += `${index + 1}. - [ ] **[${severity}]** | \`${component}\`:${line} | ${message} (\`${rule}\`) [Estado: ${status}]\n`;
    });
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, markdown, 'utf-8');
  console.log(`[SonarQube] Report successfully saved to: ${OUTPUT_FILE}`);
} catch (error) {
  console.error(`[SonarQube Error] Failed to fetch or generate report:`, error.message);
  console.error(`Asegúrate de que SonarQube esté corriendo en ${SONAR_HOST} y que el token sea válido.`);

  // Write error to file so agent/user knows what happened
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, `# Reporte SonarQube - Error\n\nNo se pudo conectar a SonarQube en ${SONAR_HOST}.\nError: ${error.message}\n`, 'utf-8');
  process.exit(1);
}
