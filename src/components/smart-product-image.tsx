'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface SmartProductImageProps {
  src: string
  alt: string
  productName: string
  className?: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
}

export default function SmartProductImage({ 
  src, 
  alt, 
  productName,
  className = "",
  width,
  height,
  fill = false,
  priority = false
}: SmartProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isMounted = true;
    
    const validateImage = (url: string) => {
      try {
        const img = new window.Image()
        img.onload = () => {
          if(isMounted) {
            setImgSrc(url)
            setIsLoading(false)
            setHasError(false)
          }
        }
        img.onerror = () => {
          if(isMounted) {
            setHasError(true)
            setIsLoading(false)
          }
        }
        img.src = url
      } catch {
        if(isMounted) {
          setHasError(true)
          setIsLoading(false)
        }
      }
    }
    
    if (!src || src.includes('placehold.co')) {
      setHasError(true)
      setIsLoading(false)
    } else {
      validateImage(src)
    }

    return () => {
        isMounted = false;
    }

  }, [src, productName])

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-200/50 dark:bg-gray-800/50 rounded-lg ${className}`} 
           style={fill ? {} : { width, height }} />
    )
  }

  // Error state - mostrar un SVG inline
  if (hasError) {
    const displayName = productName.length > 20 ? `${productName.slice(0, 20)}...` : productName;
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
        style={fill ? {} : { width, height }}
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 100 100" 
          className="text-gray-400 dark:text-gray-500"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect width="100" height="100" fill="currentColor" opacity="0.1"/>
          <text 
            x="50%" 
            y="45%" 
            textAnchor="middle" 
            dy=".3em" 
            fill="currentColor" 
            fontSize="8"
            fontFamily="sans-serif"
            className="font-semibold"
          >
            {displayName}
          </text>
          <text 
            x="50%" 
            y="55%" 
            textAnchor="middle" 
            dy=".3em" 
            fill="currentColor" 
            fontSize="7"
            fontFamily="sans-serif"
            opacity="0.7"
          >
            Imagen no disponible
          </text>
        </svg>
      </div>
    )
  }

  // Si la imagen es válida, intentar con Next/Image
  try {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        className={className}
        onError={handleError}
        priority={priority}
        style={{objectFit: 'cover'}}
      />
    )
  } catch {
    // Si Next/Image falla, usar img normal
    return (
      <img 
        src={imgSrc} 
        alt={alt}
        className={className}
        style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : { width, height, objectFit: 'cover' }}
        onError={handleError}
      />
    )
  }
}
