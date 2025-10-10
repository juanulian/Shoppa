'use client';

import { useState, useRef, useEffect } from 'react';
import type { ProductRecommendation } from "@/ai/schemas/product-recommendation";
import ProductDetailModal from './product-detail-modal';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight, Plus, Heart, Camera, Battery, Zap, DollarSign, HardDrive, Monitor, Gamepad2, Briefcase, Shield, Wifi, Smartphone, LucideIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import SmartProductImage from "./smart-product-image";
import VerifiedProductLink from "./verified-product-link";
import { useDeviceType } from '@/hooks/use-device-type';
import SwipeInstructionOverlay from './swipe-instruction-overlay';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  camera: Camera,
  battery: Battery,
  zap: Zap,
  'dollar-sign': DollarSign,
  'hard-drive': HardDrive,
  monitor: Monitor,
  gamepad: Gamepad2,
  briefcase: Briefcase,
  shield: Shield,
  wifi: Wifi,
  smartphone: Smartphone,
};

type ProductCarouselProps = {
  products: ProductRecommendation[];
  onAddMoreDetails: () => void;
  isGenerating?: boolean;
};

const getTagColor = (level: 'high' | 'medium' | 'low') => {
  switch (level) {
    case 'high':
      return 'bg-green-500/20 text-green-700 border-green-500/30 dark:bg-green-500/30 dark:text-green-200 dark:border-green-500/50 hover:bg-green-700 hover:text-white hover:border-green-700 dark:hover:bg-green-700 dark:hover:text-white dark:hover:border-green-700 transition-colors cursor-pointer';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 dark:bg-yellow-500/30 dark:text-yellow-200 dark:border-yellow-500/50 hover:bg-yellow-600 hover:text-white hover:border-yellow-600 dark:hover:bg-yellow-600 dark:hover:text-white dark:hover:border-yellow-600 transition-colors cursor-pointer';
    case 'low':
      return 'bg-red-500/20 text-red-700 border-red-500/30 dark:bg-red-500/30 dark:text-red-200 dark:border-red-500/50 hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600 transition-colors cursor-pointer';
  }
};

