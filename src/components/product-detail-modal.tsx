'use client';

import { X, CheckCircle, HelpCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProductRecommendation } from "@/ai/schemas/product-recommendation";
import SmartProductImage from "./smart-product-image";
import VerifiedProductLink from "./verified-product-link";

const KEYWORDS = ['cámara', 'batería', 'rendimiento', 'pantalla', 'gaming', 'fotos', 'trabajo', 'precio', 'calidad', 'diseño', 'procesador', 'memoria', 'almacenamiento', 'zoom', 'noche', 'video', 'autonomía'];

const HighlightedText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  const regex = new RegExp(`\\b(${KEYWORDS.join('|')})\\b`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        KEYWORDS.some(keyword => new RegExp(`^${keyword}$`, 'i').test(part)) ? (
          <span key={i} className="font-bold text-primary dark:text-primary-foreground/90">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

type ProductDetailModalProps = {
  product: ProductRecommendation;
  onClose: () => void;
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

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto modal-scroll glassmorphism-strong rounded-t-3xl sm:rounded-3xl soft-border">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 rounded-full glassmorphism w-8 h-8 sm:w-10 sm:h-10 touch-manipulation"
          onClick={onClose}
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        {/* Product Image */}
        <div className="relative h-60 sm:h-80 overflow-hidden rounded-t-3xl">
          <SmartProductImage
            src={product.imageUrl}
            alt={product.productName}
            productName={product.productName}
            className="object-cover w-full h-full"
            fill
          />

          {/* Match Percentage Overlay */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-primary text-primary-foreground px-3 py-1 sm:px-4 sm:py-2 rounded-full font-bold text-lg sm:text-xl shadow-lg">
            {product.matchPercentage}% Match
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Product Title and Price */}
          <div>
            <h2 className="font-headline font-bold text-xl sm:text-2xl mb-3 leading-tight">{product.productName}</h2>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="text-lg sm:text-xl font-bold py-1 sm:py-2 px-3 sm:px-4">
                {product.price}
              </Badge>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                <span className="font-bold text-foreground text-base sm:text-lg">
                  {product.qualityScore} <span className="text-xs sm:text-sm font-normal text-muted-foreground">/ 100</span>
                </span>
              </div>
            </div>
          </div>

          {/* Match Tags */}
          <div>
            <h3 className="font-semibold mb-3 text-primary">¿Por qué coincide contigo?</h3>
            <div className="flex flex-wrap gap-2">
              {product.matchTags.map((matchTag, index) => (
                <Badge
                  key={index}
                  className={`border font-medium text-sm ${getTagColor(matchTag.level)}`}
                >
                  {matchTag.tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Product Description */}
          <div>
            <h3 className="font-semibold mb-3">Descripción</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
                <HighlightedText text={product.productDescription} />
            </p>
            <div className="flex items-center gap-2 mt-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">{product.availability}</span>
            </div>
          </div>

          {/* Justification */}
          <div className="pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 font-semibold mb-3 text-primary">
              <HelpCircle className="w-5 h-5"/>
              <span>¿Por qué es ideal para ti?</span>
            </div>
            <div className="glassmorphism rounded-xl p-4 shadow-inner">
              <p className="text-sm text-foreground/90 leading-relaxed">
                <HighlightedText text={product.justification} />
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <VerifiedProductLink
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
