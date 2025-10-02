import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, TrendingUp, Smile, DollarSign } from 'lucide-react';

export default function SellersLandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">S!</span>
            </div>
            <span className="text-2xl font-bold font-headline">Shoppa!</span>
          </Link>

          <Button variant="outline" asChild className="rounded-full">
            <Link href="/">
              ← Volver a Comprar
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Vendé más con
            <br />
            <span className="text-primary">comisiones justas</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Dejá de pagar 13-16% a Mercado Libre. En Shoppa! pagás solo 5% y llegás a clientes que ya saben qué quieren comprar.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="rounded-full">
              <Link href="/auth/register?role=seller">
                Empezar a Vender <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full">
              <Link href="mailto:juanulian@gmail.com">
                Hablar con Nosotros
              </Link>
            </Button>
          </div>
        </section>

        {/* Comparación */}
        <section className="bg-slate-100 dark:bg-slate-900 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
              Ahorrá en cada venta
            </h2>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mercado Libre */}
                <Card className="p-8 border-2 border-red-200 dark:border-red-900">
                  <h3 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Mercado Libre</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <p className="flex justify-between">
                      <span>Comisión:</span>
                      <span className="font-bold text-red-600">13-16%</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Venta de $100,000:</span>
                      <span className="font-bold">$84,000 - $87,000</span>
                    </p>
                  </div>
                </Card>

                {/* Shoppa */}
                <Card className="p-8 border-2 border-primary">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Shoppa!</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <p className="flex justify-between">
                      <span>Comisión:</span>
                      <span className="font-bold text-primary">5%</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Venta de $100,000:</span>
                      <span className="font-bold text-primary">$95,000</span>
                    </p>
                  </div>
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm font-semibold text-primary">
                      ✨ Ahorrás hasta $11,000 por venta
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
              Por qué vender en Shoppa!
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="p-8 text-center">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Más Margen</h3>
                <p className="text-muted-foreground">
                  Pagás 5% vs 13-16% de otros marketplaces. Más ganancia en cada venta.
                </p>
              </Card>

              <Card className="p-8 text-center">
                <Smile className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Clientes Decididos</h3>
                <p className="text-muted-foreground">
                  Recibís consultas de gente que ya sabe lo que quiere. Menos tiempo perdido.
                </p>
              </Card>

              <Card className="p-8 text-center">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Setup Gratis</h3>
                <p className="text-muted-foreground">
                  Sin costos de entrada. Pagás solo cuando vendés. Cero riesgo para empezar.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Cómo funciona para vendedores */}
        <section className="bg-slate-100 dark:bg-slate-900 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
              Empezá a vender en 3 pasos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Registrate</h3>
                <p className="text-muted-foreground">
                  Completá tus datos de negocio y verificación. Demora menos de 5 minutos.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Cargá Productos</h3>
                <p className="text-muted-foreground">
                  Subí fotos, precios y specs. Nosotros nos encargamos de mostrarlos a la gente correcta.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Recibí Ventas</h3>
                <p className="text-muted-foreground">
                  Te notificamos cada venta. Cobrás cada 15 días directo en tu cuenta.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button size="lg" asChild className="rounded-full">
                <Link href="/auth/register?role=seller">
                  Crear Cuenta de Vendedor →
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
              Preguntas Frecuentes
            </h2>

            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">¿Cuánto cuesta vender?</h3>
                <p className="text-muted-foreground">
                  5% de comisión por venta. Sin costos fijos, sin suscripciones. Si no vendés, no pagás.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">¿Cuándo cobro?</h3>
                <p className="text-muted-foreground">
                  Transferimos cada 15 días el total de tus ventas menos la comisión. Directo a tu cuenta bancaria.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">¿Qué productos puedo vender?</h3>
                <p className="text-muted-foreground">
                  Por ahora solo celulares. Próximamente: laptops, tablets, auriculares y más tech.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg mb-2">¿Necesito facturar?</h3>
                <p className="text-muted-foreground">
                  Sí, como siempre. Vos emitís la factura al comprador. Nosotros te damos todos los datos.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              ¿Listo para vender más pagando menos?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Únete a los vendedores que ya están ahorrando en comisiones
            </p>
            <Button size="lg" variant="secondary" asChild className="rounded-full px-12">
              <Link href="/auth/register?role=seller">
                Crear Cuenta Gratis →
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-4">© 2025 Shoppa! Todos los derechos reservados.</p>
          <div className="flex justify-center gap-6">
            <Link href="/" className="hover:text-primary">
              Comprar
            </Link>
            <Link href="mailto:juanulian@gmail.com" className="hover:text-primary">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
