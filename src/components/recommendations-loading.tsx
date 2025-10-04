'use client';

import { useEffect, useState } from 'react';

interface RecommendationsLoadingProps {
  userProfileData?: string;
}

const RecommendationsLoading: React.FC<RecommendationsLoadingProps> = ({
  userProfileData
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    "Analizando tu perfil",
    "Buscando en el catálogo",
    "Evaluando opciones",
    "Preparando tus 3 opciones"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        if (nextStep < steps.length) {
          setCompletedSteps((completed) => [...completed, prev]);
          return nextStep;
        }
        return prev;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setCurrentStep(0);
    setCompletedSteps([]);
  }, [userProfileData]);

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4">
      <div className="glassmorphism-card rounded-3xl soft-border shadow-2xl p-10 md:p-12 max-w-md w-full text-center">
        {/* Giant S! logo with pulse */}
        <div className="mb-10">
          <h1 className="font-headline text-8xl md:text-9xl font-extrabold text-slate-900 dark:text-white animate-pulse">
            S<span className="text-primary">!</span>
          </h1>
        </div>

        {/* Loading text with fade transition */}
        <div className="mb-8 h-12">
          <p
            key={currentStep}
            className="text-xl md:text-2xl font-light text-slate-700 dark:text-slate-300 animate-in fade-in duration-700"
          >
            {steps[currentStep]}
          </p>
        </div>

        {/* Progress indicator - completa hacia adelante */}
        <div className="flex justify-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-14 rounded-full transition-all duration-700 ${
                completedSteps.includes(index)
                  ? 'bg-primary opacity-100'
                  : index === currentStep
                  ? 'bg-primary opacity-100 animate-pulse'
                  : 'bg-slate-300 dark:bg-slate-700 opacity-30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsLoading;