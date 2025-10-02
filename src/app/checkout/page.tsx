'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SimulatedCheckout from '@/components/checkout/simulated-checkout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    // Obtener datos del producto de URL params
    const productData = {
      id: searchParams.get('id') || 'demo-product',
      name: searchParams.get('name') || 'Producto Demo',
      price: parseInt(searchParams.get('price') || '100000'),
      imageUrl: searchParams.get('image') || '',
    };

    setProduct(productData);
  }, [searchParams]);

  const handleSuccess = (orderNumber: string) => {
    // Redirigir a página de confirmación o home después de 5 segundos
    setTimeout(() => {
      router.push('/');
    }, 5000);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <SimulatedCheckout product={product} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
