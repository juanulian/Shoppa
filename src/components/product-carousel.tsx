'use client';

import { useState, useRef } from 'react';
import type { ProductRecommendation } from "@/ai/schemas/product-recommendation";
import ProductDetailModal from './product-detail-modal';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight, Plus, Sparkles } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import SmartProductImage from "./smart-product-image";
import VerifiedProductLink from "./verified-product-link";
import { useDeviceType } from '@/hooks/use-device-type';

type ProductCarouselProps = {
  products: ProductRecommendation[];
  onAddMoreDetails: () => void;
};

const getTagColor = (level: 'high' | 'medium' | 'low') => {
  switch (level) {
    case 'high':
      return 'bg-green-500/20 text-green-700 border-green-500/30 dark:bg-green-500/30 dark:text-green-200 dark:border-green-500/50';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 dark:bg-yellow-500/30 dark:text-yellow-200 dark:border-yellow-500/50';
    case 'low':
      return 'bg-red-500/20 text-red-700 border-red-500/30 dark:bg-red-500/30 dark:text-red-200 dark:border-red-500/50';
  }
};


const ProductCard: React.FC<{
  product: ProductRecommendation;
  onShowDetails: () => void;
  deviceType: ReturnType<typeof useDeviceType>;
}> = ({ product, onShowDetails, deviceType }) => {
  const { isMobile, isTablet } = deviceType;

  return (
    <div className={`glassmorphism-card rounded-3xl soft-border overflow-hidden shadow-lg ${
      isMobile
        ? 'w-full max-w-xs mx-auto'
        : isTablet
        ? 'w-full max-w-sm mx-auto'
        : 'w-full max-w-md mx-auto'
    }`}>
      {/* Product Image */}
      <div className={`relative overflow-hidden ${
        isMobile
          ? 'h-48'
          : isTablet
          ? 'h-64'
          : 'h-80'
      }`}>
        <SmartProductImage
          src={product.imageUrl}
          alt={product.productName}
          productName={product.productName}
          className="object-cover w-full h-full"
          fill
        />
        {/* Match Percentage Overlay */}
        <div className={`absolute bg-primary text-primary-foreground rounded-full font-bold ${
          isMobile
            ? 'top-2 left-2 px-2 py-1 text-xs'
            : 'top-3 left-3 px-3 py-1 text-sm'
        }`}>
          {product.matchPercentage}% Match
        </div>
      </div>

      {/* Product Info */}
      <div className={`space-y-3 ${
        isMobile ? 'p-3' : 'p-4'
      }`}>
        <div>
          <h3 className={`font-headline font-bold leading-tight truncate ${
            isMobile ? 'text-base' : 'text-lg'
          }`}>
            {product.productName}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <Badge variant="secondary" className={`font-bold ${
              isMobile
                ? 'text-sm py-1 px-2'
                : 'text-lg py-1 px-3'
            }`}>
              {product.price}
            </Badge>
            <div className="flex items-center gap-1 text-yellow-500">
              <Sparkles className={`fill-current ${
                isMobile ? 'w-3 h-3' : 'w-4 h-4'
              }`} />
              <span className={`font-bold text-foreground ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                {product.qualityScore}
              </span>
            </div>
          </div>
        </div>

        {/* Match Tags Preview */}
        <div className="flex flex-wrap gap-1">
          {product.matchTags.slice(0, 3).map((matchTag, index) => (
            <Badge
              key={index}
              className={`border font-medium text-xs py-0 px-2 ${getTagColor(matchTag.level)}`}
            >
              {matchTag.tag}
            </Badge>
          ))}
          {product.matchTags.length > 3 && (
            <Badge variant="outline" className="text-xs py-0 px-2">
              +{product.matchTags.length - 3}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className={`pt-2 ${
          isMobile ? 'space-y-1' : 'space-y-2'
        }`}>
          <Button
            onClick={onShowDetails}
            variant="outline"
            className="w-full rounded-full"
            size={isMobile ? "sm" : "default"}
          >
            {isMobile ? "Detalles" : "Ver Detalles"}
          </Button>
          <VerifiedProductLink className="w-full" />
        </div>
      </div>
    </div>
  );
};

const AddMoreDetailsCard: React.FC<{
  onAddMoreDetails: () => void;
  deviceType: ReturnType<typeof useDeviceType>;
}> = ({ onAddMoreDetails, deviceType }) => {
  const { isMobile, isTablet } = deviceType;

  return (
    <div className={`glassmorphism-card rounded-3xl soft-border overflow-hidden shadow-lg border-2 border-dashed border-primary/30 ${
      isMobile
        ? 'w-full max-w-xs mx-auto'
        : isTablet
        ? 'w-full max-w-sm mx-auto'
        : 'w-full max-w-md mx-auto'
    }`}>
      <div className={`flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 ${
        isMobile
          ? 'h-48'
          : isTablet
          ? 'h-64'
          : 'h-80'
      }`}>
        <div className={`text-center ${
          isMobile ? 'space-y-2 p-4' : 'space-y-4 p-6'
        }`}>
          <div className={`mx-auto rounded-full bg-primary/10 flex items-center justify-center ${
            isMobile ? 'w-12 h-12' : 'w-16 h-16'
          }`}>
            <Plus className={`text-primary ${
              isMobile ? 'w-6 h-6' : 'w-8 h-8'
            }`} />
          </div>
          <div>
            <h3 className={`font-headline font-bold mb-2 ${
              isMobile ? 'text-base' : 'text-lg'
            }`}>
              ¿Necesitas más opciones?
            </h3>
            <p className={`text-muted-foreground leading-relaxed ${
              isMobile ? 'text-xs' : 'text-sm'
            }`}>
              {isMobile
                ? "Cuéntanos más para mejores resultados"
                : "Cuéntanos más detalles para encontrar productos aún más perfectos para ti"
              }
            </p>
          </div>
        </div>
      </div>

      <div className={isMobile ? 'p-3' : 'p-4'}>
        <Button
          onClick={onAddMoreDetails}
          className="w-full rounded-full"
          size={isMobile ? "default" : "lg"}
        >
          <Plus className={`mr-2 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
          {isMobile ? "Más detalles" : "Agregar más detalles"}
        </Button>
      </div>
    </div>
  );
};

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  onAddMoreDetails
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductRecommendation | null>(null);
  const [startX, setStartX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const deviceInfo = useDeviceType();
  const { isMobile, isTablet, isTouchDevice } = deviceInfo;

  // Include the "add more details" card as the last item
  const totalItems = products.length + 1;

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(totalItems - 1, prev + 1));
  };

  const handleShowDetails = (product: ProductRecommendation) => {
    setSelectedProduct(product);
  };

  // Touch handlers for mobile swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isTouchDevice) return;
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouchDevice || !startX) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isTouchDevice || !startX || !currentX) {
      setStartX(null);
      setCurrentX(null);
      setIsDragging(false);
      return;
    }

    const diff = startX - currentX;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped left - go to next
        handleNext();
      } else {
        // Swiped right - go to previous
        handlePrevious();
      }
    }

    setStartX(null);
    setCurrentX(null);
    setIsDragging(false);
  };

  // Mouse handlers for desktop drag (optional)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isTouchDevice) return;
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouchDevice || !startX || !isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (isTouchDevice || !startX || !currentX) {
      setStartX(null);
      setCurrentX(null);
      setIsDragging(false);
      return;
    }

    const diff = startX - currentX;
    const threshold = 100; // Larger threshold for mouse

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }

    setStartX(null);
    setCurrentX(null);
    setIsDragging(false);
  };

  const isAddMoreDetailsCard = currentIndex >= products.length;

  return (
    <div className={`w-full mx-auto ${
      isMobile ? 'px-2' : isTablet ? 'px-3 max-w-4xl' : 'px-4 max-w-6xl'
    }`}>
      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Buttons - Hide on mobile, show on tablet/desktop */}
        {!isMobile && (
          <>
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 z-10">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full w-12 h-12 glassmorphism-strong backdrop-blur-md hover:scale-105 transition-transform disabled:opacity-50"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 -right-4 z-10">
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full w-12 h-12 glassmorphism-strong backdrop-blur-md hover:scale-105 transition-transform disabled:opacity-50"
                onClick={handleNext}
                disabled={currentIndex === totalItems - 1}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </>
        )}

        {/* Carousel Items */}
        <div
          className="overflow-hidden rounded-3xl cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          ref={carouselRef}
        >
          <div
            className={`flex transition-transform duration-500 ease-out ${
              isDragging ? 'duration-0' : ''
            }`}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              // Add slight visual feedback during drag
              ...(isDragging && startX && currentX ? {
                transform: `translateX(${-currentIndex * 100 + ((currentX - startX) / (carouselRef.current?.offsetWidth || 1)) * 100}%)`
              } : {})
            }}
          >
            {/* Product Cards */}
            {products.map((product, index) => (
              <div key={index} className={`w-full flex-shrink-0 ${
                isMobile ? 'p-2' : isTablet ? 'p-3' : 'p-4'
              }`}>
                <ProductCard
                  product={product}
                  onShowDetails={() => handleShowDetails(product)}
                  deviceType={deviceInfo}
                />
              </div>
            ))}

            {/* Add More Details Card */}
            <div className={`w-full flex-shrink-0 ${
              isMobile ? 'p-2' : isTablet ? 'p-3' : 'p-4'
            }`}>
              <AddMoreDetailsCard
                onAddMoreDetails={onAddMoreDetails}
                deviceType={deviceInfo}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className={`flex justify-center space-x-2 ${
        isMobile ? 'mt-4' : 'mt-6'
      }`}>
        {Array.from({ length: totalItems }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`rounded-full transition-colors ${
              isMobile
                ? 'w-1.5 h-1.5'
                : 'w-2 h-2'
            } ${
              index === currentIndex
                ? 'bg-primary'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Current Item Info */}
      <div className={`text-center text-muted-foreground ${
        isMobile ? 'mt-2 text-xs' : 'mt-4 text-sm'
      }`}>
        {isAddMoreDetailsCard ? (
          isMobile
            ? "Más detalles para mejores resultados"
            : "Agrega más detalles para mejores recomendaciones"
        ) : (
          `Producto ${currentIndex + 1} de ${products.length}`
        )}
      </div>

      {/* Navigation Instructions */}
      <div className={`text-center text-muted-foreground ${
        isMobile ? 'mt-1 text-xs' : 'mt-2 text-xs'
      }`}>
        {isMobile && isTouchDevice
          ? "Desliza para navegar o toca los puntos"
          : isTablet && isTouchDevice
          ? "Desliza, usa las flechas o toca los puntos"
          : "Usa las flechas o haz clic en los puntos para navegar"
        }
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

export default ProductCarousel;

    