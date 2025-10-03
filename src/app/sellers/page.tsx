
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, ArrowRight, Zap, ShoppingCart } from 'lucide-react';
import Logo from '@/components/icons/logo';
import { Footer } from '@/components/landing/footer';

// Timeline component will be redesigned

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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <header className="border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo />
                    </Link>
                    <Link
                        href="/"
                        className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
                    >
                        Para compradores
                    </Link>
                </div>
            </header>

            <main className="flex-1">
                <section className="bg-[url('/background/cards_2.png')] bg-cover bg-center py-20 sm:py-28 transition-all duration-700">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 leading-tight text-slate-900 dark:text-slate-100 [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]">
                            Dejá de competir por precio.
                            <br />
                            <span className="text-primary">Competí por claridad.</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-3xl text-lg sm:text-xl md:text-2xl text-slate-700 dark:text-slate-300 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]">
                            75% de tus clientes abandonan el carrito porque <span className="font-bold text-primary">no saben qué elegir</span>.
                            <br />
                            Shoppa! les da <span className="font-bold">3 opciones perfectas</span> y convierte en 3 minutos.
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

                {/* El problema - Estilo Apple keynote */}
                <section className="py-32 bg-white dark:bg-slate-950">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="text-center mb-24">
                            <h2 className="text-5xl md:text-7xl font-light mb-8 text-slate-900 dark:text-slate-100 tracking-tight">
                                El problema real
                            </h2>
                            <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-400 font-light leading-relaxed max-w-3xl mx-auto">
                                Tus clientes no necesitan más opciones.<br/>Necesitan <span className="text-slate-900 dark:text-slate-100 font-medium">claridad</span>.
                            </p>
                        </div>

                        {/* Stats - Centradas y minimalistas */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">
                            <div className="text-center">
                                <div className="text-7xl md:text-8xl font-light text-primary mb-6">75<span className="text-5xl">%</span></div>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                    abandonan el carrito<br/>sin comprar
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-7xl md:text-8xl font-light text-primary mb-6">30<span className="text-5xl">min</span></div>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                    comparando<br/>sin decidirse
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-7xl md:text-8xl font-light text-primary mb-6">$0</div>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                    en ventas<br/>perdidas
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Comparativa - Rediseñada estilo Apple */}
                <section className="py-32 bg-slate-50 dark:bg-slate-900">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-24">
                            <h2 className="text-5xl md:text-7xl font-light mb-6 text-slate-900 dark:text-slate-100 tracking-tight">
                                Un solo número
                            </h2>
                            <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-400 font-light">
                                Sin rangos. Sin letra chica.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                            {/* MercadoLibre - Minimalista */}
                            <div className="bg-white dark:bg-slate-950 p-12 rounded-3xl">
                                <div className="text-center mb-8">
                                    <p className="text-sm text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-4">Otros</p>
                                    <div className="text-6xl font-light text-slate-400 dark:text-slate-600 mb-2">15<span className="text-3xl">%</span></div>
                                    <div className="text-3xl font-light text-slate-400 dark:text-slate-600 mb-2">a</div>
                                    <div className="text-6xl font-light text-slate-400 dark:text-slate-600 mb-6">49<span className="text-3xl">%</span></div>
                                    <p className="text-sm text-slate-500 dark:text-slate-500 leading-relaxed">
                                        + costos fijos<br/>
                                        + impuestos<br/>
                                        + sorpresas
                                    </p>
                                </div>
                            </div>

                            {/* Shoppa! - Hero style */}
                            <div className="bg-white dark:bg-slate-950 p-12 rounded-3xl border-2 border-primary">
                                <div className="text-center mb-8">
                                    <p className="text-sm text-primary uppercase tracking-wider mb-4">Shoppa!</p>
                                    <div className="text-8xl md:text-9xl font-light text-primary mb-8">6<span className="text-5xl">%</span></div>
                                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
                                        Todo incluido.<br/>
                                        Siempre.
                                    </p>
                                    <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                                        <p className="text-sm text-slate-500 dark:text-slate-500">
                                            Vendés +$10M/mes → <span className="text-primary font-medium">5%</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                <section className="bg-[url('/background/cards_2.png')] bg-cover bg-center py-20 sm:py-28 transition-all duration-700">
                    <div className="container mx-auto px-4 max-w-3xl">
                        <ROICalculator />
                    </div>
                </section>

                <section className="bg-slate-50 dark:bg-slate-900 py-16 transition-all duration-700">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-2xl mx-auto">
                            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-6">
                                Respaldados por
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <img
                                    src="/logo/acelerado.png"
                                    alt="Emprelatam Logo"
                                    className="h-16 w-auto opacity-80 hover:opacity-100 transition-opacity"
                                />
                                <div className="text-left">
                                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                        Acelerados por Emprelatam
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        La aceleradora #1 de LATAM
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 sm:py-28 bg-primary transition-all duration-700">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-primary-foreground">
                            Los mejores vendedores no compiten por precio.
                        </h2>
                        <p className="text-lg sm:text-xl md:text-2xl mb-4 text-primary-foreground font-semibold max-w-2xl mx-auto">
                            Compiten por claridad.
                        </p>
                        <p className="text-base sm:text-lg mb-12 text-primary-foreground/80 max-w-xl mx-auto">
                            Implementación en 48hs. Sin compromiso. Sin costos fijos.
                        </p>
                        <Button size="lg" variant="secondary" asChild className="rounded-full px-12 h-16 text-xl shadow-2xl hover:scale-105 transition-transform font-bold">
                            <Link href="mailto:juanulian@gmail.com?subject=Solicitud%20de%20Reuni%C3%B3n%20-%20Shoppa!&body=Hola!%20Quiero%20vender%20con%20Shoppa!%20y%20pagar%20solo%206%25%20de%20comisi%C3%B3n.%0A%0AFacturaci%C3%B3n%20mensual%20aproximada%3A%20%0ACategor%C3%ADa%20principal%3A%20">
                                Empezar ahora
                                <ArrowRight className="ml-3 h-6 w-6" />
                            </Link>
                        </Button>
                        <p className="text-sm text-primary-foreground/70 mt-6">
                            Primeros 30 días gratis para probar. Luego, solo 6% por venta.
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

    