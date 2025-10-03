
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Smartphone, Laptop, Home, Search, ArrowRight, Zap } from 'lucide-react';
import Logo from '@/components/icons/logo';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


type Category = {
  id: string;
  name: string;
  icon: LucideIcon;
  active: boolean;
  description: string;
};

const categories: Category[] = [
  {
    id: 'smartphones',
    name: 'Celulares',
    icon: Smartphone,
    active: true,
    description: 'Encontrá tu celular ideal',
  },
  {
    id: 'laptops',
    name: 'Laptops',
    icon: Laptop,
    active: false,
    description: 'Próximamente',
  },
  {
    id: 'appliances',
    name: 'Electrodomésticos',
    icon: Home,
    active: false,
    description: 'Próximamente',
  },
];

export default function BuyerLandingPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = searchQuery.trim();
    const url = q ? `/demo?q=${encodeURIComponent(q)}` : '/demo';
    router.push(url);
  };

  const handleCategoryClick = (active: boolean) => {
    if (active) router.push('/demo');
  };

  return (
    <div className="min-h-screen">
      <header className="bg-[url('/background/header_footer.png')] bg-cover bg-center border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" aria-label="Shoppa! - Inicio">
              <Logo />
            </Link>

            <Button variant="outline" asChild className="rounded-full">
              <Link href="/sellers">Quiero Vender →</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="bg-[url('/background/cards_2.png')] bg-cover bg-center py-20 sm:py-28 transition-all duration-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 text-slate-900 dark:text-slate-100 [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]">
              Encontrá lo que buscás
              <br />
              <span className="text-primary">en 3 minutos</span>
            </h1>

            <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]">
              Sin perderte en 500 opciones. Sin arrepentimientos.
              <br />
              Shoppa! te recomienda exactamente lo que necesitás.
            </p>

            <form
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200"
            >
              <div className="flex flex-row gap-3">
                <div className="relative flex-1">
                  <Search
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                  />
                  <Input
                    type="text"
                    inputMode="search"
                    placeholder="Ej: "celular para fotos", "iPhone bajo presupuesto"…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 pl-12 pr-4 text-lg rounded-full border-2 focus-visible:ring-primary"
                    aria-label="Buscar productos"
                  />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="submit" className="h-14 w-14 rounded-full text-2xl font-extrabold border-2 border-primary/50 text-white">
                        S!
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Buscar</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </form>

            {/* Conector visual */}
            <div className="flex items-center justify-center gap-4 mb-8 animate-in fade-in duration-700 delay-300">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-700"></div>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-4">
                O explorá por categoría
              </span>
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-700"></div>
            </div>

            {/* Categorías en la misma sección */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const disabled = !category.active;
                  return (
                    <Card
                      key={category.id}
                      role="button"
                      aria-disabled={disabled}
                      tabIndex={disabled ? -1 : 0}
                      className={[
                        'p-6 sm:p-8 transition-all duration-300 border-2',
                        disabled
                          ? 'opacity-50 cursor-not-allowed bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-md'
                          : 'cursor-pointer hover:border-primary hover:shadow-lg hover:scale-105 bg-gradient-to-br from-primary/10 to-transparent bg-white/90 dark:bg-slate-950/90 backdrop-blur-md',
                      ].join(' ')}
                      onClick={() => handleCategoryClick(category.active)}
                      onKeyDown={(e) => {
                        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                          e.preventDefault();
                          handleCategoryClick(category.active);
                        }
                      }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={[
                            'w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4',
                            disabled
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                              : 'bg-primary text-primary-foreground',
                          ].join(' ')}
                        >
                          <Icon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                        {category.active && (
                          <Button variant="ghost" size="sm" className="mt-4 group">
                            Explorar
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-900 py-20 transition-all duration-700">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">¿Cómo funciona?</h2>
              <p className="text-xl text-muted-foreground">Simple, rápido, sin vueltas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" role="list">
              {[
                { step: 1, title: 'Respondé 3 preguntas', desc: 'Contanos qué necesitás' },
                {
                  step: 2,
                  title: 'Te mostramos 3 opciones',
                  desc: 'Shoppa! selecciona las 3 mejores opciones para vos. Ni más, ni menos',
                },
                { step: 3, title: 'Comprás sin dudas', desc: 'Elegís la que más te gusta y listo' },
              ].map(({ step, title, desc }) => (
                <div
                  key={step}
                  className="text-center p-4"
                  role="listitem"
                  aria-label={`Paso ${step}: ${title}`}
                >
                  <div
                    className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4"
                    aria-label={`Paso número ${step}`}
                    role="img"
                  >
                    {step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{title}</h3>
                  <p className="text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" onClick={() => router.push('/demo')} className="rounded-full px-8">
                <Zap className="mr-2 h-5 w-5" />
                Empezar ahora
              </Button>
            </div>
        </div>
      </section>

      <section className="bg-[url('/background/header_footer.png')] bg-cover bg-center py-20 transition-all duration-700">
        <div className="bg-primary/95 backdrop-blur-md py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-primary-foreground">
              ¿Listo para encontrar tu celular ideal?
            </h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Tomá 3 minutos ahora y olvidate de las dudas
            </p>

            <Button asChild size="lg" variant="secondary" className="rounded-full px-12 text-lg shadow-xl hover:scale-105 transition-transform">
              <Link
                href={
                  'mailto:juanulian@gmail.com?subject=' +
                  encodeURIComponent('Solicitud de Reunión - Shoppa!') +
                  '&body=' +
                  encodeURIComponent('Hola! Me gustaría coordinar una reunión para ver cómo implementar Shoppa! en mi negocio.')
                }
              >
                Lo quiero probar
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-[url('/background/header_footer.png')] bg-cover bg-center border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm py-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p className="mb-4">© 2025 Shoppa! Todos los derechos reservados.</p>
            <div className="flex justify-center gap-6">
              <Link href="/sellers" className="hover:text-primary transition-colors">
                Quiero Vender
              </Link>
              <Link href="mailto:juanulian@gmail.com" className="hover:text-primary transition-colors">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
