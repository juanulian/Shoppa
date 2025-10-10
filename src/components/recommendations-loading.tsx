'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface RecommendationsLoadingProps {
  userProfileData?: string;
  isFinished?: boolean;
}

const loadingStates = [
  { text: "Analizando tus respuestas...", duration: 5000 },
  { text: "Identificando prioridades...", duration: 5000 },
  { text: "Filtrando el catálogo de productos...", duration: 8000 },
  { text: "Comparando las mejores opciones...", duration: 8000 },
  { text: "Creando la primera recomendación...", duration: 7000 },
  { text: "Buscando la mejor alternativa...", duration: 6000 },
  { text: "Añadiendo la opción final...", duration: 6000 },
  { text: "¡Listas! Presentando tus opciones...", duration: 1000 },
];

const RecommendationsLoading: React.FC<RecommendationsLoadingProps> = ({
  userProfileData,
  isFinished = false,
}) => {
  const [stage, setStage] = useState(0);
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (isFinished) {
      // Clear any pending timeouts and jump to the final "Presenting" stage
      timeouts.current.forEach(clearTimeout);
      setStage(loadingStates.length - 1);
      return;
    }

    // Reset and start the animation sequence
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setStage(0);

    let cumulativeTime = 0;
    // We only schedule up to the second to last state. The final one is triggered by `isFinished`.
    loadingStates.slice(0, -1).forEach((state, index) => {
      cumulativeTime += state.duration;
      const timeout = setTimeout(() => {
        setStage(index + 1);
      }, cumulativeTime);
      timeouts.current.push(timeout);
    });

    return () => {
      timeouts.current.forEach(clearTimeout);
    };
  }, [userProfileData, isFinished]);


  return (
    <div className="w-full flex items-center justify-center px-4 py-8">
      <div className="glassmorphism-card rounded-3xl soft-border shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
        <div className="mx-auto mb-8">
          <h1 className="text-7xl md:text-8xl font-extrabold tracking-tight">
            <span className="text-foreground">S</span>
            <span className="text-primary">!</span>
          </h1>
        </div>

        <div className="h-12 flex flex-col items-center justify-center mb-8">
          <p className="text-xl md:text-2xl font-light text-foreground/90 animate-pulse">
            {loadingStates[stage]?.text || "Preparando..."}
          </p>
        </div>
        
        <div className="flex w-full gap-2 h-2">
            {Array(7).fill(0).map((_, i) => (
                <div key={i} className="flex-1 rounded-full bg-muted overflow-hidden">
                    <div className={cn(
                        'h-full rounded-full transition-all duration-500',
                        stage > i ? 'bg-primary' : 'bg-transparent'
                    )} />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsLoading;
