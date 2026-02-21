// import React, { useState } from 'react'

// const ERROR_IMG_SRC =
//   'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

// export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
//   const [didError, setDidError] = useState(false)

//   const handleError = () => {
//     setDidError(true)
//   }

//   const { src, alt, style, className, ...rest } = props

//   return didError ? (
//     <div
//       className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
//       style={style}
//     >
//       <div className="flex items-center justify-center w-full h-full">
//         <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
//       </div>
//     </div>
//   ) : (
//     <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
//   )
// }
import React, { useState, useEffect } from 'react';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

// Define the interface to include fallbackSrc
interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export function ImageWithFallback({ fallbackSrc, src, className, style, alt, ...props }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      // If src is missing, treat it as an error and try fallback immediately
      if (fallbackSrc) {
        setImgSrc(fallbackSrc);
        setHasError(true);
      } else {
        const seed = getSeed(alt || 'default');
        setImgSrc(`https://picsum.photos/seed/${seed}/800/600`);
        setHasError(true);
      }
    } else {
      setImgSrc(src);
      setHasError(false);
    }
  }, [src, fallbackSrc, alt]);

  // Function to get a consistent random seed from a string
  const getSeed = (str: string) => {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // 1. If currently trying the original src AND a custom fallback is provided
    if (imgSrc === src && fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
    // 2. If we haven't tried Picsum yet (either original failed w/o custom fallback, or custom fallback failed)
    else if (imgSrc !== undefined && !imgSrc.includes('picsum.photos')) {
      const seed = getSeed(src || alt || 'default');
      setImgSrc(`https://picsum.photos/seed/${seed}/800/600`);
      setHasError(true);
    }
    // 3. If Picsum also failed, show the error state (SVG placeholder)
    else {
      setImgSrc(undefined);
    }

    // Call original onError if provided
    if (props.onError) {
      props.onError(e);
    }
  };

  if (hasError && !imgSrc) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full p-4">
          <img
            src={ERROR_IMG_SRC}
            alt="Error loading image"
            className="w-8 h-8 opacity-40"
          />
        </div>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
    />
  );
}