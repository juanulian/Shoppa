'use client';

import { X, CheckCircle, HelpCircle, Heart, LucideIcon, Camera, Battery, Zap, DollarSign, HardDrive, Monitor, Gamepad2, Briefcase, Shield, Wifi, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProductRecommendation } from "@/ai/schemas/product-recommendation";
import SmartProductImage from "./smart-product-image";
import VerifiedProductLink from "./verified-product-link";
import { useDeviceType } from '@/hooks/use-device-type';
import { cn } from "@/lib/utils";

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
      <div className={`relative w-full flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-2xl ${
        isMobile
          ? 'max-h-[92vh] rounded-t-3xl max-w-none'
          : isTablet
          ? 'max-h-[85vh] max-w-lg rounded-3xl'
          : 'max-h-[85vh] max-w-2xl rounded-3xl'
      }`}>
        {/* Close Button - Fixed position */}
        <Button
          variant="ghost"
          size="icon"
          className={`fixed z-20 rounded-full glassmorphism-strong shadow-lg touch-manipulation ${
            isMobile
              ? 'top-3 right-3 w-10 h-10'
              : 'top-6 right-6 w-10 h-10'
          }`}
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Product Image - Flex shrink to prevent overflow */}
        <div className={`relative overflow-hidden rounded-t-3xl flex-shrink-0 ${
          isMobile
            ? 'h-40'
            : isTablet
            ? 'h-48'
            : 'h-64'
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
              ? 'top-2 left-2 px-2 py-1 text-xs'
              : 'top-4 left-4 px-3 py-1.5 text-base'
          }`}>
            {product.matchPercentage}% Match
          </div>
        </div>

        {/* Content - Scrollable area */}
        <div className={`overflow-y-auto modal-scroll flex-1 space-y-4 ${
          isMobile ? 'p-4 pb-6' : isTablet ? 'p-5 pb-6' : 'p-6 pb-8'
        }`}>
          {/* Product Title and Price */}
          <div>
            <h2 className={`font-headline font-bold mb-2 leading-tight ${
              isMobile ? 'text-base' : isTablet ? 'text-lg' : 'text-2xl'
            }`}>{product.productName}</h2>
            <div className="flex items-center justify-between mb-3">
              <Badge variant="secondary" className={`font-bold ${
                isMobile
                  ? 'text-sm py-0.5 px-2'
                  : isTablet
                  ? 'text-base py-1 px-3'
                  : 'text-xl py-2 px-4'
              }`}>
                {product.price}
              </Badge>
              <Badge variant="outline" className={`flex items-center gap-1.5 ${
                isMobile ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
              } border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950`}>
                <Heart className={`fill-red-500 text-red-500 ${
                  isMobile ? 'w-3 h-3' : 'w-4 h-4'
                }`} />
                <span className="font-bold text-red-700 dark:text-red-300">
                  {product.qualityScore}/100
                </span>
              </Badge>
            </div>
          </div>

          {/* Match Tags */}
          <div>
            <h3 className={`font-semibold mb-2 text-primary ${
              isMobile ? 'text-xs' : 'text-sm'
            }`}>¿Por qué coincide contigo?</h3>
            <div className="flex flex-wrap gap-1.5">
              {product.matchTags.map((matchTag, index) => {
                const Icon = iconMap[matchTag.icon] || Smartphone;
                return(
                  <Badge
                    key={index}
                    className={cn('border font-medium flex items-center gap-1', getTagColor(matchTag.level), isMobile ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2.5 py-1')}
                  >
                    <Icon className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
                    {matchTag.tag}
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* Product Description */}
          <div>
            <h3 className={`font-semibold mb-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>Descripción</h3>
            <p className={`text-muted-foreground leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`}>
                <HighlightedText text={product.productDescription} />
            </p>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className={`text-green-500 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
              <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{product.availability}</span>
            </div>
          </div>

          {/* Justification */}
          <div className={`border-t border-white/20 ${isMobile ? 'pt-3' : 'pt-4'}`}>
            <div className={`flex items-center gap-2 font-semibold mb-2 text-primary ${isMobile ? 'text-xs' : 'text-sm'}`}>
              <HelpCircle className={isMobile ? 'w-4 h-4' : 'w-5 h-5'}/>
              <span>¿Por qué es ideal para ti?</span>
            </div>
            <div className={`glassmorphism rounded-xl shadow-inner ${isMobile ? 'p-3' : 'p-4'}`}>
              <p className={`text-foreground/90 leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`}>
                <HighlightedText text={product.justification} />
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className={isMobile ? 'pt-3' : 'pt-4'}>
            <VerifiedProductLink
              className="w-full"
              productId={product.productName}
              productName={product.productName}
              productPrice={product.price}
              productImage={product.imageUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
