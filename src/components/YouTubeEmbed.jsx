export default function YouTubeEmbed({ videoId }) {
  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?rel=0`}
      title="Video del producto"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
      loading="lazy"
    />
  );
}
