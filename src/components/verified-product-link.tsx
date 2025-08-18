'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'

interface VerifiedProductLinkProps {
  className?: string
}

export default function VerifiedProductLink({ 
  className = ""
}: VerifiedProductLinkProps) {
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className={className}>
          Comprar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Simulación de Compra Finalizada</AlertDialogTitle>
          <AlertDialogDescription>
            La simulación de compra ha finalizado. ¿Avanzamos a la encuesta de satisfacción?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
          <AlertDialogAction onClick={() => window.open('https://forms.gle/CVdyFmBcASjXRKww7', '_blank')}>
            Avanzar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
