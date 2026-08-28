import { useState, useEffect, useRef } from 'react';
import { Radio, X, ExternalLink } from 'lucide-react';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;

const CHECK_INTERVAL = 60000; // Check every 60 seconds

export default function LiveIndicator() {
  const [isLive, setIsLive] = useState(false);
  const [liveTitle, setLiveTitle] = useState('');
  const [liveVideoId, setLiveVideoId] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
      setLoading(false);
      return;
    }

    const checkLive = async () => {
      try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.items && data.items.length > 0) {
          const live = data.items[0];
          setIsLive(true);
          setLiveTitle(live.snippet.title);
          setLiveVideoId(live.id.videoId);
        } else {
          setIsLive(false);
          setLiveTitle('');
          setLiveVideoId(null);
        }
      } catch (err) {
        console.error('Live check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkLive();
    timeoutRef.current = setInterval(checkLive, CHECK_INTERVAL);

    return () => clearInterval(timeoutRef.current);
  }, []);

  if (loading || !YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) return null;

  return (
    <>
      {/* Live Badge in Navbar */}
      {isLive && (
        <button
          onClick={() => setShowPlayer(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse hover:bg-red-700 transition-colors"
          title={liveTitle}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          EN VIVO
        </button>
      )}

      {/* Floating Player Modal */}
      {showPlayer && liveVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                <span className="text-sm font-semibold text-white">EN VIVO</span>
                <span className="text-xs text-gray-400 ml-2 truncate max-w-xs">{liveTitle}</span>
              </div>
              <button
                onClick={() => setShowPlayer(false)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* YouTube Embed */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${liveVideoId}?autoplay=1&rel=0`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={liveTitle}
              />
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-500">Transmitiendo en YouTube</span>
              <a
                href={`https://www.youtube.com/watch?v=${liveVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-brand hover:underline"
              >
                Ver en YouTube <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
