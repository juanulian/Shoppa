'use client';
import { useEffect, useState } from 'react';
import { intelligentSearchAgent } from '@/ai/flows/intelligent-search-agent';
import { ProductRecommendation } from '@/ai/schemas/product-recommendation';
import { Button } from '@/components/ui/button';
import ProductCarousel from '@/components/product-carousel';
import AddDetailsModal from '@/components/add-details-modal';
import RecommendationsLoading from '@/components/recommendations-loading';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MainAppProps {
  userProfileData: string;
  onNewSearch: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ userProfileData, onNewSearch }) => {
  const [results, setResults] = useState<ProductRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [showAddDetailsModal, setShowAddDetailsModal] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(userProfileData);
  const { toast } = useToast();

  const handleSearch = async (searchData?: string) => {
    setIsGenerating(true);
    setResults([]);

    const userData = searchData || currentUserData;

    try {
      // Generate all 3 recommendations at once (faster)
      const allRecommendations = await intelligentSearchAgent({
        userProfileData: userData,
      });

      // Show them progressively with small delays for better UX
      for (let i = 0; i < allRecommendations.length; i++) {
        await new Promise(resolve => setTimeout(resolve, i * 500)); // 0.5s delay between cards
        setResults(prev => [...prev, allRecommendations[i]]);
      }
      
      setIsGenerating(false);
    } catch (error) {
      console.error('La búsqueda falló:', error);
      toast({
        title: 'Error en la búsqueda',
        description: 'Hubo un problema al generar las recomendaciones. Por favor, intentá de nuevo.',
        variant: 'destructive',
      });
      setIsGenerating(false); // Detener el estado de carga
    }
  };

  const handleAddMoreDetails = (additionalDetails: string, selectedTags: string[]) => {
    // Combinar datos existentes con nuevos detalles
    let combinedData = currentUserData;

    if (additionalDetails.trim()) {
      combinedData += `\n\nDetalles adicionales: ${additionalDetails.trim()}`;
    }

    if (selectedTags.length > 0) {
      combinedData += `\n\nCaracterísticas importantes: ${selectedTags.join(', ')}`;
    }

    setCurrentUserData(combinedData);
    setShowAddDetailsModal(false);

    // Realizar nueva búsqueda con los datos combinados
    handleSearch(combinedData);
  };

  useEffect(() => {
    setCurrentUserData(userProfileData);
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileData]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 sm:gap-8 px-2 sm:px-4">
      <header className="flex flex-col items-start text-center md:text-left">
        <div className="w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-headline tracking-tight">
            Tus 3 opciones perfectas
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Seleccionadas específicamente para tus necesidades y presupuesto. Sin confusión, sin perdida de tiempo.
          </p>
        </div>
      </header>

      <div className="space-y-4 min-h-[400px]">
        <div className="w-full transition-all duration-500 ease-in-out">
          {results.length > 0 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-4">
              <ProductCarousel
                products={results}
                onAddMoreDetails={() => setShowAddDetailsModal(true)}
                isGenerating={isGenerating}
              />
            </div>
          ) : isGenerating ? (
            <div className="animate-in fade-in duration-500">
              <RecommendationsLoading userProfileData={currentUserData} />
            </div>
          ) : null}
        </div>
      </div>

      {!isGenerating && results.length > 0 && (
        <div className="flex justify-center items-center pt-4">
          <Button onClick={onNewSearch} variant="outline" size="lg" className="rounded-full glassmorphism-strong transition-all duration-300 hover:scale-105 text-sm sm:text-base touch-manipulation" suppressHydrationWarning>
            <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Empezar de Nuevo
          </Button>
        </div>
      )}

      {/* Add Details Modal */}
      {showAddDetailsModal && (
        <AddDetailsModal
          onClose={() => setShowAddDetailsModal(false)}
          onSubmit={handleAddMoreDetails}
          existingUserData={currentUserData}
        />
      )}
    </div>
  );
};

export default MainApp;
