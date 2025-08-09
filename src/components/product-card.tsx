import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, HelpCircle, Star } from "lucide-react";

type ProductCardProps = {
  productName: string;
  productDescription: string;
  price: number;
  qualityScore: number;
  availability: string;
  justification: string;
};

const ProductCard: React.FC<ProductCardProps> = ({
  productName,
  productDescription,
  price,
  qualityScore,
  availability,
  justification,
}) => {
  return (
    <Card className="bg-card/30 backdrop-blur-lg border border-border/20 shadow-lg rounded-2xl h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <CardHeader>
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
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2 font-semibold">
           <HelpCircle className="w-5 h-5 text-accent"/>
           <span>Why we recommend it</span>
        </div>
        <p className="text-sm text-muted-foreground">{justification}</p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
