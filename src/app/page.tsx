'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Smartphone, Laptop, Headphones, Search, ArrowRight, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

const categories = [
  {
    id: 'smartphones',
    name: 'Celulares',
    icon: Smartphone,
    active: true,
    description: 'Encuentra tu celular ideal',
  },
  {
    id: 'laptops',
    name: 'Laptops',
    icon: Laptop,
    active: false,
    description: 'Próximamente',
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: Headphones,
    active: false,
    description: 'Próximamente',
  },
];

export default function BuyerLandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Por ahora solo celulares, ir directo al onboarding
      router.push('/demo');
    }
  };

  const handleCategoryClick = (categoryId: string, active: boolean) => {
    if (active) {
      router.push('/demo');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
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
            <Link href="/sellers">
              Quiero Vender →
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Encontrá tu celular perfecto
            <br />
            <span className="text-primary">en 3 minutos</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Sin perderte en 500 opciones. Sin arrepentimientos.
            <br />
            Shoppa! te recomienda exactamente lo que necesitás.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Ej: 'celular para fotos', 'iPhone bajo presupuesto'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 pr-4 text-lg rounded-full border-2 focus-visible:ring-primary"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 rounded-full text-lg">
                Buscar
              </Button>
            </div>
          </form>

          {/* Categories */}
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
              O explorá por categoría
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card
                    key={category.id}
                    className={`p-8 transition-all duration-300 cursor-pointer border-2 ${
                      category.active
                        ? 'hover:border-primary hover:shadow-lg hover:scale-105 bg-gradient-to-br from-primary/5 to-transparent'
                        : 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900'
                    }`}
                    onClick={() => handleCategoryClick(category.id, category.active)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                          category.active
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{category.name}</h3>
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

      {/* How it Works */}
      <section className="bg-slate-100 dark:bg-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">¿Cómo funciona?</h2>
            <p className="text-xl text-muted-foreground">Simple, rápido, sin vueltas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Respondé 3 preguntas</h3>
              <p className="text-muted-foreground">
                Contanos qué necesitás en lenguaje simple. Sin términos técnicos raros.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Te mostramos 3 opciones</h3>
              <p className="text-muted-foreground">
                Nuestra IA selecciona las 3 mejores opciones para vos. Ni más, ni menos.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Comprás sin dudas</h3>
              <p className="text-muted-foreground">
                Elegís la que más te gusta y listo. Sin arrepentimientos, sin vueltas atrás.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button size="lg" onClick={() => router.push('/demo')} className="rounded-full px-8">
              <Zap className="mr-2 h-5 w-5" />
              Empezar ahora
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              ¿Por qué confiar en Shoppa!?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center border-2">
              <div className="text-5xl font-bold text-primary mb-2">4.8/5</div>
              <p className="text-muted-foreground">Satisfacción de usuarios</p>
            </Card>

            <Card className="p-8 text-center border-2">
              <div className="text-5xl font-bold text-primary mb-2">69%</div>
              <p className="text-muted-foreground">Deciden comprar inmediatamente</p>
            </Card>

            <Card className="p-8 text-center border-2">
              <div className="text-5xl font-bold text-primary mb-2">3min</div>
              <p className="text-muted-foreground">Promedio de decisión vs 30min tradicional</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-100 dark:bg-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Lo que dicen nuestros usuarios</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <p className="text-lg mb-4 italic">
                "Me encantó! Sobre todo me gustó mucho que sea correlacional con mis gustos."
              </p>
              <p className="font-semibold text-primary">— Clara</p>
            </Card>

            <Card className="p-6">
              <p className="text-lg mb-4 italic">
                "Es una necesidad que no sabía que tenía."
              </p>
              <p className="font-semibold text-primary">— Florencia</p>
            </Card>

            <Card className="p-6">
              <p className="text-lg mb-4 italic">
                "Me gustó que no te invaden con muchas cosas, es claro en la búsqueda que uno necesita."
              </p>
              <p className="font-semibold text-primary">— Fernando</p>
            </Card>

            <Card className="p-6">
              <p className="text-lg mb-4 italic">
                "Te hace tener claro qué querés."
              </p>
              <p className="font-semibold text-primary">— Ciro</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            ¿Listo para encontrar tu celular ideal?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Tomá 3 minutos ahora y olvidate de las dudas
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => router.push('/demo')}
            className="rounded-full px-12 text-lg"
          >
            Empezar ahora →
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="mb-4">© 2025 Shoppa! Todos los derechos reservados.</p>
          <div className="flex justify-center gap-6">
            <Link href="/sellers" className="hover:text-primary">
              Quiero Vender
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
