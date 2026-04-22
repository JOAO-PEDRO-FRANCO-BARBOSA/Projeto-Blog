'use client';

import Image, { ImageProps } from 'next/image';
import { useMemo, useState } from 'react';

type SafeImageProps = Omit<ImageProps, 'src'> & {
  src: string;
  fallbackSrc?: string;
};

export function SafeImage({
  src,
  fallbackSrc = '/images/fallback-placeholder.svg',
  alt,
  onError,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  const safeAlt = useMemo(() => alt || 'Imagem', [alt]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={safeAlt}
      onError={(event) => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
        onError?.(event);
      }}
    />
  );
}
