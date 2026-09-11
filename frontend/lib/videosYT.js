function id(){
    let id = 0;
    id = id + 1;
    return id;
}

const VIDEOS_YT =[
    {
        id: id(),
        modelo_vehículo: 'S4 Pro',
        url: 'https://youtu.be/Zxkomo2Ccs0?si=owaFO5jBZ7gpq6ii',
        
    },
    {
        id: id(),
        modelo_vehículo: 'Y5',
        url: 'https://youtu.be/XMHwoozejJI?si=sGZvxJZ0X9Zxddor',
    },
    {
        id: id(),
        modelo_vehículo: 'GL3',
        url: 'hhttps://youtu.be/-FC6WVJvIoo?si=xhUXRt7nO3Q1Czpo',
    },
    {
        id: id(),
        modelo_vehículo: 'F4 Pro',
        url: 'https://youtu.be/cmziN_moID4?si=Fxn0UcpdsjJvvfRs',
    },
    {
        id: id(),
        modelo_vehículo: 'T6',
        url: 'https://youtu.be/jp4NPas8CxM?si=OxtnQtWDl2jhZAiL',
    },
    {
        id: id(),
        modelo_vehículo: 'X3',
        url: 'https://youtu.be/Ee9OlmOcT-k?si=bO5J-QlqeCHvqeFn',
    },
    {
        id: id(),
        modelo_vehículo: 'TM9',
        url: 'https://youtu.be/05xPjX7tIXg?si=YA5cpA2ygqKob-Rt',
    },
    {
        id: id(),
        modelo_vehículo: 'M3 Pro',
        url: 'https://youtu.be/KbuotZGWoqI?si=Xv7D6shNl5FnTM_e',
    },
    {
        id: id(),
        modelo_vehículo: 'X6 Pro',
        url: 'https://youtu.be/hJoX-2OJ0Tk?si=30MJrqBYDf2ON2IL',
    },
    {
        id: id(),
        modelo_vehículo: 'V9 Pro',
        url: 'https://youtu.be/LAVJnJN8owI?si=WtI8_I7Omxzn5Ykj',
    },
    {
        id: id(),
        modelo_vehículo: 'H3 Pro',
        url: 'https://youtu.be/h4rjpqrdOjQ?si=NQx34vq-quQ_mSq1',
    },
    {
        id: id(),
        modelo_vehículo: 'X6 Pro',
        url: 'https://youtu.be/hJoX-2OJ0Tk?si=rLRlaoSMx8IOIMtA',
    },
    {
        id: id(),
        modelo_vehículo: 'V9 Pro',
        url: 'https://youtu.be/LAVJnJN8owI?si=p8RdWuw7Ekw7d2z0',                
    },
    {
        id: id(),
        modelo_vehículo: 'H3 Pro',
        url: 'https://youtu.be/h4rjpqrdOjQ?si=6g0j1k5J7X8y2W9A',                
    },
    {
        id: id(),
        modelo_vehículo: 'SR',
        url: 'https://youtu.be/DBxKiVRcNAo?si=cj6ViOwK2BmBOYnx',
    },
    {
        id: id(),
        modelo_vehículo: 'MX6',
        url: 'https://youtu.be/piPS6IW-ZtA?si=MktQ7ItzD6BF_ezQ',                
    },
    {
        id: id(),
        modelo_vehículo: 'TM4 Pro',
        url: 'https://youtu.be/Wn9kG5PthWQ?si=3S39zD-Qpiisl5cs',                
    },
    {
        id: id(),
        modelo_vehículo: 'TC2-160 Power Pro',
        url: 'https://youtu.be/YbBws_i92Qw?si=JooT2KOwXy5wrgAO',                
    },
    {
        id: id(),
        modelo_vehículo: 'T4',
        url: 'https://youtu.be/WgK3f1vUh6k?si=h9GLGhumgcHoH_Kg',                
    },
    {
        id: id(),
        modelo_vehículo: 'H5',
        url: 'https://youtu.be/jVHSesuHOs8?si=r5DRorS4eesHjeYD',                
    },
    {
        id: id(),
        modelo_vehículo: 'L3',
        url: 'https://youtu.be/kBFLDTALpug?si=1UQ44eMUwb7Q306u',                
    },
    {
        id: id(),
        modelo_vehículo: 'P01',
        url: 'https://youtu.be/ATY4C2O_r2c?si=iuoyPkIpDHgzdysR',                
    },
    {
        id: id(),
        modelo_vehículo: 'Y5',
        url: 'https://youtu.be/fm7jS8DRQoo?si=0eqaIql_i4mIExGc',                
    },
    {
        id: id(),
        modelo_vehículo: 'MX6',
        url: 'https://youtu.be/piPS6IW-ZtA?si=MktQ7ItzD6BF_ezQ',                
    },
    {
        id: id(),
        modelo_vehículo: 'S6 Pro',
        url: 'https://youtu.be/d85qr7hZcdM?si=eZ6ynxaIZMnzPnpC',
    }
]

const BARE_ID_RE = /^[A-Za-z0-9_-]{11}$/;
const URL_ID_RE =
  /(?:youtu\.be\/|youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/;

export function extractVideoId(input) {
  if (!input) return null;
  const str = String(input).trim();
  if (!str) return null;
  if (BARE_ID_RE.test(str)) return str;
  const match = str.match(URL_ID_RE);
  return match ? match[1] : null;
}

export function youtubeThumbUrl(input, quality = 'hqdefault') {
  const id = extractVideoId(input);
  return id ? `https://img.youtube.com/vi/${id}/${quality}.jpg` : null;
}

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function videosForProduct(product) {
  const nombre = normalize(product?.nombre);
  if (!nombre) return [];
  return VIDEOS_YT.filter((v) => {
    const modelo = normalize(v.modelo_vehículo);
    if (!modelo) return false;
    const re = new RegExp('(^|\\s)' + modelo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|\\s)');
    return re.test(nombre);
  });
}

export function videoForProduct(product) {
  return videosForProduct(product)[0]?.url || null;
}

export default VIDEOS_YT;