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

    // Payment info (simulado)
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  // Format expiry MM/YY
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar campos básicos
      if (!formData.buyerName || !formData.buyerEmail || !formData.buyerPhone || !formData.buyerAddress) {
        throw new Error('Por favor completá todos los datos personales');
      }

      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv || !formData.cardName) {
        throw new Error('Por favor completá todos los datos de la tarjeta');
      }

      // Validar número de tarjeta (16 dígitos)
      const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
      if (cleanCardNumber.length !== 16 || !/^\d+$/.test(cleanCardNumber)) {
        throw new Error('Número de tarjeta inválido');
      }

      // Validar CVV
      if (formData.cardCvv.length < 3 || !/^\d+$/.test(formData.cardCvv)) {
        throw new Error('CVV inválido');
      }

      // Generar número de orden
      const generatedOrderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const platformFee = product.price * 0.05;
      const sellerReceives = product.price - platformFee;

      // Construir email para el vendedor
      const emailSubject = `🎉 Nueva venta en Shoppa! - Orden ${generatedOrderNumber}`;
      const emailBody = `
NUEVA VENTA EN SHOPPA!
Orden: ${generatedOrderNumber}

═══════════════════════════════════
📦 PRODUCTO VENDIDO
═══════════════════════════════════
${product.name}
Precio: $${product.price.toLocaleString('es-AR')}

═══════════════════════════════════
👤 DATOS DEL COMPRADOR
═══════════════════════════════════
Nombre: ${formData.buyerName}
Email: ${formData.buyerEmail}
Teléfono: ${formData.buyerPhone}
Dirección: ${formData.buyerAddress}

═══════════════════════════════════
💰 RESUMEN FINANCIERO
═══════════════════════════════════
Precio del Producto: $${product.price.toLocaleString('es-AR')}
Comisión Shoppa! (5%): -$${platformFee.toLocaleString('es-AR')}
──────────────────────
RECIBIRÁS: $${sellerReceives.toLocaleString('es-AR')}

* Transferencia cada 15 días

═══════════════════════════════════
⚠️ ACCIÓN REQUERIDA
═══════════════════════════════════
1. Contactá al comprador por WhatsApp/Email
2. EMITÍ LA FACTURA a nombre de: ${formData.buyerName}
3. Coordiná entrega/envío
4. Marcá como "Enviado" en tu panel

═══════════════════════════════════
💳 PAGO SIMULADO CON
═══════════════════════════════════
Tarjeta: **** **** **** ${cleanCardNumber.slice(-4)}
Vencimiento: ${formData.cardExpiry}
Titular: ${formData.cardName}

Nota: Este es un pago simulado para demo.
En producción usaremos Stripe/MercadoPago.

═══════════════════════════════════
Shoppa! - El marketplace sin vueltas
Si tenés dudas, respondé este email.
      `.trim();

      // Abrir cliente de email del usuario
      window.location.href = `mailto:juanulian@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

      // Esperar un momento para que se abra el email
      setTimeout(() => {
        setOrderNumber(generatedOrderNumber);
        setOrderCompleted(true);

        toast({
          title: '¡Compra exitosa! 🎉',
          description: `Orden ${generatedOrderNumber} procesada. Se abrió tu cliente de email para notificar al vendedor.`,
        });

        onSuccess?.(generatedOrderNumber);
        setIsLoading(false);
      }, 1000);

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: 'Error',
        description: error.message || 'No pudimos procesar tu compra',
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
          Checkout simulado - En producción usaríamos Stripe/MercadoPago
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

            <div className="space-y-2">
              <Label htmlFor="buyerAddress">Dirección Completa *</Label>
              <Input
                id="buyerAddress"
                placeholder="Av. Corrientes 1234, Piso 5, Depto B, CABA"
                value={formData.buyerAddress}
                onChange={(e) => handleInputChange('buyerAddress', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Incluí calle, número, piso/depto, localidad y código postal
              </p>
            </div>
          </div>

          {/* Datos de Tarjeta (Simulado) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Datos de Pago (Simulado)</h3>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-sm">
              <p><strong>💡 Tarjetas de prueba:</strong></p>
              <ul className="mt-2 space-y-1">
                <li>• Número: 4242 4242 4242 4242</li>
                <li>• Vencimiento: cualquier fecha futura (12/25)</li>
                <li>• CVV: cualquier 3 dígitos (123)</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cardNumber">Número de Tarjeta *</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formatCardNumber(formData.cardNumber)}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\s/g, '');
                    if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
                      handleInputChange('cardNumber', cleaned);
                    }
                  }}
                  maxLength={19}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardExpiry">Vencimiento *</Label>
                <Input
                  id="cardExpiry"
                  placeholder="MM/AA"
                  value={formData.cardExpiry}
                  onChange={(e) => {
                    const formatted = formatExpiry(e.target.value);
                    if (formatted.replace('/', '').length <= 4) {
                      handleInputChange('cardExpiry', formatted);
                    }
                  }}
                  maxLength={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardCvv">CVV *</Label>
                <Input
                  id="cardCvv"
                  placeholder="123"
                  value={formData.cardCvv}
                  onChange={(e) => {
                    if (e.target.value.length <= 4 && /^\d*$/.test(e.target.value)) {
                      handleInputChange('cardCvv', e.target.value);
                    }
                  }}
                  maxLength={4}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cardName">Nombre en la Tarjeta *</Label>
                <Input
                  id="cardName"
                  placeholder="JUAN PEREZ"
                  value={formData.cardName}
                  onChange={(e) => handleInputChange('cardName', e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Procesando Compra...
              </>
            ) : (
              <>
                Confirmar Compra - ${product.price.toLocaleString('es-AR')}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Al confirmar, aceptás nuestros términos y condiciones.
            <br />
            Este es un checkout simulado. En producción usaríamos Stripe/MercadoPago.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
