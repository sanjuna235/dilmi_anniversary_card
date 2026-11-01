/** A photograph that keeps its own aspect ratio and lazy-loads unless told otherwise. */
export default function Photo({ photo, eager = false, className = '', fit = false, sizes }) {
  return (
    <img
      className={className}
      src={photo.src}
      alt={photo.alt}
      width={photo.w}
      height={photo.h}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchpriority={eager ? 'high' : undefined}
      sizes={sizes}
      style={fit ? { objectPosition: photo.pos } : undefined}
      draggable={false}
    />
  );
}
