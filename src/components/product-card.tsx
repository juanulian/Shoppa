import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, HelpCircle, Star, ShoppingCart } from "lucide-react";
import Image from "next/image";

type ProductCardProps = {
  productName: string;
  productDescription: string;
  price: number;
  qualityScore: number;
  availability: string;
  justification: string;
  imageUrl: string;
  onAddToCart: () => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
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
    <Card className="bg-card/30 backdrop-blur-lg border border-border/20 shadow-lg rounded-2xl h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
       <CardHeader>
        <div className="relative aspect-video w-full mb-4">
            <Image src={imageUrl} alt={productName} fill className="rounded-t-2xl object-cover" data-ai-hint="product image" />
        </div>
        <CardTitle className="font-headline font-bold text-xl">{productName}</CardTitle>
        <CardDescription>{productDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex justify-between items-center">
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
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Añadir al carrito
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
