import 'react-inner-image-zoom/lib/styles.min.css';
import InnerImageZoom from 'react-inner-image-zoom';

export default function ImageZoom({ nombreProducto, imagenNormal }) {
  const esTouch =
    typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  return (
    <div className="w-full h-full">
      <div
        className="
          relative
          w-full
          h-full
          bg-white
          flex
          items-center
          justify-center
          border-0
        "
      >
        <InnerImageZoom
          src={imagenNormal}
          zoomSrc={imagenNormal}
          zoomType={esTouch ? 'click' : 'hover'}
          zoomPreload={false}
          hideHint={true}
          alt={`Vista detallada de ${nombreProducto}`}
          className="w-full h-full"
          imgAttributes={{ draggable: false }}
        />
      </div>
    </div>
  );
}