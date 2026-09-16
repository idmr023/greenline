const DAY = {
  dom: 0,
  domingo: 0,
  lun: 1,
  lunes: 1,
  mar: 2,
  martes: 2,
  mie: 3,
  miercoles: 3,
  jue: 4,
  jueves: 4,
  vie: 5,
  viernes: 5,
  sab: 6,
  sabado: 6,
};

const DAY_LABEL = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

function normalize(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function parseMinutes(hStr, mmStr, period) {
  let h = parseInt(hStr, 10);
  const mm = mmStr ? parseInt(mmStr, 10) : 0;
  if (period) {
    const p = period.toLowerCase();
    if (p === 'pm' && h < 12) h += 12;
    if (p === 'am' && h === 12) h = 0;
  }
  if (Number.isNaN(h) || Number.isNaN(mm)) return null;
  return h * 60 + mm;
}

export function parseSchedule(schedule) {
  if (!schedule) return null;
  const m = schedule.trim().match(
    /^([^\d:]+?)\s*:?\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*[-–—a]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i
  );
  if (!m) return null;
  const dm = m[1].trim().match(
    /^([A-Za-zÁÉÍÓÚÑáéíóúñ]+)(?:\s*(?:a|al|[-–—])\s*([A-Za-zÁÉÍÓÚÑáéíóúñ]+))?$/i
  );
  if (!dm) return null;
  const startDay = DAY[normalize(dm[1])];
  const endDay = dm[2] ? DAY[normalize(dm[2])] : startDay;
  if (startDay == null || endDay == null) return null;
  const openMin = parseMinutes(m[2], m[3], m[4]);
  const closeMin = parseMinutes(m[5], m[6], m[7]);
  if (openMin == null || closeMin == null) return null;
  if (openMin >= closeMin) return null;
  return { startDay, endDay, openMin, closeMin };
}

export function isOpenAt(schedule, now = new Date()) {
  const p = parseSchedule(schedule);
  if (!p) return null;
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const inRange = (d) => {
    if (p.startDay <= p.endDay) return d >= p.startDay && d <= p.endDay;
    return d >= p.startDay || d <= p.endDay;
  };
  if (inRange(day) && mins >= p.openMin && mins < p.closeMin) {
    return { state: 'open', ...p };
  }
  return { state: 'closed', ...p };
}

export function nextOpenLabel(p, now = new Date()) {
  const day = now.getDay();
  const inRange = (d) => {
    if (p.startDay <= p.endDay) return d >= p.startDay && d <= p.endDay;
    return d >= p.startDay || d <= p.endDay;
  };
  if (inRange(day)) return `hoy ${formatMinutes(p.openMin)}`;
  for (let i = 1; i <= 7; i += 1) {
    const d = (day + i) % 7;
    if (inRange(d)) return i === 1 ? `mañana ${formatMinutes(p.openMin)}` : `el ${DAY_LABEL[d]} ${formatMinutes(p.openMin)}`;
  }
  return 'próximamente';
}

export function formatMinutes(min) {
  let h = Math.floor(min / 60);
  const mm = min % 60;
  const p = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  return mm === 0 ? `${h}${p}` : `${h}:${String(mm).padStart(2, '0')}${p}`;
}