'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { analytics } from '@/lib/analytics'

interface VerifiedProductLinkProps {
  className?: string
  productId?: string
  productName?: string
  productPrice?: string
  productImage?: string
}

export default function VerifiedProductLink({
  className = "",
  productId,
  productName,
  productPrice,
  productImage
}: VerifiedProductLinkProps) {
  const router = useRouter()

  const handleClick = () => {
    // Si no hay datos del producto, ir a la encuesta (legacy)
    if (!productId || !productName || !productPrice) {
      window.open('https://forms.gle/CVdyFmBcASjXRKww7', '_blank')
      return
    }

    // Track product click
    analytics.productClicked(productId, undefined, {
      productName,
      productPrice,
      source: 'buy_button'
    });

    // Track start checkout
    analytics.startCheckout(productId, undefined, {
      productName,
      productPrice
    });

    // Extraer precio numérico (eliminar ARS, $, puntos, espacios)
    const priceClean = productPrice.replace(/[^\d]/g, '')
    const priceNumber = parseInt(priceClean) || 100000

    // Ir al checkout con datos del producto
    const params = new URLSearchParams({
      id: productId,
      name: productName,
      price: priceNumber.toString(),
      ...(productImage && { image: productImage })
    })

    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <Button onClick={handleClick} className={className}>
      Comprar
    </Button>
  )
}
