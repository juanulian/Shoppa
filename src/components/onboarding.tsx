'use client';

import { useState } from 'react';
import { generateFollowUpQuestions } from '@/ai/flows/dynamic-question-generation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface OnboardingProps {
  onComplete: (profileData: string) => void;
}

interface QA {
  question: string;
  answer: string;
}

const initialQuestions = ["¿Para qué estás comprando principalmente hoy? (ej. trabajo, pasatiempos, regalos)"];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<string[]>(initialQuestions);
  const [qaPairs, setQaPairs] = useState<QA[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const { toast } = useToast();

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswer.trim() || isLoading) return;

    const newQaPairs = [...qaPairs, { question: questions[currentQuestionIndex], answer: currentAnswer }];
    setQaPairs(newQaPairs);
    setCurrentAnswer('');

    const nextQuestionIndex = currentQuestionIndex + 1;

    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
        if (questions.length === initialQuestions.length) {
            setIsLoading(true);
            try {
                const res = await generateFollowUpQuestions({
                    initialAnswer: newQaPairs[0].answer,
                    priorQuestionsAndAnswers: newQaPairs
                });
                if (res.questions && res.questions.length > 0) {
                    setQuestions([...questions, ...res.questions]);
                    setCurrentQuestionIndex(nextQuestionIndex);
                } else {
                    setIsFinished(true);
                }
            } catch (error) {
                console.error("No se pudieron generar las preguntas:", error);
                toast({
                    title: "Error",
                    description: "No se pudieron generar preguntas de seguimiento. Puedes continuar sin ellas.",
                    variant: "destructive",
                });
                setIsFinished(true);
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsFinished(true);
        }
    }
  };

  const handleFinish = () => {
    const profileData = qaPairs.map(qa => `P: ${qa.question}\nR: ${qa.answer}`).join('\n\n');
    onComplete(profileData);
  };
  
  const progressValue = (currentQuestionIndex / questions.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl bg-card/80 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl md:text-3xl text-center">
            Encontremos lo mejor para ti
        </CardTitle>
        <CardDescription className="text-center">
            Responde algunas preguntas para personalizar tu experiencia.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
            <Progress value={isFinished ? 100 : progressValue} className="w-full h-2" />
            
            <div className="text-center h-16 flex items-center justify-center">
                <p className="text-lg font-medium text-foreground">
                    {questions[currentQuestionIndex]}
                </p>
            </div>

            <form onSubmit={handleAnswerSubmit} className="space-y-4">
                <Input
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Tu respuesta..."
                    className="h-12 text-base rounded-full px-6 bg-background/70 focus-visible:ring-accent"
                    disabled={isFinished || isLoading}
                />
                <div className="flex justify-end">
                    {isFinished ? (
                         <Button onClick={handleFinish} size="lg" className="rounded-full font-bold bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 w-full md:w-auto">
                            ¡Vamos de Compras!
                        </Button>
                    ) : (
                        <Button type="submit" size="lg" disabled={!currentAnswer.trim() || isLoading} className="rounded-full font-bold shadow-[4px_4px_8px_#d1d1d1,-4px_-4px_8px_#ffffff] dark:shadow-[4px_4px_8px_#181a1e,-4px_-4px_8px_#222428] active:shadow-[inset_4px_4px_8px_#d1d1d1,inset_-4px_-4px_8px_#ffffff] dark:active:shadow-[inset_4px_4px_8px_#181a1e,inset_-4px_-4px_8px_#222428] transition-shadow duration-150 ease-in-out">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Siguiente'}
                        </Button>
                    )}
                </div>
            </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default Onboarding;
