import { useState, lazy, Suspense } from 'react';
import { Play } from 'lucide-react';
import { extractVideoId, youtubeThumbUrl } from '../lib/videosYT';

const LazyYouTube = lazy(() => import('./YouTubeEmbed'));

export default function ProductVideo({ videoId, className = '' }) {
  const [show, setShow] = useState(false);
  const id = extractVideoId(videoId);

  if (!id) return null;

  if (show) {
    return (
      <div className={`aspect-video rounded-xl overflow-hidden ${className}`}>
        <Suspense
          fallback={
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          }
        >
          <LazyYouTube videoId={id} />
        </Suspense>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShow(true)}
      aria-label="Ver video del producto"
      className={`group relative w-full aspect-video rounded-xl overflow-hidden bg-gray-900 ${className}`}
    >
      <img
        src={youtubeThumbUrl(id, 'maxresdefault')}
        onError={(e) => {
          const fallback = youtubeThumbUrl(id, 'hqdefault');
          if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
        }}
        alt="Video del producto"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Play className="w-6 h-6 ml-0.5" fill="white" />
        </div>
      </div>
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-1.5 rounded-full text-sm backdrop-blur-sm">
        Ver video del producto
      </span>
    </button>
  );
}