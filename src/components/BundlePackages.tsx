import { Package, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import antiAgingBundle from "@/assets/bundles/anti-aging-bundle.jpg";
import hydrationBundle from "@/assets/bundles/hydration-bundle.jpg";
import acneBundle from "@/assets/bundles/acne-bundle.jpg";
import brighteningBundle from "@/assets/bundles/brightening-bundle.jpg";

const bundles = [
  {
    id: 1,
    name: "Anti-Aging Komplett Pakke",
    description: "Alt du trenger for ungdommelig hud",
    price: "1.899,-",
    originalPrice: "2.497,-",
    discount: "24%",
    image: antiAgingBundle,
    products: [
      "Retinol Night Treatment",
      "Vitamin C Brightening Serum",
      "Hyaluronic Acid Serum",
      "Peptide Eye Cream",
      "Daily SPF 50 Sunscreen"
    ],
    tag: "Mest Populær",
    color: "from-purple-500/10 to-pink-500/10"
  },
  {
    id: 2,
    name: "Hydrerings Essentials",
    description: "For tørr og sliten hud",
    price: "1.299,-",
    originalPrice: "1.697,-",
    discount: "23%",
    image: hydrationBundle,
    products: [
      "Hyaluronic Acid Serum",
      "Rich Moisture Cream",
      "Overnight Sleeping Mask",
      "Gentle Cleansing Oil",
      "Hydrating Face Mist"
    ],
    tag: "Best for Vinteren",
    color: "from-blue-500/10 to-cyan-500/10"
  },
  {
    id: 3,
    name: "Akne & Uren Hud Pakke",
    description: "Ren og balansert hud",
    price: "1.199,-",
    originalPrice: "1.596,-",
    discount: "25%",
    image: acneBundle,
    products: [
      "Salicylic Acid Cleanser",
      "Niacinamide Pore Refining Serum",
      "Clay Purifying Mask",
      "Tea Tree Spot Gel",
      "Oil-Free Moisturizer"
    ],
    tag: "Best Verdi",
    color: "from-green-500/10 to-emerald-500/10"
  },
  {
    id: 4,
    name: "Glød & Brightening Set",
    description: "Strålende og jevn hudtone",
    price: "1.599,-",
    originalPrice: "2.096,-",
    discount: "24%",
    image: brighteningBundle,
    products: [
      "Vitamin C Brightening Serum",
      "Niacinamide Pore Refining Serum",
      "BHA Exfoliating Toner",
      "Daily SPF 50 Sunscreen",
      "Micellar Cleansing Water"
    ],
    tag: "Nyhet",
    color: "from-amber-500/10 to-orange-500/10"
  }
];

export const BundlePackages = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Spar med Ferdigpakker</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">Komplett Hudpleie Pakker</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Få alt du trenger for din hudpleierutine - spar opp til 25%
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {bundles.map((bundle) => (
            <Card 
              key={bundle.id}
              className={`group relative overflow-hidden border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-br ${bundle.color}`}
            >
              {/* Bundle Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={bundle.image}
                  alt={bundle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <Badge className="absolute top-4 right-4 bg-primary text-white shadow-lg">
                  Spar {bundle.discount}
                </Badge>
                <Badge variant="secondary" className="absolute top-4 left-4">
                  {bundle.tag}
                </Badge>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {bundle.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {bundle.description}
                  </p>
                </div>

                <div className="space-y-3 py-4">
                  {bundle.products.map((product, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-primary/20 p-1">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm">{product}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-primary">
                      {bundle.price}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      {bundle.originalPrice}
                    </span>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full rounded-full text-base h-12 group-hover:scale-105 transition-transform"
                  >
                    Kjøp Pakke
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
