
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LucideIcon, DollarSign, Zap, CheckCircle } from 'lucide-react';

interface Step { icon: LucideIcon; title: string; description: string; }
const steps: Step[] = [
  { icon: DollarSign, title: 'Más margen', description: 'Comisiones más bajas → más ganancia por venta.' },
  { icon: Zap, title: 'Clientes decididos', description: 'Menos fricción, menos preguntas, más conversiones.' },
  { icon: CheckCircle, title: 'Alta simple', description: 'Sin costos fijos. Pagás cuando vendés.' },
];

export default function InteractiveTimelineCurved() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  // Progreso mapeado a 0–100% para offset-distance
  const offsetDistance = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%']);
  const pathOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);

  // Path responsivo (pensado para ~768px de alto; se escala con el contenedor)
  const PATH = `M 50 0 
                C 50 120, 200 160, 200 260
                S 50 360, 50 460
                S 200 560, 200 660`;

  return (
    <section ref={ref} className="py-20 sm:py-28 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 relative max-w-5xl">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Un camino claro para vender</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Seguí el recorrido: problema → solución → resultado.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10">
          {/* Columna izquierda: camino + pelotita */}
          <div className="relative min-h-[760px] md:min-h-[900px]">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 260 700"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <motion.path
                d={PATH}
                fill="none"
                stroke="currentColor"
                className="text-primary/25"
                strokeWidth={4}
                style={{ opacity: pathOpacity }}
              />
            </svg>

            {/* Pelotita que recorre el PATH */}
            <motion.div
              aria-hidden="true"
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary shadow-lg ring-4 ring-primary/15"
              style={{
                offsetPath: `path('${PATH}')`,
                offsetDistance,
                offsetRotate: '0deg',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          </div>

          {/* Columna derecha: contenidos sincronizados */}
          <div className="space-y-16">
            {steps.map((s, i) => (
              <StepCard key={i} index={i} {...s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  icon: Icon,
  title,
  description,
  index,
}: Step & { index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 0.8', 'end 0.6'],
  });

  const o = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ['24px', '0px']);
  const s = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity: o, y, scale: s }}
      className="bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
      role="group"
      aria-label={`Paso ${index + 1}: ${title}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
