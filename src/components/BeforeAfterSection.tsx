import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import beforeAging from "@/assets/before-after/before-aging.jpg";
import afterAging from "@/assets/before-after/after-aging.jpg";
import beforeAcne from "@/assets/before-after/before-acne.jpg";
import afterAcne from "@/assets/before-after/after-acne.jpg";
import beforeDry from "@/assets/before-after/before-dry.jpg";
import afterDry from "@/assets/before-after/after-dry.jpg";

const transformations = [
  {
    id: 1,
    title: "Anti-Aging Transformasjon",
    before: beforeAging,
    after: afterAging,
    duration: "8 uker",
    products: ["Retinol Night Treatment", "Vitamin C Serum", "Hyaluronic Acid Serum"],
    results: ["92% reduksjon i fine linjer", "Jevnere hudtone", "Synlig fastere hud"]
  },
  {
    id: 2,
    title: "Akne & Uren Hud",
    before: beforeAcne,
    after: afterAcne,
    duration: "6 uker",
    products: ["Salicylic Acid Cleanser", "Niacinamide Serum", "Tea Tree Spot Gel"],
    results: ["85% færre utbrudd", "Renere porer", "Balansert hudtone"]
  },
  {
    id: 3,
    title: "Tørr Hud Hydrering",
    before: beforeDry,
    after: afterDry,
    duration: "4 uker",
    products: ["Hyaluronic Acid Serum", "Rich Moisture Cream", "Overnight Mask"],
    results: ["95% mer hydrert hud", "Glattere tekstur", "Strålende glød"]
  }
];

export const BeforeAfterSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAfter, setShowAfter] = useState(false);

  const goToPrevious = () => {
    setShowAfter(false);
    setCurrentIndex((prev) => (prev - 1 + transformations.length) % transformations.length);
  };

  const goToNext = () => {
    setShowAfter(false);
    setCurrentIndex((prev) => (prev + 1) % transformations.length);
  };

  const currentTransformation = transformations[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Verifiserte Resultater</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">Før & Etter Transformasjoner</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Se de utrolige resultatene våre kunder har oppnådd med våre produkter
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden border-2 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Before/After Images */}
              <div className="relative aspect-square bg-muted overflow-hidden group">
                <img
                  src={showAfter ? currentTransformation.after : currentTransformation.before}
                  alt={showAfter ? "After" : "Before"}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium">
                  {showAfter ? "ETTER" : "FØR"}
                </div>
                
                {/* Toggle Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="lg"
                    onClick={() => setShowAfter(!showAfter)}
                    className="bg-white/95 text-foreground hover:bg-white shadow-2xl"
                  >
                    {showAfter ? "Vis Før" : "Vis Etter"}
                  </Button>
                </div>
              </div>

              {/* Details */}
              <div className="p-8 md:p-12 flex flex-col justify-center space-y-6 bg-gradient-to-br from-background to-muted/20">
                <div>
                  <h3 className="text-3xl font-bold mb-2">{currentTransformation.title}</h3>
                  <div className="flex items-center gap-2 text-primary">
                    <span className="text-sm font-medium">Varighet: {currentTransformation.duration}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 text-lg">Produkter brukt:</h4>
                    <div className="space-y-2">
                      {currentTransformation.products.map((product, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{product}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-lg">Resultater:</h4>
                    <div className="space-y-2">
                      {currentTransformation.results.map((result, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full mt-4 rounded-full"
                  onClick={() => setShowAfter(!showAfter)}
                >
                  {showAfter ? "Se Før Bilde" : "Se Etter Bilde"}
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between p-6 border-t bg-muted/30">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                className="rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="flex gap-2">
                {transformations.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setShowAfter(false);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-primary w-8"
                        : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
