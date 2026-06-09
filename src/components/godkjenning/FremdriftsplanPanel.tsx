import { Check, Circle, Flag, AlertCircle } from "lucide-react";

type Phase = {
  dates: string;
  title: string;
  owner: "Byrå" | "CMedical" | "Begge";
  description: string;
  deliverables?: string[];
  milestone?: boolean;
  launch?: boolean;
};

const PHASES: Phase[] = [
  {
    dates: "8.–15. juni",
    title: "Gjennomgang av demo-versjonen",
    owner: "CMedical",
    description:
      "CMedical går grundig gjennom designet som er tilsendt på demo-versjonen og bekrefter at tekst, bilder og øvrig innhold er riktig, samt at layout er som ønsket. Resultat: demo-versjonen er «godkjent side» for CMedical.",
    deliverables: [
      "Tekstgjennomgang per side",
      "Bekreftelse på bilder og media (se bildespesifikasjon)",
      "Bekreftelse på layout og struktur",
    ],
  },
  {
    dates: "16. juni",
    title: "Mobilversjon leveres",
    owner: "Byrå",
    description: "Utkast av mobilversjonen leveres for visning og gjennomgang.",
    milestone: true,
  },
  {
    dates: "16.–22. juni",
    title: "Ferdigstille maler + bekrefte mobil",
    owner: "Begge",
    description:
      "Vi ferdigstiller mastermalene og innhenter bekreftelse på disse. Parallelt går CMedical gjennom mobilversjonen og bekrefter den. Begge må være godkjent innen 22. juni.",
    deliverables: ["Godkjente mastermaler", "Godkjent mobilversjon"],
  },
  {
    dates: "23. juni",
    title: "Metodika-integrasjon klar for test",
    owner: "Byrå",
    description:
      "Booking via Metodika er integrert. CMedical kan teste integrasjonen og gi tilbakemelding frem til 1. juli. Forutsetter at tjeneste-mapping per underkategori er levert, slik at riktig Metodika-tjeneste velges automatisk fra hver side.",
    deliverables: [
      "Mottatt tjeneste-mapping fra CMedical (underkategori → Metodika-tjeneste)",
    ],
    milestone: true,
  },
  {
    dates: "23. juni – 1. juli",
    title: "Testperiode Metodika",
    owner: "CMedical",
    description:
      "CMedical tester bookingflyt, bekreftelser, kalender og betaling. Tilbakemeldinger registreres i fanen «Booking».",
  },
  {
    dates: "29. juni",
    title: "Tredjepartsintegrasjoner klare",
    owner: "CMedical",
    description:
      "Goalstar og øvrige tredjeparter er klare for integrering fra denne datoen.",
    milestone: true,
  },
  {
    dates: "2. juli",
    title: "Alt demo-design integrert med Sanity og lagt på server",
    owner: "Byrå",
    description:
      "Hele demo-designet er integrert med Sanity CMS og publisert på CMedicals server klar for betatest.",
    milestone: true,
  },
  {
    dates: "2.–8. juli",
    title: "Betatest og ferdigstilling",
    owner: "Begge",
    description: "CMedical går grundig gjennom hele siden og samler tilbakemeldinger i fanen «Booking» og «Godkjenning». Byrå retter innmeldte feil, kjører QA, ytelse- og SEO-sjekk, og forbereder domene og analyse. Alt skal være klart til lansering innen 8. juli.",
    milestone: true,
  },
  {
    dates: "9. juli",
    title: "Lansering",
    owner: "Begge",
    description: "Siden lanseres på cmedical.no.",
    launch: true,
  },
  {
    dates: "10. juli og utover",
    title: "Sanity V2",
    owner: "Byrå",
    description: "Vi ferdigstiller Sanity V2 — utvidet redaktøropplevelse og nye seksjoner basert på erfaringer fra lansering.",
  },
];

const NEED_FROM_CLIENT: { title: string; items: string[] }[] = [
  {
    title: "Innhold og media (frist 15. juni)",
    items: [
      "Alle bilder etter spesifikasjonene i «CMedial bilde- og mediespesifikasjoner v3» (mappestruktur 01–09, filnavn-konvensjon)",
      "ALT-tekster per bilde i Excel/tekstfil",
      "Endelige tekster per side (eller bekreftelse på eksisterende)",
      "Spesialist-portretter (3:4, min. 1200×1600) + bio per spesialist",
    ],
  },
  {
    title: "Booking og Metodika (frist 22. juni)",
    items: [
      "Tjeneste-mapping per underkategori: for hver underkategori/behandling på siden må dere oppgi hvilken Metodika-tjeneste bookingen skal peke til, slik at riktig tjeneste velges automatisk i bookingflyten (leveres som regneark: side/URL → underkategori → Metodika-tjeneste-ID/navn → varighet → pris)",
      "Bekreftet pris pr. tjeneste (med «fra»-pris der relevant)",
    ],
  },
  {
    title: "Teknisk og juridisk (frist 1. juli)",
    items: [
      "Tilgang til domene cmedical.no (DNS-rettigheter for å peke til ny server)",
      "Google Analytics / Tag Manager-konto",
      "Google Search Console-tilgang",
      "Bekreftet personvernerklæring og cookie-tekst",
      "Bekreftet kontaktinformasjon per klinikk (åpningstider, adresse, telefon)",
      "Konto for nyhetsbrev (Mailchimp/Brevo) dersom det skal kobles",
    ],
  },
  {
    title: "Etter lansering",
    items: [
      "Utpekt redaktør hos CMedical for Sanity-opplæring",
      "Liste over fremtidige sider/artikler som skal opprettes i V2",
    ],
  },
];

