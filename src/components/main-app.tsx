'use client';
import { useState } from 'react';
import {
  intelligentSearchAgent,
  IntelligentSearchAgentOutput,
} from '@/ai/flows/intelligent-search-agent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/product-card';
import ProductCardSkeleton from '@/components/product-card-skeleton';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MainAppProps {
  userProfileData: string;
}

const MainApp: React.FC<MainAppProps> = ({ userProfileData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<IntelligentSearchAgentOutput>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setResults([]);

    try {
      const res = await intelligentSearchAgent({
        searchQuery,
        userProfileData,
      });
      setResults(res);
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: 'Search Error',
        description: 'Something went wrong with the search. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      <header className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">
          What are you looking for?
        </h2>
        <p className="text-muted-foreground mt-2">
          Our AI will find the best options based on your needs.
        </p>
      </header>
      <form
        onSubmit={handleSearch}
        className="sticky top-4 z-20 w-full"
      >
        <div className="relative bg-background/50 backdrop-blur-sm rounded-full border p-1 shadow-md">
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g., 'A new laptop for programming'"
            className="w-full pr-20 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-base pl-6 rounded-full"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute top-2 right-2 h-10 w-10 rounded-full bg-accent hover:bg-accent/90 transition-all duration-300 transform active:scale-95 disabled:scale-100"
            disabled={isLoading}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        {!isLoading &&
          results.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
      </div>
      {!isLoading && results.length === 0 && (
         <div className="col-span-full text-center py-16">
            <p className="text-muted-foreground">Search results will appear here.</p>
         </div>
      )}
    </div>
  );
};

export default MainApp;
