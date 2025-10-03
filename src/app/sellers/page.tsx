
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

                <section className="bg-[url('/background/cards.png')] bg-cover bg-center py-20 sm:py-28 transition-all duration-700">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <ShoppingCart className="h-16 w-16 text-primary mx-auto mb-6" />
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-slate-100 [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]">
                                El costo oculto de la indecisión del cliente
                            </h2>
                            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]">
                                Competir por precio ya no es suficiente. El verdadero problema es la <span className="font-semibold text-foreground">parálisis por análisis</span> que sufren tus clientes frente a productos complejos.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
                            <Card
                              className="p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md hover:scale-105 transition-transform duration-300 shadow-xl"
                              role="article"
                              aria-label="Estadística: 75% de carritos abandonados"
                            >
                                <p className="text-5xl sm:text-6xl font-bold text-primary mb-3" aria-label="75 por ciento">75%</p>
                                <p className="text-sm sm:text-base font-medium text-muted-foreground leading-snug">
                                    de carritos abandonados en LATAM vs 69% global
                                </p>
                            </Card>
                            <Card
                              className="p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md hover:scale-105 transition-transform duration-300 shadow-xl"
                              role="article"
                              aria-label="Estadística: Más de 30 minutos comparando productos"
                            >
                                <p className="text-5xl sm:text-6xl font-bold text-primary mb-3" aria-label="Más de 30">30+</p>
                                <p className="text-sm sm:text-base font-medium text-muted-foreground leading-snug">
                                    minutos comparando sin decidirse a comprar
                                </p>
                            </Card>
                            <Card
                              className="p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md hover:scale-105 transition-transform duration-300 shadow-xl"
                              role="article"
                              aria-label="Estadística: 50% del tiempo de vendedores en consultas"
                            >
                                <p className="text-5xl sm:text-6xl font-bold text-primary mb-3" aria-label="50 por ciento">50%</p>
                                <p className="text-sm sm:text-base font-medium text-muted-foreground leading-snug">
                                    del tiempo de tus vendedores en consultas repetitivas
                                </p>
                            </Card>
                            <Card
                              className="p-6 sm:p-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md hover:scale-105 transition-transform duration-300 shadow-xl"
                              role="article"
                              aria-label="Estadística: Bajo margen de ganancia"
                            >
                                <p className="text-5xl sm:text-6xl font-bold text-primary mb-3" aria-label="Bajo">Bajo</p>
                                <p className="text-sm sm:text-base font-medium text-muted-foreground leading-snug">
                                    Margen de ganancia al competir solo por precio
                                </p>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Removed broken timeline section */}

                <section className="bg-slate-50 dark:bg-slate-900 py-20 sm:py-28 transition-all duration-700">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-4xl mx-auto mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                                Comparativa: Shoppa! vs MercadoLibre
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Analizá los costos reales y descubrí cómo podés maximizar tu margen
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {/* MercadoLibre */}
                            <Card className="p-8 bg-slate-100 dark:bg-slate-800 border-2">
                                <CardHeader className="p-0 mb-6">
                                    <CardTitle className="text-2xl flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-yellow-900">ML</span>
                                        </div>
                                        MercadoLibre
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-medium">Cargo por vender (Celulares)</span>
                                            <span className="text-lg font-bold text-yellow-600">11.80% - 17.14%</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-medium">Costo fijo adicional</span>
                                            <span className="text-lg font-bold text-yellow-600">$1.115 - $2.810</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-medium">Cuotas con interés bajo</span>
                                            <span className="text-lg font-bold text-yellow-600">+4%</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-medium">12 cuotas sin interés</span>
                                            <span className="text-lg font-bold text-yellow-600">+32.70%</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-300 dark:border-slate-700">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold">Total estimado</span>
                                            <span className="text-2xl font-bold text-yellow-600">15.80% - 49.84%</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            *Más costos de envío, impuestos y retenciones
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Shoppa! */}
                            <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary shadow-xl relative overflow-hidden">
                                <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                                    SIMPLE Y CLARO
                                </div>
                                <CardHeader className="p-0 mb-6">
                                    <CardTitle className="text-2xl flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                                            <span className="text-2xl font-bold text-white">S!</span>
                                        </div>
                                        Shoppa!
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-medium">Comisión por venta</span>
                                            <div className="text-right">
                                                <span className="text-2xl font-bold text-primary block">6%</span>
                                                <span className="text-xs text-muted-foreground">fijo, todo incluido</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-medium">Costo fijo adicional</span>
                                            <span className="text-lg font-bold text-green-600">$0</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-medium">Financiación incluida</span>
                                            <span className="text-lg font-bold text-green-600">✓</span>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-medium">Cuotas flexibles</span>
                                            <span className="text-lg font-bold text-green-600">✓</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-primary/20">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold">Total siempre</span>
                                            <span className="text-3xl font-bold text-primary">6%</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            *Sin letra chica. Sin costos ocultos.
                                        </p>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-xl">
                                        <p className="text-sm font-semibold text-green-800 dark:text-green-200 text-center mb-2">
                                            💰 Ahorrá hasta 43.84% vs MercadoLibre
                                        </p>
                                        <p className="text-xs text-green-700 dark:text-green-300 text-center">
                                            Vendés +$10M/mes? Bajamos a <span className="font-bold">5%</span>
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="text-center mt-12">
                            <p className="text-sm text-muted-foreground mb-4">
                                *Datos de MercadoLibre actualizados a Enero 2025. Categoría: Celulares y Smartphones
                            </p>
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

    