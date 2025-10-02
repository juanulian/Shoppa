
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, BarChart, Bot, DollarSign, Smile, TrendingUp, User, Zap, CheckCircle, Calculator } from 'lucide-react';
import Logo from '@/components/icons/logo';

const FAQItem: React.FC<{ value: string; question: string; children: React.ReactNode }> = ({ value, question, children }) => (
    <AccordionItem value={value} className="border-white/20 bg-primary/5 p-4 rounded-lg">
        <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">{question}</AccordionTrigger>
        <AccordionContent className="text-muted-foreground pt-2">{children}</AccordionContent>
    </AccordionItem>
);

const ProfitCalculator: React.FC = () => {
    const [monthlySales, setMonthlySales] = useState<number | ''>('');
    const [averagePrice, setAveragePrice] = useState<number | ''>('');
    const [potentialGain, setPotentialGain] = useState({ min: 0, max: 0 });

    const calculateGain = () => {
        if (!monthlySales || !averagePrice || monthlySales <= 0 || averagePrice <= 0) {
            setPotentialGain({ min: 0, max: 0 });
            return;
        }

        const currentAbandonmentRate = 0.753;
        const salesVolume = monthlySales / averagePrice;
        
        // Potential customers that are currently abandoning
        const potentialCustomers = salesVolume / (1 - currentAbandonmentRate);
        const abandoningCustomers = potentialCustomers * currentAbandonmentRate;
        
        // Recovery rates
        const minRecovery = 0.15; // 15% reduction in abandonment
        const maxRecovery = 0.25; // 25% reduction in abandonment

        const minRecoveredCustomers = abandoningCustomers * minRecovery;
        const maxRecoveredCustomers = abandoningCustomers * maxRecovery;

        const minGain = minRecoveredCustomers * averagePrice;
        const maxGain = maxRecoveredCustomers * averagePrice;

        setPotentialGain({ min: minGain, max: maxGain });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(value);
    };

    return (
        <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/10 via-white to-primary/5 dark:from-primary/20 dark:via-slate-900 dark:to-primary/10 border-2 border-primary/30 shadow-2xl">
            <CardHeader className="p-0 mb-6 text-center">
                <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl md:text-3xl font-bold">Calculadora de Ganancias Potenciales</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="monthlySales" className="font-semibold">Ventas Mensuales (ARS)</Label>
                        <Input 
                            id="monthlySales" 
                            type="number"
                            placeholder="Ej: 1000000"
                            value={monthlySales}
                            onChange={(e) => setMonthlySales(Number(e.target.value))}
                            className="h-12 text-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="averagePrice" className="font-semibold">Precio Promedio por Unidad (ARS)</Label>
                        <Input 
                            id="averagePrice" 
                            type="number"
                            placeholder="Ej: 150000"
                            value={averagePrice}
                            onChange={(e) => setAveragePrice(Number(e.target.value))}
                            className="h-12 text-lg"
                        />
                    </div>
                </div>
                <Button onClick={calculateGain} size="lg" className="w-full h-12 text-lg">
                    Calcular Ganancia Extra
                </Button>
                
                {(potentialGain.min > 0 || potentialGain.max > 0) && (
                    <div className="text-center pt-6 border-t border-primary/20 animate-in fade-in duration-500">
                        <p className="text-lg text-muted-foreground">Podrías aumentar tus ventas mensuales entre:</p>
                        <p className="text-3xl md:text-5xl font-bold text-green-600 dark:text-green-400 my-2">
                            {formatCurrency(potentialGain.min)} y {formatCurrency(potentialGain.max)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Al reducir el abandono de carrito entre un 15% y un 25% con Shoppa!
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default function SellersLandingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-[url('/background/header_footer.png')] bg-cover bg-center">
          <div className="flex min-h-screen flex-col bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
            {/* Header */}
            <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 sticky top-0 z-50">
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
                <section className="container mx-auto px-4 pt-20 pb-16 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl animate-in fade-in-0 slide-in-from-bottom-5 duration-1000">
                        ¿Perdés 75% de tus ventas por carritos abandonados?
                    </h1>
                    <p className="mx-auto mt-6 max-w-3xl text-lg text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-5 duration-1000 delay-200">
                        Shoppa! elimina la parálisis por análisis presentando exactamente 3 opciones perfectas. Transforma clientes confundidos en compradores seguros en 3 minutos.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4 animate-in fade-in-0 slide-in-from-bottom-5 duration-1000 delay-300">
                        <Button size="lg" asChild>
                            <Link href="/demo">Probar ahora <ArrowRight className="ml-2 h-5 w-5" /></Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="mailto:juan.ulian@pluscompol.com?subject=Solicitud%20de%20Reunión%20-%20Shoppa!&body=Hola!%20Me%20gustaría%20coordinar%20una%20reunión%20en%20los%20próximos%20días%20para%20ver%20como%20implementar%20Shoppa!%20en%20mi%20negocio.%20Vendo%20...%20(completar%20sugerencia)">Agendar Reunión</Link>
                        </Button>
                    </div>
                </section>

                {/* Problem Section */}
                <section className="container mx-auto px-4 py-16">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight">El costo oculto de la indecisión del cliente</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                            Competir por precio ya no es suficiente. El verdadero problema es la parálisis por análisis que sufren tus clientes.
                        </p>
                    </div>
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
                        <Card className="p-6"><p className="text-4xl font-bold text-primary">75%</p><p className="text-sm font-medium text-muted-foreground">de carritos abandonados en LATAM</p></Card>
                        <Card className="p-6"><p className="text-4xl font-bold text-primary">30+</p><p className="text-sm font-medium text-muted-foreground">minutos comparando sin decidir</p></Card>
                        <Card className="p-6"><p className="text-4xl font-bold text-primary">50%</p><p className="text-sm font-medium text-muted-foreground">del tiempo de vendedores en consultas repetitivas</p></Card>
                        <Card className="p-6"><p className="text-4xl font-bold text-primary">Bajo</p><p className="text-sm font-medium text-muted-foreground">margen al competir solo por precio</p></Card>
                    </div>
                </section>
                
                {/* Solution Section */}
                <section className="bg-slate-100/70 dark:bg-slate-900/70 py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">La Solución: Tu Asesor Digital 24/7</h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Shoppa! replica a tu mejor vendedor, pero a escala digital. Guía, entiende y recomienda, convirtiendo la duda en una venta segura.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <div className="text-center p-4"><div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4"><User className="h-8 w-8" /></div><h3 className="text-xl font-bold mb-2">1. Cliente llega confundido</h3><p className="text-muted-foreground">Abrumado por opciones y especificaciones técnicas.</p></div>
                            <div className="text-center p-4"><div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4"><Logo /></div><h3 className="text-xl font-bold mb-2">2. Shoppa! hace preguntas simples</h3><p className="text-muted-foreground">Entiende la necesidad real del cliente en su lenguaje.</p></div>
                            <div className="text-center p-4"><div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4"><Zap className="h-8 w-8" /></div><h3 className="text-xl font-bold mb-2">3. Cliente recibe 3 opciones perfectas</h3><p className="text-muted-foreground">Recomendaciones claras con justificaciones que generan confianza.</p></div>
                        </div>
                    </div>
                </section>

                {/* Results Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">Resultados Reales, No Promesas Vacías</h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Los datos de nuestra prueba piloto hablan por sí solos. Los clientes no solo están satisfechos, están listos para comprar.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <Card className="p-8 text-center"><div className="text-5xl font-bold text-primary mb-2">69%</div><p className="font-semibold">Intención de Compra Inmediata</p><p className="text-sm text-muted-foreground mt-2">de usuarios mostró intención probable o decidida de comprar.</p></Card>
                            <Card className="p-8 text-center"><div className="text-5xl font-bold text-primary mb-2">4.8/5</div><p className="font-semibold">Satisfacción de Usuario</p><p className="text-sm text-muted-foreground mt-2">Calificación promedio que supera los estándares del e-commerce.</p></Card>
                            <Card className="p-8 text-center"><div className="text-5xl font-bold text-primary mb-2">25%</div><p className="font-semibold">Decisión Acelerada</p><p className="text-sm text-muted-foreground mt-2">de usuarios decidió comprar inmediatamente.</p></Card>
                        </div>
                         <p className="text-center mt-4 text-xs text-muted-foreground">* Métricas validadas sobre una muestra de usuarios en nuestra encuesta de satisfacción.</p>
                    </div>
                </section>

                {/* Business Benefits Section */}
                <section className="bg-slate-100/70 dark:bg-slate-900/70 py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">Los Resultados que Obtenés en Tu Negocio</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <Card className="p-8 text-center"><TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" /><h3 className="text-xl font-bold mb-2">15-25% Menos Abandono</h3><p className="text-muted-foreground">Reduce el abandono de carrito y captura valor perdido convirtiendo dudas en decisiones de compra.</p></Card>
                            <Card className="p-8 text-center"><Smile className="h-12 w-12 text-primary mx-auto mb-4" /><h3 className="text-xl font-bold mb-2">60-70% Menos Tiempo</h3><p className="text-muted-foreground">Reduce el tiempo de decisión de 30+ minutos a 3-5 minutos. Clientes satisfechos que compran más rápido.</p></Card>
                            <Card className="p-8 text-center"><DollarSign className="h-12 w-12 text-primary mx-auto mb-4" /><h3 className="text-xl font-bold mb-2">Vendedores Optimizados</h3><p className="text-muted-foreground">Libera a tu equipo de preguntas básicas. Deja que Shoppa! califique para que tus vendedores se enfoquen en cerrar ventas.</p></Card>
                        </div>
                    </div>
                </section>

                {/* Profit Calculator Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <ProfitCalculator />
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="bg-slate-100/70 dark:bg-slate-900/70 py-20">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Preguntas Frecuentes</h2>
                        </div>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            <FAQItem value="faq-1" question="¿Cómo se integra Shoppa! con mi e-commerce actual?">Nuestra integración es simple y rápida. Funciona con las plataformas más populares como Shopify, Tiendanube, WooCommerce y más, a través de un simple snippet de código o un plugin. No necesitás un equipo técnico para ponerlo en marcha.</FAQItem>
                            <FAQItem value="faq-2" question="¿Mi equipo necesita capacitación para usarlo?">¡No! Shoppa! es totalmente autónomo. Funciona 24/7 sin intervención humana. Tu equipo solo notará que los clientes llegan más decididos y con menos preguntas básicas.</FAQItem>
                            <FAQItem value="faq-3" question="¿Qué pasa si el cliente no compra a través de la recomendación?">No pasa nada. El modelo "Pay-per-Success" significa que la comisión solo se aplica si la venta se concreta a través de nuestro flujo. Si el cliente no compra, no hay ningún costo para nadie. Es un modelo 100% basado en resultados.</FAQItem>
                            <FAQItem value="faq-4" question="¿Se puede personalizar el catálogo de productos?">Por supuesto. Shoppa! se conecta a tu base de datos de productos para asegurarse de que las recomendaciones siempre reflejen tu stock, precios y ofertas actuales. La personalización es total.</FAQItem>
                        </Accordion>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="py-20 bg-primary text-primary-foreground">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6">¿Listo para dejar de perder clientes?</h2>
                        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">Probá Shoppa! sin compromiso. La implementación es rápida, gratuita y te acompañamos en cada paso.</p>
                        <Button size="lg" variant="secondary" asChild className="rounded-full px-12">
                            <Link href="mailto:juan.ulian@pluscompol.com?subject=Solicitud%20de%20Reunión%20-%20Shoppa!&body=Hola!%20Me%20gustaría%20coordinar%20una%20reunión%20en%20los%20próximos%20días%20para%20ver%20como%20implementar%20Shoppa!%20en%20mi%20negocio.%20Vendo%20...%20(completar%20sugerencia)">Lo quiero probar →</Link>
                        </Button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 py-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p className="mb-4">© 2025 Shoppa! Todos los derechos reservados.</p>
                    <div className="flex justify-center gap-6">
                        <Link href="/" className="hover:text-primary">Comprar</Link>
                        <Link href="mailto:juanulian@gmail.com" className="hover:text-primary">Contacto</Link>
                    </div>
                </div>
            </footer>
          </div>
        </div>
    );
}
