import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { fertilitetImages } from "./fertilitetContent";

interface PageProps { isChatOpen: boolean }

const variants = [
  {
    slug: "fertilitet/editorial",
    title: "Editorial",
    subtitle: "Magasinpreget, varm og fortellende",
    description:
      "Stor typografi, generøst luftrom og en rolig rytme der bilder og målgrupper leder leseren framover. Tjenester presenteres som kapitler.",
    image: fertilitetImages.hero,
    tone: "Som et helsemagasin – mennesket i sentrum, ikke utstyret.",
  },
  {
    slug: "fertilitet/journey",
    title: "Reisen",
    subtitle: "Pasientreisen som rød tråd",
    description:
      "Siden er bygget rundt fortellingen «Fra første samtale til graviditetstest». Spesialister, behandlinger og booking flettes inn der de naturlig hører hjemme.",
    image: fertilitetImages.consultation,
    tone: "Trygghet bygges gjennom mennesker og prosess.",
  },
  {
    slug: "fertilitetssjekk/editorial",
    title: "Editorial",
    subtitle: "Rolig, opplysende og myk",
    description:
      "En kvinnelig henvendelse til den som lurer. Innholdet i sjekken vises som et kuratert kapittelregister, ikke en nummerert sjekkliste.",
    image: fertilitetImages.alt,
    tone: "Tar bort skammen rundt det å lure.",
  },
  {
    slug: "fertilitetssjekk/journey",
    title: "Reisen",
    subtitle: "Trinn for trinn gjennom sjekken",
    description:
      "Bygget rundt det konkrete forløpet — fra blodprøve til samtale. Tydelig hva som skjer, hva det betyr, og hva som kommer etter.",
    image: fertilitetImages.lab,
    tone: "Trygghet gjennom forutsigbarhet.",
  },
  {
    slug: "fertilitet/atelier",
    title: "Atelier",
    subtitle: "Klinisk presisjon, spesialistene i forgrunn",
    description:
      "Data, tall og team i fokus. Asymmetrisk hero med faktapanel, spesialistene først, og en strukturert tjenestekatalog som et oppslagsverk.",
    image: fertilitetImages.result,
    tone: "Tillit gjennom presisjon og åpenhet.",
  },
  {
    slug: "fertilitetssjekk/atelier",
    title: "Atelier",
    subtitle: "Klinisk, konkret, faktabasert",
    description:
      "Hero med faktablokk (varighet, innhold, henvisning), målepunktene som tabell, og hvem-er-sjekken-for som ren sjekkliste. Ingen pynt — kun klarhet.",
    image: fertilitetImages.lab,
    tone: "Trygghet gjennom konkrete fakta.",
  },
  {
    slug: "fertilitet/dialog",
    title: "Dialog",
    subtitle: "Split-hero med pasientens stemme",
    description:
      "Bilde til venstre, en roterende stemme fra pasienten til høyre — som hjemmesiden. Resten av siden er bygget rundt 'hvem du er' og 'hva du trenger', med spesialistkort i samme stil som forsiden.",
    image: fertilitetImages.hero,
    tone: "Som å starte en samtale, ikke en søknad.",
  },
  {
    slug: "fertilitet/magasin",
    title: "Magasin",
    subtitle: "Split-hero som magasinforside",
    description:
      "Stor bildeside til venstre, et innholdsregister + lederen til høyre. Resten av siden er kapittelinndelt — fra 'hvem' til 'reisen' til 'spesialistene' — som et helsemagasin.",
    image: fertilitetImages.alt,
    tone: "Premium, kuratert, lest fremfor scrollet.",
  },
  {
    slug: "fertilitet/klinikk",
    title: "Klinikk",
    subtitle: "Split-hero med faktapanel",
    description:
      "Bilde til venstre, mørk faktablokk til høyre med klinikkstatistikk (etablert 1989, suksessrate, vurdering). Spesialister først, deretter resultater og en strukturert behandlingskatalog.",
    image: fertilitetImages.result,
    tone: "Tillit gjennom åpne tall og presisjon.",
  },
  {
    slug: "fertilitetssjekk/dialog",
    title: "Dialog",
    subtitle: "Split-hero med pasientens spørsmål",
    description:
      "Bilde til venstre, en roterende strøm av 'det folk lurer på' til høyre. Sjekken vises som en samtale — seks korte steg, fem grunner, og hva som kan komme etter.",
    image: fertilitetImages.lab,
    tone: "Vi tar bort skammen rundt det å lure.",
  },
  {
    slug: "fertilitetssjekk/magasin",
    title: "Magasin",
    subtitle: "Split-hero som magasinforside",
    description:
      "Stor bildeside til venstre, innholdsregister og 'lederen' til høyre. Resten av siden gjennomgår sjekken kapittel for kapittel — rolig, opplyst og lesbar.",
    image: fertilitetImages.lab,
    tone: "En sjekk fortalt som et kapittel, ikke en sjekkliste.",
  },
  {
    slug: "fertilitetssjekk/klinikk",
    title: "Klinikk",
    subtitle: "Split-hero med faktapanel",
    description:
      "Bilde til venstre, mørk faktablokk til høyre med varighet, henvisning og innhold. Spesialister først, målepunktene som tabell, og hvem-er-sjekken-for som ren sjekkliste.",
    image: fertilitetImages.lab,
    tone: "Klar, ryddig og konkret — du vet hva du får.",
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
