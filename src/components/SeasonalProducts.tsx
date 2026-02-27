import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { allProducts } from "@/data/mockData";

export const SeasonalProducts = () => {
  // Select seasonal featured products
  const seasonalProducts = [
    allProducts.find(p => p.id === "5"), // Retinol Night Treatment
    allProducts.find(p => p.id === "1"), // Hyaluronic Acid Serum
    allProducts.find(p => p.id === "9"), // Vitamin C Serum
  ].filter(Boolean);

  return (
    <section className="py-20" style={{ backgroundColor: 'hsl(40, 35%, 92%)' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Sesongens Beste</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">Vinterklar Hud 2025</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Våre mest populære produkter for kald og tørr vinterhud
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {seasonalProducts.map((product, index) => (
            <Card 
              key={product?.id} 
              className="group hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white border-2 hover:border-primary/30 hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <div className="aspect-[4/5]">
                  <img
                    src={product?.image}
                    alt={product?.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-white shadow-lg">
                    #{index + 1} Bestseller
                  </Badge>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors">
                    {product?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {product?.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {product?.tags?.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-2xl font-bold text-primary">{product?.price}</span>
                  <Button className="rounded-full">
                    Legg i kurv
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
