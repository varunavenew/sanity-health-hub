export type MediaType = "article" | "video" | "podcast" | "post";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  featured?: boolean;
  pinned?: boolean;
  externalUrl?: string;
  mediaType?: MediaType;
}

export const filterCategories = [
  "Alle",
  "Pasienthistorier",
  "Oss i media",
  "Fagartikler",
  "Nytt fra oss",
];

// Map legacy "Nyheter" category from existing data/Sanity to "Nytt fra oss"
export const normalizeCategory = (cat: string) =>
  cat === "Nyheter" ? "Nytt fra oss" : cat;

// Base URL for real published articles on cmedical.no. When an article has
// an `externalUrl`, the "Les mer" link on each card routes there instead of
// the internal /aktuelt/:slug page.
const CM = "https://cmedical.no";

export const articles: Article[] = [
  {
    slug: "vi-har-alltid-visst-at-vi-ville-bli-foreldre-sammen",
    title: "«Vi har alltid visst at vi ville bli foreldre sammen»",
    excerpt:
      "To som lenge har visst at de ville bygge familie sammen forteller om veien til å bli foreldre — med assistert befruktning og tett oppfølging fra spesialistene ved Livio Oslo, en del av CMedical.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/32d26b009155315ee9079e632d50526ed728d822-4853x5037.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2026-06-20",
    category: "Pasienthistorier",
    externalUrl: `${CM}/no/nyheter-og-artikler/vi-har-alltid-visst-at-vi-ville-bli-foreldre-sammen`,
    pinned: true,
    featured: true,
    mediaType: "article",
  },
  {
    slug: "18-maneder-etter-hofteoperasjon-hos-cmedical",
    title: "18 måneder etter hofteoperasjon hos CMedical sto hun på Sydpolen",
    excerpt:
      "«Mini og Muttern» er verdens første mor-datter-duo på Sydpolen. Etter 55 dager på ekspedisjon sto Emma «Mini» Gyllenhammar og moren Kathinka «Muttern» på verdens sørligste punkt.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/1a6b5c045dd900b09dd7dd5e0c2e9683d2d12643-4284x5712.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2026-06-05",
    category: "Pasienthistorier",
    externalUrl: `${CM}/18-maneder-etter-hofteoperasjon-hos-cmedical`,
    pinned: true,
    featured: true,
    mediaType: "video",
  },
  {
    slug: "madeleine-engen-vinner-av-kvinnehelseprisen-her-awards-2026",
    title: "Madeleine Engen – vinner av Kvinnehelseprisen HER Awards 2026",
    excerpt:
      "Gynekolog Madeleine Engen hedres med Kvinnehelseprisen under HER Awards 2026 for sitt arbeid med å løfte fram fødselsskader og gi kvinner en stemme i helsevesenet.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/d362bd71e8041ad17a85c756ec9bc7c6d638b817-5464x8192.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2026-05-22",
    category: "Nytt fra oss",
    externalUrl: `${CM}/madeleine-engen-vinner-av-kvinnehelseprisen-her-awards-2026`,
    featured: true,
    mediaType: "article",
  },
  {
    slug: "overgangsalderen-er-en-ny-fase-ikke-slutten-pa-noe",
    title: "Overgangsalderen er en ny fase, ikke slutten på noe",
    excerpt:
      "Symptomene på overgangsalderen starter ofte tidligere enn mange tror. Gynekolog Birgitte Mitlid-Mork forklarer hva som skjer med kroppen og hvilke behandlingsmuligheter som finnes.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/1b6782dd6bb68860c34de07a6522605faa161d22-4318x2879.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2026-05-10",
    category: "Fagartikler",
    externalUrl: `${CM}/overgangsalderen-er-en-ny-fase-ikke-slutten-pa-noe`,
    featured: true,
    mediaType: "article",
  },
  {
    slug: "nar-kroppen-ikke-fungerer-etter-fodsel-og-ingen-lytter",
    title: "Når kroppen ikke fungerer etter fødsel – og ingen lytter",
    excerpt:
      "Gynekolog Madeleine Engen om vaginalt fremfall – en av de vanligste og mest oversette fødselsskadene. Ifølge WHO får 36 prosent av kvinner som føder vaginalt permanente sekveler.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/d31e037d4dbce186dfade4ab6bca8a970aff5284-6000x4000.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2026-04-18",
    category: "Fagartikler",
    externalUrl: `${CM}/nar-kroppen-ikke-fungerer-etter-fodsel-og-ingen-lytter`,
    mediaType: "article",
  },
  {
    slug: "minis-historie-gjennom-mutterns-oyne",
    title: "Minis historie gjennom Mutterns øyne",
    excerpt:
      "For Kathinka «Muttern» Gyllenhammar er det å lede mennesker gjennom polare områder en del av jobben. Men ingenting kunne forberede henne på reisen datteren Emma «Mini» skulle gjennom.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/946dc27d7aa8ac81e67a23ec388973f4e01cc259-4000x6000.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2026-04-02",
    category: "Pasienthistorier",
    externalUrl: `${CM}/minis-historie-gjennom-mutterns-oyne`,
    mediaType: "article",
  },
  {
    slug: "slik-forbereder-hun-seg-til-sydpolen",
    title: "Slik forbereder hun seg til Sydpolen",
    excerpt:
      "Etter to år med intense smerter tross tidligere kirurgi måtte Emma «Mini» Gyllenhammar starte helt på nytt. Nå, etter en vellykket hofteoperasjon hos CMedical, trener hun systematisk mot Sydpolen.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/6b1f1277856be1831383a33517a2272009f9bb3d-4000x6000.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2026-03-15",
    category: "Pasienthistorier",
    mediaType: "article",
  },
  {
    slug: "robotassistert-overvektskirurgi-presisjon-trygghet-og-varige-resultater",
    title: "Robotassistert overvektskirurgi – presisjon, trygghet og varige resultater",
    excerpt:
      "Som den eneste private aktøren i Norden tilbyr CMedical robotassistert overvektskirurgi med høyeste presisjon og skånsomhet. Med avansert 3D-visualisering og mikrobevegelser styrt av erfarne kirurger.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/11f45ca6a82256cd2bfc61fc0d267d302975a09f-3519x4000.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2026-02-28",
    category: "Nytt fra oss",
    featured: true,
    mediaType: "video",
  },
];
