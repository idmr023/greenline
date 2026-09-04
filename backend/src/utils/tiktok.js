import { NextResponse } from 'next/server';

export async function GET() {
  const TIKTOK_USERNAME = 'greenline_peru'; // Tu usuario sin el @

  try {
    // Hacemos la petición al perfil de TikTok simulando ser un navegador
    const response = await fetch(`https://www.tiktok.com/@${TIKTOK_USERNAME}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 60 } // Evitamos saturar a TikTok cacheando la respuesta 60 seg
    });

    const html = await response.text();

    // TikTok inyecta la palabra "room_id" en el código fuente cuando la cuenta está transmitiendo
    // Es un web-scraping básico y ultra ligero
    const isLive = html.includes('roomId":"') && !html.includes('roomId":""');

    return NextResponse.json({ 
      isLive, 
      liveUrl: `https://www.tiktok.com/@${TIKTOK_USERNAME}/live` 
    });

  } catch (error) {
    console.error('Error revisando TikTok Live:', error);
    return NextResponse.json({ isLive: false }, { status: 500 });
  }
}