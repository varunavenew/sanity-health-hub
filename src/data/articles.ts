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

const IMG = "https://cdn.sanity.io/images/bk8rw7yi/production";
const img = (id: string) => `${IMG}/${id}?q=75&fit=clip&auto=format&w=1200`;

export const articles: Article[] = [
  {
    slug: "vi-har-alltid-visst-at-vi-ville-bli-foreldre-sammen",
    title: "«Vi har alltid visst at vi ville bli foreldre sammen»",
    excerpt:
      "To som lenge har visst at de ville bygge familie sammen forteller om veien til å bli foreldre — med assistert befruktning og tett oppfølging fra spesialistene ved Livio Oslo, en del av CMedical.",
    image: img("53dc57a4228ced56fab1393ba6328b9f17ce2b6e-2560x3840.jpg"),
    date: "2026-06-20",
    category: "Pasienthistorier",
    pinned: true,
    featured: true,
    mediaType: "article",
  },
  {
    slug: "18-maneder-etter-hofteoperasjon-hos-cmedical",
    title: "18 måneder etter hofteoperasjon hos CMedical sto hun på Sydpolen",
    excerpt:
      "«Mini og Muttern» er verdens første mor-datter-duo på Sydpolen. Etter 55 dager på ekspedisjon sto Emma «Mini» Gyllenhammar og moren Kathinka «Muttern» på verdens sørligste punkt.",
    image: img("1a6b5c045dd900b09dd7dd5e0c2e9683d2d12643-4284x5712.jpg"),
    date: "2026-06-05",
    category: "Pasienthistorier",
    pinned: true,
    featured: true,
    mediaType: "video",
  },
  {
    slug: "madeleine-engen-vinner-av-kvinnehelseprisen-her-awards-2026",
    title: "Madeleine Engen – vinner av Kvinnehelseprisen HER Awards 2026",
    excerpt:
      "Gynekolog Madeleine Engen hedres med Kvinnehelseprisen under HER Awards 2026 for sitt arbeid med å løfte fram fødselsskader og gi kvinner en stemme i helsevesenet.",
    image: img("63778bc92991fd62e22595617c3b460b05a03f98-800x1000.jpg"),
    date: "2026-05-22",
    category: "Nytt fra oss",
    featured: true,
    mediaType: "article",
  },
  {
    slug: "overgangsalderen-er-en-ny-fase-ikke-slutten-pa-noe",
    title: "Overgangsalderen er en ny fase, ikke slutten på noe",
    excerpt:
      "Symptomene på overgangsalderen starter ofte tidligere enn mange tror. Gynekolog Birgitte Mitlid-Mork forklarer hva som skjer med kroppen og hvilke behandlingsmuligheter som finnes.",
    image: img("1b6782dd6bb68860c34de07a6522605faa161d22-4318x2879.jpg"),
    date: "2026-05-10",
    category: "Fagartikler",
    featured: true,
    mediaType: "article",
  },
  {
    slug: "nar-kroppen-ikke-fungerer-etter-fodsel-og-ingen-lytter",
    title: "Når kroppen ikke fungerer etter fødsel – og ingen lytter",
    excerpt:
      "Gynekolog Madeleine Engen om vaginalt fremfall – en av de vanligste og mest oversette fødselsskadene. Ifølge WHO får 36 prosent av kvinner som føder vaginalt permanente sekveler.",
    image: img("d362bd71e8041ad17a85c756ec9bc7c6d638b817-5464x8192.jpg"),
    date: "2026-04-18",
    category: "Fagartikler",
    mediaType: "article",
  },
  {
    slug: "minis-historie-gjennom-mutterns-oyne",
    title: "Minis historie gjennom Mutterns øyne",
    excerpt:
      "For Kathinka «Muttern» Gyllenhammar er det å lede mennesker gjennom polare områder en del av jobben. Men ingenting kunne forberede henne på reisen datteren Emma «Mini» skulle gjennom.",
    image: img("946dc27d7aa8ac81e67a23ec388973f4e01cc259-4000x6000.jpg"),
    date: "2026-04-02",
    category: "Pasienthistorier",
    mediaType: "article",
  },
  {
    slug: "slik-forbereder-hun-seg-til-sydpolen",
    title: "Slik forbereder hun seg til Sydpolen",
    excerpt:
      "Etter to år med intense smerter tross tidligere kirurgi måtte Emma «Mini» Gyllenhammar starte helt på nytt. Nå, etter en vellykket hofteoperasjon hos CMedical, trener hun systematisk mot Sydpolen.",
    image: img("6b1f1277856be1831383a33517a2272009f9bb3d-4000x6000.jpg"),
    date: "2026-03-15",
    category: "Pasienthistorier",
    mediaType: "article",
  },
  {
    slug: "robotassistert-overvektskirurgi-presisjon-trygghet-og-varige-resultater",
    title: "Robotassistert overvektskirurgi – presisjon, trygghet og varige resultater",
    excerpt:
      "Som den eneste private aktøren i Norden tilbyr CMedical robotassistert overvektskirurgi med høyeste presisjon og skånsomhet. Med avansert 3D-visualisering og mikrobevegelser styrt av erfarne kirurger.",
    image: img("11f45ca6a82256cd2bfc61fc0d267d302975a09f-3519x4000.jpg"),
    date: "2026-02-28",
    category: "Nytt fra oss",
    featured: true,
    mediaType: "video",
  },
  {
    slug: "fra-operasjonsbordet-til-sydpolen-pa-14-maneder",
    title: "Fra operasjonsbordet til Sydpolen på 14 måneder",
    excerpt:
      "Emma «Mini» Gyllenhammar var 17 år da en alvorlig hofteskade satte livet på vent. Etter en vellykket operasjon hos CMedical forberedte hun seg til sitt livs største eventyr.",
    image: img("e725aa565f4be72b0ce0260d828548a5a2a0203b-6000x4000.jpg"),
    date: "2026-02-10",
    category: "Pasienthistorier",
    mediaType: "article",
  },
  {
    slug: "livio-oslo-blir-en-del-av-cmedical-og-tilbudet-til-pasientene-styrkes",
    title: "Livio Oslo blir en del av CMedical – og tilbudet til pasientene styrkes",
    excerpt:
      "Livio Oslo har i snart 40 år vært en pioner innen assistert befruktning. Nå blir klinikken en del av CMedical, og pasientene får fertilitetsbehandling og kirurgi samlet under samme tak.",
    image: img("32d26b009155315ee9079e632d50526ed728d822-4853x5037.jpg"),
    date: "2026-01-22",
    category: "Nytt fra oss",
    mediaType: "article",
  },
  {
    slug: "historiene-ingen-snakker-om-etter-fodsel",
    title: "Historiene ingen snakker om etter fødsel",
    excerpt:
      "«Astrid» (50) levde i mange år med usynlige fødselsskader og smerter som ble bagatellisert. Vendepunktet kom da hun møtte gynekolog Madeleine Engen hos CMedical.",
    image: img("d31e037d4dbce186dfade4ab6bca8a970aff5284-6000x4000.jpg"),
    date: "2025-12-12",
    category: "Oss i media",
    mediaType: "article",
  },
  {
    slug: "jeg-matte-grate-pa-telefonen-for-a-bli-tatt-pa-alvor",
    title: "«Jeg måtte gråte på telefonen for å bli tatt på alvor»",
    excerpt:
      "Kristine Flygind Bjerke fikk beskjed om at smertene etter fødselen var normale. Først etter 15 måneder og fire leger fikk hun diagnosen vaginalt fremfall – og hjelpen hun trengte.",
    image: img("b881be63ba69efe658b1fca8229437e3d44c94d7-3500x2333.jpg"),
    date: "2025-11-20",
    category: "Oss i media",
    mediaType: "article",
  },
  {
    slug: "maria-falt-i-sahara-og-mellom-alle-stoler-i-helse-norge",
    title: "Maria falt i Sahara – og mellom alle stoler i helse-Norge",
    excerpt:
      "Et uhell i ørkenen ble starten på et år med smerte og kamp mot systemet. Vendepunktet kom da Maria Teresa Cristofoli (54) møtte håndkirurg Jan-Ragnar Haugstvedt ved CMedical.",
    image: img("6f1783a2781390af679c6152ad01230d5925f391-4608x3456.jpg"),
    date: "2025-10-28",
    category: "Pasienthistorier",
    mediaType: "article",
  },
  {
    slug: "cmedical-og-nors-care-inngar-samarbeid-vil-styrke-kvinners-kunnskap-om-egen-helse",
    title: "CMedical og Nørs Care inngår samarbeid – vil styrke kvinners kunnskap om egen helse",
    excerpt:
      "CMedical og Nørs Care, som står bak kvinnehelseappen Nørs, samarbeider for å øke kunnskapen om fertilitet og kvinnehelse gjennom hele livet.",
    image: img("3480faeccb875c3efde636db2e2a32f0c473c967-3456x4608.jpg"),
    date: "2025-10-02",
    category: "Nytt fra oss",
    mediaType: "article",
  },
  {
    slug: "cmedical-kjoper-livio-oslo",
    title: "CMedical kjøper Livio Oslo",
    excerpt:
      "CMedical satser videre på kvinnehelse og fertilitetsbehandling, og kjøper Livio Oslo – landets første private fertilitetsklinikk med egen egg- og sædbank.",
    image: img("9d98db67b0bed43cb6748e735176901b526eecf3-3456x4016.jpg"),
    date: "2025-09-05",
    category: "Nytt fra oss",
    mediaType: "article",
  },
  {
    slug: "tanken-slo-meg-ikke-at-det-kunne-vaere-meg",
    title: "«Tanken slo meg ikke at det kunne være meg»",
    excerpt:
      "I én av tre tilfeller med ufrivillig barnløshet ligger årsaken hos mannen. Synne og Chris deler sin historie for å bryte tabuet – og oppfordrer par til å sjekke seg tidlig.",
    image: img("62e47805ef92f8e3c679efcb84fb92ee3f7bb588-3217x4289.jpg"),
    date: "2025-08-14",
    category: "Pasienthistorier",
    mediaType: "article",
  },
  {
    slug: "ved-a-lukke-kvinnehelsegapet-kan-hver-kvinne-fa-syv-flere-friske-dager-i-lopet-av-et-ar",
    title:
      "Ved å lukke kvinnehelsegapet kan hver kvinne få syv flere friske dager i løpet av et år",
    excerpt:
      "Økt fokus på kvinnehelse er ikke bare et politisk ansvar – det er også økonomisk lønnsomt. Gynekolog Madeleine Engen om hvordan kvinnehelsegapet kan lukkes.",
    image: img("472a177365d6d13a8a884152e437da2b738fe92b-8192x5464.jpg"),
    date: "2025-07-18",
    category: "Fagartikler",
    mediaType: "article",
  },
];
