'use client';
import { useEffect, useState } from 'react';
import {
  intelligentSearchAgent,
  IntelligentSearchAgentOutput,
} from '@/ai/flows/intelligent-search-agent';
import { ProductRecommendation } from '@/ai/schemas/product-recommendation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductAccordion from '@/components/product-accordion';
import ProductCardSkeleton from '@/components/product-card-skeleton';
import { Search, ShoppingCart, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import Image from 'next/image';

interface MainAppProps {
  userProfileData: string;
  initialSearchQuery?: string;
}

const MainApp: React.FC<MainAppProps> = ({ userProfileData, initialSearchQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [results, setResults] = useState<IntelligentSearchAgentOutput>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<ProductRecommendation[]>([]);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setResults([]);

    try {
      const res = await intelligentSearchAgent({
        searchQuery: query,
        userProfileData,
      });
      setResults(res);
    } catch (error) {
      console.error('La búsqueda falló:', error);
      toast({
        title: 'Error de Búsqueda',
        description: 'Algo salió mal con la búsqueda. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };
  
  useEffect(() => {
    if (initialSearchQuery) {
        handleSearch(initialSearchQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSearchQuery]);


  const addToCart = (product: ProductRecommendation) => {
    setCart((prevCart) => [...prevCart, product]);
    toast({
      title: 'Producto añadido',
      description: `${product.productName} ha sido añadido a tu carrito.`,
    });
  };

  const removeFromCart = (productName: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productName !== productName));
  };
  
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  }

  const handleConfirmPurchase = () => {
    if (cart.length === 0) return;
    
    toast({
        title: "Redirigiendo para la compra...",
        description: "Se abrirán nuevas pestañas para cada producto.",
    });

    cart.forEach(item => {
        if (item.productUrl) {
            window.open(item.productUrl, '_blank');
        }
    });

    setCart([]);
  }

  const mainProduct = results.length > 0 ? results[0] : null;
  const complementaryProducts = results.length > 1 ? results.slice(1) : [];


  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      <header className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight">
          ¿Qué estás buscando?
        </h2>
        <p className="text-muted-foreground mt-2">
          Nuestra IA encontrará las mejores opciones según tus necesidades.
        </p>
      </header>
      <div className="sticky top-4 z-20 w-full flex gap-2">
        <form onSubmit={onSearchSubmit} className="relative flex-grow bg-white/10 backdrop-blur-xl rounded-full border border-white/20 p-1 shadow-md">
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ej: 'Un nuevo portátil para programar'"
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
            <span className="sr-only">Buscar</span>
          </Button>
        </form>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-14 w-14 rounded-full relative bg-white/10 backdrop-blur-xl border-white/20 shadow-md">
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                  {cart.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-white/10 backdrop-blur-2xl border-l border-white/20">
            <SheetHeader>
              <SheetTitle>Carrito de Compras</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full">
              {cart.length === 0 ? (
                <div className="flex-grow flex items-center justify-center">
                  <p className="text-muted-foreground">Tu carrito está vacío.</p>
                </div>
              ) : (
                <div className="flex-grow overflow-y-auto pr-4 -mr-4 mt-4">
                    <div className="space-y-4">
                    {cart.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <Image src={item.imageUrl} alt={item.productName} width={64} height={64} className="rounded-md object-cover" data-ai-hint="product image" />
                            <div className="flex-grow">
                                <h4 className="font-semibold">{item.productName}</h4>
                                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.productName)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    </div>
                </div>
              )}
              {cart.length > 0 && (
                <SheetFooter className="mt-auto border-t pt-4">
                    <div className="w-full">
                        <div className="flex justify-between font-bold text-lg mb-4">
                            <span>Total:</span>
                            <span>${getTotalPrice()}</span>
                        </div>
                        <Button className="w-full" size="lg" onClick={handleConfirmPurchase}>Confirmar Compra</Button>
                    </div>
                </SheetFooter>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="space-y-4">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        {!isLoading && mainProduct && (
            <ProductAccordion
              product={mainProduct}
              complementaryProducts={complementaryProducts}
              onAddToCart={addToCart}
            />
        )}
      </div>
      {!isLoading && results.length === 0 && (
         <div className="text-center py-16">
            <p className="text-muted-foreground">Los resultados de la búsqueda aparecerán aquí.</p>
         </div>
      )}
    </div>
  );
};

export default MainApp;
