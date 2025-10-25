'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Clock, Package, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/icons/logo';
import { Suspense } from 'react';

function ConfirmationContent() {
  const searchParams = useSearchParams();

  // Mercado Pago envía estos parámetros en la URL
  const status = searchParams.get('status') || searchParams.get('collection_status');
  const paymentId = searchParams.get('payment_id') || searchParams.get('preference_id');
  const externalReference = searchParams.get('external_reference');

  // Determinar el estado del pago
  const getPaymentStatus = () => {
    switch (status) {
      case 'approved':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: '¡Pago Confirmado!',
          description: 'Tu compra se procesó exitosamente',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
        };
      case 'pending':
      case 'in_process':
        return {
          icon: <Clock className="h-16 w-16 text-yellow-500" />,
          title: 'Pago Pendiente',
          description: 'Estamos procesando tu pago',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
        };
      case 'rejected':
      case 'cancelled':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: 'Pago Rechazado',
          description: 'No pudimos procesar tu pago',
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
        };
      default:
        return {
          icon: <Package className="h-16 w-16 text-blue-500" />,
          title: 'Confirmación de Compra',
          description: 'Gracias por tu compra en Shoppa!',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
        };
    }
  };

  const paymentStatus = getPaymentStatus();

  return (
    <div className="min-h-screen bg-[url('/background/header_footer.png')] bg-cover bg-center flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/80"></div>

      <Card className="w-full max-w-2xl relative z-10">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Link href="/">
              <Logo />
            </Link>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Estado del pago */}
          <div className={`${paymentStatus.bgColor} rounded-lg p-8 text-center space-y-4`}>
            <div className="flex justify-center">
              {paymentStatus.icon}
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${paymentStatus.textColor}`}>
                {paymentStatus.title}
              </h1>
              <p className={`text-sm ${paymentStatus.textColor} mt-2`}>
                {paymentStatus.description}
              </p>
            </div>
          </div>

          {/* Detalles de la transacción */}
          {(paymentId || externalReference) && (
            <div className="border rounded-lg p-6 space-y-3 bg-slate-50">
              <h2 className="font-semibold text-sm text-slate-600">Detalles de la transacción</h2>
              {paymentId && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">ID de Pago:</span>
                  <span className="font-mono font-semibold">{paymentId}</span>
                </div>
              )}
              {externalReference && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Referencia:</span>
                  <span className="font-mono font-semibold">{externalReference}</span>
                </div>
              )}
            </div>
          )}

          {/* Información adicional según el estado */}
          {status === 'approved' && (
            <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
              <h3 className="font-semibold text-green-800 mb-2">Próximos pasos</h3>
              <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                <li>Recibirás un email de confirmación en los próximos minutos</li>
                <li>El vendedor procesará tu pedido dentro de las 24hs</li>
                <li>Te contactaremos para coordinar el envío</li>
              </ul>
            </div>
          )}

          {status === 'pending' && (
            <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
              <h3 className="font-semibold text-yellow-800 mb-2">¿Qué sigue?</h3>
              <p className="text-sm text-yellow-700">
                Tu pago está siendo procesado. Te notificaremos por email cuando se confirme.
                Este proceso puede tomar hasta 48 horas hábiles.
              </p>
            </div>
          )}

          {(status === 'rejected' || status === 'cancelled') && (
            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
              <h3 className="font-semibold text-red-800 mb-2">¿Necesitás ayuda?</h3>
              <p className="text-sm text-red-700 mb-2">
                Si tenés dudas sobre por qué se rechazó tu pago, podés:
              </p>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                <li>Intentar nuevamente con otro medio de pago</li>
                <li>Contactar a tu banco o emisor de la tarjeta</li>
                <li>Escribirnos a soporte@shoppa.ar</li>
              </ul>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button asChild className="flex-1" variant="default">
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="h-4 w-4" />
                Volver al Inicio
              </Link>
            </Button>
            {(status === 'rejected' || status === 'cancelled') && (
              <Button asChild className="flex-1" variant="outline">
                <Link href="/">
                  Intentar Nuevamente
                </Link>
              </Button>
            )}
          </div>

          {/* Footer con información de contacto */}
          <div className="border-t pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              ¿Tenés dudas? Escribinos a{' '}
              <a href="mailto:soporte@shoppa.ar" className="text-primary hover:underline">
                soporte@shoppa.ar
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[url('/background/header_footer.png')] bg-cover bg-center flex items-center justify-center">
        <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/80"></div>
        <div className="relative z-10">
          <Package className="h-12 w-12 animate-pulse text-primary" />
        </div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
