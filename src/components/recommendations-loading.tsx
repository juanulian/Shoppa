
'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface RecommendationsLoadingProps {
  userProfileData?: string;
}

const loadingStates = [
  { text: "Analizando tu perfil...", duration: 15000 },
  { text: "Buscando en el catálogo...", duration: 15000 },
  { text: "Generando tus recomendaciones...", duration: 15000 },
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
          {loadingStates.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-3 w-3 rounded-full bg-muted transition-all duration-500",
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
