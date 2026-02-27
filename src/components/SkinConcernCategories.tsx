import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import drySkin from "@/assets/skin-concerns/dry-skin.jpg";
import oilySkin from "@/assets/skin-concerns/oily-skin.jpg";
import agingSkin from "@/assets/skin-concerns/aging-skin.jpg";
import acneSkin from "@/assets/skin-concerns/acne-skin.jpg";

const skinConcerns = [
  {
    id: "dry_skin",
    title: "Tørr hud",
    description: "Produkter for intensiv hydrering",
    image: drySkin,
  },
  {
    id: "oily_skin",
    title: "Fet/Kombinert hud",
    description: "Balanser oljeproduksjonen",
    image: oilySkin,
  },
  {
    id: "anti_aging",
    title: "Anti-aging",
    description: "Reduser alderstegn",
    image: agingSkin,
  },
  {
    id: "acne",
    title: "Akne & Uren hud",
    description: "Rens og behandle urenheter",
    image: acneSkin,
  },
];

interface SkinConcernCategoriesProps {
  onCategorySelect: (concernId: string) => void;
}

export const SkinConcernCategories = ({ onCategorySelect }: SkinConcernCategoriesProps) => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Finn løsninger for din hudtype
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Velg ditt hudproblem og oppdag produkter som er spesielt utviklet for dine behov
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {skinConcerns.map((concern) => (
            <Card
              key={concern.id}
              className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all"
              onClick={() => onCategorySelect(concern.id)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={concern.image}
                  alt={concern.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{concern.title}</h3>
                  <p className="text-sm text-white/90 mb-4">{concern.description}</p>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    Se produkter
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
