import { useState } from 'react';

const FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#F5F7FA"/><text x="50%" y="50%" text-anchor="middle" fill="#9AA5B1" font-family="sans-serif" font-size="16">Image unavailable</text></svg>`,
  );

export function ImageWithFallback(
  props: React.ImgHTMLAttributes<HTMLImageElement>,
) {
  const [errored, setErrored] = useState(false);
  const { src, alt, ...rest } = props;
  return (
    <img
      {...rest}
      src={errored || !src ? FALLBACK : src}
      alt={alt ?? ''}
      onError={() => setErrored(true)}
    />
  );
}
