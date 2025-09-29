'use client';

import { X, CheckCircle, HelpCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProductRecommendation } from "@/ai/schemas/product-recommendation";
import SmartProductImage from "./smart-product-image";
import VerifiedProductLink from "./verified-product-link";
import { useDeviceType } from '@/hooks/use-device-type';

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
  const deviceInfo = useDeviceType();
  const { isMobile, isTablet } = deviceInfo;

  return (
    <div className={`fixed inset-0 z-50 flex justify-center ${
      isMobile
        ? 'items-end p-0'
        : 'items-center p-2 sm:p-4'
    }`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full overflow-y-auto modal-scroll glassmorphism-strong soft-border ${
        isMobile
          ? 'max-h-[95vh] rounded-t-3xl max-w-none'
          : isTablet
          ? 'max-h-[90vh] max-w-lg rounded-3xl'
          : 'max-h-[90vh] max-w-2xl rounded-3xl'
      }`}>
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute z-10 rounded-full glassmorphism touch-manipulation ${
            isMobile
              ? 'top-2 right-2 w-8 h-8'
              : 'top-4 right-4 w-10 h-10'
          }`}
          onClick={onClose}
        >
          <X className={isMobile ? 'h-4 w-4' : 'h-5 w-5'} />
        </Button>

        {/* Product Image */}
        <div className={`relative overflow-hidden rounded-t-3xl ${
          isMobile
            ? 'h-48'
            : isTablet
            ? 'h-60'
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
          <div className={`absolute bg-primary text-primary-foreground rounded-full font-bold shadow-lg ${
            isMobile
              ? 'top-2 left-2 px-2 py-1 text-sm'
              : 'top-4 left-4 px-4 py-2 text-xl'
          }`}>
            {product.matchPercentage}% Match
          </div>
        </div>

        {/* Content */}
        <div className={`space-y-4 ${
          isMobile ? 'p-4' : isTablet ? 'p-5' : 'p-6'
        }`}>
          {/* Product Title and Price */}
          <div>
            <h2 className={`font-headline font-bold mb-3 leading-tight ${
              isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl'
            }`}>{product.productName}</h2>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className={`font-bold ${
                isMobile
                  ? 'text-sm py-1 px-2'
                  : isTablet
                  ? 'text-base py-1 px-3'
                  : 'text-xl py-2 px-4'
              }`}>
                {product.price}
              </Badge>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className={`fill-current ${
                  isMobile ? 'w-4 h-4' : isTablet ? 'w-5 h-5' : 'w-6 h-6'
                }`} />
                <span className={`font-bold text-foreground ${
                  isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg'
                }`}>
                  {product.qualityScore} <span className={`font-normal text-muted-foreground ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}>/ 100</span>
                </span>
              </div>
            </div>
          </div>

          {/* Match Tags */}
          <div>
            <h3 className={`font-semibold mb-3 text-primary ${
              isMobile ? 'text-sm' : 'text-base'
            }`}>¿Por qué coincide contigo?</h3>
            <div className="flex flex-wrap gap-2">
              {product.matchTags.map((matchTag, index) => (
                <Badge
                  key={index}
                  className={`border font-medium ${getTagColor(matchTag.level)} ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}
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

    