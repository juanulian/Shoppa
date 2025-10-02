'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Store, CheckCircle2 } from 'lucide-react';

interface SellerOnboardingFormProps {
  onSuccess?: () => void;
}

export default function SellerOnboardingForm({ onSuccess }: SellerOnboardingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'info' | 'banking' | 'success'>('info');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'individual' as 'individual' | 'company' | 'cooperative',
    taxId: '',
    businessAddress: '',
    businessPhone: '',
    businessEmail: '',
    bankName: '',
    bankAccountNumber: '',
    bankAccountType: 'savings' as 'savings' | 'checking',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBusinessInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.businessName || !formData.taxId || !formData.businessAddress) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor completa todos los campos obligatorios',
        variant: 'destructive',
      });
      return;
    }

    setStep('banking');
  };

  const handleBankingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('shoppa_token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/seller/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Onboarding failed');
      }

      toast({
        title: 'Perfil de vendedor creado',
        description: 'Tu solicitud está en revisión. Te notificaremos cuando sea aprobada.',
      });

      setStep('success');
      onSuccess?.();

    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast({
        title: 'Error',
        description: error.message || 'No pudimos completar tu registro',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">¡Solicitud enviada!</h2>
          <p className="text-muted-foreground mb-6">
            Estamos revisando tu información. Te notificaremos por email cuando tu cuenta sea verificada.
            Esto suele tomar 24-48 horas.
          </p>
          <Button onClick={() => window.location.href = '/seller/dashboard'}>
            Ir al Panel de Vendedor
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'banking') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Store className="w-8 h-8 text-primary" />
            <div>
              <CardTitle>Información Bancaria</CardTitle>
              <CardDescription>Paso 2 de 2 - Para recibir tus pagos</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBankingSubmit} className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                💡 Puedes completar esta información más tarde, pero es necesaria para recibir pagos.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName">Banco</Label>
              <Input
                id="bankName"
                placeholder="Ej: Banco Galicia"
                value={formData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccountType">Tipo de Cuenta</Label>
              <Select
                value={formData.bankAccountType}
                onValueChange={(value) => handleInputChange('bankAccountType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">Caja de Ahorro</SelectItem>
                  <SelectItem value="checking">Cuenta Corriente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccountNumber">Número de Cuenta / CBU</Label>
              <Input
                id="bankAccountNumber"
                placeholder="22 dígitos del CBU"
                maxLength={22}
                value={formData.bankAccountNumber}
                onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('info')}
                disabled={isLoading}
              >
                Atrás
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Completar Registro'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Store className="w-8 h-8 text-primary" />
          <div>
            <CardTitle>Registro de Vendedor</CardTitle>
            <CardDescription>Paso 1 de 2 - Información del negocio</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBusinessInfoSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Nombre del Negocio *</Label>
            <Input
              id="businessName"
              placeholder="TechStore CABA"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessType">Tipo de Negocio *</Label>
            <Select
              value={formData.businessType}
              onValueChange={(value) => handleInputChange('businessType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual / Monotributo</SelectItem>
                <SelectItem value="company">Empresa / Responsable Inscripto</SelectItem>
                <SelectItem value="cooperative">Cooperativa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxId">CUIT / CUIL *</Label>
            <Input
              id="taxId"
              placeholder="20-12345678-9"
              value={formData.taxId}
              onChange={(e) => handleInputChange('taxId', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessAddress">Dirección del Negocio *</Label>
            <Input
              id="businessAddress"
              placeholder="Av. Corrientes 1234, CABA"
              value={formData.businessAddress}
              onChange={(e) => handleInputChange('businessAddress', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessPhone">Teléfono del Negocio *</Label>
            <Input
              id="businessPhone"
              placeholder="+54 11 1234-5678"
              value={formData.businessPhone}
              onChange={(e) => handleInputChange('businessPhone', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessEmail">Email del Negocio *</Label>
            <Input
              id="businessEmail"
              type="email"
              placeholder="contacto@tunegocio.com"
              value={formData.businessEmail}
              onChange={(e) => handleInputChange('businessEmail', e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Continuar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
