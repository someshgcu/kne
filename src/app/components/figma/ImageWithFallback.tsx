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
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && fallbackSrc && imgSrc !== fallbackSrc) {
      // Try the fallback source first
      setImgSrc(fallbackSrc);
      setHasError(true);
    } else {
      // If fallback fails or doesn't exist, show error placeholder
      setHasError(true);
      setImgSrc(undefined); // Trigger the error UI
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