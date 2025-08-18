'use client'

import { Button } from '@/components/ui/button'

interface VerifiedProductLinkProps {
  className?: string
}

export default function VerifiedProductLink({ 
  className = ""
}: VerifiedProductLinkProps) {
  
  const handleClick = () => {
    window.open('https://forms.gle/CVdyFmBcASjXRKww7', '_blank')
  }

  return (
    <Button onClick={handleClick} className={className}>
      Comprar
    </Button>
  )
}
