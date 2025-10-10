
'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import Logo from '@/components/icons/logo';

interface RecommendationsLoadingProps {
  userProfileData?: string;
  isFinished?: boolean;
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
  isFinished = false,
}) => {
  const [stage, setStage] = useState(0);
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // If the process is already finished when the component mounts, jump to the end.
    if (isFinished) {
      setStage(loadingStates.length);
      return;
    }

    // Clear any existing timeouts when starting a new loading sequence.
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setStage(0);

    let cumulativeTime = 0;
    loadingStates.forEach((state, index) => {
      cumulativeTime += state.duration;
      const timeout = setTimeout(() => {
        setStage(index + 1);
      }, cumulativeTime);
      timeouts.current.push(timeout);
    });

    return () => {
      timeouts.current.forEach(clearTimeout);
    };
  }, [userProfileData, isFinished]); // Rerun effect if userProfileData changes (new search) or isFinished status changes.

  useEffect(() => {
    // If `isFinished` becomes true while the animation is running, jump to the end.
    if (isFinished) {
      timeouts.current.forEach(clearTimeout); // Stop any scheduled state changes.
      setStage(loadingStates.length);
    }
  }, [isFinished]);

  const progressPercentage = (stage / loadingStates.length) * 100;

  return (
    <div className="w-full flex items-center justify-center px-4 py-8">
      <div className="glassmorphism-card rounded-3xl soft-border shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
        <div className="mx-auto mb-8">
            <Logo />
        </div>

        {/* Loading text */}
        <div className="h-12 flex flex-col items-center justify-center mb-8">
          <p className="text-xl md:text-2xl font-light text-foreground/90 animate-pulse">
            {loadingStates[Math.min(stage, loadingStates.length - 1)]?.text || "Preparando..."}
          </p>
        </div>
        
        {/* Animated Lines Indicator */}
        <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
                className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-1000 ease-in-out"
                style={{ width: `${progressPercentage}%` }}
            />
        </div>
      </div>
    </div>
  );
};

export default RecommendationsLoading;