const SkeletonProductCard: React.FC<{
  deviceType: ReturnType<typeof useDeviceType>;
}> = ({ deviceType }) => {
  const { isMobile, isTablet } = deviceType;

  return (
    <div className={`glassmorphism-card rounded-3xl soft-border overflow-hidden shadow-lg relative ${
      isMobile
        ? 'w-full max-w-xs mx-auto'
        : isTablet
        ? 'w-full max-w-sm mx-auto'
        : 'w-full max-w-md mx-auto'
    }`}>
      {/* Loading overlay with spinner */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-[1px] z-10 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-primary">Analizando opciones...</p>
        </div>
      </div>

      <div className="relative">
        <div className="w-full h-64 bg-muted-foreground/10 animate-pulse" />
        <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-muted-foreground/20 animate-pulse w-24 h-8" />
      </div>

      <div className="p-6 space-y-4">
        <div className="h-8 bg-muted-foreground/10 animate-pulse rounded w-3/4" />
        <div className="h-6 bg-muted-foreground/10 animate-pulse rounded w-1/3" />

        <div className="flex gap-2 flex-wrap">
          <div className="h-6 bg-muted-foreground/10 animate-pulse rounded w-20" />
          <div className="h-6 bg-muted-foreground/10 animate-pulse rounded w-24" />
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-muted-foreground/10 animate-pulse rounded w-full" />
          <div className="h-4 bg-muted-foreground/10 animate-pulse rounded w-5/6" />
        </div>

        <div className="flex gap-2 pt-4">
          <div className="h-12 bg-muted-foreground/10 animate-pulse rounded-full flex-1" />
          <div className="h-12 bg-muted-foreground/10 animate-pulse rounded-full flex-1" />
        </div>
      </div>
    </div>
  );
};

const ProductCard: React.FC<{
  product: ProductRecommendation;
  onShowDetails: () => void;
  deviceType: ReturnType<typeof useDeviceType>;
  showInstructions?: boolean;
  onDismissInstructions?: () => void;
}> = ({ product, onShowDetails, deviceType, showInstructions, onDismissInstructions }) => {
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
        {showInstructions && onDismissInstructions && (
          <SwipeInstructionOverlay onDismiss={onDismissInstructions} />
        )}
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
            <Badge variant="outline" className={`flex items-center gap-1 ${
              isMobile ? 'text-xs px-1 py-0' : 'text-xs px-2 py-0'
            } border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950`}>
              <Heart className={`fill-red-500 text-red-500 ${
                isMobile ? 'w-2 h-2' : 'w-3 h-3'
              }`} />
              <span className="font-bold text-red-700 dark:text-red-300">
                {product.qualityScore}/100
              </span>
            </Badge>
          </div>
        </div>

        {/* Match Tags Preview */}
        <div className="flex flex-wrap gap-1">
          {product.matchTags.slice(0, 3).map((matchTag, index) => {
            const Icon = iconMap[matchTag.icon] || Smartphone;
            return (
              <Badge
                key={index}
                className={cn('border font-medium text-xs py-0.5 px-2 flex items-center gap-1.5', getTagColor(matchTag.level))}
              >
                <Icon className="w-3 h-3" />
                {matchTag.tag}
              </Badge>
            );
          })}
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
          <VerifiedProductLink
            className="w-full"
            productId={product.productName} // Using name as ID for now
            productName={product.productName}
            productPrice={product.price}
            productImage={product.imageUrl}
          />
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
  onAddMoreDetails,
  isGenerating = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<ProductRecommendation | null>(null);
  const [startX, setStartX] = useState<number | null>(null);
  const [currentX, setCurrentX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const deviceInfo = useDeviceType();
  const { isMobile, isTablet, isTouchDevice } = deviceInfo;
  
  const MAX_PRODUCTS = 3;
  const productsToShow = products.slice(0, MAX_PRODUCTS);
  const skeletonsNeeded = isGenerating ? Math.max(0, MAX_PRODUCTS - productsToShow.length) : 0;
  const hasAddMoreCard = !isGenerating && productsToShow.length > 0;
  const totalItems = productsToShow.length + skeletonsNeeded + (hasAddMoreCard ? 1 : 0);

  useEffect(() => {
    try {
      const hasSeenInstructions = localStorage.getItem('shoppa-swipe-instructions-seen');
      if (!hasSeenInstructions) {
        setShowInstructions(true);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  }, []);

  const dismissInstructions = () => {
    if (showInstructions) {
      setShowInstructions(false);
      try {
        localStorage.setItem('shoppa-swipe-instructions-seen', 'true');
      } catch (error) {
        console.error("Could not access localStorage:", error);
      }
    }
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
    dismissInstructions();
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(totalItems - 1, prev + 1));
    dismissInstructions();
  };

  const handleShowDetails = (product: ProductRecommendation) => {
    setSelectedProduct(product);
  };

  // Touch handlers for mobile swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isTouchDevice) return;
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
    dismissInstructions();
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
    dismissInstructions();
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

  const isAddMoreDetailsCard = hasAddMoreCard && currentIndex >= productsToShow.length + skeletonsNeeded;
  const numProductsAvailable = productsToShow.length + skeletonsNeeded;

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
              isDragging ? '!duration-0' : ''
            }`}
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% + ${isDragging && startX && currentX ? currentX - startX : 0}px))`,
            }}
          >
            {/* Product Cards */}
            {productsToShow.map((product, index) => (
              <div key={`product-${index}`} className={`w-full flex-shrink-0 ${
                isMobile ? 'p-2' : isTablet ? 'p-3' : 'p-4'
              }`}>
                <ProductCard
                  product={product}
                  onShowDetails={() => handleShowDetails(product)}
                  deviceType={deviceInfo}
                  showInstructions={index === 0 && showInstructions}
                  onDismissInstructions={dismissInstructions}
                />
              </div>
            ))}

            {/* Skeleton Cards for loading products */}
            {isGenerating && Array.from({ length: skeletonsNeeded }).map((_, index) => (
              <div key={`skeleton-${index}`} className={`w-full flex-shrink-0 ${
                isMobile ? 'p-2' : isTablet ? 'p-3' : 'p-4'
              }`}>
                <SkeletonProductCard deviceType={deviceInfo} />
              </div>
            ))}

            {/* Add More Details Card (only when not generating) */}
            {hasAddMoreCard && (
              <div className={`w-full flex-shrink-0 ${
                isMobile ? 'p-2' : isTablet ? 'p-3' : 'p-4'
              }`}>
                <AddMoreDetailsCard
                  onAddMoreDetails={onAddMoreDetails}
                  deviceType={deviceInfo}
                />
              </div>
            )}
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
          `Producto ${currentIndex + 1} de ${numProductsAvailable}`
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
