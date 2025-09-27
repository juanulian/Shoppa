'use client';
import { useEffect, useState } from 'react';
import {
  intelligentSearchAgent,
  IntelligentSearchAgentOutput,
} from '@/ai/flows/intelligent-search-agent';
import { ProductRecommendation } from '@/ai/schemas/product-recommendation';
import { Button } from '@/components/ui/button';
import ProductAccordion from '@/components/product-accordion';
import ProductCardSkeleton from '@/components/product-card-skeleton';
import { RefreshCw, Bot, Smartphone, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Logo from './icons/logo';

interface MainAppProps {
  userProfileData: string;
  onNewSearch: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ userProfileData, onNewSearch }) => {
  const [results, setResults] = useState<IntelligentSearchAgentOutput>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const handleSearch = async () => {
    setIsLoading(true);
    setResults([]);

    try {
      const res = await intelligentSearchAgent({
        userProfileData,
      });
      setResults(res);
    } catch (error) {
      console.error('La búsqueda falló:', error);
      toast({
        title: 'Error de Búsqueda',
        description: 'No pudimos encontrar tus opciones perfectas. Intentémoslo de nuevo en un momento.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForm = () => {
    window.open('https://forms.gle/CVdyFmBcASjXRKww7', '_blank');
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileData]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-center md:text-left">
        <div className="w-full md:w-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">
            Tus 3 opciones perfectas
          </h2>
          <p className="text-muted-foreground mt-2">
            Seleccionadas específicamente para tus necesidades y presupuesto. Sin confusión, sin perdida de tiempo.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button onClick={onNewSearch} variant="outline" size="lg" className="rounded-full glassmorphism-strong w-full sm:w-auto transition-all duration-300 hover:scale-105" suppressHydrationWarning>
                <RefreshCw className="h-5 w-5 mr-2" />
                Empezar de Nuevo
            </Button>
            <Button onClick={handleOpenForm} variant="outline" size="lg" className="rounded-full glassmorphism-strong w-full sm:w-auto transition-all duration-300 hover:scale-105" suppressHydrationWarning>
                <FileText className="h-5 w-5 mr-2" />
                Responder Encuesta
            </Button>
        </div>
      </header>

      <div className="space-y-4">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        {!isLoading && results.length > 0 && (
          <>
            {results.map((result, index) => (
              <ProductAccordion
                key={index}
                product={result}
              />
            ))}
            <div className="flex justify-center pt-4">
                <Button onClick={handleSearch} variant="outline" size="lg" className="glassmorphism-strong transition-all duration-300 hover:scale-105" suppressHydrationWarning>
                    <Bot className="mr-2 h-5 w-5" />
                    Buscar 3 opciones diferentes
                </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MainApp;
