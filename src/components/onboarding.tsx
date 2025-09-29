'use client';

import { useState, useEffect } from 'react';
import { generateFollowUpQuestions } from '@/ai/flows/dynamic-question-generation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from '@/components/ui/progress';

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
  const [qaPairs, setQaPairs] = useState<QA[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nextQuestions, setNextQuestions] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (nextQuestions.length > 0) {
      // Tomar una pregunta aleatoria de las generadas
      const nextQ = nextQuestions[Math.floor(Math.random() * nextQuestions.length)];
      setCurrentQuestion(nextQ);
      setNextQuestions([]);
    }
  }, [nextQuestions]);

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswer.trim() || isLoading) return;

    setIsLoading(true);
    const newQaPair = { question: currentQuestion, answer: currentAnswer };
    const newQaPairs = [...qaPairs, newQaPair];
    
    try {
      const res = await generateFollowUpQuestions({
        initialAnswer: newQaPairs[0].answer,
        priorQuestionsAndAnswers: newQaPairs
      });

      if (!res.isAnswerRelevant) {
        toast({
          title: "Respuesta poco clara",
          description: "No he entendido bien tu respuesta. ¿Podrías ser un poco más específico para poder ayudarte mejor?",
          variant: "destructive",
        });
        setIsLoading(false);
        return; 
      }

      setQaPairs(newQaPairs);
      setCurrentAnswer('');

      if (newQaPairs.length >= maxQuestions || !res.questions || res.questions.length === 0) {
        handleFinish(newQaPairs);
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
    onComplete(profileData);
  };
  
  const progressValue = (qaPairs.length / maxQuestions) * 100;

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
            <p className="text-xs text-center mt-1 text-muted-foreground">Pregunta {qaPairs.length + 1} de {maxQuestions}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="space-y-6">
          <div className="text-center min-h-[4rem] flex items-center justify-center p-2">
            <p className="text-base sm:text-lg font-medium text-foreground animate-in fade-in duration-500">
              {currentQuestion}
            </p>
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
              <Button type="submit" size="icon" disabled={!currentAnswer.trim() || isLoading} className="rounded-full h-10 w-10 md:h-12 md:w-12 flex-shrink-0 glassmorphism-strong transition-all duration-300 hover:scale-110 touch-manipulation" suppressHydrationWarning>
                {isLoading ? <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5" /> : <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />}
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
