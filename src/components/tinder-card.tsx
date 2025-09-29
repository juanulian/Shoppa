'use client';

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Info, Star } from "lucide-react";
import type { ProductRecommendation } from "@/ai/schemas/product-recommendation";
import SmartProductImage from "./smart-product-image";

type TinderCardProps = {
  product: ProductRecommendation;
  onLike: () => void;
  onDislike: () => void;
  onShowDetails: () => void;
  isActive: boolean;
  zIndex: number;
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

const TinderCard: React.FC<TinderCardProps> = ({
  product,
  onLike,
  onDislike,
  onShowDetails,
  isActive,
  zIndex,
}) => {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isActive) return;
    e.preventDefault();
    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;

    const handlePointerMove = (e: PointerEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      setDragOffset({ x: deltaX, y: deltaY });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);

      // Check if dragged enough to trigger action
      const threshold = window.innerWidth > 768 ? 150 : 100; // Smaller threshold on mobile
      if (Math.abs(dragOffset.x) > threshold) {
        if (dragOffset.x > 0) {
          onLike();
        } else {
          onDislike();
        }
      }
      setDragOffset({ x: 0, y: 0 });
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const rotation = isDragging ? dragOffset.x * 0.1 : 0;
  const opacity = isActive ? 1 : 0.9;
  const scale = isActive ? 1 : 0.95;

  return (
    <div
      className={`absolute inset-0 cursor-grab transition-all duration-300 ${
        isDragging ? 'cursor-grabbing' : ''
      }`}
      style={{
        transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg) scale(${scale})`,
        zIndex,
        opacity,
      }}
      onPointerDown={handlePointerDown}
    >
      <div className="w-full h-full bg-white/40 dark:bg-slate-900/40 rounded-3xl soft-border overflow-hidden shadow-2xl glassmorphism-card">
        {/* Product Image */}
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <SmartProductImage
            src={product.imageUrl}
            alt={product.productName}
            productName={product.productName}
            className="object-cover w-full h-full"
            fill
          />

          {/* Match Percentage Overlay */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-primary text-primary-foreground px-2 py-1 sm:px-3 sm:py-1 rounded-full font-bold text-sm sm:text-lg shadow-lg">
            {product.matchPercentage}% Match
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
          <div className="space-y-3">
             <div className="flex flex-wrap gap-1 sm:gap-2">
                {product.matchTags.map((matchTag, index) => (
                <Badge
                    key={index}
                    className={`border font-medium ${getTagColor(matchTag.level)}`}
                >
                    {matchTag.tag}
                </Badge>
                ))}
            </div>
            <h3 className="font-headline font-bold text-lg sm:text-xl leading-tight">{product.productName}</h3>
            <div className="flex items-center justify-between mb-3">
              <Badge variant="secondary" className="text-sm sm:text-lg font-bold py-1 px-2 sm:px-4">
                {product.price}
              </Badge>
              <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Calidad: {product.qualityScore}/100
                  </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 sm:gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full w-auto h-12 sm:h-14 px-6 border-2 border-red-500/30 hover:border-red-500 hover:bg-red-500/10 touch-manipulation flex-grow justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onDislike();
              }}
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 mr-2" />
              Descartar
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full w-auto h-12 sm:h-14 px-6 touch-manipulation flex-grow justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onShowDetails();
              }}
            >
              <Info className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
              Detalles
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TinderCard;
