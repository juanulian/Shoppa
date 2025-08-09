'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, HelpCircle, Star, ShoppingCart, Plus } from "lucide-react";
import Image from "next/image";
import type { ProductRecommendation } from "@/ai/schemas/product-recommendation";

type ProductAccordionProps = {
  product: ProductRecommendation;
  complementaryProducts: ProductRecommendation[];
  onAddToCart: (product: ProductRecommendation) => void;
};

const ProductAccordion: React.FC<ProductAccordionProps> = ({
  product,
  complementaryProducts,
  onAddToCart,
}) => {
  return (
    <Accordion type="single" collapsible className="w-full bg-card/30 backdrop-blur-lg border border-border/20 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-2xl">
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="p-4 hover:no-underline">
          <div className="flex gap-4 items-center w-full">
            <div className="relative h-24 w-24 flex-shrink-0">
                <Image src={product.imageUrl} alt={product.productName} fill className="rounded-md object-cover" data-ai-hint="product image" />
            </div>
            <div className="flex-grow text-left">
                <h3 className="font-headline font-bold text-lg">{product.productName}</h3>
                <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="text-base font-bold py-1 px-3">
                        ${product.price.toFixed(2)}
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
                <div className="pt-2">
                    <div className="flex items-center gap-2 font-semibold mb-1">
                        <HelpCircle className="w-5 h-5 text-accent"/>
                        <span>Por qué lo recomendamos</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{product.justification}</p>
                </div>
                <Button className="w-full mt-4" onClick={() => onAddToCart(product)}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Añadir al carrito
                </Button>

                {complementaryProducts.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-border/20">
                         <h4 className="font-headline font-bold text-md text-center">Productos Complementarios</h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {complementaryProducts.map((compProduct, index) => (
                                <Card key={index} className="bg-background/50 overflow-hidden">
                                    <CardContent className="p-3 flex flex-col h-full">
                                        <div className="relative h-24 w-full mb-2">
                                            <Image src={compProduct.imageUrl} alt={compProduct.productName} fill className="rounded-md object-cover" data-ai-hint="product image" />
                                        </div>
                                        <h5 className="font-bold text-sm flex-grow">{compProduct.productName}</h5>
                                        <p className="text-xs text-muted-foreground mt-1">{compProduct.justification}</p>
                                        <div className="flex items-center justify-between mt-3">
                                            <Badge variant="secondary" className="text-sm font-bold">
                                                ${compProduct.price.toFixed(2)}
                                            </Badge>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => onAddToCart(compProduct)}>
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                         </div>
                    </div>
                )}
            </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductAccordion;
