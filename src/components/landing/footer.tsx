
import React from 'react';
import Link from 'next/link';
import Logo from '../icons/logo';

export function Footer() {
  return (
    <footer 
      className="w-full py-8 relative"
      style={{
          backgroundImage: "url('/background/header_footer.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm"></div>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-6 relative">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Convierte indecisión en ventas.
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            Desarrollado en Argentina
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Navegación</h4>
            <ul className="space-y-2">
              <li><Link href="#problema" className="text-muted-foreground hover:text-foreground">El Problema</Link></li>
              <li><Link href="#solucion" className="text-muted-foreground hover:text-foreground">La Solución</Link></li>
              <li><Link href="#resultados" className="text-muted-foreground hover:text-foreground">Resultados</Link></li>
              <li><Link href="#precios" className="text-muted-foreground hover:text-foreground">Precios</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Términos y Condiciones</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Política de Privacidad</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-sm">
          <h4 className="font-semibold mb-2">Contacto</h4>
          <p className="text-muted-foreground">¿Listo para potenciar tus ventas?</p>
          <Link href="mailto:hola@shoppa.ai" className="text-primary font-medium hover:underline">
            hola@shoppa.ai
          </Link>
        </div>
      </div>
      <div className="container mx-auto mt-8 px-4 md:px-6 text-center text-xs text-muted-foreground relative">
        &copy; {new Date().getFullYear()} Shoppa!. Todos los derechos reservados.
      </div>
    </footer>
  );
}
