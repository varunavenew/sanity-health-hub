import { ShoppingBag, Star, Sparkles } from "lucide-react";
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
  results?: string;
  howItWorks?: string;
}

interface ProductGalleryProps {
  products: Product[];
  title: string;
  description: string;
  recommendedProductId?: string;
}

export const ProductGallery = ({ products, title, description, recommendedProductId }: ProductGalleryProps) => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-foreground">{title}</h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product, index) => {
            const isRecommended = product.id === recommendedProductId;
            
            return (
            <Card
              key={product.id}
              className={`bg-card overflow-hidden group hover:shadow-sm transition-all duration-300 animate-slide-up border-2 ${
                isRecommended 
                  ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                  : 'border-transparent hover:border-primary/30'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {isRecommended && (
                <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-3 py-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-semibold">Idas Anbefaling</span>
                </div>
              )}
              
              <div className="aspect-square bg-muted/20 relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded flex items-center gap-1">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span className="text-xs font-medium">{product.rating}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{product.category}</p>
                  <h3 className="font-medium text-base mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t">
                  <span className="text-lg font-semibold text-foreground">{product.price}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-xs h-8"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      Les mer
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 text-xs h-8"
                    >
                      <ShoppingBag className="w-3 h-3 mr-1" />
                      Kjøp
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
