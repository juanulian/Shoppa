
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { DollarSign, Zap, CheckCircle, LucideIcon } from 'lucide-react';

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: DollarSign,
    title: 'Aumentá tu Margen de Ganancia',
    description: 'Con comisiones significativamente más bajas que Mercado Libre, te quedás con más dinero en cada venta. Vendé más, ganá más.',
  },
  {
    icon: Zap,
    title: 'Recibí Clientes Listos para Comprar',
    description: 'Shoppa! filtra y califica a los clientes. Recibís compradores informados y decididos, reduciendo el tiempo de venta y las consultas repetitivas.',
  },
  {
    icon: CheckCircle,
    title: 'Configuración Simple y Sin Costo',
    description: 'Empezá a vender en minutos. Nuestra plataforma es intuitiva y no tiene costos de mantenimiento. Solo pagás cuando vendés.',
  },
];

const StepContent = ({ step, index }: { step: Step; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.3], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0.1, 0.3], ['20px', '0px']);

  const Icon = step.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale, y }}
      className={`relative flex items-start gap-6 sm:gap-8 z-10 my-16 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
      </div>
      <div className={`flex-grow ${isEven ? 'text-left' : 'text-right'}`}>
        <h3 className="text-xl sm:text-2xl font-bold mb-2">{step.title}</h3>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">{step.description}</p>
      </div>
    </motion.div>
  );
};

export default function InteractiveTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const pathLength = useTransform(scrollYProgress, [0.15, 0.85], [0, 1]);

  return (
    <section ref={containerRef} className="py-20 sm:py-28 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Tu viaje hacia mejores ventas
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                Transformá tu negocio con una plataforma diseñada para maximizar tus ganancias y minimizar tu esfuerzo.
            </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <svg width="100%" height="100%" viewBox="0 0 400 900" preserveAspectRatio="none" className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-auto">
            <motion.path
              d="M 200 0 V 900"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeOpacity="0.2"
            />
            <motion.path
              d="M 200 0 V 900"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              style={{ pathLength }}
            />
          </svg>
          
          <div className="relative">
            {steps.map((step, index) => (
              <StepContent key={index} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
