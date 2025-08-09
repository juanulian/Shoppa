'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImageProps {
  src: string
  alt: string
  className?: string
  width?: number;
  height?: number;
  fill?: boolean;
}

export default function ProductImage({ 
    src, 
    alt, 
    className = "", 
    fill = false,
    width,
    height
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
        setHasError(true)
        // Imagen de fallback cuando falla la carga
        setImgSrc(`https://placehold.co/${width || 100}x${height || 100}.png`) 
    }
  }

  // Si la imagen es de un dominio no confiable o falla, usa img normal
  if (hasError) {
    return (
        <Image 
            src={imgSrc} 
            alt={alt}
            width={width}
            height={height}
            fill={fill}
            className={className}
            style={{ objectFit: 'cover' }}
            data-ai-hint="product image placeholder"
        />
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      onError={handleError}
      data-ai-hint="product image"
    />
  )
}
