'use client';

import { useState } from 'react';
import type { ProductRecommendation } from "@/ai/schemas/product-recommendation";
import TinderCard from './tinder-card';
import ProductDetailModal from './product-detail-modal';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type TinderStackProps = {
  products: ProductRecommendation[];
};

const TinderStack: React.FC<TinderStackProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProducts, setLikedProducts] = useState<ProductRecommendation[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductRecommendation | null>(null);

  const handleLike = () => {
    if (currentIndex >= products.length) return;
    const currentProduct = products[currentIndex];
    setLikedProducts(prev => [...prev, currentProduct]);
    setCurrentIndex(prev => prev + 1);
  };

  const handleDislike = () => {
    if (currentIndex >= products.length) return;
    setCurrentIndex(prev => prev + 1);
  };

  const handleShowDetails = () => {
    if (currentIndex >= products.length) return;
    setSelectedProduct(products[currentIndex]);
  };

  const resetStack = () => {
    setCurrentIndex(0);
    setLikedProducts([]);
  };

  if (currentIndex >= products.length) {
    return (
      <div className="w-full max-w-sm sm:max-w-md mx-auto text-center space-y-4 sm:space-y-6 px-2 sm:px-0">
        <div className="glassmorphism-card rounded-3xl p-4 sm:p-8 soft-border">
          <h3 className="text-xl sm:text-2xl font-bold mb-4">¡Terminaste de revisar!</h3>

          {likedProducts.length > 0 ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Te gustaron {likedProducts.length} producto{likedProducts.length !== 1 ? 's' : ''}:
              </p>
              <div className="space-y-2">
                {likedProducts.map((product, index) => (
                  <div key={index} className="text-sm font-medium">
                    {product.productName} - {product.matchPercentage}% match
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No seleccionaste ningún producto. ¿Quieres ver más opciones?
            </p>
          )}

          <button
            onClick={resetStack}
            className="mt-4 sm:mt-6 px-4 py-2 sm:px-6 sm:py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base touch-manipulation"
          >
            Ver más opciones
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto relative px-2 sm:px-0">
      {/* Card Stack */}
      <div className="relative h-[550px] sm:h-[650px] flex items-center justify-center">
        {products.slice(currentIndex, currentIndex + 3).map((product, index) => {
          const actualIndex = currentIndex + index;
          return (
            <TinderCard
              key={actualIndex}
              product={product}
              onLike={handleLike}
              onDislike={handleDislike}
              onShowDetails={handleShowDetails}
              isActive={index === 0}
              zIndex={10 - index}
            />
          );
        })}
      </div>

       {/* Navigation Buttons */}
       <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between items-center px-0 sm:-px-8">
            <Button
            size="icon"
            variant="ghost"
            className="rounded-full w-12 h-12 bg-white/50 dark:bg-black/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-black/70"
            onClick={handleDislike}
            >
                <ArrowLeft className="h-6 w-6" />
            </Button>
            <Button
            size="icon"
            variant="ghost"
            className="rounded-full w-12 h-12 bg-white/50 dark:bg-black/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-black/70"
            onClick={handleLike}
            >
                <ArrowRight className="h-6 w-6" />
            </Button>
        </div>


      {/* Progress Indicator */}
      <div className="mt-6 flex justify-center space-x-2">
        {products.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index < currentIndex
                ? 'bg-green-500'
                : index === currentIndex
                ? 'bg-primary'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-muted-foreground px-2">
        Desliza las cards o usa los botones para decidir
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default TinderStack;
