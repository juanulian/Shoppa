'use client';

import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Search, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { useDeviceType } from '@/hooks/use-device-type';

interface RecommendationsLoadingProps {
  userProfileData?: string;
}

const RecommendationsLoading: React.FC<RecommendationsLoadingProps> = ({
  userProfileData
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const deviceInfo = useDeviceType();
  const { isMobile } = deviceInfo;

  const steps = [
    {
      icon: Search,
      title: "Analizando tu perfil",
      description: "Procesando tus preferencias y necesidades específicas",
      duration: 2000,
    },
    {
      icon: Bot,
      title: "Buscando en el catálogo",
      description: "Explorando miles de opciones disponibles",
      duration: 3000,
    },
    {
      icon: Sparkles,
      title: "Aplicando IA avanzada",
      description: "Calculando compatibilidad y puntuaciones de match",
      duration: 2500,
    },
    {
      icon: CheckCircle,
      title: "Preparando tus 3 opciones",
      description: "Seleccionando las mejores recomendaciones para ti",
      duration: 1500,
    }
  ];

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let stepTimer: NodeJS.Timeout;

    const startProgress = () => {
      const step = steps[currentStep];
      if (!step) return;

      const progressIncrement = 100 / (step.duration / 50);
      let currentProgress = 0;

      progressTimer = setInterval(() => {
        currentProgress += progressIncrement;
        setProgress(Math.min(currentProgress, 100));

        if (currentProgress >= 100) {
          clearInterval(progressTimer);

          if (currentStep < steps.length - 1) {
            stepTimer = setTimeout(() => {
              setCurrentStep(prev => prev + 1);
              setProgress(0);
            }, 500);
          }
        }
      }, 50);
    };

    startProgress();

    return () => {
      clearInterval(progressTimer);
      clearTimeout(stepTimer);
    };
  }, [currentStep]);

  // Resetear cuando cambia el userProfileData (nueva búsqueda)
  useEffect(() => {
    setCurrentStep(0);
    setProgress(0);
  }, [userProfileData]);

  const currentStepData = steps[currentStep] || steps[0];
  const Icon = currentStepData.icon;
  const overallProgress = ((currentStep + (progress / 100)) / steps.length) * 100;

  // Extraer algunas keywords del perfil del usuario para personalizar
  const getPersonalizedHint = () => {
    if (!userProfileData) return "Encontrando las mejores opciones para ti";

    const profile = userProfileData.toLowerCase();
    if (profile.includes('foto') || profile.includes('camara')) {
      return "Priorizando celulares con excelente cámara";
    }
    if (profile.includes('juego') || profile.includes('gaming')) {
      return "Buscando dispositivos optimizados para gaming";
    }
    if (profile.includes('trabajo') || profile.includes('profesional')) {
      return "Enfocándonos en productividad y rendimiento";
    }
    if (profile.includes('bateria') || profile.includes('duracion')) {
      return "Considerando autonomía y duración de batería";
    }
    return "Analizando tus preferencias específicas";
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <Card className="glassmorphism-strong shadow-2xl soft-border">
        <CardContent className={`text-center ${isMobile ? 'p-6' : 'p-8'}`}>
          {/* Main Icon Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative" key={`icon-container-${currentStep}`}>
              {/* Pulsing Background */}
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>

              {/* Main Icon Container */}
              <div className={`relative bg-primary/10 rounded-full flex items-center justify-center transition-all duration-500 ${
                isMobile ? 'w-16 h-16' : 'w-20 h-20'
              }`}>
                <div className="animate-in zoom-in duration-500" key={`icon-${currentStep}`}>
                  <Icon className={`text-primary ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`} />
                </div>
              </div>

              {/* Spinning Border */}
              <div className="absolute inset-0 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Step Title */}
          <h3 className={`font-headline font-bold mb-2 text-primary transition-all duration-500 ${
            isMobile ? 'text-lg' : 'text-xl'
          }`} key={`title-${currentStep}`}>
            <span className="animate-in fade-in slide-in-from-left-2 duration-500">
              {currentStepData.title}
            </span>
          </h3>

          {/* Step Description */}
          <p className={`text-muted-foreground mb-6 transition-all duration-500 ${
            isMobile ? 'text-sm' : 'text-base'
          }`} key={`desc-${currentStep}`}>
            <span className="animate-in fade-in slide-in-from-right-2 duration-500 delay-150">
              {currentStepData.description}
            </span>
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <Progress value={progress} className="h-2 mb-2" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Paso {currentStep + 1} de {steps.length}
              </span>
              <span className="text-xs text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Overall Progress Indicator */}
          <div className="mb-6">
            <div className="flex justify-center space-x-2 mb-3">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`rounded-full transition-colors duration-500 ${
                    isMobile ? 'w-2 h-2' : 'w-3 h-3'
                  } ${
                    index < currentStep
                      ? 'bg-green-500'
                      : index === currentStep
                      ? 'bg-primary'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <Progress value={overallProgress} className="h-1" />
          </div>

          {/* Personalized Hint */}
          <div className="flex items-center justify-center gap-2 text-sm text-primary">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{getPersonalizedHint()}</span>
          </div>

          {/* Fun Facts Footer */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-muted-foreground">
              💡 {currentStep === 0 && "Analizamos más de 50 características por dispositivo"}
              {currentStep === 1 && "Comparamos precios en tiempo real de múltiples tiendas"}
              {currentStep === 2 && "Nuestro algoritmo evalúa miles de combinaciones posibles"}
              {currentStep === 3 && "Solo te mostramos las 3 opciones más perfectas para ti"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationsLoading;