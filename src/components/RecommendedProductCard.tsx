import { ShoppingBag, Star, CheckCircle, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  rating: number;
  image: string;
  tags: string[];
  description?: string;
  benefits?: string[];
}

interface RecommendedProductCardProps {
  product: Product;
}

export const RecommendedProductCard = ({ product }: RecommendedProductCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="mb-8 overflow-hidden border-2 border-primary shadow-xl bg-gradient-to-br from-primary/5 to-background animate-slide-down">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">Idas Personlige Anbefaling</span>
        </div>
        <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
          <Star className="w-4 h-4 fill-white" />
          <span className="font-bold">{product.rating}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 p-6">
        {/* Product Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden group">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between space-y-4">
          <div>
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3">
              {product.category}
            </div>
            
            <h3 className="text-2xl font-bold mb-3 text-foreground">
              {product.name}
            </h3>
            
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {product.description}
            </p>

            {product.benefits && product.benefits.length > 0 && (
              <div className="space-y-2 mb-4">
                {product.benefits.slice(0, 3).map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">{product.price}</span>
              <span className="text-sm text-muted-foreground">inkl. mva</span>
            </div>
            
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 rounded-full h-12 text-base shadow-lg hover:shadow-xl transition-shadow"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Kjøp Nå
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full h-12 px-6"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                Les Mer
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Gratis frakt over 500 kr • 30 dagers åpent kjøp
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
