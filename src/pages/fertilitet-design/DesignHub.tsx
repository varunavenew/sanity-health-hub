import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { fertilitetImages } from "./fertilitetContent";

interface PageProps { isChatOpen: boolean }

const variants = [
  {
    slug: "fertilitet/editorial",
    eyebrow: "Forslag 02 · Fertilitet",
    title: "Editorial",
    subtitle: "Magasinpreget, varm og fortellende",
    description:
      "Stor typografi, generøst luftrom og en rolig rytme der bilder og målgrupper leder leseren framover. Tjenester presenteres som kapitler.",
    image: fertilitetImages.hero,
    tone: "Som et helsemagasin – mennesket i sentrum, ikke utstyret.",
  },
  {
    slug: "fertilitet/journey",
    eyebrow: "Forslag 03 · Fertilitet",
    title: "Reisen",
    subtitle: "Pasientreisen som rød tråd",
    description:
      "Siden er bygget rundt fortellingen «Fra første samtale til graviditetstest». Spesialister, behandlinger og booking flettes inn der de naturlig hører hjemme.",
    image: fertilitetImages.consultation,
    tone: "Trygghet bygges gjennom mennesker og prosess.",
  },
  {
    slug: "fertilitetssjekk/editorial",
    eyebrow: "Forslag 02 · Fertilitetssjekk",
    title: "Editorial",
    subtitle: "Rolig, opplysende og myk",
    description:
      "En kvinnelig henvendelse til den som lurer. Innholdet i sjekken vises som et kuratert kapittelregister, ikke en nummerert sjekkliste.",
    image: fertilitetImages.alt,
    tone: "Tar bort skammen rundt det å lure.",
  },
  {
    slug: "fertilitetssjekk/journey",
    eyebrow: "Forslag 03 · Fertilitetssjekk",
    title: "Reisen",
    subtitle: "Trinn for trinn gjennom sjekken",
    description:
      "Bygget rundt det konkrete forløpet — fra blodprøve til samtale. Tydelig hva som skjer, hva det betyr, og hva som kommer etter.",
    image: fertilitetImages.lab,
    tone: "Trygghet gjennom forutsigbarhet.",
  },
];

const DesignHub = ({ isChatOpen }: PageProps) => {
  useEffect(() => {
    document.title = "Fertilitet – designforslag | CMedical";
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <section className="bg-brand-warm pt-32 md:pt-40 pb-16 md:pb-20">
        <div className="container mx-auto px-6 md:px-16 max-w-5xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-light mb-6">
            Designforslag · Fertilitet
          </p>
          <h1 className="text-4xl md:text-6xl font-light text-foreground leading-[1.05] tracking-tight mb-6">
            To tonefall — to sider
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
            Forslag 02 og 03 vist på både <span className="italic">/fertilitet</span> og{" "}
            <span className="italic">/fertilitetssjekk</span>. Samme innhold som i dag — bare en ny
            rytme, layout og tone for å vise hvordan brukerreisen kan oppleves.
          </p>
        </div>
      </section>

      <section className="bg-background pb-24 md:pb-32">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {variants.map((v) => (
              <Link
                key={v.slug}
                to={`/fertilitet-design/${v.slug}`}
                className="group block bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-foreground/40 transition-all duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
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
                    <ArrowUpRight
                      className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                      strokeWidth={1.5}
                    />
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
              tjenester, spesialister og booking samspiller. Eksisterende
              <Link to="/fertilitet" className="underline underline-offset-4 hover:text-foreground mx-1">
                /fertilitet
              </Link>
              og
              <Link to="/behandlinger/fertilitet/fertilitetssjekk" className="underline underline-offset-4 hover:text-foreground mx-1">
                /fertilitetssjekk
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
