
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

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], ['30px', '0px']);

  const Icon = step.icon;
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="relative grid grid-cols-[1fr_auto_1fr] items-start gap-4 sm:gap-8 my-16">
      {/* Content for even/left side */}
      <motion.div
        style={{ opacity, scale, y }}
        className={`flex-grow text-right ${!isEven ? 'md:hidden' : 'block'}`}
      >
        <h3 className="text-xl sm:text-2xl font-bold mb-2">{step.title}</h3>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">{step.description}</p>
      </motion.div>
      
      {/* Mobile view content */}
      <div className="md:hidden col-start-1 col-span-3 text-center my-4">
        <motion.div style={{ opacity, scale, y }}>
          <h3 className="text-xl font-bold mb-2">{step.title}</h3>
          <p className="text-muted-foreground text-base leading-relaxed">{step.description}</p>
        </motion.div>
      </div>

      {/* Center Icon */}
      <motion.div style={{ opacity, scale }} className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center z-10 mx-auto md:mx-0">
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
      </motion.div>

      {/* Content for odd/right side */}
      <motion.div
        style={{ opacity, scale, y }}
        className={`flex-grow text-left ${isEven ? 'md:hidden' : 'block'}`}
      >
        <h3 className="text-xl sm:text-2xl font-bold mb-2">{step.title}</h3>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">{step.description}</p>
      </motion.div>
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px bg-primary/20">
              <motion.div 
                className="h-full w-full bg-primary origin-top"
                style={{ scaleY: pathLength }}
              />
          </div>
          
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
