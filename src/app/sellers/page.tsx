
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Calculator, DollarSign, Smile, TrendingUp, Zap } from 'lucide-react';
import Logo from '@/components/icons/logo';

const FAQItem: React.FC<{ value: string; question: string; children: React.ReactNode }> = ({ value, question, children }) => (
    <AccordionItem value={value} className="border-b border-slate-200 dark:border-slate-700 py-2">
        <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline text-slate-800 dark:text-slate-200">{question}</AccordionTrigger>
        <AccordionContent className="text-slate-600 dark:text-slate-400 pt-2 text-base">
            {children}
        </AccordionContent>
    </AccordionItem>
);

const ProfitCalculator: React.FC = () => {
    const [monthlySales, setMonthlySales] = useState<number | ''>(1000000);
    const [potentialGain, setPotentialGain] = useState({ min: 0, max: 0 });

    const calculateGain = () => {
        if (!monthlySales || monthlySales <= 0) {
            setPotentialGain({ min: 0, max: 0 });
            return;
        }

        const abandonmentReductionMin = 0.15; // 15%
        const abandonmentReductionMax = 0.25; // 25%

        // Si el 75% abandona, el 25% compra.
        // Ventas actuales = Clientes Totales * (1 - 0.75)
        // Clientes Totales = Ventas actuales / 0.25
        const totalPotentialRevenue = monthlySales / 0.25;
        const abandoningRevenue = totalPotentialRevenue * 0.75;
        
        const minGain = abandoningRevenue * abandonmentReductionMin;
        const maxGain = abandoningRevenue * abandonmentReductionMax;

        setPotentialGain({ min: minGain, max: maxGain });
    };
    
    React.useEffect(() => {
        calculateGain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthlySales]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    };

    return (
        <Card className="p-6 md:p-8 bg-white dark:bg-slate-900 border-2 border-primary/20 shadow-2xl rounded-2xl">
            <CardHeader className="p-0 mb-6 text-center">
                <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl md:text-3xl font-bold">Calculadora de Ganancia Potencial</CardTitle>
                 <p className="text-muted-foreground mt-2">Mirá cuánto más podrías vender con Shoppa!</p>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="monthlySales" className="font-semibold text-lg">Tus Ventas Mensuales (ARS)</Label>
                    <Input 
                        id="monthlySales" 
                        type="text"
                        value={monthlySales === '' ? '' : monthlySales.toLocaleString('es-AR')}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setMonthlySales(value === '' ? '' : Number(value));
                        }}
                        className="h-14 text-2xl font-bold text-center"
                    />
                </div>
                
                {(potentialGain.min > 0 || potentialGain.max > 0) && (
                    <div className="text-center pt-6 border-t border-primary/10 animate-in fade-in duration-500">
                        <p className="text-lg text-muted-foreground">Podrías aumentar tus ventas mensuales entre:</p>
                        <p className="text-3xl md:text-5xl font-bold text-green-600 dark:text-green-400 my-2">
                            {formatCurrency(potentialGain.min)} y {formatCurrency(potentialGain.max)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Al reducir el abandono de carrito entre un 15% y un 25%.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default function SellersLandingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo />
                    </Link>
                    <Button variant="outline" asChild className="rounded-full">
                        <Link href="/">
                            ← Volver a Comprar
                        </Link>
                    </Button>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="container mx-auto px-4 pt-20 pb-24 text-center">
                    <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl animate-in fade-in-0 slide-in-from-bottom-5 duration-1000">
                       Vendé más, con menos esfuerzo.
                    </h1>
                    <p className="mx-auto mt-6 max-w-3xl text-xl text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-5 duration-1000 delay-200">
                        Shoppa! es tu vendedor estrella 24/7. Transforma clientes indecisos en compradores seguros, reduciendo el abandono de carrito y aumentando tus ingresos.
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-4 animate-in fade-in-0 slide-in-from-bottom-5 duration-1000 delay-300">
                        <Button size="lg" asChild className="rounded-full px-8 h-12 text-lg">
                            <Link href="/demo">Probar Demo <ArrowRight className="ml-2 h-5 w-5" /></Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="rounded-full px-8 h-12 text-lg">
                            <Link href="mailto:juan.ulian@pluscompol.com?subject=Solicitud%20de%20Reunión%20-%20Shoppa!&body=Hola!%20Me%20gustaría%20coordinar%20una%20reunión%20en%20los%20próximos%20días%20para%20ver%20como%20implementar%20Shoppa!%20en%20mi%20negocio.%20Vendo%20...%20(completar%20sugerencia)">Agendar Reunión</Link>
                        </Button>
                    </div>
                </section>

                {/* Problem Section */}
                <section className="bg-slate-100 dark:bg-slate-900 py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto">
                            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">El costo oculto de la indecisión</h2>
                            <p className="mt-6 text-lg text-muted-foreground">
                                Cada día, clientes potenciales abandonan tu tienda no por el precio, sino por la confusión. Es una pérdida silenciosa que afecta directamente tu rentabilidad.
                            </p>
                        </div>
                        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
                            <Card className="p-6 bg-white dark:bg-slate-800/50"><p className="text-5xl font-bold text-primary">75%</p><p className="mt-2 font-medium text-muted-foreground">de carritos abandonados en LATAM</p></Card>
                            <Card className="p-6 bg-white dark:bg-slate-800/50"><p className="text-5xl font-bold text-primary">30+</p><p className="mt-2 font-medium text-muted-foreground">minutos comparando sin decidir</p></Card>
                            <Card className="p-6 bg-white dark:bg-slate-800/50"><p className="text-5xl font-bold text-primary">50%</p><p className="mt-2 font-medium text-muted-foreground">del tiempo de vendedores en consultas repetitivas</p></Card>
                            <Card className="p-6 bg-white dark:bg-slate-800/50"><p className="text-5xl font-bold text-primary">↓</p><p className="mt-2 font-medium text-muted-foreground">margen al competir solo por precio</p></Card>
                        </div>
                    </div>
                </section>
                
                {/* Solution Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-20 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">La Solución: Tu Asesor Digital 24/7</h2>
                            <p className="text-lg text-muted-foreground">Shoppa! replica a tu mejor vendedor a escala digital. Guía, entiende y recomienda, convirtiendo la duda en una venta segura.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto text-center">
                            <div>
                                <div className="text-6xl font-bold text-primary/20 dark:text-primary/30 mb-4">1</div>
                                <h3 className="text-2xl font-bold mb-2">Cliente Llega Confundido</h3>
                                <p className="text-muted-foreground text-lg">Abrumado por opciones y especificaciones técnicas que no entiende.</p>
                            </div>
                             <div>
                                <div className="text-6xl font-bold text-primary/20 dark:text-primary/30 mb-4">2</div>
                                <h3 className="text-2xl font-bold mb-2">Shoppa! Pregunta y Entiende</h3>
                                <p className="text-muted-foreground text-lg">Hace 3 preguntas simples para entender la necesidad real en su lenguaje.</p>
                            </div>
                            <div>
                                <div className="text-6xl font-bold text-primary/20 dark:text-primary/30 mb-4">3</div>
                                <h3 className="text-2xl font-bold mb-2">Recibe 3 Opciones Perfectas</h3>
                                <p className="text-muted-foreground text-lg">Recomendaciones claras con justificaciones que generan confianza y aceleran la compra.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Business Benefits Section */}
                <section className="bg-slate-100 dark:bg-slate-900 py-24">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 max-w-3xl mx-auto">Resultados Reales en Tu Negocio</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            <Card className="p-8 text-center bg-white dark:bg-slate-800/50"><TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" /><h3 className="text-2xl font-bold mb-2">15-25% Menos Abandono</h3><p className="text-muted-foreground text-lg">Captura valor perdido convirtiendo dudas en decisiones de compra.</p></Card>
                            <Card className="p-8 text-center bg-white dark:bg-slate-800/50"><Smile className="h-12 w-12 text-primary mx-auto mb-4" /><h3 className="text-2xl font-bold mb-2">60-70% Menos Tiempo</h3><p className="text-muted-foreground text-lg">Reduce el tiempo de decisión de 30+ minutos a 3-5 minutos.</p></Card>
                            <Card className="p-8 text-center bg-white dark:bg-slate-800/50"><DollarSign className="h-12 w-12 text-primary mx-auto mb-4" /><h3 className="text-2xl font-bold mb-2">Vendedores Optimizados</h3><p className="text-muted-foreground text-lg">Libera a tu equipo de preguntas básicas para que se enfoquen en cerrar ventas.</p></Card>
                        </div>
                    </div>
                </section>

                {/* Profit Calculator Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <ProfitCalculator />
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="bg-slate-100 dark:bg-slate-900 py-24">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Preguntas Frecuentes</h2>
                        </div>
                        <Accordion type="single" collapsible className="w-full space-y-2">
                            <FAQItem value="faq-1" question="¿Cómo se integra Shoppa! con mi e-commerce actual?">Nuestra integración es simple y rápida. Funciona con las plataformas más populares como Shopify, Tiendanube y WooCommerce a través de un simple snippet de código. No necesitás un equipo técnico para ponerlo en marcha.</FAQItem>
                            <FAQItem value="faq-2" question="¿Mi equipo necesita capacitación para usarlo?">¡No! Shoppa! es totalmente autónomo. Funciona 24/7 sin intervención humana. Tu equipo solo notará que los clientes llegan más decididos y con menos preguntas básicas.</FAQItem>
                            <FAQItem value="faq-3" question="¿Cuál es el modelo de negocio?">Es simple: ganamos si vos ganás. Nuestro modelo es un "Pay-per-Success", donde cobramos una pequeña comisión solo sobre las ventas generadas a través de nuestras recomendaciones. Sin costos fijos ni de implementación.</FAQItem>
                            <FAQItem value="faq-4" question="¿Se puede personalizar el catálogo de productos?">Por supuesto. Shoppa! se conecta a tu base de datos de productos para asegurarse de que las recomendaciones siempre reflejen tu stock, precios y ofertas actuales. La personalización es total.</FAQItem>
                        </Accordion>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-24 bg-primary text-primary-foreground">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">¿Listo para dejar de perder clientes?</h2>
                        <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">Probá Shoppa! sin compromiso. La implementación es rápida, gratuita y te acompañamos en cada paso.</p>
                        <Button size="lg" variant="secondary" asChild className="rounded-full px-12 h-14 text-xl">
                            <Link href="mailto:juan.ulian@pluscompol.com?subject=Solicitud%20de%20Reunión%20-%20Shoppa!&body=Hola!%20Me%20gustaría%20coordinar%20una%20reunión%20en%20los%20próximos%20días%20para%20ver%20como%20implementar%20Shoppa!%20en%20mi%20negocio.%20Vendo%20...%20(completar%20sugerencia)">Quiero Probarlo →</Link>
                        </Button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 py-8 bg-slate-100 dark:bg-slate-900">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p className="mb-4">© 2025 Shoppa! Todos los derechos reservados.</p>
                    <div className="flex justify-center gap-6">
                        <Link href="/" className="hover:text-primary">Comprar</Link>
                        <Link href="mailto:juanulian@gmail.com" className="hover:text-primary">Contacto</Link>
                    </div>
                </div>
            </footer>
          </div>
    );
}
