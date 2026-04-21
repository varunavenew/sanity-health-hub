import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import gynHero from "@/assets/hero/gynecology-hero.jpg";
import kvinnehelseHero from "@/assets/hero/kvinnehelse-hero.jpg";
import heroPregnancy from "@/assets/hero/hero-pregnancy.jpg";

interface PageProps {
  isChatOpen: boolean;
}

const variants = [
  {
    slug: "editorial",
    eyebrow: "Variant 01",
    title: "Editorial",
    subtitle: "Magasinpreget, varm og fortellende",
    description:
      "Stor typografi i ABC Ginto Light, generøst luftrom og en rolig rytme der bilder og sitater leder leseren framover. Tjenester presenteres som kapitler, ikke som en liste.",
    image: gynHero,
    tone: "Lik et helsemagasin – kvinnen i sentrum, ikke utstyret.",
  },
  {
    slug: "journey",
    eyebrow: "Variant 02",
    title: "Reisen",
    subtitle: "Pasienthistorier som rød tråd",
    description:
      "Siden er bygget rundt fortellingen «Fra første time til oppfølging». Spesialister, behandlinger og booking flettes inn der de naturlig hører hjemme i en pasientreise.",
    image: kvinnehelseHero,
    tone: "Trygghet bygges gjennom mennesker og prosess.",
  },
  {
    slug: "atelier",
    eyebrow: "Variant 03",
    title: "Atelier",
    subtitle: "Galleri-stil med store bilder",
    description:
      "Inspirert av kuraterte gallerirom: store bildeflater, spesialistene presentert som portretter, og tjenester som tagger. Intimt, premium og personlig.",
    image: heroPregnancy,
    tone: "Premium nærhet – som en privat konsultasjon.",
  },
  {
    slug: "index",
    eyebrow: "Variant 04",
    title: "Index",
    subtitle: "Moderne, strammere og rolig",
    description:
      "Ett fokus per seksjon, et tydelig nummerert tjenesteregister og rikelig med luft. Inspirert av samtidens redaksjonelle nettsteder – moderne, men aldri støyende.",
    image: gynHero,
    tone: "Stillere design, sterkere innhold.",
  },
  {
    slug: "klassisk-plus",
    eyebrow: "Variant 05",
    title: "Klassisk+",
    subtitle: "Som dagens side – med en frisk vri",
    description:
      "Bygget på den kjente strukturen fra /gynekologi: hero, intro, tjenesteliste, spesialister og FAQ. Vrien er en to-bilde hero, en nummerert to-kolonners tjenesteliste og roligere typografi.",
    image: kvinnehelseHero,
    tone: "Trygg gjenkjennelse, bedre rytme.",
  },
];

const DesignHub = ({ isChatOpen }: PageProps) => {
  useEffect(() => {
    document.title = "Gynekologi – designforslag | CMedical";
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Intro */}
      <section className="bg-brand-warm pt-32 md:pt-40 pb-16 md:pb-20">
        <div className="container mx-auto px-6 md:px-16 max-w-5xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-light mb-6">
            Designforslag · Gynekologi
          </p>
          <h1 className="text-4xl md:text-6xl font-light text-foreground leading-[1.05] tracking-tight mb-6">
            Tre tonefall for én side
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
            Alle tre varianter er bygget på samme visuelle profil – skin-tone palett, ABC Ginto Normal,
            16px radius på knapper og myk venstrejustert layout. Forskjellen ligger i rytmen og hvordan
            pasienten møtes.
          </p>
        </div>
      </section>

      {/* Variants */}
      <section className="bg-background pb-24 md:pb-32">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {variants.map((v) => (
              <Link
                key={v.slug}
                to={`/gynekologi-design/${v.slug}`}
                className="group block bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-foreground/40 transition-all duration-500"
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={v.image}
                    alt={v.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-light mb-4">
                    {v.eyebrow}
                  </p>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="text-2xl md:text-3xl font-light text-foreground">{v.title}</h2>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-light text-foreground/80 mb-4">{v.subtitle}</p>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed mb-5">
                    {v.description}
                  </p>
                  <p className="text-xs italic text-muted-foreground font-light border-t border-border/60 pt-4">
                    {v.tone}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 md:mt-20 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-light mb-4">
              Slik leser du forslagene
            </p>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Hver variant er en fullt levende side. Klikk inn for å se layout, rytme og hvordan
              tjenester, spesialister, pasienthistorier og booking samspiller. Den nåværende
              <Link to="/gynekologi" className="underline underline-offset-4 hover:text-foreground mx-1">
                /gynekologi
              </Link>
              forblir uendret.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default DesignHub;
