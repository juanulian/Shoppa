
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

const initialQuestion = "¿Cuál es tu uso principal del celular?\nTips: fotos familiares, trabajo, gaming, redes sociales";
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
    // If there's an initial search query, automatically generate first question based on it
    if (initialSearchQuery && qaPairs.length === 0 && currentAnswer === '' && !isLoading) {
      const generateInitialQuestion = async () => {
        setIsLoading(true);
        setProcessingState('generating');

        try {
          const res = await generateFollowUpQuestions({
            initialAnswer: initialSearchQuery,
            priorQuestionsAndAnswers: []
          });

          if (res.questions && res.questions.length > 0) {
            // Set the first generated question and store the search as first QA
            setCurrentQuestion(res.questions[0]);
            setQaPairs([{ question: "Búsqueda inicial", answer: initialSearchQuery }]);
          } else {
            // Fallback: use default question and pre-fill answer
            setCurrentAnswer(initialSearchQuery);
          }
        } catch (error) {
          console.error("Error generating initial question:", error);
          // Fallback: use default question and pre-fill answer
          setCurrentAnswer(initialSearchQuery);
        } finally {
          setIsLoading(false);
          setProcessingState('idle');
        }
      };

      generateInitialQuestion();
    }
  }, [initialSearchQuery, qaPairs.length, currentAnswer, isLoading]);


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

  const parseQuestion = (question: string) => {
    // Try to split by newline first
    const newlineSplit = question.split(/\n(?=Tips?:|Ejemplos?:)/i);
    if (newlineSplit.length > 1) {
      return {
        main: newlineSplit[0].trim(),
        tips: newlineSplit.slice(1).join('\n').trim()
      };
    }

    // If no newline, try to find "Tips:" or "Ejemplos:" anywhere
    const match = question.match(/^(.+?)(Tips?:|Ejemplos?:)(.+)$/is);
    if (match) {
      return {
        main: match[1].trim(),
        tips: `${match[2]} ${match[3]}`.trim()
      };
    }

    return { main: question, tips: null };
  };

  return (
    <Card className="w-full max-w-2xl mx-auto glassmorphism-card rounded-3xl soft-border shadow-2xl transition-all duration-500">
      <CardHeader className="p-6 md:p-8">
        <CardTitle className="font-headline text-2xl sm:text-3xl md:text-4xl font-light text-center">
            Encontremos tu celular ideal
        </CardTitle>
        <CardDescription className="text-center text-base sm:text-lg font-light mt-4">
            Solo 3 preguntas simples.
        </CardDescription>
        <div className="pt-6">
            <Progress value={progressValue} className="w-full h-2" />
            <div className="flex justify-between items-center mt-3">
              <p className="text-sm text-muted-foreground font-light">{qaPairs.length + 1} de {maxQuestions}</p>
              {getStatusIndicator()}
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <div className="space-y-8">
          <div className="text-center min-h-[6rem] flex flex-col items-center justify-center space-y-4">
            {processingState !== 'idle' ? (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
                <p className="text-base text-muted-foreground font-light animate-pulse">
                  {getProcessingMessage()}
                </p>
              </div>
            ) : (
              <>
                <p className="text-xl sm:text-2xl font-light text-foreground animate-in fade-in duration-500">
                  {parseQuestion(currentQuestion).main}
                </p>
                {parseQuestion(currentQuestion).tips && (
                  <p className="text-sm sm:text-base text-muted-foreground font-light animate-in fade-in duration-500 delay-100">
                    {parseQuestion(currentQuestion).tips}
                  </p>
                )}
              </>
            )}
          </div>

          <form onSubmit={handleAnswerSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <div className="flex gap-2 w-full">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading || qaPairs.length === 0}
                  className="rounded-full h-12 w-12 flex-shrink-0 glassmorphism transition-all duration-300 hover:scale-110 touch-manipulation"
                  suppressHydrationWarning
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">Atrás</span>
                </Button>
                <Input
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Ej: 'Fotos para Instagram'"
                  className="h-12 text-base rounded-full px-4 sm:px-6 glassmorphism focus-visible:ring-accent flex-grow transition-all duration-300 w-full"
                  disabled={isLoading}
                  suppressHydrationWarning
                />
                <Button
                  type="submit"
                  disabled={!currentAnswer.trim() || isLoading}
                  className={`rounded-full h-12 w-12 flex-shrink-0 glassmorphism-strong transition-all duration-300 hover:scale-110 touch-manipulation ${
                    preloadedQuestions.length > 0 ? 'ring-2 ring-green-400' : ''
                  }`}
                  suppressHydrationWarning
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : preloadedQuestions.length > 0 ? (
                    <ArrowRight className="h-5 w-5 text-green-600" />
                  ) : (
                    <ArrowRight className="h-5 w-5" />
                  )}
                  <span className="sr-only">Siguiente</span>
                </Button>
              </div>
            </div>
            <div className="flex justify-center items-center gap-4 pt-2 sm:pt-4">
                <Button
                  onClick={() => handleFinish()}
                  size="lg"
                  variant="ghost"
                  className="rounded-full font-bold glassmorphism transition-all duration-300 hover:scale-105 hover:glassmorphism-strong text-base w-full sm:w-auto touch-manipulation"
                  disabled={isLoading || qaPairs.length === 0}
                  suppressHydrationWarning
                >
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
