'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LucideIcon, DollarSign, Zap, CheckCircle, TrendingUp } from 'lucide-react';

interface TimelineStep {
  icon: LucideIcon;
  title: string;
  description: string;
  position: number; // 0 to 1, position along the path
}

const steps: TimelineStep[] = [
  {
    icon: DollarSign,
    title: 'Más margen',
    description: 'Comisiones más bajas → más ganancia por venta.',
    position: 0.25
  },
  {
    icon: Zap,
    title: 'Clientes decididos',
    description: 'Menos fricción, menos preguntas, más conversiones.',
    position: 0.5
  },
  {
    icon: CheckCircle,
    title: 'Alta simple',
    description: 'Sin costos fijos. Pagás cuando vendés.',
    position: 0.75
  },
  {
    icon: TrendingUp,
    title: 'Crecimiento sostenible',
    description: 'Escalá tu negocio con costos predecibles.',
    position: 0.95
  }
];

export default function ScrollTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Path que recorre toda la página
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const circleProgress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // SVG Path - recorre de arriba a abajo con curvas suaves
  const PATH = `
    M 50 50
    C 50 150, 200 200, 200 350
    S 50 500, 50 700
    S 200 900, 200 1100
    S 50 1300, 50 1500
  `;

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ minHeight: '200vh' }}
      role="region"
      aria-label="Línea de tiempo interactiva del proceso de ventas"
    >
      {/* SVG Path fijo en viewport */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-10">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 250 1600"
          preserveAspectRatio="xMidYMid slice"
          aria-label="Camino visual que representa el flujo de mejora en ventas"
          role="img"
        >
          <title>Ruta de progreso visual</title>
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(255, 103, 77)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(255, 103, 77)" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Línea de fondo completa */}
          <motion.path
            d={PATH}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth={8}
            strokeLinecap="round"
            opacity={0.4}
          />

          {/* Línea de progreso */}
          <motion.path
            d={PATH}
            fill="none"
            stroke="rgb(255, 103, 77)"
            strokeWidth={8}
            strokeLinecap="round"
            style={{
              pathLength,
              strokeDasharray: '1 1',
              strokeDashoffset: 0,
            }}
          />
        </svg>

        {/* Círculo animado que sigue el path */}
        <motion.div
          className="w-8 h-8 rounded-full bg-primary shadow-2xl ring-4 ring-primary/30 absolute"
          style={{
            offsetPath: `path('${PATH}')`,
            offsetDistance: circleProgress,
            offsetRotate: '0deg',
            left: '0',
            top: '0',
          }}
          role="presentation"
          aria-label="Indicador de progreso"
        />
      </div>

      {/* Content sections con cards posicionadas */}
      <div className="relative z-20">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <TimelineCard
              key={index}
              step={step}
              index={index}
              totalSteps={steps.length}
            />
          );
        })}
      </div>
    </div>
  );
}

interface TimelineCardProps {
  step: TimelineStep;
  index: number;
  totalSteps: number;
}

function TimelineCard({ step, index, totalSteps }: TimelineCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 0.7', 'end 0.3'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -20]);

  const Icon = step.icon;
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={cardRef}
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        marginTop: index === 0 ? '0' : '-40vh',
      }}
    >
      <motion.div
        style={{ opacity, scale, y }}
        className={`max-w-md w-full ${isLeft ? 'mr-auto md:ml-16' : 'ml-auto md:mr-16'}`}
      >
        <div
          className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl"
          role="article"
          aria-label={`Paso ${index + 1}: ${step.title}`}
        >
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center flex-shrink-0">
              <Icon className="w-8 h-8 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">
                {step.title}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
