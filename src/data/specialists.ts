// CMedical Specialists Data
// Based on real specialists from cmedical.no/no/spesialister
// Sorted alphabetically by first name

export interface Specialist {
  name: string;
  title: string;
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
    expertise: ["Gynekologi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/a3151648ebd28edb73e32804a332941f8ffd50df-3024x4032.jpg?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "alenka-bindas",
    bio: "Alenka er en erfaren gynekolog med bred kompetanse innen kvinnehelse. Hun er kjent for sin grundige tilnærming og evne til å skape trygghet hos pasientene.",
    education: "Medisin ved Universitetet i Ljubljana",
    experience: "10+ års erfaring innen gynekologi",
    languages: ["Norsk", "Engelsk", "Slovensk"],
    clinics: ["Oslo", "Sandvika"]
  },
  {
    name: "Anamika Choudhury",
    title: "Embryolog",
    expertise: ["Fertilitet", "Embryologi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/5319d76ea46e90e838bf99a6aac8e5e4cce2b5bb-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "fertilitet",
    slug: "anamika-choudhury",
    bio: "Anamika er en høyt kvalifisert embryolog med spesialkompetanse innen assistert befruktning. Hun arbeider dedikert for å gi par de beste forutsetninger for å lykkes.",
    education: "MSc i klinisk embryologi, Universitetet i Oxford",
    experience: "8+ års erfaring innen IVF-laboratoriet",
    languages: ["Norsk", "Engelsk", "Hindi"],
    clinics: ["Oslo"]
  },
  {
    name: "Andreas Edenberg",
    title: "Gastrokirurg",
    expertise: ["Gastrokirurgi", "Overvektskirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/666d77ac644d211010521a594fa745deb4d91dc3-3456x4608.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "andreas-edenberg",
    bio: "Andreas er spesialist i gastrokirurgi med særlig fokus på overvektskirurgi og avansert laparoskopisk kirurgi.",
    education: "Medisin ved Universitetet i Oslo",
    experience: "15+ års erfaring innen kirurgi",
    languages: ["Norsk", "Engelsk"],
    clinics: ["Oslo", "Drammen"]
  },
  {
    name: "Ane Gerda Z Eriksson",
    title: "Gynekolog",
    expertise: ["Gynekologi", "Robotkirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/1fcb49627206bb29534bdd3d0b3958478c8f3638-500x500.webp?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "ane-gerda-z-eriksson",
    bio: "Ane Gerda er en anerkjent gynekolog med spesialkompetanse innen robotassistert kirurgi. Hun kombinerer teknisk presisjon med en varm og omsorgsfull tilnærming til pasientbehandling.",
    education: "Medisin ved Universitetet i Bergen, spesialisering i gynekologi ved OUS",
    experience: "12+ års erfaring, inkludert 5 år med robotkirurgi",
    languages: ["Norsk", "Engelsk", "Svensk"],
    clinics: ["Oslo", "Bergen"]
  },
  {
    name: "Are Haukåen Stødle",
    title: "Ortoped",
    expertise: ["Ortopedi", "Fot- og ankelkirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/83e5a00ba81e6b854a3f5d97d59d74d16a566332-2913x3884.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "are-haukaen-stodle"
  },
  {
    name: "Ashi Ahmad",
    title: "Gynekolog",
    expertise: ["Gynekologi", "Fødselshjelp", "Fostermedisin"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/01df2957ef4d8b6b4b60e580159dec9d3eede6c7-1708x1708.webp?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "ashi-ahmad"
  },
  {
    name: "Audun Høegh Tangerud",
    title: "Ortoped",
    expertise: ["Ortopedi", "Hånd- og fotkirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/dd5b402c271b624003d54a0b248568365701cf05-3024x4032.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "audun-hoegh-tangerud"
  },
  {
    name: "Birgir Gudbrandsson",
    title: "Revmatolog",
    expertise: ["Revmatologi", "Vaskulitt"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/5e74349054bfb25be6c27a43f2ea344d36cea5b4-3456x4608.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "birgir-gudbrandsson"
  },
  {
    name: "Birgitte Aspenes",
    title: "Gynekolog",
    expertise: ["Gynekologi", "Kirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/6c99c042744c2cc6ae8ae64cc17f37507d7cd314-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "birgitte-aspenes"
  },
  {
    name: "Birgitte Mitlid-Mork",
    title: "Fertilitetslege",
    expertise: ["Fertilitet", "IVF", "Gynekologi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/cf1f648a73cce3c107023879241d17e4d733d45c-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "fertilitet",
    slug: "birgitte-mitlid-mork"
  },
  {
    name: "Bjørn Brennhovd",
    title: "Urolog",
    expertise: ["Urologi", "Robotkirurgi", "Prostatakreft"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/4a8cb1c0569d65e2a67d4074be83ae4c6dae0b80-4777x5995.jpg?q=75&fit=clip&auto=format&w=800",
    category: "urologi",
    slug: "bjorn-brennhovd"
  },
  {
    name: "Bjørn Robstad",
    title: "Ortoped",
    expertise: ["Ortopedi", "Protesekirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/e797e0691fd6f747689a87603cf7ec499366f067-4284x5712.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "bjorn-robstad"
  },
  {
    name: "Einar Andre Brevik",
    title: "Karkirurg",
    expertise: ["Karkirurgi", "Åreknuter"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/c42b59a96fd92557474849b3a47239e61a29f3f7-3024x4032.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "einar-andre-brevik"
  },
  {
    name: "Emily Livesay",
    title: "Gynekolog",
    expertise: ["Gynekologi", "Fertilitet", "Barselomsorg"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/3ac467999c1cef11a9304bc117daea97a54572c6-1058x1400.png?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "emily-livesay"
  },
  {
    name: "Endre Søreide",
    title: "Ortoped",
    expertise: ["Ortopedi", "Hånd- og albuekirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/fcea32079226ebd5b6d1b3dd7634ecf8fc71f729-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "endre-soreide"
  },
  {
    name: "Erik Berg",
    title: "Plastikkirurg",
    expertise: ["Plastikkirurgi", "Rekonstruksjonskirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/9c644ad36d98d826254b12422244a33c00a8241c-3335x4455.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "erik-berg"
  },
  {
    name: "Ersan Krckov",
    title: "Endokrinolog",
    expertise: ["Endokrinologi", "Stoffskifte"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/29c9bff7f685982357812f82966e32d78bb3e0ef-4841x6516.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "ersan-krckov"
  },
  {
    name: "Gilbert Moatshe",
    title: "Ortoped",
    expertise: ["Ortopedi", "Knekirurgi", "Idrettsskader"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/41e7398c5eeda540e48d4f364fed3840b0af3801-1000x899.webp?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "gilbert-moatshe"
  },
  {
    name: "Gunnar Dalén",
    title: "Karkirurg",
    expertise: ["Karkirurgi", "Åreknuter"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/cb02b7b95369faddcc4bc12d6acee7e82161099c-3067x4090.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "gunnar-dalen"
  },
  {
    name: "Hannah Russell",
    title: "Fertilitetslege",
    expertise: ["Fertilitet", "Gynekologi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/d12168d8222dc136da3687aad816b378b7562bcc-4678x5847.jpg?q=75&fit=clip&auto=format&w=800",
    category: "fertilitet",
    slug: "hannah-russell"
  },
  {
    name: "Ida Waagsbø Bjørntvedt",
    title: "Fertilitetslege",
    expertise: ["Fertilitet", "IVF", "Vulvaklinikk"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/20070bd7ecdae3247b1d1e75b1b2ea0387f4227b-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "fertilitet",
    slug: "ida-waagsbo-bjorntvedt"
  },
  {
    name: "Ingvild Skarpås Aannerud",
    title: "Osteopat",
    expertise: ["Osteopati", "Bekkenbunnshelse"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/eb8692dd9b59e91d8b949797f64fe703c0a4f301-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "ingvild-skarpas-aannerud"
  },
  {
    name: "Istvan Zoltan Rigo",
    title: "Ortoped",
    expertise: ["Ortopedi", "Håndkirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/a60a981cf98c01c968b4eefb929cae6854c4a20e-2834x3778.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "istvan-zoltan-rigo"
  },
  {
    name: "Jackson Tok",
    title: "Fertilitetslege",
    expertise: ["Fertilitet", "IVF", "Mannlig infertilitet"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/03198988e5d455825994d2e476b6180ed986b00b-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "fertilitet",
    slug: "jackson-tok"
  },
  {
    name: "Jan-Ragnar Haugstvedt",
    title: "Ortoped",
    expertise: ["Ortopedi", "Håndkirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/39b7bf79e4cc79414387e55f935ad558c4166c9e-5464x8192.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "jan-ragnar-haugstvedt"
  },
  {
    name: "Jeanette Follestad",
    title: "Sykepleier",
    expertise: ["Sykepleie", "Fertilitet"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/e3ee319fd6202d29b6ea6c9b3cde9a022ae6ea71-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "jeanette-follestad"
  },
  {
    name: "Jonas Rydinge",
    title: "Ortoped",
    expertise: ["Ortopedi", "Fot- og ankelkirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/bd204a1f213646b2b48dd512d0582684a7f67985-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "jonas-rydinge"
  },
  {
    name: "Jørgen Perminow",
    title: "Gynekolog",
    expertise: ["Gynekologi", "Obstetrikk"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/8d2d22cce4d07a41bfca993d7663c29153ad4a09-3692x4937.jpg?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "jorgen-perminow"
  },
  {
    name: "Kjersti Brenden",
    title: "Fertilitetslege",
    expertise: ["Fertilitet", "IVF", "Gynekologi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/59e08f41f5621da655b0ca6a9e5ea5dc85b7b232-4486x5608.jpg?q=75&fit=clip&auto=format&w=800",
    category: "fertilitet",
    slug: "kjersti-brenden"
  },
  {
    name: "Kjersti Margrete Finsrud",
    title: "Sexolog",
    expertise: ["Sexologi", "Seksuell helse"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/3c81b0d9cf9a540bafd3691dab54610675cf11ef-4386x4441.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "kjersti-margrete-finsrud"
  },
  {
    name: "Kristian Marstrand Warholm",
    title: "Ortoped",
    expertise: ["Ortopedi", "Hoftekirurgi", "Idrettsmedisin"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/a62cd813c7aef36624deec5175215ae285d1739a-2172x2896.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "kristian-marstrand-warholm"
  },
  {
    name: "Kristian Ophaug",
    title: "Fertilitetscoach",
    expertise: ["Fertilitet", "Familieterapi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/d0282fd492dede8a360bf167c04ac7aaee66e550-1976x2636.jpg?q=75&fit=clip&auto=format&w=800",
    category: "fertilitet",
    slug: "kristian-ophaug"
  },
  {
    name: "Lars Eldar Myrseth",
    title: "Ortoped",
    expertise: ["Ortopedi", "Håndkirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/c9e553a9800ef6bcd1fbf7640d724376147d6435-480x480.webp?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "lars-eldar-myrseth"
  },
  {
    name: "Lars Fredrik Qvigstad",
    title: "Urolog",
    expertise: ["Urologi", "Prostatakreft"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/1b428c8e2f9fb394f37c87411e764741226fdad6-2962x3950.jpg?q=75&fit=clip&auto=format&w=800",
    category: "urologi",
    slug: "lars-fredrik-qvigstad"
  },
  {
    name: "Line Fusdahl Hulleberg",
    title: "Sykepleier",
    expertise: ["Sykepleie", "Fertilitet"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/04931cf419bd35a877804638d2751a4a38d43dfc-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "line-fusdahl-hulleberg"
  },
  {
    name: "Line Jacob",
    title: "Gynekolog",
    expertise: ["Gynekologi", "Reproduksjonsmedisin"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/7fc1cd7d279f3512676854e1ee28b097fdf6a646-4828x5855.jpg?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "line-jacob"
  },
  {
    name: "Linn Myrtveit-Stensrud",
    title: "Psykolog, PhD",
    expertise: ["Psykologi", "Kvinnehelse"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/283e2bb6b705efd95e53634444264df52a336ff1-4631x5618.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "linn-myrtveit-stensrud"
  },
  {
    name: "Linnea Torsnes",
    title: "Hudlege",
    expertise: ["Hudhelse", "Dermatologi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/f589f05d41e79fc1f931cc6ebcb27541ffff5ae8-2813x3751.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "linnea-torsnes"
  },
  {
    name: "Madeleine Engen",
    title: "Gynekolog",
    expertise: ["Gynekologi", "Urogynekologi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/deacf4d53cd4b9684c5332ca3bbc9f9f47f37c7d-5464x8192.jpg?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "madeleine-engen"
  },
  {
    name: "Marc Jacob Strauss",
    title: "Ortoped",
    expertise: ["Ortopedi", "Knekirurgi", "Idrettsmedisin"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/01d4a38fee3b35e3d8715146ebb2715360360c13-4987x6318.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "marc-jacob-strauss"
  },
  {
    name: "Mari Borge Eskerud",
    title: "Ernæringsfysiolog",
    expertise: ["Ernæring", "IBS"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/f52b2366d588c373afc3086d42521c7db274e7b5-1125x1500.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "mari-borge-eskerud"
  },
  {
    name: "Maria Thompson Clausen",
    title: "Ernæringsfysiolog",
    expertise: ["Ernæring", "Livsstilsveiledning"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/efbfd34ced9d5b50d9ade9e967a564c77a5ef267-2259x3011.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "maria-thompson-clausen"
  },
  {
    name: "Marian Bale",
    title: "Gastrokirurg",
    expertise: ["Gastrokirurgi", "Brokkbehandling"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/02ebe97d4f81cb79ba4c4651ffb29b3a92c12f2d-3024x4032.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "marian-bale"
  },
  {
    name: "Marthe Hagen",
    title: "Psykolog",
    expertise: ["Psykologi", "Terapi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/824463405bde8574679816e3df922c544a41cba1-1242x1225.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "marthe-hagen"
  },
  {
    name: "Morten Andersen",
    title: "Urolog",
    expertise: ["Urologi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/5c86415aea4852e9dc32b2adcd5d07a7d803b8d7-2718x3624.jpg?q=75&fit=clip&auto=format&w=800",
    category: "urologi",
    slug: "morten-andersen"
  },
  {
    name: "Nabeel Yousaf Khan",
    title: "Urolog",
    expertise: ["Urologi", "Prostata"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/b877a497010793ca02bfa65c3875582a547f5aa0-4760x6305.jpg?q=75&fit=clip&auto=format&w=800",
    category: "urologi",
    slug: "nabeel-yousaf-khan"
  },
  {
    name: "Nicolai Wessel",
    title: "Urolog",
    expertise: ["Urologi", "Robotkirurgi", "Prostatakreft"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/2c6715b31f346a6c263043f098debf3a55216b1d-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "urologi",
    slug: "nicolai-wessel"
  },
  {
    name: "Siri Kløkstad",
    title: "Gynekolog",
    expertise: ["Gynekologi", "Vulvaplager"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/1bd1339c6a5061316d3c9be6fa4419254004838f-1708x1708.webp?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "siri-klokstad"
  },
  {
    name: "Sondre Hassellund",
    title: "Ortoped",
    expertise: ["Ortopedi", "Hånd- og albuekirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/95f64114ea630fa283191d95a5aa4b2b00375618-1772x1299.webp?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "sondre-hassellund"
  },
  {
    name: "Sonu Lukose",
    title: "Embryolog",
    expertise: ["Fertilitet", "Embryologi", "IVF"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/a55e7f7e1d9e0fffb688b667a062e9b820ef91b5-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "fertilitet",
    slug: "sonu-lukose"
  },
  {
    name: "Stig Hegna",
    title: "Ortoped",
    expertise: ["Ortopedi", "Fotkirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/685b3455975cf5b15adbdb91293eecb1974ddccc-3456x4608.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "stig-hegna"
  },
  {
    name: "Tea Berge",
    title: "Ortoped",
    expertise: ["Ortopedi", "Kne- og skulderkirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/1efa907937d0589d475b4c522fc79e0c663cf19f-3220x4294.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "tea-berge"
  },
  {
    name: "Thomas Fredrik Thaulow",
    title: "Gynekolog",
    expertise: ["Gynekologi", "Endometriose", "Laparoskopi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/77d01e4f0186b86232b7694b257945b828fb97a6-2000x2999.jpg?q=75&fit=clip&auto=format&w=800",
    category: "gynekologi",
    slug: "thomas-fredrik-thaulow"
  },
  {
    name: "Tom Henry Sundøen",
    title: "Ortoped",
    expertise: ["Ortopedi", "Skopisk kirurgi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/5c65653366dd640cd10f917fb0c3ec22a4d9968e-663x996.jpg?q=75&fit=clip&auto=format&w=800",
    category: "ortopedi",
    slug: "tom-henry-sundoen"
  },
  {
    name: "Tonje Westlie",
    title: "Fysioterapeut",
    expertise: ["Fysioterapi", "Håndterapi"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/770aea569eba482b1875c64312eded11786d7a06-2898x3864.jpg?q=75&fit=clip&auto=format&w=800",
    category: "annet",
    slug: "tonje-westlie"
  },
  {
    name: "Trond Jørgensen",
    title: "Urolog",
    expertise: ["Urologi", "Prostatakreft"],
    image: "https://cdn.sanity.io/images/bk8rw7yi/production/4317b077f39c8b5d23a2ca488a4311410cd95544-3614x4468.jpg?q=75&fit=clip&auto=format&w=800",
    category: "urologi",
    slug: "trond-jorgensen"
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
