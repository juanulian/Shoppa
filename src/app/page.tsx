import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, BarChart, Bot, DollarSign, Group, TrendingUp, Zap } from 'lucide-react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Badge } from '@/components/ui/badge';

interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, description, value }) => (
    <div className="group relative overflow-hidden rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-white/80 to-primary/5 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/25 dark:from-primary/20 dark:via-slate-900/80 dark:to-primary/10 dark:border-primary/30 hover:-translate-y-2 hover:border-primary/40">
        <div className="absolute top-0 right-0 -m-4 h-24 w-24 rounded-full bg-primary/20 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-150"></div>
        <div className="relative z-10">
            <Icon className="h-10 w-10 text-primary mb-4 drop-shadow-sm" />
            <p className="text-4xl font-bold text-primary dark:text-primary mb-1 drop-shadow-sm">{value}</p>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
        </div>
    </div>
);

interface BenefitCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    children: React.ReactNode;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon: Icon, title, children }) => (
    <Card className="p-6 text-center flex flex-col items-center shadow-lg hover:shadow-primary/30 transition-all duration-300 bg-gradient-to-b from-primary/5 via-white/90 to-primary/10 backdrop-blur-sm dark:from-primary/10 dark:via-slate-800/90 dark:to-primary/20 border-2 border-primary/20 hover:border-primary/40 hover:-translate-y-1">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
            <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-primary">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400">{children}</p>
    </Card>
);

interface TestimonialCardProps {
    text: string;
    author: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ text, author }) => (
    <Card className="p-6 bg-gradient-to-br from-white/90 via-primary/5 to-white/80 backdrop-blur-sm dark:from-slate-800/90 dark:via-primary/10 dark:to-slate-800/80 border-2 border-primary/20 dark:border-primary/30 shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-0">
            <p className="text-slate-600 dark:text-slate-300 mb-4 italic">"{text}"</p>
            <p className="font-semibold text-right text-primary">- {author}</p>
        </CardContent>
    </Card>
);

interface FAQItemProps {
    value: string;
    question: string;
    children: React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ value, question, children }) => (
    <AccordionItem value={value} className="border-white/20">
        <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">{question}</AccordionTrigger>
        <AccordionContent className="text-muted-foreground">{children}</AccordionContent>
    </AccordionItem>
);

