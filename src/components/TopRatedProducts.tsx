import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { allProducts } from "@/data/mockData";

export const TopRatedProducts = () => {
  const topRated = allProducts
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium text-primary">Best Vurdert</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">Våre Kundefavoritter</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Produkter med høyest vurdering fra våre kunder
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topRated.map((product) => (
            <Card 
              key={product.id} 
              className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/20 hover:-translate-y-2"
            >
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-sm">{product.rating}</span>
                </div>
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-bold text-primary">{product.price}</span>
                  <Button size="sm" className="rounded-full">
                    Kjøp nå
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
