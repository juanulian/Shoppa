
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
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
  const [questionsToAsk, setQuestionsToAsk] = useState<QuestionConfig[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<QuestionType, string[]>>({
    useCase: [],
    priority: [],
    budget: [],
  });
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const determinedQuestions: QuestionConfig[] = [];
    if (!analysis || analysis.missing.includes('useCase')) {
      determinedQuestions.push({
        type: 'useCase',
        title: '¿Para qué lo vas a usar más?',
        description: 'Elegí todos los que quieras',
        multiSelect: true,
      });
    }
    if (!analysis || analysis.missing.includes('priority')) {
      determinedQuestions.push({
        type: 'priority',
        title: '¿Qué no te puede fallar?',
        description: 'Elegí todos los que quieras',
        multiSelect: true,
      });
    }
    if (!analysis || analysis.missing.includes('budget')) {
      determinedQuestions.push({
        type: 'budget',
        title: '¿Qué presupuesto tenés en mente?',
        description: 'Elegí uno',
        multiSelect: false,
      });
    }
    setQuestionsToAsk(determinedQuestions);

    if (analysis) {
        setAnswers({
            useCase: analysis.detected.useCase || [],
            priority: analysis.detected.priority || [],
            budget: analysis.detected.budget ? [analysis.detected.budget] : [],
        });
    }

    setIsInitialized(true);
  }, [analysis]);
  
  const currentQuestion = questionsToAsk[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questionsToAsk.length - 1;
  const progressValue = questionsToAsk.length > 0 ? ((currentQuestionIndex + 1) / questionsToAsk.length) * 100 : 0;

  const handleAnswerChange = (value: string[]) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.type]: value,
    }));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
        handleFinish();
    }
  };

  const handleBack = () => {
    if(currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
    }
  }

  const handleFinish = () => {
    let profileData = '';
    if (initialQuery) {
      profileData += `Búsqueda inicial: ${initialQuery}\n\n`;
    }
    if (analysis?.detected) {
      const { brand, model, special } = analysis.detected;
      if (brand) profileData += `Marca preferida: ${brand}\n`;
      if (model) profileData += `Modelo: ${model}\n`;
      if (special) profileData += `Necesidad especial: ${special}\n`;
      if (brand || model || special) profileData += '\n';
    }
    if (answers.useCase.length > 0) {
      profileData += `Uso principal: ${answers.useCase.join(', ')}\n`;
    }
    if (answers.priority.length > 0) {
      profileData += `Prioridades: ${answers.priority.join(', ')}\n`;
    }
    if (answers.budget.length > 0) {
      profileData += `Presupuesto: ${answers.budget[0]}\n`;
    }
    if (additionalDetails.trim()) {
      profileData += `\nDetalles adicionales: ${additionalDetails.trim()}`;
    }
    onComplete(profileData);
  };

  useEffect(() => {
    if (isInitialized && questionsToAsk.length === 0) {
        handleFinish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, questionsToAsk.length]);

  if (!isInitialized || !currentQuestion) {
    return (
      <Card className="w-full max-w-2xl mx-auto glassmorphism-card rounded-3xl soft-border shadow-2xl">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </CardContent>
      </Card>
    );
  }

  const canProceed = answers[currentQuestion.type]?.length > 0;

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
          
          {isLastQuestion && (
            <div className="space-y-4 pt-4 border-t border-white/20 animate-in fade-in duration-500">
                <CardTitle className="font-headline text-xl sm:text-2xl font-light text-center">
                    ¿Algo más que querés aclarar?
                </CardTitle>
                <CardDescription className="text-center text-sm sm:text-base font-light">
                    Opcional: Agregá cualquier detalle que nos ayude a encontrar tu celular ideal
                </CardDescription>
                <Input
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="Ej: 'Necesito dual SIM' o 'Resistente al agua'"
                    className="h-12 text-base rounded-full px-6 glassmorphism"
                />
            </div>
          )}

          <div className="flex justify-center gap-4 pt-4">
            {currentQuestionIndex > 0 && (
                <Button
                    onClick={handleBack}
                    variant="outline"
                    size="lg"
                    className="rounded-full glassmorphism"
                >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Atrás
                </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              size="lg"
              className="rounded-full glassmorphism-strong px-8"
            >
              {isLastQuestion ? 'Ver mis celulares ideales' : 'Siguiente'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingNew;
