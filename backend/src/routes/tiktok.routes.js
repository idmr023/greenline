import { Router } from 'express';

const router = Router();

const TIKTOK_USERNAME = 'greenline_peru';
const LIVE_URL = `https://www.tiktok.com/@${TIKTOK_USERNAME}/live`;
const ROOM_API_URL = `https://www.tiktok.com/api-live/user/room/?uniqueId=${TIKTOK_USERNAME}&aid=1988&sourceType=54`;

// Cache en memoria: evita golpear TikTok con cada visitante.
// El front solo consulta dentro de la ventana horaria del live.
const CACHE_TTL_MS = 60 * 1000;
let cache = { at: 0, data: { isLive: false, liveUrl: LIVE_URL } };

router.get('/', async (_req, res) => {
  if (Date.now() - cache.at < CACHE_TTL_MS) {
    return res.json(cache.data);
  }

  try {
    // Endpoint interno de TikTok: devuelve JSON con el estado de la sala.
    // user.status: 2 = en vivo, 4 = offline, undefined = sin datos.
    const response = await fetch(ROOM_API_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Referer: 'https://www.tiktok.com/live',
      },
      signal: AbortSignal.timeout(10_000),
    });

    const json = await response.json();
    const isLive = json?.data?.user?.status === 2;

    cache = { at: Date.now(), data: { isLive, liveUrl: LIVE_URL } };
    res.json(cache.data);
  } catch (error) {
    console.error('Error revisando TikTok Live:', error);
    // No cacheamos el fallo: el próximo intento vuelve a consultar
    res.json({ isLive: false, liveUrl: LIVE_URL });
  }
});

export default router;
