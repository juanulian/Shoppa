
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
    offset: ['start 0.8', 'end 0.6'], // Animate when element is in view
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], ['30px', '0px']);

  const Icon = step.icon;
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className={`relative flex items-center gap-8 ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
        {/* Content Block */}
        <motion.div
            style={{ opacity, y, scale }}
            className="w-full md:w-1/2"
        >
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
        </motion.div>

        {/* Timeline Dot */}
        <div className="w-8 h-8 rounded-full bg-primary border-4 border-slate-50 dark:border-slate-950 flex-shrink-0 z-10 hidden md:flex items-center justify-center">
             <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>

        {/* Spacer */}
        <div className="w-full md:w-1/2 hidden md:block"></div>
    </div>
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px bg-primary/20 hidden md:block">
              <motion.div 
                className="h-full w-full bg-primary origin-top"
                style={{ scaleY: pathLength }}
              />
          </div>
          
          <div className="relative flex flex-col gap-16">
            {steps.map((step, index) => (
              <StepContent key={index} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
