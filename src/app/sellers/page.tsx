'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, Clock, Users, DollarSign } from 'lucide-react';
import Logo from '@/components/icons/logo';

const ROICalculator: React.FC = () => {
    const [units, setUnits] = useState<number | ''>(100);
    const [unitPrice, setUnitPrice] = useState<number | ''>(100000);
    const [potentialGain, setPotentialGain] = useState({ min: 0, max: 0, current: 0 });

    const calculateGain = () => {
        if (!units || !unitPrice || units <= 0 || unitPrice <= 0) {
            setPotentialGain({ min: 0, max: 0, current: 0 });
            return;
        }

        // Ventas actuales (solo el 25% compra debido al 75% de abandono)
        const currentSales = Number(units) * Number(unitPrice);

        // Si el 75% abandona, solo el 25% de clientes potenciales compra
        // Total de clientes potenciales = ventas actuales / 0.25
        const totalPotentialClients = Number(units) / 0.25;
        const abandoningClients = totalPotentialClients * 0.753; // 75.3% abandono actual

        // Reducción del abandono: de 75.3% a 56-64%
        const newAbandonmentMin = 0.56;
        const newAbandonmentMax = 0.64;

        // Nuevos clientes que comprarán
        const newBuyersMin = totalPotentialClients * (0.753 - newAbandonmentMin);
        const newBuyersMax = totalPotentialClients * (0.753 - newAbandonmentMax);

        // Ganancia adicional en ventas
        const minGain = newBuyersMin * Number(unitPrice);
        const maxGain = newBuyersMax * Number(unitPrice);

        setPotentialGain({
            min: minGain,
            max: maxGain,
            current: currentSales
        });
    };

    React.useEffect(() => {
        calculateGain();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [units, unitPrice]);

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="units" className="font-semibold text-base">Unidades Vendidas/Mes</Label>
                        <Input
                            id="units"
                            type="text"
                            value={units === '' ? '' : units.toLocaleString('es-AR')}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setUnits(value === '' ? '' : Number(value));
                            }}
                            className="h-12 text-xl font-semibold text-center"
                            placeholder="Ej: 100"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="unitPrice" className="font-semibold text-base">Precio Unitario (ARS)</Label>
                        <Input
                            id="unitPrice"
                            type="text"
                            value={unitPrice === '' ? '' : unitPrice.toLocaleString('es-AR')}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setUnitPrice(value === '' ? '' : Number(value));
                            }}
                            className="h-12 text-xl font-semibold text-center"
                            placeholder="Ej: 100000"
                        />
                    </div>
                </div>

                {(potentialGain.min > 0 || potentialGain.max > 0) && (
                    <div className="space-y-4 pt-6 border-t-2 border-primary/20 animate-in fade-in duration-500">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">Tus ventas actuales:</p>
                            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                                {formatCurrency(potentialGain.current)}
                            </p>
                        </div>
                        <div className="text-center bg-green-50 dark:bg-green-950/30 p-6 rounded-xl border-2 border-green-200 dark:border-green-800">
                            <p className="text-lg text-green-800 dark:text-green-200 font-semibold mb-2">💰 Con Shoppa! podrías ganar:</p>
                            <p className="text-3xl md:text-5xl font-bold text-green-600 dark:text-green-400 my-2">
                                {formatCurrency(potentialGain.min)} - {formatCurrency(potentialGain.max)}
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                                más por mes en ventas recuperadas
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default function SellersLandingPage() {
    return (
        <div className="min-h-screen bg-[url('/background/header_footer.png')] bg-cover bg-center">
            <div className="min-h-screen bg-white/85 dark:bg-slate-950/85 backdrop-blur-sm">
                {/* Header */}
                <header className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
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
                    <section className="container mx-auto px-4 pt-16 pb-20 text-center">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            ¿Perdés 75% de tus ventas
                            <br />
                            <span className="text-primary">por carritos abandonados?</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-3xl text-lg sm:text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            Shoppa! elimina la parálisis por análisis presentando exactamente 3 opciones perfectas.
                            <br className="hidden sm:block" />
                            Transforma clientes confundidos en compradores seguros en 3 minutos.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                            <Button size="lg" asChild className="rounded-full px-8 h-12 sm:h-14 text-base sm:text-lg">
                                <Link href="/demo">Probar ahora</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild className="rounded-full px-8 h-12 sm:h-14 text-base sm:text-lg">
                                <Link href="mailto:juanulian@gmail.com?subject=Solicitud%20de%20Reuni%C3%B3n%20-%20Shoppa!&body=Hola!%20Me%20gustar%C3%ADa%20coordinar%20una%20reuni%C3%B3n%20para%20ver%20c%C3%B3mo%20implementar%20Shoppa!%20en%20mi%20negocio.">
                                    Agendar Reunión
                                </Link>
                            </Button>
                        </div>
                    </section>

                    {/* Problem Stats Section */}
                    <section className="bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm py-16 sm:py-20">
                        <div className="container mx-auto px-4">
                            <div className="text-center max-w-3xl mx-auto mb-12">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                                    El costo oculto de la indecisión del cliente
                                </h2>
                                <p className="text-base sm:text-lg text-muted-foreground">
                                    Competir por precio ya no es suficiente. El verdadero problema es la parálisis por análisis que sufren tus clientes frente a productos complejos.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                                <Card className="p-4 sm:p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                                    <p className="text-4xl sm:text-5xl font-bold text-primary mb-2">75%</p>
                                    <p className="text-sm sm:text-base font-medium text-muted-foreground">
                                        de carritos abandonados en LATAM vs 69% global.
                                    </p>
                                </Card>
                                <Card className="p-4 sm:p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                                    <p className="text-4xl sm:text-5xl font-bold text-primary mb-2">30+</p>
                                    <p className="text-sm sm:text-base font-medium text-muted-foreground">
                                        minutos comparando sin decidirse a comprar.
                                    </p>
                                </Card>
                                <Card className="p-4 sm:p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                                    <p className="text-4xl sm:text-5xl font-bold text-primary mb-2">50%</p>
                                    <p className="text-sm sm:text-base font-medium text-muted-foreground">
                                        del tiempo de tus vendedores en consultas repetitivas.
                                    </p>
                                </Card>
                                <Card className="p-4 sm:p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                                    <p className="text-4xl sm:text-5xl font-bold text-primary mb-2">Bajo</p>
                                    <p className="text-sm sm:text-base font-medium text-muted-foreground">
                                        margen de ganancia al competir solo por precio.
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* Solution Section */}
                    <section className="py-16 sm:py-20">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-16 max-w-3xl mx-auto">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                                    La Solución: Tu Asesor Digital 24/7
                                </h2>
                                <p className="text-base sm:text-lg text-muted-foreground">
                                    Shoppa! replica a tu mejor vendedor, pero a escala digital. Guía, entiende y recomienda, convirtiendo la duda en una venta segura.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
                                <div className="text-center">
                                    <div className="text-6xl sm:text-7xl font-bold text-primary/20 dark:text-primary/30 mb-4">1</div>
                                    <h3 className="text-xl sm:text-2xl font-bold mb-3">Cliente llega confundido</h3>
                                    <p className="text-muted-foreground text-base sm:text-lg">
                                        Abrumado por opciones y especificaciones técnicas.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="text-5xl sm:text-6xl font-bold text-primary mb-4">S!</div>
                                    <h3 className="text-xl sm:text-2xl font-bold mb-3">Shoppa! hace preguntas simples</h3>
                                    <p className="text-muted-foreground text-base sm:text-lg">
                                        Entiende la necesidad real del cliente en su lenguaje.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="text-6xl sm:text-7xl font-bold text-primary/20 dark:text-primary/30 mb-4">3</div>
                                    <h3 className="text-xl sm:text-2xl font-bold mb-3">Cliente recibe 3 opciones perfectas</h3>
                                    <p className="text-muted-foreground text-base sm:text-lg">
                                        Recomendaciones claras con justificaciones que generan confianza.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pilot Results Section */}
                    <section className="bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm py-16 sm:py-20">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12 max-w-3xl mx-auto">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                                    Resultados Reales, No Promesas Vacías
                                </h2>
                                <p className="text-base sm:text-lg text-muted-foreground">
                                    Los datos de nuestra prueba piloto hablan por sí solos. Los clientes no solo están satisfechos, están listos para comprar.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
                                <Card className="p-6 sm:p-8 text-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                                    <p className="text-5xl sm:text-6xl font-bold text-primary mb-2">69%</p>
                                    <h3 className="text-lg sm:text-xl font-bold mb-2">Intención de Compra Inmediata</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground">
                                        68.75% de usuarios mostró intención probable o decidida de comprar tras usar Shoppa!
                                    </p>
                                </Card>
                                <Card className="p-6 sm:p-8 text-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                                    <p className="text-5xl sm:text-6xl font-bold text-primary mb-2">4.8/5</p>
                                    <h3 className="text-lg sm:text-xl font-bold mb-2">Satisfacción de Usuario</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground">
                                        Calificación promedio que supera ampliamente los estándares del e-commerce tradicional.
                                    </p>
                                </Card>
                                <Card className="p-6 sm:p-8 text-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                                    <p className="text-5xl sm:text-6xl font-bold text-primary mb-2">25%</p>
                                    <h3 className="text-lg sm:text-xl font-bold mb-2">Decisión Acelerada</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground">
                                        de usuarios decidió comprar inmediatamente vs navegar opciones ilimitadas.
                                    </p>
                                </Card>
                            </div>
                            <p className="text-center text-xs sm:text-sm text-muted-foreground mt-8 italic">
                                * Métricas validadas sobre una muestra de usuarios en nuestra encuesta de satisfacción.
                            </p>
                        </div>
                    </section>

                    {/* Business Benefits Section */}
                    <section className="py-16 sm:py-20">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12 max-w-3xl mx-auto">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                                    Los Resultados que Obtenés en Tu Negocio
                                </h2>
                                <p className="text-base sm:text-lg text-muted-foreground">
                                    Implementar Shoppa! no es un gasto, es una inversión directa en el crecimiento de tu negocio.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                                <Card className="p-6 sm:p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                                    <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-4" />
                                    <h3 className="text-xl sm:text-2xl font-bold mb-3">15-25% Menos Abandono</h3>
                                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                                        Reduce el abandono de carrito del 75% actual al 56-64%. Captura hasta USD 150B en valor perdido convirtiendo dudas en decisiones de compra.
                                    </p>
                                </Card>
                                <Card className="p-6 sm:p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                                    <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-4" />
                                    <h3 className="text-xl sm:text-2xl font-bold mb-3">60-70% Menos Tiempo</h3>
                                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                                        Reduce el tiempo de decisión de 30+ minutos a 3-5 minutos por compra. Clientes satisfechos (4.8/5) que recomiendan activamente la experiencia.
                                    </p>
                                </Card>
                                <Card className="p-6 sm:p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                                    <Users className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-4" />
                                    <h3 className="text-xl sm:text-2xl font-bold mb-3">Vendedores Optimizados</h3>
                                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                                        Liberá a tu equipo de las preguntas básicas y repetitivas. Dejá que Shoppa! se encargue de la calificación inicial para que tus vendedores se enfoquen en cerrar ventas complejas.
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* ROI Calculator Section */}
                    <section className="bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm py-16 sm:py-20">
                        <div className="container mx-auto px-4 max-w-3xl">
                            <ROICalculator />
                        </div>
                    </section>

                    {/* Final CTA Section */}
                    <section className="py-16 sm:py-20 bg-primary text-primary-foreground">
                        <div className="container mx-auto px-4 text-center">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                ¿Listo para dejar de perder clientes?
                            </h2>
                            <p className="text-lg sm:text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                                Probá Shoppa! sin compromiso. La implementación es rápida y te acompañamos en cada paso.
                            </p>
                            <Button size="lg" variant="secondary" asChild className="rounded-full px-8 sm:px-12 h-12 sm:h-14 text-base sm:text-xl">
                                <Link href="mailto:juanulian@gmail.com?subject=Solicitud%20de%20Reuni%C3%B3n%20-%20Shoppa!&body=Hola!%20Me%20gustar%C3%ADa%20coordinar%20una%20reuni%C3%B3n%20para%20ver%20c%C3%B3mo%20implementar%20Shoppa!%20en%20mi%20negocio.">
                                    Quiero Probarlo →
                                </Link>
                            </Button>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-slate-200 dark:border-slate-800 py-8 bg-slate-100/70 dark:bg-slate-900/70 backdrop-blur-sm">
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
