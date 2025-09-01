
'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/icons/logo';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#problema"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            El Problema
          </Link>
          <Link
            href="#solucion"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Solución
          </Link>
          <Link
            href="#resultados"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Resultados
          </Link>
          <Link
            href="#precios"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Precios
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="#contacto">Agendar Reunión</Link>
          </Button>
          <Button asChild>
            <Link href="/demo">Ver Demo en Vivo</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
