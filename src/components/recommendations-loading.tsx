
'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface RecommendationsLoadingProps {
  userProfileData?: string;
}

const loadingStates = [
  { text: "Analizando tus respuestas...", duration: 5000 },
  { text: "Identificando prioridades...", duration: 5000 },
  { text: "Filtrando el catálogo de productos...", duration: 8000 },
  { text: "Comparando las mejores opciones...", duration: 8000 },
  { text: "Generando la primera recomendación...", duration: 7000 },
  { text: "Creando la segunda alternativa...", duration: 6000 },
  { text: "Finalizando la última opción...", duration: 6000 },
];

const RecommendationsLoading: React.FC<RecommendationsLoadingProps> = ({
  userProfileData,
}) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Reset stage when user data changes (new search)
    setStage(0);

    const timeouts: NodeJS.Timeout[] = [];

    const scheduleNextStage = (currentStage: number) => {
      if (currentStage >= loadingStates.length - 1) return;

      const timeout = setTimeout(() => {
        setStage(prev => prev + 1);
        scheduleNextStage(currentStage + 1);
      }, loadingStates[currentStage].duration);
      timeouts.push(timeout);
    };

    scheduleNextStage(0);

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [userProfileData]);

  return (
    <div className="w-full flex items-center justify-center px-4 py-8">
      <div className="glassmorphism-card rounded-3xl soft-border shadow-2xl p-10 md:p-12 max-w-md w-full text-center">
        
        {/* Animated Dots Indicator */}
        <div className="flex justify-center items-center gap-4 mb-10">
          {Array.from({ length: loadingStates.length }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 w-2 rounded-full bg-muted transition-all duration-500",
                stage >= index ? "bg-primary scale-110" : ""
              )}
            />
          ))}
        </div>

        {/* Loading text */}
        <div className="h-12 flex flex-col items-center justify-center">
          <p className="text-xl md:text-2xl font-light text-slate-700 dark:text-slate-300">
            {loadingStates[stage]?.text || "Un momento..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsLoading;
