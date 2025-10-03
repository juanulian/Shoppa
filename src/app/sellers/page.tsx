'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, Clock, Users, ArrowRight, Zap, Target, ShoppingCart } from 'lucide-react';
import Logo from '@/components/icons/logo';

const ROICalculator: React.FC = () => {
    const [monthlyRevenue, setMonthlyRevenue] = useState<number | ''>(10000000);
    const [potentialGain, setPotentialGain] = useState({ min: 0, max: 0 });

    const calculateGain = () => {
        if (!monthlyRevenue || monthlyRevenue <= 0) {
            setPotentialGain({ min: 0, max: 0 });
            return;
        }

        // Con 75.3% de abandono, solo capturamos 24.7% del potencial
        // Facturación actual = 24.7% del potencial total
        const totalPotential = Number(monthlyRevenue) / 0.247;

        // Con Shoppa! reducimos abandono a 56-64%
        // Nuevo abandono 64% = capturamos 36% (mejor caso: menos abandono)
        // Nuevo abandono 56% = capturamos 44% (mejor caso: aún menos abandono)
        const newRevenueMin = totalPotential * 0.36; // 64% abandono
        const newRevenueMax = totalPotential * 0.44; // 56% abandono

        // Ganancia adicional
        const minGain = newRevenueMin - Number(monthlyRevenue);
        const maxGain = newRevenueMax - Number(monthlyRevenue);

        setPotentialGain({
            min: minGain,
            max: maxGain
        });
    };

    React.useEffect(() => {
        calculateGain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthlyRevenue]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <Card className="p-6 md:p-8 bg-white/95 dark:bg-slate-900/95 border-2 border-primary shadow-2xl rounded-2xl backdrop-blur-sm">
            <CardHeader className="p-0 mb-6 text-center">
                <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl md:text-3xl font-bold">Calculá Cuánto Más Podés Ganar</CardTitle>
                <p className="text-muted-foreground mt-2">Al reducir el abandono de carrito del 75.3% al 56-64%</p>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="monthlyRevenue" className="font-semibold text-base">Facturación Aproximada Mensual (ARS)</Label>
                    <Input
                        id="monthlyRevenue"
                        type="text"
                        value={monthlyRevenue === '' ? '' : monthlyRevenue.toLocaleString('es-AR')}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setMonthlyRevenue(value === '' ? '' : Number(value));
                        }}
                        className="h-14 text-2xl font-bold text-center"
                        placeholder="Ej: 10.000.000"
                    />
                </div>

                {(potentialGain.min > 0 || potentialGain.max > 0) && (
                    <div className="text-center bg-green-50 dark:bg-green-950/30 p-6 rounded-xl border-2 border-green-200 dark:border-green-800 animate-in fade-in duration-500">
                        <p className="text-lg text-green-800 dark:text-green-200 font-semibold mb-2">🔥 Con Shoppa! podrías ganar:</p>
                        <p className="text-3xl md:text-5xl font-bold text-green-600 dark:text-green-400 my-2">
                            {formatCurrency(potentialGain.min)} - {formatCurrency(potentialGain.max)}
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                            más por mes en ventas recuperadas
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default function SellersLandingPage() {
    return (
        <div className="min-h-screen">
            {/* Header con fondo header_footer.png */}
            <header className="bg-[url('/background/header_footer.png')] bg-cover bg-center border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
                <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
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
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section con fondo header_footer.png */}
                <section className="bg-[url('/background/header_footer.png')] bg-cover bg-center">
                    <div className="bg-gradient-to-b from-white/90 via-white/85 to-white/80 dark:from-slate-950/90 dark:via-slate-950/85 dark:to-slate-950/80 backdrop-blur-sm">
                        <div className="container mx-auto px-4 pt-20 pb-28 text-center">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 leading-tight">
                                ¿Perdés 75% de tus ventas
                                <br />
                                <span className="text-primary">por carritos abandonados?</span>
                            </h1>
                            <p className="mx-auto mt-6 max-w-3xl text-lg sm:text-xl md:text-2xl text-slate-700 dark:text-slate-300 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 leading-relaxed">
                                Shoppa! elimina la parálisis por análisis presentando exactamente <span className="font-bold text-primary">3 opciones perfectas</span>.
                                <br />
                                Transforma clientes confundidos en compradores seguros en 3 minutos.
                            </p>
                            <div className="mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                                <Button size="lg" asChild className="rounded-full px-10 h-14 text-lg shadow-xl hover:shadow-2xl transition-all">
                                    <Link href="/demo">
                                        <Zap className="mr-2 h-5 w-5" />
                                        Probar ahora
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild className="rounded-full px-10 h-14 text-lg shadow-lg hover:shadow-xl transition-all">
                                    <Link href="mailto:juanulian@gmail.com?subject=Solicitud%20de%20Reuni%C3%B3n%20-%20Shoppa!&body=Hola!%20Me%20gustar%C3%ADa%20coordinar%20una%20reuni%C3%B3n%20para%20ver%20c%C3%B3mo%20implementar%20Shoppa!%20en%20mi%20negocio.">
                                        Agendar Reunión
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Problem Stats Section con fondo cards.png */}
                <section className="bg-[url('/background/cards.png')] bg-cover bg-center py-20 sm:py-28">
                    <div className="bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm py-16 sm:py-20">
                        <div className="container mx-auto px-4">
                            <div className="text-center max-w-3xl mx-auto mb-16">
                                <ShoppingCart className="h-16 w-16 text-primary mx-auto mb-6" />
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                                    El costo oculto de la indecisión del cliente
                                </h2>
                                <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                                    Competir por precio ya no es suficiente. El verdadero problema es la <span className="font-semibold text-foreground">parálisis por análisis</span> que sufren tus clientes frente a productos complejos.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
                                <Card className="p-6 sm:p-8 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300 shadow-xl">
                                    <p className="text-5xl sm:text-6xl font-bold text-primary mb-3">75%</p>
                                    <p className="text-sm sm:text-base font-medium text-muted-foreground leading-snug">
                                        de carritos abandonados en LATAM vs 69% global
                                    </p>
                                </Card>
                                <Card className="p-6 sm:p-8 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300 shadow-xl">
                                    <p className="text-5xl sm:text-6xl font-bold text-primary mb-3">30+</p>
                                    <p className="text-sm sm:text-base font-medium text-muted-foreground leading-snug">
                                        minutos comparando sin decidirse a comprar
                                    </p>
                                </Card>
                                <Card className="p-6 sm:p-8 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300 shadow-xl">
                                    <p className="text-5xl sm:text-6xl font-bold text-primary mb-3">50%</p>
                                    <p className="text-sm sm:text-base font-medium text-muted-foreground leading-snug">
                                        del tiempo de tus vendedores en consultas repetitivas
                                    </p>
                                </Card>
                                <Card className="p-6 sm:p-8 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300 shadow-xl">
                                    <p className="text-5xl sm:text-6xl font-bold text-primary mb-3">↓</p>
                                    <p className="text-sm sm:text-base font-medium text-muted-foreground leading-snug">
                                        Margen de ganancia al competir solo por precio
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Solution Section con fondo cards_2.png */}
                <section className="bg-[url('/background/cards_2.png')] bg-cover bg-center py-20 sm:py-28">
                    <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm py-16 sm:py-20">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-20 max-w-3xl mx-auto">
                                <Target className="h-16 w-16 text-primary mx-auto mb-6" />
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                                    La Solución: Tu Asesor Digital 24/7
                                </h2>
                                <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                                    Shoppa! replica a tu mejor vendedor, pero a escala digital. <span className="font-semibold text-foreground">Guía, entiende y recomienda</span>, convirtiendo la duda en una venta segura.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-6xl mx-auto">
                                <div className="text-center space-y-4">
                                    <div className="text-7xl sm:text-8xl font-bold text-slate-200 dark:text-slate-800 mb-6">1</div>
                                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">Cliente llega confundido</h3>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        Abrumado por opciones y especificaciones técnicas que no entiende.
                                    </p>
                                </div>
                                <div className="text-center space-y-4 relative">
                                    <div className="absolute -inset-4 bg-primary/5 rounded-3xl"></div>
                                    <div className="relative">
                                        <div className="text-6xl sm:text-7xl font-bold text-primary mb-6">S!</div>
                                        <h3 className="text-2xl sm:text-3xl font-bold mb-4">Shoppa! hace preguntas simples</h3>
                                        <p className="text-muted-foreground text-lg leading-relaxed">
                                            Entiende la necesidad real del cliente en su lenguaje. 3 preguntas, 3 minutos.
                                        </p>
                                    </div>
                                </div>
                                <div className="text-center space-y-4">
                                    <div className="text-7xl sm:text-8xl font-bold text-slate-200 dark:text-slate-800 mb-6">3</div>
                                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">Recibe 3 opciones perfectas</h3>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        Recomendaciones claras con justificaciones que generan confianza y cierran la venta.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pilot Results Section con fondo cards.png */}
                <section className="bg-[url('/background/cards.png')] bg-cover bg-center py-20 sm:py-28">
                    <div className="bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm py-16 sm:py-20">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-16 max-w-3xl mx-auto">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                                    Resultados Reales, No Promesas Vacías
                                </h2>
                                <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                                    Los datos de nuestra prueba piloto hablan por sí solos. Los clientes no solo están satisfechos, <span className="font-semibold text-foreground">están listos para comprar</span>.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                                <Card className="p-8 sm:p-10 text-center bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-xl">
                                    <p className="text-6xl sm:text-7xl font-bold text-primary mb-4">69%</p>
                                    <h3 className="text-xl sm:text-2xl font-bold mb-3">Intención de Compra Inmediata</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        68.75% de usuarios mostró intención probable o decidida de comprar tras usar Shoppa!
                                    </p>
                                </Card>
                                <Card className="p-8 sm:p-10 text-center bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-xl">
                                    <p className="text-6xl sm:text-7xl font-bold text-primary mb-4">4.8/5</p>
                                    <h3 className="text-xl sm:text-2xl font-bold mb-3">Satisfacción de Usuario</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        Calificación promedio que supera ampliamente los estándares del e-commerce tradicional
                                    </p>
                                </Card>
                                <Card className="p-8 sm:p-10 text-center bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-xl">
                                    <p className="text-6xl sm:text-7xl font-bold text-primary mb-4">25%</p>
                                    <h3 className="text-xl sm:text-2xl font-bold mb-3">Decisión Acelerada</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        de usuarios decidió comprar inmediatamente vs navegar opciones ilimitadas
                                    </p>
                                </Card>
                            </div>
                            <p className="text-center text-xs sm:text-sm text-muted-foreground mt-10 italic max-w-2xl mx-auto">
                                * Métricas validadas sobre una muestra de usuarios en nuestra encuesta de satisfacción.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Business Benefits Section con fondo cards_2.png */}
                <section className="bg-[url('/background/cards_2.png')] bg-cover bg-center py-20 sm:py-28">
                    <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm py-16 sm:py-20">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-16 max-w-3xl mx-auto">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                                    Los Resultados que Obtenés en Tu Negocio
                                </h2>
                                <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                                    Implementar Shoppa! no es un gasto, es una <span className="font-semibold text-foreground">inversión directa</span> en el crecimiento de tu negocio.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                                <Card className="p-8 sm:p-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow">
                                    <TrendingUp className="h-14 w-14 text-primary mb-6" />
                                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">15-25% Menos Abandono</h3>
                                    <p className="text-muted-foreground text-base leading-relaxed">
                                        Reduce el abandono de carrito del <span className="font-semibold">75% actual al 56-64%</span>. Captura hasta USD 150B en valor perdido convirtiendo dudas en decisiones de compra.
                                    </p>
                                </Card>
                                <Card className="p-8 sm:p-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow">
                                    <Clock className="h-14 w-14 text-primary mb-6" />
                                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">60-70% Menos Tiempo</h3>
                                    <p className="text-muted-foreground text-base leading-relaxed">
                                        Reduce el tiempo de decisión de <span className="font-semibold">30+ minutos a 3-5 minutos</span> por compra. Clientes satisfechos (4.8/5) que recomiendan activamente la experiencia.
                                    </p>
                                </Card>
                                <Card className="p-8 sm:p-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow">
                                    <Users className="h-14 w-14 text-primary mb-6" />
                                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">Vendedores Optimizados</h3>
                                    <p className="text-muted-foreground text-base leading-relaxed">
                                        Liberá a tu equipo de las preguntas básicas y repetitivas. Dejá que Shoppa! se encargue de la <span className="font-semibold">calificación inicial</span> para que tus vendedores se enfoquen en cerrar ventas complejas.
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ROI Calculator Section con fondo cards.png */}
                <section className="bg-[url('/background/cards.png')] bg-cover bg-center py-20 sm:py-28">
                    <div className="bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm py-16 sm:py-20">
                        <div className="container mx-auto px-4 max-w-3xl">
                            <ROICalculator />
                        </div>
                    </div>
                </section>

                {/* Final CTA Section con fondo header_footer.png */}
                <section className="bg-[url('/background/header_footer.png')] bg-cover bg-center py-20 sm:py-28">
                    <div className="bg-primary/95 backdrop-blur-sm py-16 sm:py-20">
                        <div className="container mx-auto px-4 text-center">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-primary-foreground">
                                ¿Listo para dejar de perder clientes?
                            </h2>
                            <p className="text-lg sm:text-xl md:text-2xl mb-12 text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
                                Probá Shoppa! sin compromiso. La implementación es rápida y te acompañamos en cada paso.
                            </p>
                            <Button size="lg" variant="secondary" asChild className="rounded-full px-12 h-16 text-xl shadow-2xl hover:scale-105 transition-transform">
                                <Link href="mailto:juanulian@gmail.com?subject=Solicitud%20de%20Reuni%C3%B3n%20-%20Shoppa!&body=Hola!%20Me%20gustar%C3%ADa%20coordinar%20una%20reuni%C3%B3n%20para%20ver%20c%C3%B3mo%20implementar%20Shoppa!%20en%20mi%20negocio.">
                                    Quiero Probarlo
                                    <ArrowRight className="ml-3 h-6 w-6" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer con fondo header_footer.png */}
            <footer className="bg-[url('/background/header_footer.png')] bg-cover bg-center border-t border-slate-200 dark:border-slate-800">
                <div className="bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm py-10">
                    <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                        <p className="mb-4 text-base">© 2025 Shoppa! Todos los derechos reservados.</p>
                        <div className="flex justify-center gap-8 text-base">
                            <Link href="/" className="hover:text-primary transition-colors font-medium">Comprar</Link>
                            <Link href="mailto:juanulian@gmail.com" className="hover:text-primary transition-colors font-medium">Contacto</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
