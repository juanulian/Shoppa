'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, CreditCard, User, MapPin } from 'lucide-react';

interface SimulatedCheckoutProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  onSuccess?: (orderNumber: string) => void;
}

export default function SimulatedCheckout({ product, onSuccess }: SimulatedCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Buyer info
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    buyerAddress: '',
    buyerCity: '',
    buyerProvince: '',
    buyerPostalCode: '',
    buyerNotes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos básicos
    if (!formData.buyerName || !formData.buyerEmail || !formData.buyerPhone || !formData.buyerAddress || !formData.buyerCity || !formData.buyerProvince || !formData.buyerPostalCode) {
      toast({
        title: 'Error',
        description: 'Por favor completá todos los campos obligatorios',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Guardar datos de envío en la base de datos antes de ir a pagar
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          productImage: product.imageUrl,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar los datos');
      }

      const data = await response.json();

      // Redirigir a Mercado Pago con el ID de checkout
      const mpUrl = new URL('https://mpago.la/1XSvNBm');
      mpUrl.searchParams.set('external_reference', data.checkoutId);

      window.location.href = mpUrl.toString();
    } catch (error) {
      console.error('Error saving checkout data:', error);
      toast({
        title: 'Error',
        description: 'Hubo un error al procesar tu pedido. Por favor intentá de nuevo.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  if (orderCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-8 text-center">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-3">¡Compra Confirmada!</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Orden <strong>{orderNumber}</strong>
          </p>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-lg mb-2">✅ Próximos Pasos:</h3>
            <ol className="text-left space-y-2 text-sm">
              <li>1. El vendedor recibió un email con tu orden</li>
              <li>2. Te contactará para coordinar entrega/envío</li>
              <li>3. Recibirás tu {product.name} en los próximos días</li>
              <li>4. Después podrás calificar al vendedor</li>
            </ol>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 mb-6 text-sm">
            <p className="mb-2">
              <strong>Email de confirmación enviado a:</strong><br />
              {formData.buyerEmail}
            </p>
            <p>
              <strong>Recibirás en:</strong><br />
              {formData.buyerAddress}
            </p>
          </div>

          <Button onClick={() => window.location.href = '/'} size="lg">
            Volver al Inicio
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Finalizar Compra</CardTitle>
        <CardDescription>
          Completá tus datos de envío para continuar con el pago
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Resumen del Producto */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-4">Resumen de Compra</h3>
            <div className="flex items-center gap-4">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold">{product.name}</p>
                <p className="text-2xl font-bold text-primary">
                  ${product.price.toLocaleString('es-AR')}
                </p>
              </div>
            </div>
          </div>

          {/* Datos Personales */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Datos Personales</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buyerName">Nombre Completo *</Label>
                <Input
                  id="buyerName"
                  placeholder="Juan Pérez"
                  value={formData.buyerName}
                  onChange={(e) => handleInputChange('buyerName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerEmail">Email *</Label>
                <Input
                  id="buyerEmail"
                  type="email"
                  placeholder="juan@email.com"
                  value={formData.buyerEmail}
                  onChange={(e) => handleInputChange('buyerEmail', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="buyerPhone">Teléfono *</Label>
                <Input
                  id="buyerPhone"
                  type="tel"
                  placeholder="+54 11 1234-5678"
                  value={formData.buyerPhone}
                  onChange={(e) => handleInputChange('buyerPhone', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Dirección de Envío */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Dirección de Envío</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="buyerAddress">Calle y Número *</Label>
                <Input
                  id="buyerAddress"
                  placeholder="Av. Corrientes 1234, Piso 5, Depto B"
                  value={formData.buyerAddress}
                  onChange={(e) => handleInputChange('buyerAddress', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerCity">Ciudad *</Label>
                <Input
                  id="buyerCity"
                  placeholder="Buenos Aires"
                  value={formData.buyerCity}
                  onChange={(e) => handleInputChange('buyerCity', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerProvince">Provincia *</Label>
                <Input
                  id="buyerProvince"
                  placeholder="CABA"
                  value={formData.buyerProvince}
                  onChange={(e) => handleInputChange('buyerProvince', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="buyerPostalCode">Código Postal *</Label>
                <Input
                  id="buyerPostalCode"
                  placeholder="C1043"
                  value={formData.buyerPostalCode}
                  onChange={(e) => handleInputChange('buyerPostalCode', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="buyerNotes">Notas adicionales (opcional)</Label>
                <Input
                  id="buyerNotes"
                  placeholder="Ej: Timbre no funciona, llamar por tel"
                  value={formData.buyerNotes}
                  onChange={(e) => handleInputChange('buyerNotes', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" size="lg" className="w-full">
            <CreditCard className="mr-2 h-5 w-5" />
            Ir a Pagar - ${product.price.toLocaleString('es-AR')}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Al continuar, serás redirigido a Mercado Pago para completar tu compra de forma segura.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