const RISKS: { title: string; description: string }[] = [
  {
    title: "Sen levering av bilder/tekst",
    description:
      "Hvis innhold ikke er på plass innen 15. juni, forskyves alt nedstrøms. Maler kan bygges med plassholder, men sidene kan ikke godkjennes uten reelt innhold.",
  },
  {
    title: "Metodika-integrasjon",
    description:
      "Avhengig av tredjepart. Vi anbefaler tidlig dialog og test så snart 23. juni-leveransen er klar.",
  },
  {
    title: "Domene-peking",
      description: "DNS-endring tar opptil 24 timer.",
  },
  {
    title: "GDPR og samtykke",
    description:
      "Før-/etter-bilder og pasienthistorier krever skriftlig samtykke. Må være innhentet før publisering.",
  },
];

const ownerStyle: Record<Phase["owner"], string> = {
  Byrå: "bg-indigo-50 text-indigo-900 border-indigo-200",
  CMedical: "bg-amber-50 text-amber-900 border-amber-200",
  Begge: "bg-emerald-50 text-emerald-900 border-emerald-200",
};

export const FremdriftsplanPanel = () => {
  return (
    <div>
      <div className="mb-8 pb-4 border-b border-border">
        <h2 className="text-xl font-light text-foreground">Fremdriftsplan frem mot lansering 9. juli</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl font-light">
          Tidslinje for samarbeidet mellom byrået og CMedical, med leveranser, milepæler og hva vi trenger fra dere
          underveis.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border bg-indigo-50 text-indigo-900 border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Byrå
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border bg-amber-50 text-amber-900 border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> CMedical
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border bg-emerald-50 text-emerald-900 border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Begge
          </span>
        </div>
      </div>

      {/* Timeline */}
      <ol className="relative border-l border-border ml-3 space-y-8">
        {PHASES.map((p, i) => (
          <li key={i} className="pl-8 relative">
            <span
              className={`absolute -left-[13px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                p.launch
                  ? "bg-foreground text-background border-foreground"
                  : p.milestone
                    ? "bg-background border-foreground text-foreground"
                    : "bg-background border-border text-muted-foreground"
              }`}
            >
              {p.launch ? (
                <Flag className="w-3 h-3" />
              ) : p.milestone ? (
                <Check className="w-3 h-3" />
              ) : (
                <Circle className="w-2 h-2 fill-current" />
              )}
            </span>
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{p.dates}</p>
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${ownerStyle[p.owner]}`}
              >
                {p.owner}
              </span>
            </div>
            <h3 className="text-base font-light text-foreground mt-1">{p.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 font-light leading-relaxed">{p.description}</p>
            {p.deliverables && (
              <ul className="mt-3 space-y-1.5">
                {p.deliverables.map((d, j) => (
                  <li key={j} className="text-sm text-foreground/80 font-light inline-flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 mt-1 text-emerald-600 flex-shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>

      {/* Need from client */}
      <section className="mt-14">
        <h2 className="text-xl font-light text-foreground pb-4 border-b border-border">Det vi trenger fra dere</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {NEED_FROM_CLIENT.map((g) => (
            <div key={g.title} className="border border-border rounded-lg p-5 bg-background">
              <h3 className="text-base font-light text-foreground">{g.title}</h3>
              <ul className="mt-3 space-y-2">
                {g.items.map((it, i) => (
                  <li key={i} className="text-sm text-muted-foreground font-light inline-flex items-start gap-2">
                    <Circle className="w-1.5 h-1.5 mt-2 fill-current flex-shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Risks / things to keep in mind */}
      <section className="mt-14">
        <h2 className="text-xl font-light text-foreground pb-4 border-b border-border">Risiko og ting å ha i bakhodet</h2>
        <ul className="mt-6 space-y-4">
          {RISKS.map((r) => (
            <li key={r.title} className="border border-border rounded-lg p-5 bg-background flex gap-3">
              <AlertCircle className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="text-base font-light text-foreground">{r.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 font-light leading-relaxed">{r.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
