'use client';

import { useState, useEffect } from 'react';
import { generateFollowUpQuestions } from '@/ai/flows/dynamic-question-generation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface OnboardingProps {
  onComplete: (profileData: string) => void;
}

interface QA {
  question: string;
  answer: string;
}

const initialQuestion = "¿Para qué estás comprando principalmente hoy? (ej. trabajo, pasatiempos, regalos)";

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [qaPairs, setQaPairs] = useState<QA[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswer.trim() || isLoading) return;

    setIsLoading(true);
    const newQaPair = { question: currentQuestion, answer: currentAnswer };
    const newQaPairs = [...qaPairs, newQaPair];
    setQaPairs(newQaPairs);
    setCurrentAnswer('');

    try {
      const res = await generateFollowUpQuestions({
        initialAnswer: newQaPairs[0].answer,
        priorQuestionsAndAnswers: newQaPairs
      });
      if (res.questions && res.questions.length > 0) {
        // Pick a random question from the list
        const nextQuestion = res.questions[Math.floor(Math.random() * res.questions.length)];
        setCurrentQuestion(nextQuestion);
      } else {
        // If no more questions, just finish
        handleFinish(newQaPairs);
      }
    } catch (error) {
      console.error("No se pudieron generar las preguntas:", error);
      toast({
        title: "Error",
        description: "No se pudieron generar preguntas de seguimiento. Puedes finalizar ahora.",
        variant: "destructive",
      });
      // Allow user to finish even if AI fails
      setCurrentQuestion("Parece que hubo un problema. ¿Quieres finalizar y empezar a buscar?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = (finalQaPairs?: QA[]) => {
    const pairsToProcess = finalQaPairs || qaPairs;
    const profileData = pairsToProcess.map(qa => `P: ${qa.question}\nR: ${qa.answer}`).join('\n\n');
    onComplete(profileData);
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl bg-card/80 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl md:text-3xl text-center">
            Encontremos lo mejor para ti
        </CardTitle>
        <CardDescription className="text-center">
            Responde algunas preguntas para personalizar tu experiencia. Cuando estés listo, finaliza el proceso.
        </CardDescription>
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
              <Input
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Tu respuesta..."
                className="h-12 text-base rounded-full px-6 bg-background/70 focus-visible:ring-accent flex-grow"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={!currentAnswer.trim() || isLoading} className="rounded-full h-12 w-12 flex-shrink-0">
                {isLoading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                <span className="sr-only">Siguiente</span>
              </Button>
            </div>
            <div className="flex justify-center pt-4">
              <Button onClick={() => handleFinish()} size="lg" variant="ghost" className="rounded-full font-bold text-accent-foreground/80 hover:bg-accent/20 transition-all duration-300 w-full md:w-auto" disabled={isLoading || qaPairs.length === 0}>
                Finalizar y Buscar
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default Onboarding;