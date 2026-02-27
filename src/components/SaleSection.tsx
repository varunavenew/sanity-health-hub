import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer } from "lucide-react";

const saleProducts = [
  {
    id: "sale-1",
    name: "Anti-Aging Bundle",
    originalPrice: 899,
    salePrice: 649,
    discount: 28,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
  },
  {
    id: "sale-2",
    name: "Hudpleie Startsett",
    originalPrice: 599,
    salePrice: 449,
    discount: 25,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop"
  },
  {
    id: "sale-3",
    name: "Dyprengjøring Set",
    originalPrice: 499,
    salePrice: 379,
    discount: 24,
    image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop"
  }
];

export const SaleSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-destructive text-white">
            <Timer className="w-3 h-3 mr-1" />
            Begrenset tilbud
          </Badge>
          <h2 className="text-3xl font-bold mb-3">Ukens tilbud</h2>
          <p className="text-muted-foreground">Spar opptil 30% på utvalgte produkter</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {saleProducts.map((product) => (
            <div key={product.id} className="bg-card rounded-lg border overflow-hidden group hover:shadow-sm transition-shadow">
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 right-3 bg-destructive text-white">
                  -{product.discount}%
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-3">{product.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-destructive">{product.salePrice} kr</span>
                  <span className="text-sm text-muted-foreground line-through">{product.originalPrice} kr</span>
                </div>
                <Button asChild className="w-full" size="sm">
                  <Link to={`/product/${product.id}`}>Kjøp nå</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
