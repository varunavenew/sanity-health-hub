import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLayout } from "@/components/layout/PageLayout";
import { useTreatmentCategories } from "@/hooks/useSanity";

interface GuideProps {
  isChatOpen: boolean;
}

const staticCategories = [
  {
    title: "Gynekologi",
    slug: "gynecology",
    description: "Våre gynekologer tilbyr omfattende undersøkelser og behandlinger for kvinnehelse.",
    heroImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=1000&fit=crop",
    treatments: [
      { title: "Generell gynekologisk undersøkelse" },
      { title: "Celleprøve og HPV-test" },
      { title: "Ultralyd og billeddiagnostikk" },
      { title: "Hormonelle forstyrrelser" },
    ],
  },
  {
    title: "Fertilitet",
    slug: "fertility",
    description: "Vi tilbyr omfattende fertilitetsbehandling med moderne metoder og personlig oppfølging.",
    heroImage: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=1000&fit=crop",
    treatments: [
      { title: "Fertilitetsutredning" },
      { title: "IVF og IUI behandling" },
      { title: "Eggfrysing" },
      { title: "Sædanalyse og behandling" },
    ],
  },
  {
    title: "Urologi",
    slug: "urology",
    description: "Våre urologer har spesialkompetanse innen mannens helse og urinveissystemet.",
    heroImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=1000&fit=crop",
    treatments: [
      { title: "Prostataundersøkelse" },
      { title: "Erektil dysfunksjon" },
      { title: "Urinveisinfeksjoner" },
      { title: "Kirurgiske inngrep" },
    ],
  },
];

const CategorySection = ({
  category,
  index,
}: {
  category: typeof staticCategories[0];
  index: number;
}) => {
  const isReversed = index % 2 !== 0;
  const bgClass = index % 2 === 0 ? "bg-background" : "bg-gradient-to-b from-background to-primary/5";

  return (
    <section className={`py-20 ${bgClass}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className={isReversed ? "order-2 md:order-2" : ""}>
              <h2 className="text-4xl font-light mb-8 text-foreground">{category.title}</h2>
              <p className="text-muted-foreground mb-6 font-light leading-relaxed">
                {category.description}
              </p>
              <div className="space-y-4">
                {category.treatments.map((t) => (
                  <div key={t.title} className="flex items-start gap-3">
                    <span className="text-foreground/40 mt-1">•</span>
                    <span className="text-muted-foreground font-light">{t.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`relative aspect-[4/5] rounded-2xl overflow-hidden ${isReversed ? "order-1 md:order-1" : ""}`}>
              <img
                src={category.heroImage}
                alt={category.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Guide = ({ isChatOpen }: GuideProps) => {
  const navigate = useNavigate();
  const { data: sanityCategories, isLoading } = useTreatmentCategories();

  const categories = sanityCategories && sanityCategories.length > 0
    ? sanityCategories.map((cat: any) => ({
        title: cat.title,
        slug: cat.slug,
        description: cat.description || "",
        heroImage: cat.heroImage || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=1000&fit=crop",
        treatments: (cat.treatments || []).map((t: any) => ({ title: t.title })),
      }))
    : staticCategories;

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-light mb-6 text-foreground">Våre Behandlinger</h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              Spesialiserte behandlinger for kvinnen og mannens underliv
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Category Sections */}
      {isLoading ? (
        <div className="container mx-auto px-4 py-20 space-y-8 max-w-5xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid md:grid-cols-2 gap-16">
              <div className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <Skeleton className="aspect-[4/5] rounded-2xl" />
            </div>
          ))}
        </div>
      ) : (
        categories.map((cat: any, index: number) => (
          <CategorySection key={cat.slug || cat.title} category={cat} index={index} />
        ))
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-light mb-6 text-foreground">Klar til å starte?</h2>
            <p className="text-lg text-muted-foreground font-light mb-8 leading-relaxed">
              Book en time hos våre spesialister i dag. Ingen henvisning nødvendig.
            </p>
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-light rounded-full px-12 py-6 text-lg"
              onClick={() => navigate('/booking')}
            >
              Book time nå
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Guide;
