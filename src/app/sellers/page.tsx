
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, ArrowRight, Zap, Target, ShoppingCart } from 'lucide-react';
import Logo from '@/components/icons/logo';
import InteractiveTimeline from '@/components/landing/interactive-timeline';

const ROICalculator: React.FC = () => {
    const [monthlyRevenue, setMonthlyRevenue] = React.useState<number | ''>(10000000);
    const [potentialGain, setPotentialGain] = React.useState({ min: 0, max: 0 });

    const calculateGain = React.useCallback(() => {
        if (!monthlyRevenue || monthlyRevenue <= 0) {
            setPotentialGain({ min: 0, max: 0 });
            return;
        }

        const totalPotential = Number(monthlyRevenue) / 0.247;
        const newRevenueMin = totalPotential * 0.36;
        const newRevenueMax = totalPotential * 0.44; 
        const minGain = newRevenueMin - Number(monthlyRevenue);
        const maxGain = newRevenueMax - Number(monthlyRevenue);

        setPotentialGain({
            min: minGain,
            max: maxGain
        });
    }, [monthlyRevenue]);

    React.useEffect(() => {
        calculateGain();
    }, [monthlyRevenue, calculateGain]);

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
                <section className="bg-[url('/background/header_footer.png')] bg-cover bg-center py-20 sm:py-28">
                    <div className="container mx-auto px-4 text-center">
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
                </section>

                <section className="bg-[url('/background/cards.png')] bg-cover bg-center py-20 sm:py-28">
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
                </section>

                <InteractiveTimeline />
                
                <section className="bg-[url('/background/cards.png')] bg-cover bg-center py-20 sm:py-28">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <ROICalculator />
                    </div>
                </section>

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
