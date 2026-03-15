// Static fallback data for job listings

export interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  excerpt: string;
  deadline?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  applyUrl?: string;
  slug: string;
  publishedAt: string;
  body?: any[];
}

export const employmentTypeLabels: Record<string, string> = {
  fast: "Fast stilling",
  deltid: "Deltid",
  vikar: "Vikar",
  engasjement: "Engasjement",
};

export const departmentLabels: Record<string, string> = {
  gynekologi: "Gynekologi",
  fertilitet: "Fertilitet",
  urologi: "Urologi",
  ortopedi: "Ortopedi",
  hud: "Hud",
  administrasjon: "Administrasjon",
  it: "IT / Teknologi",
  annet: "Annet",
};

export const staticJobListings: JobListing[] = [
  {
    id: "job-1",
    title: "Gynekolog",
    department: "gynekologi",
    location: "Oslo Majorstuen",
    employmentType: "fast",
    excerpt:
      "Vi søker en erfaren gynekolog til vår klinikk på Majorstuen i Oslo. Du vil jobbe i et tverrfaglig team med moderne utstyr og gode arbeidsforhold.",
    deadline: "2026-05-01",
    contactName: "HR-avdelingen",
    contactEmail: "jobb@cmedical.no",
    slug: "gynekolog-oslo",
    publishedAt: "2026-03-01",
  },
  {
    id: "job-2",
    title: "Fertilitetssykepleier",
    department: "fertilitet",
    location: "Bekkestua",
    employmentType: "fast",
    excerpt:
      "Er du sykepleier med interesse for fertilitet? Vi ser etter en engasjert sykepleier til vårt fertilitetsteam på Bekkestua.",
    deadline: "2026-04-15",
    contactName: "HR-avdelingen",
    contactEmail: "jobb@cmedical.no",
    slug: "fertilitetssykepleier-bekkestua",
    publishedAt: "2026-02-20",
  },
  {
    id: "job-3",
    title: "Resepsjonist / Administrativ medarbeider",
    department: "administrasjon",
    location: "Moss",
    employmentType: "deltid",
    excerpt:
      "Vi søker en serviceinnstilt resepsjonist til vår klinikk i Moss. Stillingen er deltid (60%) med mulighet for økt stillingsprosent.",
    contactName: "HR-avdelingen",
    contactEmail: "jobb@cmedical.no",
    slug: "resepsjonist-moss",
    publishedAt: "2026-03-10",
  },
  {
    id: "job-4",
    title: "Urolog",
    department: "urologi",
    location: "Oslo Majorstuen",
    employmentType: "fast",
    excerpt:
      "Vi søker en spesialist i urologi til vårt team. Du vil ha tilgang til robotassistert kirurgi og arbeide med et bredt spekter av urologiske tilstander.",
    deadline: "2026-06-01",
    contactName: "HR-avdelingen",
    contactEmail: "jobb@cmedical.no",
    slug: "urolog-oslo",
    publishedAt: "2026-03-05",
  },
];
