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
import { RefreshCw, Bot, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Logo from './icons/logo';

interface MainAppProps {
  userProfileData: string;
  onNewSearch: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ userProfileData, onNewSearch }) => {
  const [results, setResults] = useState<IntelligentSearchAgentOutput>([]);
  const [isLoading, setIsLoading] = useState(true); // <--- CAMBIO CLAVE: Inicializar en true
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
        description: 'Algo salió mal al buscar recomendaciones. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileData]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">
            Aquí están tus recomendaciones
          </h2>
          <p className="text-muted-foreground mt-2">
            Shoppa ha seleccionado los 3 mejores celulares para ti.
          </p>
        </div>
        <Button onClick={onNewSearch} variant="outline" size="lg" className="rounded-full bg-white/30 dark:bg-card/60 backdrop-blur-2xl border-white/20 shadow-md w-full sm:w-auto" suppressHydrationWarning>
            <RefreshCw className="h-5 w-5 mr-2" />
            Empezar de Nuevo
        </Button>
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
                <Button onClick={handleSearch} variant="outline" size="lg" suppressHydrationWarning>
                    <Bot className="mr-2 h-5 w-5" />
                    Generar otras opciones
                </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MainApp;
