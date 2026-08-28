const BASE = '/assets/manuales_uso/';

const MANUAL_POR_SLUG = {
  'bicicleta-elctrica-plegable-fl2': 'Manual-de-uso-FL2-310124.pdf',
  'greenline-h3-pro': 'GreenLine-Manual-de-uso-H3-18-10-24.pdf',
  'greenline-m3-pro': 'Manual-de-uso-M3-y-M3PRO.pdf',
  'greenline-mx6': 'Manual-de-uso-MX6.pdf',
  'greenline-sr': 'Manual-de-uso-SR.pdf',
  'greenline-t6': 'Manual-de-uso-T6.pdf',
  'greenline-tc2-180a': 'Manual-TC2-180.pdf',
  'greenline-tc2-160-con-techo': 'Manual-TC2-160.pdf',
  'greenline-tc2-160a': 'Manual-de-uso-TC2-160-A.pdf',
  'greenline-v9-pro': 'Manual-de-uso-V9-PRO.pdf',
  'greenline-vmp-l3-pro': 'Manual-de-uso-VMP-L3.pdf',
  'greenline-vmp-p01': 'Manual-de-uso-VMP-P01.pdf',
  'greenline-vmp-s4-pro': 'Manual-de-uso-VMP-S4-26-06-23-.pdf',
  'greenline-vmp-s6-pro': 'Manual-S6-PRO.pdf',
  'greenline-vmp-s9': 'Manual-de-uso-VMP-S9 (1).pdf',
  'greenline-vmp-t4': 'Manual-de-uso-VMPT4.pdf',
  'greenline-y5': 'Manual-modelo-Y5-05-03-25_comp.pdf',
  'trimoto-greenline-tm6-pro': 'Manual-de-uso-TM6PRO1.pdf',
  'trimoto-greenline-tm7-v2026': 'Manual-de-uso-TM7V25.pdf',
  'trimoto-greenline-tm9': 'Manual-de-uso-TM9.pdf',
};

export function manualUrl(slug) {
  const archivo = MANUAL_POR_SLUG[slug];
  return archivo ? BASE + archivo : null;
}