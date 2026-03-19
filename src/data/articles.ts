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
}

export const filterCategories = [
  "Alle",
  "Pasienthistorier",
  "Oss i media",
  "Fagartiklar",
  "Nyheter",
  "Teknologi",
  "SoMe",
];

export const articles: Article[] = [
  {
    slug: "18-maneder-etter-hofteoperasjon-hos-cmedical",
    title: "18 måneder etter hofteoperasjon hos CMedical sto hun på Sydpolen",
    excerpt:
      "«Mini og Muttern» er verdens første mor-datter-duo på Sydpolen. Etter 55 dager på ekspedisjon sto Emma «Mini» Gyllenhammar og moren Kathinka «Muttern» på verdens sørligste punkt.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/1a6b5c045dd900b09dd7dd5e0c2e9683d2d12643-4284x5712.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2026-03-10",
    category: "Pasienthistorier",
    pinned: true,
    featured: true,
  },
  {
    slug: "overgangsalderen-er-en-ny-fase-ikke-slutten-pa-noe",
    title: "Overgangsalderen er en ny fase, ikke slutten på noe",
    excerpt:
      "Symptomene på overgangsalderen starter ofte tidligere enn mange tror. Gynekolog Birgitte Mitlid-Mork forklarer hva som skjer med kroppen og hvilke behandlingsmuligheter som finnes.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/1b6782dd6bb68860c34de07a6522605faa161d22-4318x2879.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2026-03-05",
    category: "Fagartiklar",
  },
  {
    slug: "nar-kroppen-ikke-fungerer-etter-fodsel-og-ingen-lytter",
    title: "Når kroppen ikke fungerer etter fødsel – og ingen lytter",
    excerpt:
      "Gynekolog Madeleine Engen om vaginalt fremfall – en av de vanligste og mest oversette fødselsskadene. Ifølge WHO får 36 prosent av kvinner som føder vaginalt permanente sekveler.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/d362bd71e8041ad17a85c756ec9bc7c6d638b817-5464x8192.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2026-02-26",
    category: "Fagartiklar",
  },
  {
    slug: "minis-historie-gjennom-mutterns-oyne",
    title: "Minis historie gjennom Mutterns øyne",
    excerpt:
      "For Kathinka «Muttern» Gyllenhammar er det å lede mennesker gjennom polare områder en del av jobben. Men ingenting kunne forberede henne på den reisen datteren Emma «Mini» skulle gjennom.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/946dc27d7aa8ac81e67a23ec388973f4e01cc259-4000x6000.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2026-02-19",
    category: "Pasienthistorier",
  },
  {
    slug: "slik-forbereder-hun-seg-til-sydpolen",
    title: "Slik forbereder hun seg til Sydpolen",
    excerpt:
      "Etter to år med intense smerter tross tidligere kirurgi måtte Emma «Mini» Gyllenhammar starte helt på nytt. Nå, etter en vellykket hofteoperasjon hos CMedical, trener hun systematisk mot Sydpolen.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/6b1f1277856be1831383a33517a2272009f9bb3d-4000x6000.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2026-02-10",
    category: "Pasienthistorier",
  },
  {
    slug: "robotassistert-overvektskirurgi-presisjon-trygghet-og-varige-resultater",
    title: "Robotassistert overvektskirurgi – presisjon, trygghet og varige resultater",
    excerpt:
      "Som den eneste private aktøren i Norden tilbyr CMedical robotassistert overvektskirurgi med høyeste presisjon og skånsomhet. Med avansert 3D-visualisering og mikrobevegelser styrt av erfarne kirurger.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/11f45ca6a82256cd2bfc61fc0d267d302975a09f-3519x4000.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2026-01-28",
    category: "Teknologi",
    pinned: true,
    featured: true,
  },
  {
    slug: "fra-operasjonsbordet-til-sydpolen-pa-14-maneder",
    title: "Fra operasjonsbordet til Sydpolen på 14 måneder",
    excerpt:
      "Emma «Mini» Gyllenhammar var bare 17 år da alt raknet. En alvorlig hofteskade tok fra henne hverdagsglede og drømmen om å følge morens skispor til Sydpolen. Men med hjelp fra CMedical fikk Emma livet tilbake.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/e725aa565f4be72b0ce0260d828548a5a2a0203b-6000x4000.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2026-01-15",
    category: "Pasienthistorier",
  },
  {
    slug: "livio-oslo-blir-en-del-av-cmedical-og-tilbudet-til-pasientene-styrkes",
    title: "Livio Oslo blir en del av CMedical og tilbudet til pasientene styrkes",
    excerpt:
      "I 1986 åpnet den første private fertilitetsklinikken i Norge. Livio Oslo har siden vært en pioner innen assistert befruktning. Nå har Livio Oslo blitt en del av CMedical.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/32d26b009155315ee9079e632d50526ed728d822-4853x5037.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2025-12-18",
    category: "Nyheter",
    pinned: true,
    featured: true,
  },
  {
    slug: "historiene-ingen-snakker-om-etter-fodsel",
    title: "Historiene ingen snakker om etter fødsel",
    excerpt:
      "For mange kvinner er det krevende å snakke om plager etter fødsel. «Astrid» (50) er en av mange som til slutt fant hjelpen hun trengte hos gynekolog Madeleine Engen.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/d31e037d4dbce186dfade4ab6bca8a970aff5284-6000x4000.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2025-12-05",
    category: "Oss i media",
    pinned: true,
    featured: true,
  },
  {
    slug: "jeg-matte-grate-pa-telefonen-for-a-bli-tatt-pa-alvor",
    title: "Jeg måtte gråte på telefonen for å bli tatt på alvor",
    excerpt:
      "Da Kristine fikk sin første sønn, forventet hun en normal tilhelingsprosess. Men smertene var uutholdelige. – Jeg visste at noe var galt, men ingen ville høre på meg.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/b881be63ba69efe658b1fca8229437e3d44c94d7-3500x2333.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2025-11-20",
    category: "Pasienthistorier",
  },
  {
    slug: "maria-falt-i-sahara-og-mellom-alle-stoler-i-helse-norge",
    title: "Maria falt i Sahara – og mellom alle stoler i helse-Norge",
    excerpt:
      "Et uhell i Sahara i februar 2024 ble starten på et år fylt av smerte, mistillit og en kamp mot systemet. Nå vil Maria Teresa Cristofoli løfte en stemme for de som ikke blir sett.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/6f1783a2781390af679c6152ad01230d5925f391-4608x3456.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2025-11-05",
    category: "Pasienthistorier",
  },
  {
    slug: "cmedical-og-nors-care-inngar-samarbeid-vil-styrke-kvinners-kunnskap-om-egen-helse",
    title: "CMedical og Nørs Care inngår samarbeid – vil styrke kvinners kunnskap om egen helse",
    excerpt:
      "CMedical og Nors Care, som står bak Norges største kvinnehelseapp Nørs, har inngått en strategisk samarbeidsavtale med mål om å øke kunnskapen om fertilitet blant kvinner.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/3480faeccb875c3efde636db2e2a32f0c473c967-3456x4608.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2025-10-15",
    category: "Nyheter",
  },
  {
    slug: "cmedical-kjoper-livio-oslo",
    title: "CMedical kjøper Livio Oslo",
    excerpt:
      "CMedical satser ytterligere på kvinnehelse og fertilitetsbehandling, og kjøper opp Livio Oslo, landets første private fertilitetsklinikk og første klinikk med egen egg- og sædbank.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/9d98db67b0bed43cb6748e735176901b526eecf3-3456x4016.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2025-09-22",
    category: "Nyheter",
  },
  {
    slug: "tanken-slo-meg-ikke-at-det-kunne-vaere-meg",
    title: "– Tanken slo meg ikke at det kunne være meg",
    excerpt:
      "Når barn uteblir, tror mange automatisk at problemet ligger hos kvinnen, men i én av tre tilfeller skyldes det faktisk mannen. Synne og Chris deler sin historie for å bryte tabuet.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/62e47805ef92f8e3c679efcb84fb92ee3f7bb588-3217x4289.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2025-08-28",
    category: "Pasienthistorier",
  },
  {
    slug: "ved-a-lukke-kvinnehelsegapet-kan-hver-kvinne-fa-syv-flere-friske-dager-i-lopet-av-et-ar",
    title: "Ved å lukke kvinnehelsegapet kan hver kvinne få syv flere friske dager i løpet av et år",
    excerpt:
      "Økt fokus på kvinnehelse er ikke bare et politisk ansvar. Det er også økonomisk lønnsomt. Ved å lukke kvinnehelsegapet kan vi tilføre norsk økonomi 80 milliarder kroner innen 2040.",
    image:
      "https://cdn.sanity.io/images/bk8rw7yi/production/472a177365d6d13a8a884152e437da2b738fe92b-8192x5464.jpg?q=75&fit=clip&auto=format&w=800",
    date: "2025-08-10",
    category: "Fagartiklar",
  },
];
