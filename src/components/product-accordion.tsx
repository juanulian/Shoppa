'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, HelpCircle, Star, ShoppingCart } from "lucide-react";
import Image from "next/image";

type ProductAccordionProps = {
  productName: string;
  productDescription: string;
  price: number;
  qualityScore: number;
  availability: string;
  justification: string;
  imageUrl: string;
  onAddToCart: () => void;
};

const ProductAccordion: React.FC<ProductAccordionProps> = ({
  productName,
  productDescription,
  price,
  qualityScore,
  availability,
  justification,
  imageUrl,
  onAddToCart,
}) => {
  return (
    <Accordion type="single" collapsible className="w-full bg-card/30 backdrop-blur-lg border border-border/20 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-2xl">
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="p-4 hover:no-underline">
          <div className="flex gap-4 items-center w-full">
            <div className="relative h-24 w-24 flex-shrink-0">
                <Image src={imageUrl} alt={productName} fill className="rounded-md object-cover" data-ai-hint="product image" />
            </div>
            <div className="flex-grow text-left">
                <h3 className="font-headline font-bold text-lg">{productName}</h3>
                <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="text-base font-bold py-1 px-3">
                        ${price.toFixed(2)}
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="font-bold text-foreground">
                        {qualityScore} <span className="text-sm font-normal text-muted-foreground">/ 100</span>
                        </span>
                    </div>
                </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-6 pt-2">
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{productDescription}</p>
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">{availability}</span>
                </div>
                <div className="pt-2">
                    <div className="flex items-center gap-2 font-semibold mb-1">
                        <HelpCircle className="w-5 h-5 text-accent"/>
                        <span>Por qué lo recomendamos</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{justification}</p>
                </div>
                <Button className="w-full mt-4" onClick={onAddToCart}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Añadir al carrito
                </Button>
            </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductAccordion;
