
'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/icons/logo';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-sm bg-[url('/background/header_footer.png')] bg-cover bg-center">
      <div className="absolute inset-0 glassmorphism-strong"></div>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 relative z-10">
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
          <Button variant="ghost" className="glassmorphism transition-all duration-300 hover:glassmorphism-strong hover:scale-105" asChild>
            <Link href="mailto:juan.ulian@pluscompol.com?subject=Solicitud%20de%20Reunión%20-%20Shoppa!&body=Hola!%20Me%20gustaría%20coordinar%20una%20reunión%20en%20los%20próximos%20días%20para%20ver%20como%20implementar%20Shoppa!%20en%20mi%20negocio.%20Vendo%20...%20(completar%20sugerencia)">Agendar Reunión</Link>
          </Button>
          <Button className="glassmorphism-strong transition-all duration-300 hover:scale-105" asChild>
            <Link href="/demo">Probar ahora</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