const LandingPage: React.FC = () => {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 text-center overflow-hidden bg-[url('/background/botones.jpg')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/80"></div>
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <Badge variant="outline" className="mb-4 border-primary/50 text-primary animate-in fade-in-0 duration-1000 bg-background/50 backdrop-blur-sm">La solución de IA para Retail Tech</Badge>
                        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl animate-in fade-in-0 slide-in-from-bottom-5 duration-1000">
                            ¿Tus clientes abandonan el carrito porque no saben qué elegir?
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-5 duration-1000 delay-200">
                            Shoppa! convierte clientes indecisos en compradores satisfechos. Nuestro asistente IA los guía desde la confusión hasta la compra en 3 minutos.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4 animate-in fade-in-0 slide-in-from-bottom-5 duration-1000 delay-300">
                            <Button size="lg" asChild>
                                <Link href="/demo">Ver Demo en Vivo <ArrowRight className="ml-2 h-5 w-5" /></Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="#contacto">Agendar Reunión</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Problem Section */}
                <section id="problema" className="relative py-16 md:py-24 bg-[url('/background/cards.png')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm"></div>
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight">El costo oculto de la indecisión del cliente</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                                Competir por precio ya no es suficiente. El verdadero problema es la parálisis por análisis que sufren tus clientes frente a productos complejos.
                            </p>
                        </div>
                        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="relative p-6 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-primary/20 bg-cover bg-center bg-[url('/background/cards_2.png')]">
                                <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm rounded-lg"></div>
                                <div className="relative">
                                    <p className="text-4xl font-bold text-primary drop-shadow-sm">68%</p>
                                    <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">de carritos abandonados en e-commerce.</p>
                                </div>
                            </div>
                            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-white/90 to-primary/5 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-primary/20">
                                <p className="text-4xl font-bold text-primary drop-shadow-sm">30+</p>
                                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">minutos comparando sin decidirse a comprar.</p>
                            </div>
                            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-white/90 to-primary/5 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-primary/20">
                                <p className="text-4xl font-bold text-primary drop-shadow-sm">50%</p>
                                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">del tiempo de tus vendedores en consultas repetitivas.</p>
                            </div>
                            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-white/90 to-primary/5 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-primary/20">
                                <p className="text-4xl font-bold text-primary drop-shadow-sm">Bajo</p>
                                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">margen de ganancia al competir solo por precio.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Solution Section */}
                <section id="solucion" className="relative py-16 md:py-24 bg-[url('/background/botones.jpg')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-background/80 dark:bg-slate-950/80 backdrop-blur-sm"></div>
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight">La Solución: Tu Asesor Digital 24/7</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                                Shoppa! replica a tu mejor vendedor, pero a escala digital. Guía, entiende y recomienda, convirtiendo la duda en una venta segura.
                            </p>
                        </div>
                        <div className="relative mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 hidden md:block"></div>
                            <div className="absolute top-1/2 left-0 w-full flex justify-between hidden md:flex">
                                <div className="h-0.5 bg-primary transition-all duration-500 w-1/2"></div>
                            </div>
                            <div className="relative flex flex-col items-center text-center p-6 bg-gradient-to-br from-primary/15 via-white/90 to-primary/10 backdrop-blur-sm rounded-xl border-2 border-primary/30 shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-4 border-white/50 dark:border-slate-900/50 mb-4 shadow-lg">
                                    <Group className="h-8 w-8" />
                                </div>
                                <h3 className="font-semibold text-primary mb-2">1. Cliente llega confundido</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Abrumado por opciones y especificaciones técnicas.</p>
                            </div>
                            <div className="relative flex flex-col items-center text-center p-6 bg-gradient-to-br from-primary/15 via-white/90 to-primary/10 backdrop-blur-sm rounded-xl border-2 border-primary/30 shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-4 border-white/50 dark:border-slate-900/50 mb-4 shadow-lg">
                                    <Bot className="h-8 w-8" />
                                </div>
                                <h3 className="font-semibold text-primary mb-2">2. Shoppa! hace preguntas simples</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Entiende la necesidad real del cliente en su lenguaje.</p>
                            </div>
                            <div className="relative flex flex-col items-center text-center p-6 bg-gradient-to-br from-primary/15 via-white/90 to-primary/10 backdrop-blur-sm rounded-xl border-2 border-primary/30 shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-4 border-white/50 dark:border-slate-900/50 mb-4 shadow-lg">
                                    <Zap className="h-8 w-8" />
                                </div>
                                <h3 className="font-semibold text-primary mb-2">3. Cliente recibe 3 opciones perfectas</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Recomendaciones claras con justificaciones que generan confianza.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Social Proof Section */}
                <section id="resultados" className="relative py-16 md:py-24 bg-[url('/background/cards.png')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm"></div>
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight">Resultados Reales, No Promesas Vacías</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                                Los datos de nuestra prueba piloto hablan por sí solos. Los usuarios no solo están satisfechos, están listos para comprar.
                            </p>
                        </div>
                        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                           <StatCard icon={TrendingUp} value="56%" title="Intención de Compra" description="Más de la mitad de los usuarios afirmaron su intención de comprar tras la recomendación." />
                           <StatCard icon={BarChart} value="81%" title="Preferencia vs. Sitios Tradicionales" description="Una abrumadora mayoría prefiere la guía de Shoppa! a navegar catálogos complejos." />
                           <StatCard icon={Zap} value="4.6/5" title="Satisfacción de Usuario" description="Calificación promedio que supera los estándares de la industria del e-commerce." />
                           <StatCard icon={Group} value="92%" title="NPS Positivo (Promotores)" description="9 de cada 10 usuarios recomendarían activamente la experiencia a otros." />
                        </div>
                        <div className="text-center mt-4 text-xs text-muted-foreground">
                            * Métricas validadas sobre una muestra de usuarios en nuestra encuesta de satisfacción.
                        </div>
                    </div>
                </section>
                
                {/* Benefits Section */}
                <section className="relative py-16 md:py-24 bg-[url('/background/cards_2.png')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-background/80 dark:bg-slate-950/80 backdrop-blur-sm"></div>
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight">Los Resultados que Obtenés en Tu Negocio</h2>
                            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                                Implementar Shoppa! no es un gasto, es una inversión directa en el crecimiento de tu negocio.
                            </p>
                        </div>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <BenefitCard icon={TrendingUp} title="Más Conversiones">
                                Clientes que entienden qué compran, compran más. Shoppa! transforma dudas en ventas, reduciendo el abandono de carrito.
                            </BenefitCard>
                            <BenefitCard icon={Group} title="Clientes Más Satisfechos">
                                Una experiencia de compra guiada y sin fricción genera clientes leales. La satisfacción de 4.6/5 se traduce en recompras y recomendaciones.
                            </BenefitCard>
                            <BenefitCard icon={DollarSign} title="Vendedores Optimizados">
                                Liberá a tu equipo de las preguntas básicas y repetitivas. Dejá que Shoppa! se encargue de la calificación inicial para que tus vendedores se enfoquen en cerrar ventas complejas.
                            </BenefitCard>
                        </div>
                    </div>
                </section>

                 {/* Testimonials Section */}
                <section className="relative py-16 md:py-24 bg-[url('/background/header_footer.png')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm"></div>
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                         <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight">Lo que dicen quienes ya lo probaron</h2>
                             <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                                Escuchá directamente a los usuarios que experimentaron la diferencia con Shoppa!.
                            </p>
                        </div>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                           <TestimonialCard text="Me encanto! Sobre todo me gusto mucho que sea correlacional con mis gustos." author="Clara" />
                           <TestimonialCard text="Es una necesidad que no sabía que tenía." author="Florencia" />
                           <TestimonialCard text="Me gustó que no te invaden con muchas cosas, es claro en la búsqueda que uno necesita." author="Fernando" />
                           <TestimonialCard text="Te hace tener claro que quieres." author="Ciro" />
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="precios" className="relative py-16 md:py-24 bg-[url('/background/cards_2.png')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-background/80 dark:bg-slate-950/80 backdrop-blur-sm"></div>
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-bold tracking-tight">Modelos Flexibles para Cada Negocio</h2>
                            <p className="mt-4 text-muted-foreground">
                                Olvidate de los costos fijos y las licencias caras. Nuestro modelo es simple: ganamos solo si vos ganás.
                            </p>
                        </div>
                        <div className="mt-12">
                            <Card className="max-w-2xl mx-auto shadow-2xl bg-gradient-to-br from-primary/10 to-transparent dark:from-primary/20 dark:to-transparent backdrop-blur-sm">
                                <CardContent className="p-8">
                                    <h3 className="text-2xl font-bold text-primary mb-2">Pay-per-Success</h3>
                                    <p className="text-4xl font-bold mb-4">Costo Cero para tu negocio</p>
                                    <p className="text-muted-foreground mb-6">No pagás nada por la implementación ni el mantenimiento. Shoppa! añade una pequeña comisión del 3% que abona el cliente final a cambio del servicio premium de asesoramiento. Es un win-win.</p>
                                    <ul className="space-y-4 text-left">
                                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /> <span>Implementación y Setup Gratuitos</span></li>
                                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /> <span>Sin costos fijos mensuales</span></li>
                                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /> <span>El cliente final percibe un servicio de valor agregado</span></li>
                                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500" /> <span>Aumentás tu conversión sin inversión inicial</span></li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="relative py-16 md:py-24 bg-[url('/background/cards.png')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm"></div>
                    <div className="container mx-auto px-4 md:px-6 max-w-3xl relative z-10">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-tight">Preguntas Frecuentes</h2>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                            <FAQItem value="faq-1" question="¿Cómo se integra Shoppa! con mi e-commerce actual?">
                                Nuestra integración es simple y rápida. Funciona con las plataformas más populares como Shopify, Tiendanube, WooCommerce y más, a través de un simple snippet de código o un plugin. No necesitás un equipo técnico para ponerlo en marcha.
                            </FAQItem>
                            <FAQItem value="faq-2" question="¿Mi equipo necesita capacitación para usarlo?">
                                ¡No! Shoppa! es totalmente autónomo. Funciona 24/7 sin intervención humana. Tu equipo solo notará que los clientes llegan más decididos y con menos preguntas básicas.
                            </FAQItem>
                            <FAQItem value="faq-3" question="¿Qué pasa si el cliente no compra a través de la recomendación?">
                                No pasa nada. El modelo "Pay-per-Success" significa que la comisión solo se aplica si la venta se concreta a través de nuestro flujo. Si el cliente no compra, no hay ningún costo para nadie. Es un modelo 100% basado en resultados.
                            </FAQItem>
                             <FAQItem value="faq-4" question="¿Se puede personalizar el catálogo de productos?">
                                Por supuesto. Shoppa! se conecta a tu base de datos de productos para asegurarse de que las recomendaciones siempre reflejen tu stock, precios y ofertas actuales. La personalización es total.
                            </FAQItem>
                        </Accordion>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section id="contacto" className="py-16 md:py-24 text-white relative bg-[url('/background/botones.jpg')] bg-cover bg-center">
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(45deg, hsl(var(--primary) / 0.9), hsl(var(--primary) / 0.7))' }}></div>
                    <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
                        <h2 className="text-3xl font-bold tracking-tight">¿Listo para dejar de perder clientes?</h2>
                        <p className="mt-4 max-w-2xl mx-auto">
                            Probá Shoppa! sin compromiso. La implementación es rápida, gratuita y te acompañamos en cada paso.
                        </p>
                        <div className="mt-8">
                            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-slate-200" asChild>
                                <Link href="/demo">Lo quiero probar</Link>
                            </Button>
                        </div>
                         <p className="mt-4 text-sm text-white/80">
                            Garantía de 30 días sin riesgo. Si no ves resultados, no hay costo alguno.
                        </p>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;

// CheckCircle icon component
const CheckCircle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
