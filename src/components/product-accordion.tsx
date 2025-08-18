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
    <Accordion type="single" collapsible className="w-full bg-white/30 dark:bg-card/60 backdrop-blur-2xl border border-white/20 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-2xl">
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="p-4 hover:no-underline">
          <div className="flex gap-4 items-center w-full">
            <div className="relative h-28 w-28 flex-shrink-0">
                <SmartProductImage 
                    src={product.imageUrl} 
                    alt={product.productName}
                    productName={product.productName}
                    className="rounded-md object-cover"
                    fill
                />
            </div>
            <div className="flex-grow text-left">
                <h3 className="font-headline font-bold text-lg">{product.productName}</h3>
                <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="text-base font-bold py-1 px-3">
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
        <AccordionContent className="p-6 pt-2">
            <div className="space-y-6">
                <div>
                    <p className="text-sm text-muted-foreground">{product.productDescription}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium">{product.availability}</span>
                    </div>
                </div>
                <div className="pt-4 border-t border-white/20">
                    <div className="flex items-center gap-2 font-semibold mb-2 text-primary">
                        <HelpCircle className="w-5 h-5"/>
                        <span>¿Por qué es ideal para ti?</span>
                    </div>
                    <p className="text-sm text-foreground bg-primary/10 p-3 rounded-md border border-primary/20">{product.justification}</p>
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
