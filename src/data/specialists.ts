// CMedical Specialists Data
// Based on real specialists from cmedical.no/no/spesialister
// Updated with real bio data scraped from individual profile pages

export interface Specialist {
  name: string;
  title: string;
  subtitle?: string;
  expertise: string[];
  image: string;
  category: 'gynekologi' | 'fertilitet' | 'urologi' | 'ortopedi' | 'annet';
  slug: string;
  bio?: string;
  education?: string;
  experience?: string;
  languages?: string[];
  clinics?: string[];
}

export const specialists: Specialist[] = [
  {
    name: "Alenka Bindas",
    title: "Gynekolog",
    subtitle: "Spesialist",
    expertise: ["Gynekologi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/a3151648ebd28edb73e32804a332941f8ffd50df-3024x4032.jpg?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "alenka-bindas",
    bio: "Alenka Bindas er spesialist i gynekologi. Hun har lang og bred erfaring i utredning, behandling og oppfølging av alle typer kvinnesykdommer. På grunn av hennes gode renommé og faglige dyktighet har Alenka pasienter fra hele Innlandet og andre deler av landet. Hun bruker god tid ved alle undersøkelser, og det er satt av 30 minutters konsultasjon til alle pasienter.",
    clinics: ["Moelv"]
  },
  {
    name: "Anamika Choudhury",
    title: "Embryolog",
    subtitle: "Fertilitet",
    expertise: ["Fertilitet", "Embryologi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/5319d76ea46e90e838bf99a6aac8e5e4cce2b5bb-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "fertilitet",
    slug: "anamika-choudhury",
    bio: "Anamika jobber på fertilitetsteamet og har over 12 års internasjonal erfaring innen reproduksjonsmedisin, og er en ledende spesialist innen sitt felt. Etter å ha fullført sin utdannelse ved University College London, startet hun sin karriere med UZ Brussel-teamet i Kuwait, før hun flyttet til Kobe, Japan. Hun flyttet til Oslo i 2017 og arbeidet ved Rikshospitalet i flere år. Hos CMedical Fertilitet har hun brukt sin ekspertise til å bygge et toppmoderne laboratorium for å kunne tilby personlige fertilitetsløsninger av høyeste kvalitet.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Andreas Edenberg",
    title: "Gastrokirurg",
    subtitle: "Spesialist",
    expertise: ["Gastrokirurgi", "Overvektskirurgi", "Endoskopi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/666d77ac644d211010521a594fa745deb4d91dc3-3456x4608.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "andreas-edenberg",
    bio: "Dr. Andreas Edenberg er spesialist i generell kirurgi og gastroenterologisk kirurgi, med europeisk spesialistgodkjenning i traumekirurgi. Han har spesialisert seg på avansert endoskopi og fedmebehandling og utfører årlig over 2000 endoskopiske undersøkelser. Andreas er en del av CMedical sitt tverrfaglige team som tilbyr robotassistert overvektskirurgi. Hans omfattende erfaring og faglige engasjement gjør ham til en ledende aktør innen sitt felt.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Ane Gerda Z Eriksson",
    title: "Gynekolog",
    subtitle: "Robotkirurg",
    expertise: ["Gynekologi", "Robotkirurgi", "Gynekologisk kreftbehandling"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/1fcb49627206bb29534bdd3d0b3958478c8f3638-500x500.webp?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "ane-gerda-z-eriksson",
    bio: "Dr. Eriksson er en erfaren gynekolog med subspesialisering innen gynekologisk kreftbehandling fra Memorial Sloan Kettering Cancer Center i USA.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Are Haukåen Stødle",
    title: "Ortoped",
    subtitle: "Kirurg",
    expertise: ["Ortopedi", "Fot- og ankelkirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/83e5a00ba81e6b854a3f5d97d59d74d16a566332-2913x3884.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "are-haukaen-stodle",
    bio: "Dr. Haukåen Stødle er ortoped og spesialist i fot- og ankelkirurgi. Han var ferdig utdannet spesialist i 2014 og har lang erfaring fra ortopedisk avdeling ved Oslo Universitetssykehus. Are har doktorgrad på lisfranc-skader i foten, og har publisert en rekke forskningsartikler på tematikken. I tillegg underviser han på nasjonale kurs i ortopedi, fot- og ankelkirurgi.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Ashi Ahmad",
    title: "Gynekolog",
    subtitle: "Fødselshjelp",
    expertise: ["Gynekologi", "Fødselshjelp", "Fostermedisin", "Ultralyd", "NIPT"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/01df2957ef4d8b6b4b60e580159dec9d3eede6c7-1708x1708.webp?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "ashi-ahmad",
    bio: "Dr. Ashi Ahmad er spesialist i fødselshjelp og gynekologi og fostermedisiner. Hun har en spesiell interesse for oppfølging av gravide kvinner og tilbyr tidlig ultralyd, organrettet ultralyd og NIPT. Dr. Ahmad jobber som overlege ved fødeavdelingen og fostermedisinsk avdeling ved OUS Rikshospitalet og har over 15 års erfaring. Hun har en doktorgrad i fødselshjelp og gynekologi.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Audun Høegh Tangerud",
    title: "Ortoped",
    subtitle: "Kirurg",
    expertise: ["Ortopedi", "Hånd- og fotkirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/dd5b402c271b624003d54a0b248568365701cf05-3024x4032.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "audun-hoegh-tangerud",
    bio: "Dr. Audun Høegh Tangerud er en erfaren ortopedisk kirurg med spesialisering innen hånd- og fotkirurgi. Han har omfattende erfaring med både planlagte og akutte operasjoner, og jobber også som overlege ved hånd- og albueseksjonen på Ullevål universitetssykehus. Gjennom sin karriere har han opparbeidet bred erfaring fra Ringerike sykehus og Rikshospitalet.",
    clinics: ["Moelv"]
  },
  {
    name: "Birgir Gudbrandsson",
    title: "Revmatolog",
    subtitle: "Vaskulitt",
    expertise: ["Revmatologi", "Vaskulitt"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/5e74349054bfb25be6c27a43f2ea344d36cea5b4-3456x4608.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "birgir-gudbrandsson",
    bio: "Fra 2017 har Birgir vært en viktig del av Revmatologisk avdeling ved Oslo Universitetssykehus Rikshospitalet. Han har vært foreleser i revmatologi ved Universitetet i Oslo og fullførte sitt doktorgradsarbeid ved UiO i 2017, med spesialisering på vaskulitt. Hans omfattende kunnskap innen endokrinologi, kardiologi, hematologi, nyre, lunge, gastroenterologi, geriatri og revmatologi gjør ham i stand til å tilby helhetlig omsorg.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Birgitte Aspenes",
    title: "Gynekolog",
    subtitle: "Kirurg",
    expertise: ["Gynekologi", "Kirurgi", "Overgangsalder", "Urogynekologi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/6c99c042744c2cc6ae8ae64cc17f37507d7cd314-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "birgitte-aspenes",
    bio: "Dr. Birgitte Aspenes er utdannet lege ved Universitetet i Oslo. Hun spesialiserte seg i fødselshjelp og kvinnesykdommer ved Bærum Sykehus, hvor hun har jobbet som overlege. Hun har lang erfaring med alle gynekologiske problemstillinger, som prevensjonsveiledning, celleforandringer, blødningsforstyrrelser, overgangsalder, PMS/PMDD, PCOS og urinlekkasje. Hun er medlem av Bayers nordiske menopause råd, og har særlig kompetanse innen overgangsalderen.",
    clinics: ["Bekkestua"]
  },
  {
    name: "Birgitte Mitlid-Mork",
    title: "Fertilitetslege",
    subtitle: "Gynekolog",
    expertise: ["Fertilitet", "IVF", "Gynekologi", "Hormonforstyrrelser"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/cf1f648a73cce3c107023879241d17e4d733d45c-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "fertilitet",
    slug: "birgitte-mitlid-mork",
    bio: "Birgitte er spesialist i fødselshjelp og kvinnesykdommer og har jobbet ved OUS i over 10 år med reproduksjonsmedisin, gynekologi, fødselshjelp og fostermedisin. Hun har doktorgrad innen morkakefunksjon. Jobbet frem til nylig som overlege ved Reproduksjonsmedisinsk avdeling ved Rikshospitalet. Birgitte har utstrakt innsikt innen infertilitet, hormonforstyrrelser som tidlig ovarialsvikt og overgangsalder.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Bjørn Brennhovd",
    title: "Urolog",
    subtitle: "Kirurg",
    expertise: ["Urologi", "Robotkirurgi", "Prostatakreft"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/4a8cb1c0569d65e2a67d4074be83ae4c6dae0b80-4777x5995.jpg?q=75&fit=clip&auto=format&w=800",
    category: "urologi",
    slug: "bjorn-brennhovd",
    bio: "Bjørn Brennhovd introduserte robotassistert kirurgi i Norge i 2004, etter å ha ledet teamet for alle urologiske kreftoperasjoner ved Radiumhospitalet i mange år. Han har utført 100–150 inngrep årlig og har hatt ledelsen for all urologisk robotkirurgi ved Oslo universitetssykehus siden 2014. Bjørn er nasjonal hovedutprøver i en stor skandinavisk multisenterstudie om behandling av høyrisiko prostatakreft.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Bjørn Robstad",
    title: "Ortoped",
    subtitle: "Kirurg",
    expertise: ["Ortopedi", "Protesekirurgi", "Traumatologi", "Fotkirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/e797e0691fd6f747689a87603cf7ec499366f067-4284x5712.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "bjorn-robstad",
    bio: "Bjørn Robstad har omfattende erfaring innen ortopedisk kirurgi siden 2005. Han har tidligere jobbet ved OUS Ullevål, og de siste 14 årene som overlege ved Gjøvik sykehus. Hans ekspertise omfatter avansert protesekirurgi, traumatologi og fotkirurgi. Ved CMedical i Moelv utfører han operasjoner under lokalbedøvelse, inkludert Hallux Valgus, hammertåoperasjoner og karpaltunnelsyndrom.",
    clinics: ["Moelv"]
  },
  {
    name: "Einar Andre Brevik",
    title: "Karkirurg",
    subtitle: "Spesialist",
    expertise: ["Karkirurgi", "Åreknuter"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/c42b59a96fd92557474849b3a47239e61a29f3f7-3024x4032.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "einar-andre-brevik",
    bio: "Dr. Brevik er en av Norges mest erfarne kar- og åreknutekirurger. Han tilbyr fullverdig karkirurgisk vurdering og utredning for åreknuter, venøs insuffisiens, claudicatio, Raynauds syndrom og aortaaneurismer. Totalt har Dr. Brevik operert over 2000 pasienter med åreknuter med moderne og skånsomme metoder. Han arbeider også som karkirurg ved Haukeland universitetssykehus.",
    clinics: ["Moelv", "Majorstuen"]
  },
  {
    name: "Endre Søreide",
    title: "Ortoped",
    subtitle: "Kirurg",
    expertise: ["Ortopedi", "Hånd- og albuekirurgi", "Artroskopisk kirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/fcea32079226ebd5b6d1b3dd7634ecf8fc71f729-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "endre-soreide",
    bio: "Dr. Endre Søreide er hånd- og albuekirurg. Han har jobbet mange år ved seksjon for hånd- og albuekirurgi på Oslo Universitetssykehus. Han utfører avansert hånd- og albuekirurgi, inkludert artroskopisk kirurgi. Endre har en ph.d. og betydelig forskningserfaring, med forskningsopphold ved Mayo Clinic i USA. Han er også kursleder i kirurgisk teknikk.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Erik Berg",
    title: "Plastikkirurg",
    subtitle: "Spesialist",
    expertise: ["Plastikkirurgi", "Rekonstruksjonskirurgi", "Kosmetisk kirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/9c644ad36d98d826254b12422244a33c00a8241c-3335x4455.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "erik-berg",
    bio: "Overlege PhD Erik Berg er spesialist i plastikkirurgi fra Haukeland Universitetssykehus og har over 20 års erfaring. Han utfører bryst-, kropps- og ansiktskirurgi. Han har lang erfaring med rekonstruksjon etter hudkreft, brystkreft og medfødte misdannelser. Hans doktorgrad innen leppe-, kjeve-, ganespalte ble publisert i JAMA Pediatrics.",
    clinics: ["Moss"]
  },
  {
    name: "Ersan Krckov",
    title: "Endokrinolog",
    subtitle: "Spesialist",
    expertise: ["Endokrinologi", "Stoffskifte", "Diabetes", "Hormonsykdommer"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/29c9bff7f685982357812f82966e32d78bb3e0ef-4841x6516.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "ersan-krckov",
    bio: "Dr. Ersan Krckov er spesialist i indremedisin og endokrinologi, med bred erfaring innen utredning og behandling av hormonsykdommer. Han vurderer pasienter med diabetes type 1 og 2, stoffskiftesykdommer, sykdommer i binyrer, hypofyse og biskjoldkjertler, samt testikkelsvikt og hormonbehandling ved overgangsalder. Han har jobbet ved Sykehuset i Drammen, Oslo universitetssykehus og Akershus universitetssykehus.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Gilbert Moatshe",
    title: "Ortoped",
    subtitle: "Knekirurg",
    expertise: ["Ortopedi", "Knekirurgi", "Skulderkirurgi", "Idrettsskader"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/41e7398c5eeda540e48d4f364fed3840b0af3801-1000x899.webp?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "gilbert-moatshe",
    bio: "Dr. Gilbert Moatshe er spesialist i ortopedisk kirurgi ved OUS Ullevål. Han har spesialisert seg innen artroskopisk kirurgi og idrettsskader, med særlig ekspertise på knekirurgi (korsbånd og kneliggamentskader) samt skulderkirurgi. Han har internasjonal erfaring fra USA og Canada og har publisert over 100 vitenskapelige forskningsartikler. Hans forskningsgruppe har mottatt flere internasjonale priser fra AOSSM, AAOS og ISAKOS.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Gunnar Dalén",
    title: "Karkirurg",
    subtitle: "Spesialist",
    expertise: ["Karkirurgi", "Åreknuter", "Venebehandling"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/cb02b7b95369faddcc4bc12d6acee7e82161099c-3067x4090.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "gunnar-dalen",
    bio: "Gunnar Dalén er spesialist i karkirurgi med lang erfaring i behandling av venøse sykdommer som åreknuter og sirkulasjonsplager i bena. Han bruker moderne metoder som radiofrekvensablasjon, flebektomi og sklerosering. Ved siden av CMedical arbeider han som karkirurg ved Ullevål sykehus.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Hannah Russell",
    title: "Fertilitetslege",
    subtitle: "Gynekolog",
    expertise: ["Fertilitet", "Gynekologi", "POI"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/d12168d8222dc136da3687aad816b378b7562bcc-4678x5847.jpg?q=75&fit=clip&auto=format&w=800",
    category: "fertilitet",
    slug: "hannah-russell",
    bio: "Hannah Russell er spesialist i gynekologi og obstetrikk, med over 20 års erfaring. Hun har vært en del av CMedical siden Livio Oslo ble en del av klinikkfamilien i 2025. Hun har et særlig engasjement for prematur ovarial insuffisiens (POI) og har bidratt i nasjonal veileder for Norsk Gynekologisk Forening. Hannah er medisinsk rådgiver i komiteen for ESHRE-sertifisering for sykepleiere.",
    languages: ["Norsk", "Engelsk"],
    clinics: ["Majorstuen"]
  },
  {
    name: "Henrik Michelsen-Wahl",
    title: "Gynekolog",
    subtitle: "Kirurg",
    expertise: ["Gynekologi", "Endometriose", "Gynekologisk kirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/e776569edfa20ca65eec76dd2d612871ef3e3fd2-2507x2841.jpg?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "henrik-michelsen-wahl",
    bio: "Henrik Michelsen-Wahl er gynekolog med bred erfaring og sterkt engasjement for kvinnehelse. Han har særlig kompetanse innen gynekologisk kirurgi og endometriose. Ved siden av CMedical er han overlege ved Ullevål sykehus. Han er medlem av Nasjonal kompetansetjeneste for endometriose og adenomyose (NKTEA), leder for Oslo gynekologiske forening og styremedlem i NSGE.",
    languages: ["Norsk", "Engelsk", "Tysk"],
    clinics: ["Ski"]
  },
  {
    name: "Ida Waagsbø Bjørntvedt",
    title: "Fertilitetslege",
    subtitle: "Gynekolog",
    expertise: ["Fertilitet", "IVF", "Vulvaklinikk", "POI"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/20070bd7ecdae3247b1d1e75b1b2ea0387f4227b-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "fertilitet",
    slug: "ida-waagsbo-bjorntvedt",
    bio: "Dr. Bjørntvedt er gynekolog med subspesialisering innen infertilitet. Hun har lang erfaring som overlege ved fertilitetsavdelingen på Rikshospitalet. Hun er leder for vulvaforum og har ansvar for vulvaklinikken til CMedical. Ida jobber med kvinner med eggstokksvikt før 40 år (POI), tidlig overgangsalder og andre hormonforstyrrelser. Vulvaklinikken består av et unikt multidisiplinært team.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Ingvild Skarpås Aannerud",
    title: "Osteopat",
    subtitle: "Vulvaklinikk",
    expertise: ["Osteopati", "Bekkenbunnshelse", "Kvinnehelse"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/eb8692dd9b59e91d8b949797f64fe703c0a4f301-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "ingvild-skarpas-aannerud",
    bio: "Ingvild er autorisert osteopat med over ti års erfaring innen plager som oppstår gjennom ulike faser av en kvinnes livsløp. Hun er ammeveileder og har sterkt engasjement for gravide og barselkvinner, samt kvinner og menn som opplever underlivsplager. Hun har spesialisert kompetanse innen oppfølging etter robotkirurgi, med veiledet fysikalsk rehabilitering.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Istvan Zoltan Rigo",
    title: "Ortoped",
    subtitle: "Håndkirurg",
    expertise: ["Ortopedi", "Håndkirurgi", "Artroskopi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/a60a981cf98c01c968b4eefb929cae6854c4a20e-2834x3778.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "istvan-zoltan-rigo",
    bio: "Istvan Zoltan Rigo er spesialist i ortopedisk kirurgi med Europeisk Diplom i Håndkirurgi (FESSH). Han har jobbet på Rikshospitalet og er overlege ved Sykehuset Østfold. Han har bred erfaring med håndkirurgi, inkludert leddbåndskader, artroskopi og protesekirurgi. Han har doktorgrad om bøyeseneskader i hånd.",
    clinics: ["Moss"]
  },
  {
    name: "Jackson Tok",
    title: "Fertilitetslege",
    subtitle: "Gynekolog",
    expertise: ["Fertilitet", "IVF", "Mannlig infertilitet", "Mikro-TESE"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/03198988e5d455825994d2e476b6180ed986b00b-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "fertilitet",
    slug: "jackson-tok",
    bio: "Jackson Tok er spesialist i gynekologi med subspesialisering innen ufrivillig kvinnelig og mannlig infertilitet. Han ledet etableringen av fertilitetsklinikken og er leder for CMedical Fertilitet Majorstuen. Han har sertifisering i mikrodisseksjon-TESE ved Weill Cornell Medicine i New York. I tillegg til infertilitet har Jackson god erfaring innen PCOS og menopause.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Jan Roland Lambrecht",
    title: "Gastrokirurg",
    subtitle: "Spesialist",
    expertise: ["Gastrokirurgi", "Overvektskirurgi", "Robotkirurgi", "Brokkkirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/13b963ab7b3dfeeabc25a640391ab33ee699d3d3-2894x3858.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "jan-roland-lambrecht",
    bio: "Dr. Jan Lambrecht er spesialist i gastrokirurgi, robotassistert kirurgi og generell kirurgi, med doktorgrad fra Universitetet i Oslo og over 25 års klinisk erfaring. Han er fagansvarlig gastrokirurg hos CMedical, med hovedansvar for robotassistert behandling av pasienter med alvorlig overvekt. Han er en anerkjent ekspert innen overvektskirurgi, brokk- og bukveggskirurgi, tarmkirurgi og robotkirurgi.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Jan-Ragnar Haugstvedt",
    title: "Ortoped",
    subtitle: "Håndkirurg",
    expertise: ["Ortopedi", "Håndkirurgi", "Artroskopisk håndkirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/39b7bf79e4cc79414387e55f935ad558c4166c9e-5464x8192.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "jan-ragnar-haugstvedt",
    bio: "Jan Ragnar Haugstvedt er en erfaren håndkirurg med flere års tjeneste ved Rikshospitalet, som har landsdekkende ansvar for håndkirurgi. Han spesialiserer seg i artroskopisk håndkirurgi og har bidratt med flere titalls publikasjoner i internasjonale tidsskrifter. Hans kompetanse dekker hele spekteret av håndkirurgi.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Jeanette Follestad",
    title: "Sykepleier",
    subtitle: "Fertilitet",
    expertise: ["Sykepleie", "Fertilitet"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/e3ee319fd6202d29b6ea6c9b3cde9a022ae6ea71-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "jeanette-follestad",
    bio: "Jeanette jobber som fertilitetssykepleier ved CMedical. Hun har tidligere erfaring fra hjertemedisinske avdelinger og Olafia og Vulvapoliklinikken. Jeanette har over ti års erfaring som sykepleier og brenner for kvinnehelse med en særlig forståelse for den emosjonelle og fysiske belastningen fertilitetsbehandling kan medføre.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Jonas Rydinge",
    title: "Ortoped",
    subtitle: "Spesialist",
    expertise: ["Ortopedi", "Fot- og ankelkirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/bd204a1f213646b2b48dd512d0582684a7f67985-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "jonas-rydinge",
    bio: "Spesialist i ortopedisk kirurgi og overlege ved fot- og ankelseksjonen på Ullevål sykehus. Dr. Jonas spesialiserer seg på behandling av pasienter som opplever smerter, feilstillinger eller instabilitet i foten og ankelen. Har omfattende erfaring med ettervirkninger etter leddbåndsskader, bruskproblemer og bruddskader.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Jørgen Perminow",
    title: "Gynekolog",
    subtitle: "Spesialist",
    expertise: ["Gynekologi", "Obstetrikk"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/8d2d22cce4d07a41bfca993d7663c29153ad4a09-3692x4937.jpg?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "jorgen-perminow",
    bio: "Dr. Jørgen Perminow har omfattende erfaring fra Ahus og Ullevål Sykehus. Han er spesialist i gynekologi og obstetrikk, og overlege ved Kvinneklinikken på Ahus. Dr. Perminow snakker flytende norsk og engelsk, og snakker også noe polsk. Han er dypt engasjert i kvinnehelse.",
    languages: ["Norsk", "Engelsk", "Polsk"],
    clinics: ["Majorstuen"]
  },
  {
    name: "Kjersti Brenden",
    title: "Fertilitetslege",
    subtitle: "Gynekolog",
    expertise: ["Fertilitet", "IVF", "Gynekologi", "Eggdonasjon"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/59e08f41f5621da655b0ca6a9e5ea5dc85b7b232-4486x5608.jpg?q=75&fit=clip&auto=format&w=800",
    category: "fertilitet",
    slug: "kjersti-brenden",
    bio: "Kjersti Brenden er spesialist i gynekologi og obstetrikk med over 20 års erfaring. Hun har vært en del av fertilitetsteamet ved Livio – Norges eldste fertilitetsklinikk – siden 2012. Livio ble i 2025 en del av CMedical. Hun har spisskompetanse innen fertilitetsbehandling og har vært engasjert i eggdonasjonsbehandling. Hun har sittet i styret i NOFAB.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Kjersti Margrete Finsrud",
    title: "Sexolog",
    subtitle: "Spesialist",
    expertise: ["Sexologi", "Seksuell helse", "Vulvasmerter", "Prevensjon"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/3c81b0d9cf9a540bafd3691dab54610675cf11ef-4386x4441.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "kjersti-margrete-finsrud",
    bio: "Kjersti er sykepleier med videreutdanning som helsesykepleier, og spesialist i sexologisk rådgivning gjennom NACS. Hun tar imot enkeltpersoner og par i alle aldre. Hun har kompetanse innen vulvasmerter, vaginisme, seksuell identitet, erektil dysfunksjon og hormonelle endringer. Hun tilbyr også prevensjonsveiledning og er godkjent vaksinatør.",
    clinics: ["Majorstuen", "Ski"]
  },
  {
    name: "Kristian Marstrand Warholm",
    title: "Ortoped",
    subtitle: "Kirurg",
    expertise: ["Ortopedi", "Hoftekirurgi", "Knekirurgi", "Skulderkirurgi", "Idrettsmedisin"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/a62cd813c7aef36624deec5175215ae285d1739a-2172x2896.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "kristian-marstrand-warholm",
    bio: "Kristian Marstrand Warholm er overlege ved OUS Ullevål, skopi-seksjonen, og konsulent for Idrettens Helsesenter. Han fullførte sin spesialisering i 2020 og har opparbeidet omfattende erfaring innen kikkhullsoperasjoner, med fokus på hoften. Han driver aktiv forskning for å videreutvikle feltet.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Kristian Ophaug",
    title: "Fertilitetscoach",
    subtitle: "Familieterapeut",
    expertise: ["Fertilitet", "Familieterapi", "Fertilitetsrådgivning"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/d0282fd492dede8a360bf167c04ac7aaee66e550-1976x2636.jpg?q=75&fit=clip&auto=format&w=800",
    category: "fertilitet",
    slug: "kristian-ophaug",
    bio: "Kristian Ophaug har over 20 års erfaring som terapeut i spesialisthelsetjenesten. Han er utdannet klinisk sosionom og familieterapeut, og spesialiserer seg innen psykisk helse i svangerskap og barsel. Siden 2018 har han jobbet med par som opplever ufrivillig barnløshet. Som Norges eneste mannlige fertilitetsrådgiver gir han støtte til ufrivillig barnløse menn.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Lars Eldar Myrseth",
    title: "Ortoped",
    subtitle: "Kirurg",
    expertise: ["Ortopedi", "Håndkirurgi", "Nerveskader"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/c9e553a9800ef6bcd1fbf7640d724376147d6435-480x480.webp?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "lars-eldar-myrseth",
    bio: "Lars Eldar Myrseth har flere års erfaring fra Rikshospitalet, som har landsdekkende ansvar for håndkirurgi og håndterer plexus nerveskader. Lars har omfattende erfaring innen behandling av nerveskader og håndkirurgi.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Lars Fredrik Qvigstad",
    title: "Urolog",
    subtitle: "Kirurg",
    expertise: ["Urologi", "Prostatakreft"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/1b428c8e2f9fb394f37c87411e764741226fdad6-2962x3950.jpg?q=75&fit=clip&auto=format&w=800",
    category: "urologi",
    slug: "lars-fredrik-qvigstad",
    bio: "Lars er urolog og generell kirurg og jobber til daglig på Radiumhospitalet som overlege. Han er knyttet til forskningsgruppen for prostatakreft og er doktorgradskandidat ved Universitetet i Oslo. Til daglig har Lars urologisk poliklinikk og opererer det meste innenfor urologi på Radiumhospitalet.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Line Fusdahl Hulleberg",
    title: "Sykepleier",
    subtitle: "Fertilitet",
    expertise: ["Sykepleie", "Fertilitet", "Inseminasjon"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/04931cf419bd35a877804638d2751a4a38d43dfc-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "line-fusdahl-hulleberg",
    bio: "Line Fusdahl Hulleberg har vært sykepleier siden 2008. Siden 2017 har hun jobbet med assistert befruktning. Hun er teamleder for fertilitetsteamet og var en av de første sykepleierne i Norge som startet med inseminasjonsbehandling. Med et sterkt engasjement for fertilitetsbehandling har Line fokus på å støtte pasientene gjennom hele prosessen.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Line Jacob",
    title: "Gynekolog",
    subtitle: "Spesialist",
    expertise: ["Gynekologi", "Reproduksjonsmedisin", "Overgangsalder"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/7fc1cd7d279f3512676854e1ee28b097fdf6a646-4828x5855.jpg?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "line-jacob",
    bio: "Dr. Line Jacob er utdannet lege fra Universitetet i Oslo, med erfaring fra gynekologisk avdeling ved Bærum sykehus og Rikshospitalet innen reproduksjonsmedisin og infertilitet. Hun forsker nå på sammenhengen mellom overgangsplager og risiko for demens. Line er opptatt av at det skal føles trygt og godt å komme til gynekolog.",
    clinics: ["Bekkestua"]
  },
  {
    name: "Linn Myrtveit-Stensrud",
    title: "Psykolog, PhD",
    subtitle: "Spesialist",
    expertise: ["Psykologi", "Kvinnehelse", "Vulvodyni", "Vaginisme"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/283e2bb6b705efd95e53634444264df52a336ff1-4631x5618.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "linn-myrtveit-stensrud",
    bio: "Linn er utdannet psykolog fra UiO med doktorgrad fra OsloMet, med forskning på hvordan vulvodyni påvirker den enkelte og parforholdet. Hun har spesialisert seg på kvinnehelse og har bred kompetanse innen hormonelle utfordringer som PMDD, samt psykiske belastninger knyttet til fertilitet, graviditet, abort og fødsel.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Linnea Torsnes",
    title: "Hudlege",
    subtitle: "Spesialist",
    expertise: ["Hudhelse", "Dermatologi", "Hudkreft", "Laserbehandling"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/f589f05d41e79fc1f931cc6ebcb27541ffff5ae8-2813x3751.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "linnea-torsnes",
    bio: "Dr. Linnea Torsnes er spesialist i hud- og veneriske sykdommer, med utdannelse fra Danmark og Rikshospitalet. Hun har tidligere jobbet som overlege ved hudavdelingen på Rikshospitalet. Hun behandler hudkreft, psoriasis, eksem, vorter, rosacea, akne og utfører føflekksjekker, laserbehandling og fotodynamisk terapi.",
    clinics: ["Bekkestua"]
  },
  {
    name: "Madeleine Engen",
    title: "Gynekolog",
    subtitle: "Kirurg",
    expertise: ["Gynekologi", "Urogynekologi", "Bekkenbunnshelse"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/deacf4d53cd4b9684c5332ca3bbc9f9f47f37c7d-5464x8192.jpg?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "madeleine-engen",
    bio: "Dr. Engen er spesialist innen gynekologi med ekspertise innen urogynekologi – urinlekkasje og vaginale fremfall. Hun er fagansvarlig for gynekologi og grunnlegger av CMedical Kvinnehelse. Hun har forskningserfaring innen urinlekkasje og har presentert på internasjonale kongresser. Dr. Engen er en tydelig stemme for kvinnehelse i media og på internasjonale arenaer.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Marc Jacob Strauss",
    title: "Ortoped",
    subtitle: "Spesialist",
    expertise: ["Ortopedi", "Knekirurgi", "Idrettsmedisin", "Korsbåndkirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/01d4a38fee3b35e3d8715146ebb2715360360c13-4987x6318.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "marc-jacob-strauss",
    bio: "Dr. Marc Jacob Strauss er spesialist i ortopedisk kirurgi og sertifisert idrettslege gjennom IOC. Han har bred erfaring innen avansert knekirurgi med særlig kompetanse på idrettsrelaterte kneskader og korsbåndsskader. Han har vært landslagslege for det norske alpinlandslaget siden 2014. Marc er i siste fase av sin doktorgrad innen korsbåndskirurgi.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Mari Borge Eskerud",
    title: "Ernæringsfysiolog",
    subtitle: "Spesialist",
    expertise: ["Ernæring", "IBS", "LavFODMAP", "PCOS"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/f52b2366d588c373afc3086d42521c7db274e7b5-1125x1500.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "mari-borge-eskerud",
    bio: "Mari Borge Eskerud er klinisk ernæringsfysiolog med spesialisering innen IBS og lavFODMAP-dietten. Hun er sertifisert av Monash University og har også kompetanse innen ernæring relatert til fertilitet, overgangsalder, PCOS og graviditet. Mari er medforfatter av boken «Sunn og frisk med sensitiv mage».",
    clinics: ["Majorstuen"]
  },
  {
    name: "Maria Thompson Clausen",
    title: "Ernæringsfysiolog",
    subtitle: "Spesialist",
    expertise: ["Ernæring", "Livsstilsveiledning", "IBS", "Spiseforstyrrelser"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/efbfd34ced9d5b50d9ade9e967a564c77a5ef267-2259x3011.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "maria-thompson-clausen",
    bio: "Maria Thompson Clausen er utdannet klinisk ernæringsfysiolog fra UiO, med spesialisering i bulimi og overspisingslidelse. Hun har bred erfaring med livsstilsendringer, overvekt, fedme, spiseforstyrrelser, IBS, PCOS, diabetes type 2 og kosthold tilpasset overgangsalder. Hun brenner for bærekraftige, sunne valg tilpasset den enkelte.",
    clinics: ["Bekkestua"]
  },
  {
    name: "Marian Bale",
    title: "Gastrokirurg",
    subtitle: "Spesialist",
    expertise: ["Gastrokirurgi", "Brokkbehandling", "Laparoskopi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/02ebe97d4f81cb79ba4c4651ffb29b3a92c12f2d-3024x4032.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "marian-bale",
    bio: "Dr. Marian Bale er overlege og spesialist i generell kirurgi og gastrokirurgi, nå overlege ved Bærum sykehus. Hun er en kapasitet på alle typer brokkbehandling og tilbyr utredning og behandling av endetarmsplager, brokk og diverse kirurgiske prosedyrer. Dr. Bale legger alltid vekt på god dialog med pasienter gjennom hele behandlingsløpet.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Marthe Hagen",
    title: "Psykolog",
    subtitle: "Terapi",
    expertise: ["Psykologi", "Terapi", "Kvinnehelse", "EMDR"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/824463405bde8574679816e3df922c544a41cba1-1242x1225.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "marthe-hagen",
    bio: "Marthe Hagen er psykolog med spesielt fokus på kvinnehelse. Hun tilbyr samtaleterapi for traumer, angst, depresjon, kronisk sykdom og utmattelse. Hun benytter kognitiv og metakognitiv terapi, eksistensielle terapiformer og EMDR. Marthe tilbyr også digitale konsultasjoner.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Morten Andersen",
    title: "Urolog",
    subtitle: "Spesialist",
    expertise: ["Urologi", "Sterilisering", "Forhudsoperasjoner"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/5c86415aea4852e9dc32b2adcd5d07a7d803b8d7-2718x3624.jpg?q=75&fit=clip&auto=format&w=800",
    category: "urologi",
    slug: "morten-andersen",
    bio: "Morten Andersen er spesialist i kirurgi og urologi fra 1993. Tidligere overlege ved Sykehuset Innlandet. Han har lang og bred erfaring innen de fleste urologiske problemstillinger. Utfører steriliseringer, forhudsoperasjoner, operasjoner på penis og refertiliseringer. Utreder og behandler kvinner og menn med urologiske sykdommer.",
    clinics: ["Moelv"]
  },
  {
    name: "Nabeel Yousaf Khan",
    title: "Urolog",
    subtitle: "Spesialist",
    expertise: ["Urologi", "Prostata", "Sterilisering"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/b877a497010793ca02bfa65c3875582a547f5aa0-4760x6305.jpg?q=75&fit=clip&auto=format&w=800",
    category: "urologi",
    slug: "nabeel-yousaf-khan",
    bio: "Nabeel Yousaf Khan er urolog ved Sykehuset Innlandet Hamar. Han har bred erfaring med utredning og behandling av urologiske lidelser. Han har erfaring med kirurgi ved lidelser i pungen, penis, forhud og mannlig sterilisering. Han er doktorgradsstipendiat ved UiO og forsker på kirurgisk behandling av godartet forstørrelse av prostata.",
    clinics: ["Moelv"]
  },
  {
    name: "Nicolai Wessel",
    title: "Urolog",
    subtitle: "Kirurg",
    expertise: ["Urologi", "Robotkirurgi", "Prostatakreft"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/2c6715b31f346a6c263043f098debf3a55216b1d-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "urologi",
    slug: "nicolai-wessel",
    bio: "Nicolai Wessel er en erfaren spesialist innen kirurgi og urologi med spesialkompetanse innen laparoskopiske urologiske prosedyrer. Tidligere overlege ved Aker Sykehus, regnes han blant Europas mest erfarne kirurger innen robotassistert kirurgi. Han begynte med robotkirurgi i 2007 og har utført over 1.400 robotassisterte prostatakreftoperasjoner.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Siri Kløkstad",
    title: "Gynekolog",
    subtitle: "Spesialist",
    expertise: ["Gynekologi", "Vulvaplager", "Hormoner", "Prevensjon"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/1bd1339c6a5061316d3c9be6fa4419254004838f-1708x1708.webp?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "siri-klokstad",
    bio: "Siri Kløkstad er utdannet gynekolog og har jobbet ved sykehuset i Elverum og Oslo Universitetssykehus. Nå jobber hun ved CMedical og resten av tiden ved Sex og samfunn i Oslo. Siri er spesielt interessert i underlivsplager, vulvasmerter, hormoner og prevensjon.",
    clinics: ["Bekkestua"]
  },
  {
    name: "Sondre Hassellund",
    title: "Ortoped",
    subtitle: "Kirurg",
    expertise: ["Ortopedi", "Hånd- og albuekirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/95f64114ea630fa283191d95a5aa4b2b00375618-1772x1299.webp?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "sondre-hassellund",
    bio: "Dr. Sondre Hassellund er hånd- og albuekirurg med mange års erfaring fra hånd- og albueseksjonen på Ullevål universitetssykehus. Han har stor erfaring med akutt og planlagt kirurgi, både åpen og med kikkhullsteknikk. Sondre underviser også på nasjonale kurs for ortopeder.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Sonu Lukose",
    title: "Embryolog",
    subtitle: "Fertilitetsteam",
    expertise: ["Fertilitet", "Embryologi", "IVF"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/a55e7f7e1d9e0fffb688b667a062e9b820ef91b5-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "fertilitet",
    slug: "sonu-lukose",
    bio: "Sonu er en ESHRE-sertifisert Senior Klinisk Embryolog med mer enn et tiår med klinisk erfaring. Han har etablert Guyanas første IVF-laboratorium og er ansvarlig for de første IVF-fødslene i landet. Hans ekspertområder inkluderer oppsett av IVF-laboratorium, testikulær sperm-ICSI, embryo biopsier for PGT og embryovitrifisering.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Stig Hegna",
    title: "Ortoped",
    subtitle: "Kirurg",
    expertise: ["Ortopedi", "Fotkirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/685b3455975cf5b15adbdb91293eecb1974ddccc-3456x4608.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "stig-hegna",
    bio: "Dr. Hegna er spesialist i ortopedisk kirurgi og spesialist i fotkirurgi.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Tea Berge",
    title: "Ortoped",
    subtitle: "Spesialist",
    expertise: ["Ortopedi", "Kne- og skulderkirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/1efa907937d0589d475b4c522fc79e0c663cf19f-3220x4294.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "tea-berge",
    bio: "Tea er spesialist i ortopedisk kirurgi siden 2015. Hun jobber som overlege på Artroskopiseksjonen ved Oslo Universitetssykehus med kne- og skulderkirurgi som spesialfelt. Hun forsker på skulderinstabilitet og har presentert sitt arbeid på internasjonale kongresser.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Thomas Fredrik Thaulow",
    title: "Gynekolog",
    subtitle: "Spesialist",
    expertise: ["Gynekologi", "Endometriose", "Laparoskopi", "Hysteroskopi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/77d01e4f0186b86232b7694b257945b828fb97a6-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "thomas-fredrik-thaulow",
    bio: "Thomas er en av landets fremste spesialister innen endoskopiske operasjoner og utmerker seg som en av de mest kompetente innen komplekse inngrep med laparoskopi og hysteroskopi. Han er en nøkkelperson i det dedikerte endometriose-teamet ved Ullevål sykehus, hvor han diagnostiserer og behandler de mest utfordrende tilfellene fra hele landet.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Tom Henry Sundøen",
    title: "Ortoped",
    subtitle: "Spesialist",
    expertise: ["Ortopedi", "Skopisk kirurgi", "Hoftekirurgi", "Idrettsmedisin"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/5c65653366dd640cd10f917fb0c3ec22a4d9968e-663x996.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "tom-henry-sundoen",
    bio: "Tom Henry Sundøen er ortopedkirurg og traumatolog med særlig kompetanse innen avansert skopisk kirurgi i skulder, albue, håndledd, hofte, knær og ankel. Han utfører skopi i hofteledd som en av få ortopeder i Norge. Ved Colosseum Faust i Moss utfører han avansert ortopedisk dagkirurgi. Han har over 10 års erfaring med PRP-behandling.",
    clinics: ["Moss"]
  },
  {
    name: "Tonje Westlie",
    title: "Fysioterapeut",
    subtitle: "Håndterapeut",
    expertise: ["Fysioterapi", "Håndterapi", "Rehabilitering"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/770aea569eba482b1875c64312eded11786d7a06-2898x3864.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "tonje-westlie",
    bio: "Tonje er utdannet fysioterapeut ved OsloMet i 2011. Hun har jobbet mange år med kompliserte albue- og håndskader ved OUS og skadelegevakten. Hun er styremedlem i Norsk forening for Håndterapi og har bred erfaring med rehabilitering etter brudd, leddbåndsskader og bløtdelsskader i albue og hånd.",
    clinics: ["Majorstuen"]
  },
  {
    name: "Trond Jørgensen",
    title: "Urolog",
    subtitle: "Kirurg",
    expertise: ["Urologi", "Prostatakreft", "Sterilisering"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/4317b077f39c8b5d23a2ca488a4311410cd95544-3614x4468.jpg?q=75&fit=clip&auto=format&w=800",
    category: "urologi",
    slug: "trond-jorgensen",
    bio: "Trond Jørgensen er kirurg og urolog med doktorgrad innen prostatakreft. Tidligere overlege ved Oslo Universitetssykehus, urologisk avdeling. De siste 16 årene har han praktisert som privat urolog, med spesiell ekspertise innen urologisk kirurgi. Hvert år utfører han flere hundre steriliseringer og fimoseoperasjoner.",
    clinics: ["Majorstuen"]
  },
];

// Get specialists sorted alphabetically by first name (A-Å)
export const getSpecialistsSortedByLastName = (): Specialist[] => {
  return [...specialists].sort((a, b) => {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'nb');
  });
};

// Get specialists by category
export const getSpecialistsByCategory = (category: Specialist['category']): Specialist[] => {
  return specialists.filter(s => s.category === category)
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'nb'));
};

// Get all unique clinic names
export const getAllClinics = (): string[] => {
  const clinicSet = new Set<string>();
  specialists.forEach(s => s.clinics?.forEach(c => clinicSet.add(c)));
  return Array.from(clinicSet).sort((a, b) => a.localeCompare(b, 'nb'));
};

// Get specialists by clinic
export const getSpecialistsByClinic = (clinic: string): Specialist[] => {
  return specialists.filter(s => s.clinics?.includes(clinic))
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'nb'));
};
