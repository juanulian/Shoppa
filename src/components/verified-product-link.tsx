'use client'

import { ExternalLink, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

interface VerifiedProductLinkProps {
  url: string
  productName: string
  className?: string
}

export default function VerifiedProductLink({ 
  url, 
  productName,
  className = ""
}: VerifiedProductLinkProps) {
  const [verifiedUrl, setVerifiedUrl] = useState(url)
  const [isValid, setIsValid] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let isMounted = true;

    const validateUrl = () => {
      // Validaciones básicas de URL
      if (!url || url === '#' || url === '' || url.includes('google.com/search') || url.includes('google.com/url')) {
        generateFallbackUrl();
        if(isMounted) setIsChecking(false);
        return
      }
      
      try {
        const urlObj = new URL(url);
        setVerifiedUrl(url);
        setIsValid(true);
      } catch {
        generateFallbackUrl();
      }
      if(isMounted) setIsChecking(false);
    }
    
    validateUrl();

    return () => {
        isMounted = false;
    }
  }, [url, productName])

  const generateFallbackUrl = () => {
    const searchQuery = encodeURIComponent(productName)
    const mercadoLibreUrl = `https://listado.mercadolibre.com.ar/${searchQuery}`
    setVerifiedUrl(mercadoLibreUrl)
    setIsValid(false)
  }

  const handleClick = () => {
    if (verifiedUrl) {
      window.open(verifiedUrl, '_blank', 'noopener,noreferrer')
    }
  }

  if (isChecking) {
    return (
      <Button 
        disabled 
        className={className}
        variant="outline"
        suppressHydrationWarning
      >
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Verificando...
      </Button>
    )
  }

  return (
    <Button
        onClick={handleClick}
        className={className}
        variant={isValid ? "default" : "outline"}
        suppressHydrationWarning
    >
        {isValid ? (
        <>
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver Producto
        </>
        ) : (
        <>
            <AlertCircle className="h-4 w-4 mr-2" />
            Buscar en MercadoLibre
        </>
        )}
    </Button>
  )
}
