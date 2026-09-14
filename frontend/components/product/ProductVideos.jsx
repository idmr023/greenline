import ProductVideo from './ProductVideo';
import { extractVideoId, videosForProduct } from '../../data/videosYT';

export default function ProductVideos({ product }) {
  const urls = [];

  const primary = extractVideoId(product?.videoId);
  if (primary) urls.push(product.videoId);

  for (const v of videosForProduct(product)) {
    const id = extractVideoId(v.url);
    if (id && !urls.some((u) => extractVideoId(u) === id)) {
      urls.push(v.url);
    }
  }

  if (urls.length === 0) return null;

  return (
    <div className="mt-4 flex flex-col gap-4">
      {urls.map((url) => (
        <ProductVideo key={extractVideoId(url)} videoId={url} />
      ))}
    </div>
  );
}