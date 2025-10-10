'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Loader2, ArrowRight } from 'lucide-react';
import { ButtonSelect, useCaseOptions, priorityOptions, budgetOptions } from '@/components/onboarding-button-select';
import type { QueryAnalysisOutput } from '@/ai/flows/query-analysis';

interface OnboardingNewProps {
  onComplete: (profileData: string) => void;
  analysis?: QueryAnalysisOutput;
  initialQuery?: string;
}

type QuestionType = 'useCase' | 'priority' | 'budget';

interface QuestionConfig {
  type: QuestionType;
  title: string;
  description: string;
  multiSelect: boolean;
}

const OnboardingNew: React.FC<OnboardingNewProps> = ({ onComplete, analysis, initialQuery }) => {
  // Determine which questions to ask based on analysis
  const questionsToAsk: QuestionConfig[] = [];

  if (!analysis || analysis.missing.includes('useCase')) {
    questionsToAsk.push({
      type: 'useCase',
      title: '¿Para qué lo vas a usar más?',
      description: 'Podés elegir más de uno',
      multiSelect: true,
    });
  }

  if (!analysis || analysis.missing.includes('priority')) {
    questionsToAsk.push({
      type: 'priority',
      title: '¿Qué no te puede fallar?',
      description: 'Elegí tus prioridades',
      multiSelect: true,
    });
  }

  if (!analysis || analysis.missing.includes('budget')) {
    questionsToAsk.push({
      type: 'budget',
      title: '¿Qué presupuesto tenés en mente?',
      description: 'Elegí uno',
      multiSelect: false,
    });
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<QuestionType, string[]>>({
    useCase: analysis?.detected.useCase || [],
    priority: analysis?.detected.priority || [],
    budget: analysis?.detected.budget ? [analysis.detected.budget] : [],
  });
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [showAdditionalInput, setShowAdditionalInput] = useState(false);

  const currentQuestion = questionsToAsk[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questionsToAsk.length - 1;
  const progressValue = ((currentQuestionIndex + 1) / (questionsToAsk.length + 1)) * 100;

  const handleAnswerChange = (value: string[]) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.type]: value,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowAdditionalInput(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleFinish = () => {
    // Build profile data
    let profileData = '';

    // Include initial query if exists
    if (initialQuery) {
      profileData += `Búsqueda inicial: ${initialQuery}\n\n`;
    }

    // Include detected info from analysis
    if (analysis?.detected) {
      const { brand, model, special } = analysis.detected;
      if (brand) profileData += `Marca preferida: ${brand}\n`;
      if (model) profileData += `Modelo: ${model}\n`;
      if (special) profileData += `Necesidad especial: ${special}\n`;
      if (brand || model || special) profileData += '\n';
    }

    // Include answers
    if (answers.useCase.length > 0) {
      profileData += `Uso principal: ${answers.useCase.join(', ')}\n`;
    }
    if (answers.priority.length > 0) {
      profileData += `Prioridades: ${answers.priority.join(', ')}\n`;
    }
    if (answers.budget.length > 0) {
      profileData += `Presupuesto: ${answers.budget[0]}\n`;
    }

    // Include additional details
    if (additionalDetails.trim()) {
      profileData += `\nDetalles adicionales: ${additionalDetails.trim()}`;
    }

    onComplete(profileData);
  };

  const canProceed = answers[currentQuestion?.type]?.length > 0;

  // If no questions to ask, go directly to additional details
  useEffect(() => {
    if (questionsToAsk.length === 0) {
      setShowAdditionalInput(true);
    }
  }, [questionsToAsk.length]);

  if (showAdditionalInput) {
    return (
      <Card className="w-full max-w-2xl mx-auto glassmorphism-card rounded-3xl soft-border shadow-2xl transition-all duration-500">
        <CardHeader className="p-6 md:p-8">
          <CardTitle className="font-headline text-2xl sm:text-3xl md:text-4xl font-light text-center">
            ¿Algo más que querés aclarar?
          </CardTitle>
          <CardDescription className="text-center text-base sm:text-lg font-light mt-4">
            Opcional: Agregá cualquier detalle adicional que nos ayude a encontrar tu celular ideal
          </CardDescription>
          <div className="pt-6">
            <Progress value={100} className="w-full h-2" />
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            <Input
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Ej: 'Necesito dual SIM' o 'Resistente al agua'"
              className="h-12 text-base rounded-full px-6 glassmorphism"
            />

            <div className="flex justify-center gap-4">
              {questionsToAsk.length > 0 && (
                <Button
                  onClick={() => {
                    setShowAdditionalInput(false);
                    setCurrentQuestionIndex(questionsToAsk.length - 1);
                  }}
                  variant="outline"
                  size="lg"
                  className="rounded-full glassmorphism"
                >
                  Atrás
                </Button>
              )}
              <Button
                onClick={handleFinish}
                size="lg"
                className="rounded-full glassmorphism-strong px-12"
              >
                Ver mis celulares ideales
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
    // Should not happen but handle gracefully
    return (
      <Card className="w-full max-w-2xl mx-auto glassmorphism-card rounded-3xl soft-border shadow-2xl">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto glassmorphism-card rounded-3xl soft-border shadow-2xl transition-all duration-500">
      <CardHeader className="p-6 md:p-8">
        <CardTitle className="font-headline text-2xl sm:text-3xl md:text-4xl font-light text-center">
          {currentQuestion.title}
        </CardTitle>
        <CardDescription className="text-center text-base sm:text-lg font-light mt-4">
          {currentQuestion.description}
        </CardDescription>
        <div className="pt-6">
          <Progress value={progressValue} className="w-full h-2" />
          <div className="flex justify-between items-center mt-3">
            <p className="text-sm text-muted-foreground font-light">
              {currentQuestionIndex + 1} de {questionsToAsk.length}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <div className="space-y-6">
          <ButtonSelect
            options={
              currentQuestion.type === 'useCase'
                ? useCaseOptions
                : currentQuestion.type === 'priority'
                ? priorityOptions
                : budgetOptions
            }
            value={answers[currentQuestion.type]}
            onChange={handleAnswerChange}
            multiSelect={currentQuestion.multiSelect}
          />

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              size="lg"
              className="rounded-full glassmorphism-strong px-12 transition-all duration-300 hover:scale-105"
            >
              {isLastQuestion ? 'Continuar' : 'Siguiente'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingNew;
