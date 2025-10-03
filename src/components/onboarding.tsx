
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { generateFollowUpQuestions } from '@/ai/flows/dynamic-question-generation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from '@/components/ui/progress';
import { questionCache } from '@/utils/question-cache';
import { useSearchParams } from 'next/navigation';

interface OnboardingProps {
  onComplete: (profileData: string, initialSearchQuery?: string) => void;
}

interface QA {
  question: string;
  answer: string;
}

const initialQuestion = "¿Cuál es tu uso principal del celular? (Por ejemplo: fotos familiares, trabajo, gaming, redes sociales)";
const maxQuestions = 3; 

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const searchParams = useSearchParams();
  const initialSearchQuery = useMemo(() => searchParams.get('q') || '', [searchParams]);

  const [qaPairs, setQaPairs] = useState<QA[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nextQuestions, setNextQuestions] = useState<string[]>([]);
  const [preloadedQuestions, setPreloadedQuestions] = useState<string[]>([]);
  const [isPreloading, setIsPreloading] = useState(false);
  const [processingState, setProcessingState] = useState<'idle' | 'analyzing' | 'generating' | 'finishing'>('idle');
  const [debouncedAnswer, setDebouncedAnswer] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // If there's an initial search query, use it as the answer to the first question.
    if (initialSearchQuery && qaPairs.length === 0 && currentAnswer === '') {
      setCurrentAnswer(initialSearchQuery);
    }
  }, [initialSearchQuery, qaPairs.length, currentAnswer]);


  useEffect(() => {
    if (nextQuestions.length > 0) {
      let nextQ = nextQuestions[Math.floor(Math.random() * nextQuestions.length)];

      if (preloadedQuestions.length > 0) {
        nextQ = preloadedQuestions[0];
        setPreloadedQuestions(prev => prev.slice(1));
      }

      setCurrentQuestion(nextQ);
      setNextQuestions([]);
      setProcessingState('idle');
    }
  }, [nextQuestions, preloadedQuestions]);

  const preloadNextQuestions = useCallback(async (partialAnswer: string) => {
    if (!partialAnswer.trim() || partialAnswer.length < 20 || isPreloading) return;
    if (currentAnswer.length > 0 && partialAnswer.length < currentAnswer.length + 5) return;

    setIsPreloading(true);
    try {
      const cachedQuestions = questionCache.findCachedQuestions(partialAnswer);

      if (cachedQuestions.length > 0) {
        const filteredQuestions = cachedQuestions.filter(q =>
          !q.toLowerCase().includes(currentQuestion.toLowerCase().split('?')[0].slice(0, 10))
        );

        if (filteredQuestions.length > 0) {
          setPreloadedQuestions(filteredQuestions);
          setIsPreloading(false);
          return;
        }
      }

      if (partialAnswer.length < 25) {
        setIsPreloading(false);
        return;
      }

      const tempQaPair = { question: currentQuestion, answer: partialAnswer };
      const tempQaPairs = [...qaPairs, tempQaPair];

      const res = await generateFollowUpQuestions({
        initialAnswer: tempQaPairs[0].answer,
        priorQuestionsAndAnswers: tempQaPairs
      });

      if (res.questions && res.questions.length > 0) {
        setPreloadedQuestions(res.questions);
      }
    } catch (error) {
      console.log("Preload failed (non-critical):", error);
    } finally {
      setIsPreloading(false);
    }
  }, [isPreloading, currentQuestion, qaPairs, currentAnswer]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAnswer(currentAnswer);
    }, 2000); 
    return () => clearTimeout(timer);
  }, [currentAnswer]);

  useEffect(() => {
    if (debouncedAnswer.length >= 20 && qaPairs.length < maxQuestions - 1) {
      preloadNextQuestions(debouncedAnswer);
    }
  }, [debouncedAnswer, preloadNextQuestions, qaPairs.length]);

  const handleAnswerSubmit = async (e: React.FormEvent | Event, explicitAnswer?: string) => {
    e.preventDefault();
    const answerToSubmit = explicitAnswer ?? currentAnswer;

    if (!answerToSubmit.trim() || isLoading) return;

    setIsLoading(true);
    setProcessingState('analyzing');

    const newQaPair = { question: currentQuestion, answer: answerToSubmit };
    const newQaPairs = [...qaPairs, newQaPair];

    setQaPairs(newQaPairs);
    setCurrentAnswer('');

    if (newQaPairs.length >= maxQuestions) {
      setProcessingState('finishing');
      setTimeout(() => handleFinish(newQaPairs), 500);
      return;
    }

    if (preloadedQuestions.length > 0) {
      const nextQ = preloadedQuestions[0];
      setPreloadedQuestions(prev => prev.slice(1));
      setCurrentQuestion(nextQ);
      setIsLoading(false);
      setProcessingState('idle');
      return;
    }
    
    setProcessingState('generating');

    try {
      const res = await generateFollowUpQuestions({
        initialAnswer: newQaPairs[0].answer,
        priorQuestionsAndAnswers: newQaPairs.slice(1)
      });

      if (!res.isAnswerRelevant) {
        toast({
          title: "Respuesta poco clara",
          description: "No he entendido bien tu respuesta. ¿Podrías ser un poco más específico para poder ayudarte mejor?",
          variant: "destructive",
        });
        setIsLoading(false);
        setProcessingState('idle');
        // revert the last question
        setQaPairs(qaPairs);
        setCurrentAnswer(answerToSubmit);
        return;
      }

      if (res.questions && res.questions.length > 0) {
        setNextQuestions(res.questions);
      } else {
        handleFinish(newQaPairs);
      }
    } catch (error) {
      console.error("No se pudieron generar las preguntas:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al generar la siguiente pregunta. Puedes finalizar ahora si lo deseas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleBack = () => {
    if (qaPairs.length === 0) return;
    const lastQa = qaPairs[qaPairs.length - 1];
    setQaPairs(qaPairs.slice(0, -1));
    setCurrentQuestion(lastQa.question);
    setCurrentAnswer(lastQa.answer);
  };

  const handleFinish = (finalQaPairs?: QA[]) => {
    const pairsToProcess = finalQaPairs || qaPairs;
    if (pairsToProcess.length === 0) {
      toast({
        title: "Espera un momento",
        description: "Por favor, responde al menos una pregunta para que podamos ayudarte.",
        variant: "default",
      });
      return;
    }

    const profileData = pairsToProcess.map(qa => `P: ${qa.question}\nR: ${qa.answer}`).join('\n\n');

    onComplete(profileData, initialSearchQuery);
  };
  
  const progressValue = (qaPairs.length / maxQuestions) * 100;

  const getProcessingMessage = () => {
    switch (processingState) {
      case 'analyzing': return 'Analizando tu respuesta...';
      case 'generating': return 'Generando la siguiente pregunta...';
      case 'finishing': return 'Preparando tus recomendaciones...';
      default: return '';
    }
  };

  const getStatusIndicator = () => {
    if (isPreloading) {
      return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Preparando siguiente pregunta...</span>
        </div>
      );
    }

    if (preloadedQuestions.length > 0) {
      return (
        <div className="flex items-center gap-2 text-xs text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Siguiente pregunta lista ✓</span>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto glassmorphism-strong shadow-2xl transition-all duration-500 hover-glow soft-border">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="font-headline text-xl sm:text-2xl md:text-3xl text-center">
            Encontremos tu celular ideal
        </CardTitle>
        <CardDescription className="text-center text-sm sm:text-base">
            Responde algunas preguntas para recibir una recomendación experta.
        </CardDescription>
        <div className="pt-4">
            <Progress value={progressValue} className="w-full" />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">Pregunta {qaPairs.length + 1} de {maxQuestions}</p>
              {getStatusIndicator()}
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="space-y-6">
          <div className="text-center min-h-[4rem] flex items-center justify-center p-2">
            {processingState !== 'idle' ? (
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
                <p className="text-sm text-muted-foreground animate-pulse">
                  {getProcessingMessage()}
                </p>
              </div>
            ) : (
              <p className="text-base sm:text-lg font-medium text-foreground animate-in fade-in duration-500">
                {currentQuestion}
              </p>
            )}
          </div>

          <form onSubmit={handleAnswerSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Button type="button" size="icon" variant="outline" onClick={handleBack} disabled={isLoading || qaPairs.length === 0} className="rounded-full h-10 w-10 md:h-12 md:w-12 flex-shrink-0 glassmorphism transition-all duration-300 hover:scale-110 touch-manipulation" suppressHydrationWarning>
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Atrás</span>
              </Button>
              <Input
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Ej: 'Fotos para Instagram' o 'Apps de trabajo'"
                className="h-10 md:h-12 text-sm md:text-base rounded-full px-4 md:px-6 glassmorphism focus-visible:ring-accent flex-grow transition-all duration-300"
                disabled={isLoading}
                suppressHydrationWarning
              />
              <Button type="submit" disabled={!currentAnswer.trim() || isLoading} className={`rounded-full h-10 w-10 md:h-12 md:w-12 flex-shrink-0 glassmorphism-strong transition-all duration-300 hover:scale-110 touch-manipulation ${
                preloadedQuestions.length > 0 ? 'ring-2 ring-green-400' : ''
              }`} suppressHydrationWarning>
                {isLoading ? (
                  <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
                ) : preloadedQuestions.length > 0 ? (
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                ) : (
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
                <span className="sr-only">Siguiente</span>
              </Button>
            </div>
            <div className="flex justify-center items-center gap-4 pt-4">
                <Button onClick={() => handleFinish()} size="lg" variant="ghost" className="rounded-full font-bold glassmorphism transition-all duration-300 hover:scale-105 hover:glassmorphism-strong text-sm sm:text-base touch-manipulation" disabled={isLoading || qaPairs.length === 0} suppressHydrationWarning>
                    Finalizar y Ver Celulares
                </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default Onboarding;
