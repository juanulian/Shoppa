'use client';

import { useState, useEffect } from 'react';
import { generateFollowUpQuestions } from '@/ai/flows/dynamic-question-generation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowRight, ArrowLeft, SkipForward } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from '@/components/ui/progress';

interface OnboardingProps {
  onComplete: (profileData: string, initialSearchQuery?: string) => void;
}

interface QA {
  question: string;
  answer: string;
}

const initialQuestion = "¿Qué te gustaría comprar hoy?";
const totalQuestions = 4;

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [qaPairs, setQaPairs] = useState<QA[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nextQuestions, setNextQuestions] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (nextQuestions.length > 0) {
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
    setQaPairs(newQaPairs);
    setCurrentAnswer('');

    if (newQaPairs.length >= totalQuestions) {
        handleFinish(newQaPairs);
        return;
    }

    try {
      const res = await generateFollowUpQuestions({
        initialAnswer: newQaPairs[0].answer,
        priorQuestionsAndAnswers: newQaPairs
      });
      if (res.questions && res.questions.length > 0) {
        setNextQuestions(res.questions);
      } else {
        handleFinish(newQaPairs);
      }
    } catch (error) {
      console.error("No se pudieron generar las preguntas:", error);
      toast({
        title: "Error",
        description: "No se pudieron generar preguntas de seguimiento. Puedes finalizar ahora.",
        variant: "destructive",
      });
      setCurrentQuestion("Parece que hubo un problema. ¿Quieres finalizar y empezar a buscar?");
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
    const profileData = pairsToProcess.map(qa => `P: ${qa.question}\nR: ${qa.answer}`).join('\n\n');
    const firstAnswer = pairsToProcess.find(qa => qa.question === initialQuestion)?.answer;
    onComplete(profileData, firstAnswer);
  };
  
  const progressValue = (qaPairs.length / totalQuestions) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl bg-white/60 dark:bg-card/60 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl md:text-3xl text-center">
            Encontremos lo mejor para ti
        </CardTitle>
        <CardDescription className="text-center">
            Responde algunas preguntas para personalizar tu experiencia.
        </CardDescription>
        <div className="pt-4">
            <Progress value={progressValue} className="w-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center min-h-[4rem] flex items-center justify-center p-2">
            <p className="text-lg font-medium text-foreground animate-in fade-in duration-500">
              {currentQuestion}
            </p>
          </div>

          <form onSubmit={handleAnswerSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Button type="button" size="icon" variant="outline" onClick={handleBack} disabled={isLoading || qaPairs.length === 0} className="rounded-full h-12 w-12 flex-shrink-0" suppressHydrationWarning>
                <ArrowLeft />
                <span className="sr-only">Atrás</span>
              </Button>
              <Input
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Tu respuesta..."
                className="h-12 text-base rounded-full px-6 bg-background/70 focus-visible:ring-accent flex-grow"
                disabled={isLoading}
                suppressHydrationWarning
              />
              <Button type="submit" size="icon" disabled={!currentAnswer.trim() || isLoading} className="rounded-full h-12 w-12 flex-shrink-0" suppressHydrationWarning>
                {isLoading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                <span className="sr-only">Siguiente</span>
              </Button>
            </div>
            <div className="flex justify-center items-center gap-4 pt-4">
                <Button onClick={() => handleFinish()} size="lg" variant="ghost" className="rounded-full font-bold text-accent-foreground/80 hover:bg-accent/20 transition-all duration-300" disabled={isLoading || qaPairs.length === 0} suppressHydrationWarning>
                    Finalizar y Buscar
                </Button>
                <Button onClick={() => handleFinish(qaPairs)} variant="link" disabled={isLoading} className="flex items-center gap-2" suppressHydrationWarning>
                    <SkipForward className="h-4 w-4" />
                    Omitir
                </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default Onboarding;
