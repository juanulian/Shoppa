'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, HelpCircle, Star } from "lucide-react";
import type { ProductRecommendation } from "@/ai/schemas/product-recommendation";
import SmartProductImage from "./smart-product-image";
import VerifiedProductLink from "./verified-product-link";

type ProductAccordionProps = {
  product: ProductRecommendation;
};

const ProductAccordion: React.FC<ProductAccordionProps> = ({
  product,
}) => {
  return (
    <Accordion type="single" collapsible className="w-full glassmorphism-card rounded-2xl transition-all duration-500 hover:glassmorphism-strong hover:scale-[1.02] hover-glow floating-elements">
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="p-4 hover:no-underline">
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full text-center sm:text-left">
            <div className="relative h-28 w-28 flex-shrink-0">
                <SmartProductImage 
                    src={product.imageUrl} 
                    alt={product.productName}
                    productName={product.productName}
                    className="rounded-md object-cover"
                    fill
                />
            </div>
            <div className="flex-grow">
                <h3 className="font-headline font-bold text-lg">{product.productName}</h3>
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-4 mt-2">
                    <Badge variant="secondary" className="text-base font-bold py-1 px-3 glassmorphism text-white shadow-lg">
                        {product.price}
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="font-bold text-foreground">
                        {product.qualityScore} <span className="text-sm font-normal text-muted-foreground">/ 100</span>
                        </span>
                    </div>
                </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-4 sm:p-6 pt-2">
            <div className="space-y-6">
                <div>
                    <p className="text-sm text-muted-foreground">{product.productDescription}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium">{product.availability}</span>
                    </div>
                </div>
                <div className="pt-4 border-t border-white/30">
                    <div className="flex items-center gap-2 font-semibold mb-3 text-primary">
                        <HelpCircle className="w-5 h-5"/>
                        <span>¿Por qué es ideal para ti?</span>
                    </div>
                    <div className="glassmorphism rounded-xl p-4 shadow-inner">
                        <p className="text-sm text-foreground/90 leading-relaxed">{product.justification}</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                    <VerifiedProductLink 
                        className="w-full sm:w-auto flex-grow"
                    />
                </div>
            </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductAccordion;
