import type { Redirect } from "next/dist/lib/load-custom-routes";

type LegacyRedirect = Redirect;

/** Root-level NO articles that live under the news listing prefix (/aktuelt/). */
const ROOT_ARTICLE_REDIRECTS: LegacyRedirect[] = [
  {
    source: "/no/hvordan-foregar-en-prostataundersokelse",
    destination: "/no/aktuelt/hvordan-foregar-en-prostataundersokelse",
    permanent: true,
  },
  {
    source: "/nb/hvordan-foregar-en-prostataundersokelse",
    destination: "/nb/aktuelt/hvordan-foregar-en-prostataundersokelse",
    permanent: true,
  },
  {
    source: "/no/la-deg-operere-i-norge",
    destination: "/no/aktuelt/la-deg-operere-i-norge",
    permanent: true,
  },
  {
    source: "/nb/la-deg-operere-i-norge",
    destination: "/nb/aktuelt/la-deg-operere-i-norge",
    permanent: true,
  },
  {
    source: "/no/vi-tar-opp-kampen-mot-prostatakreft-med-robotkirurgi",
    destination:
      "/no/aktuelt/vi-tar-opp-kampen-mot-prostatakreft-med-robotkirurgi",
    permanent: true,
  },
  {
    source: "/nb/vi-tar-opp-kampen-mot-prostatakreft-med-robotkirurgi",
    destination:
      "/nb/aktuelt/vi-tar-opp-kampen-mot-prostatakreft-med-robotkirurgi",
    permanent: true,
  },
  {
    source: "/no/operasjonssykepleier-og-anestesisykepleier",
    destination: "/no/aktuelt/operasjonssykepleier-og-anestesisykepleier",
    permanent: true,
  },
  {
    source: "/nb/operasjonssykepleier-og-anestesisykepleier",
    destination: "/nb/aktuelt/operasjonssykepleier-og-anestesisykepleier",
    permanent: true,
  },
  {
    source: "/no/madeleine-engen-tildelt-kvinnehelseprisen-under-her-awards-2026",
    destination:
      "/no/aktuelt/madeleine-engen-vinner-av-kvinnehelseprisen-her-awards-2026",
    permanent: true,
  },
  {
    source: "/nb/madeleine-engen-tildelt-kvinnehelseprisen-under-her-awards-2026",
    destination:
      "/nb/aktuelt/madeleine-engen-vinner-av-kvinnehelseprisen-her-awards-2026",
    permanent: true,
  },
  {
    source: "/no/18-maneder-etter-hofteoperasjon-hos-cmedical-sto-hun-pa-sydpolen",
    destination: "/no/aktuelt/18-maneder-etter-hofteoperasjon-hos-cmedical",
    permanent: true,
  },
  {
    source: "/nb/18-maneder-etter-hofteoperasjon-hos-cmedical-sto-hun-pa-sydpolen",
    destination: "/nb/aktuelt/18-maneder-etter-hofteoperasjon-hos-cmedical",
    permanent: true,
  },
];

/** Removed EN specialist profiles → nearest live colleague (SEO audit Aug 2026). */
const EN_SPECIALIST_REDIRECTS: LegacyRedirect[] = [
  { source: "/en/specialists/stylianos-triantafyllidis", destination: "/en/specialists/marian-bale", permanent: true },
  { source: "/en/specialists/kristina-torn", destination: "/en/specialists/linnea-torsnes", permanent: true },
  { source: "/en/specialists/hashem-amini", destination: "/en/specialists/ashi-ahmad", permanent: true },
  { source: "/en/specialists/marcus-bergman", destination: "/en/specialists/tea-berge", permanent: true },
  { source: "/en/specialists/christina-ertl", destination: "/en/specialists/tea-berge", permanent: true },
  { source: "/en/specialists/birgitta-essen", destination: "/en/specialists/birgitte-aspenes", permanent: true },
  { source: "/en/specialists/cennet-akdeni", destination: "/en/specialists/cennet-akdeniz", permanent: true },
  { source: "/en/specialists/katarina-lindborg-kosanlioglu", destination: "/en/specialists/mari-borge-eskerud", permanent: true },
  { source: "/en/specialists/pia-ekman-zgryzniak", destination: "/en/specialists/mia-kitter", permanent: true },
  { source: "/en/specialists/helene-haesert", destination: "/en/specialists/madeleine-engen", permanent: true },
  { source: "/en/specialists/jan-rapp", destination: "/en/specialists/bjorn-robstad", permanent: true },
  { source: "/en/specialists/riina-aarnio", destination: "/en/specialists/kristian-ophaug", permanent: true },
  { source: "/en/specialists/karina-varasteh", destination: "/en/specialists/marian-bale", permanent: true },
  { source: "/en/specialists/lisa-reppert", destination: "/en/specialists/mia-kitter", permanent: true },
  { source: "/en/specialists/adam-abdulmajeed", destination: "/en/specialists/ashi-ahmad", permanent: true },
  { source: "/en/specialists/malin-karlsson", destination: "/en/specialists/marian-bale", permanent: true },
  { source: "/en/specialists/camilla-melin-da-silva", destination: "/en/specialists/alenka-bindas", permanent: true },
  { source: "/en/specialists/anna-maria-kanold", destination: "/en/specialists/marian-bale", permanent: true },
  { source: "/en/specialists/marie-olsson", destination: "/en/specialists/marthe-hagen", permanent: true },
  { source: "/en/specialists/ida-wikander", destination: "/en/specialists/mia-kitter", permanent: true },
  { source: "/en/specialists/maria-palmqvist", destination: "/en/specialists/marian-bale", permanent: true },
  { source: "/en/specialists/lars-eldar-myrseth", destination: "/en/specialists/gilbert-moatshe", permanent: true },
  { source: "/en/specialists/lisa_alin", destination: "/en/specialists/gunnar-dalen", permanent: true },
  { source: "/en/specialists/irina-genberg", destination: "/en/specialists/tea-berge", permanent: true },
  { source: "/en/specialists/kjersti-brenden", destination: "/en/specialists/bjorn-brennhovd", permanent: true },
  { source: "/en/specialists/kristin-floberghagen", destination: "/en/specialists/kristian-ophaug", permanent: true },
  { source: "/en/specialists/ivana-virijevic", destination: "/en/specialists/mia-kitter", permanent: true },
  { source: "/en/specialists/kristin-vallstroem", destination: "/en/specialists/kristian-marstrand-warholm", permanent: true },
  { source: "/en/specialists/tyra-bjoerklund", destination: "/en/specialists/tea-berge", permanent: true },
  { source: "/en/specialists/helena-litorp", destination: "/en/specialists/mia-kitter", permanent: true },
  { source: "/en/specialists/mikaela-moberg", destination: "/en/specialists/tea-berge", permanent: true },
  { source: "/en/specialists/hans-siltberg", destination: "/en/specialists/andreas-edenberg", permanent: true },
  { source: "/en/specialists/sara-johansson", destination: "/en/specialists/marthe-hagen", permanent: true },
  { source: "/en/specialists/valentina-leutner", destination: "/en/specialists/mia-kitter", permanent: true },
  { source: "/en/specialists/teres-faellmar", destination: "/en/specialists/tea-berge", permanent: true },
  { source: "/en/specialists/annelie-hansson", destination: "/en/specialists/madeleine-engen", permanent: true },
  { source: "/en/specialists/karolina-gimdal", destination: "/en/specialists/marian-bale", permanent: true },
  { source: "/en/specialists/tord-naessen", destination: "/en/specialists/trond-jorgensen", permanent: true },
  { source: "/en/specialists/karin-holmsten", destination: "/en/specialists/marian-bale", permanent: true },
  { source: "/en/specialists/kjersti-margrete-finsrud", destination: "/en/specialists/linn-myrtveit-stensrud", permanent: true },
  { source: "/en/specialists/jose-antonio-rodriguez", destination: "/en/specialists/jonas-rydinge", permanent: true },
  { source: "/en/specialists/hanna-svanstroem", destination: "/en/specialists/hannah-russell", permanent: true },
  { source: "/en/specialists/fertillitetsdoktorn", destination: "/en/specialists/linnea-torsnes", permanent: true },
  { source: "/en/specialists/nazanin-shojaei", destination: "/en/specialists/marian-bale", permanent: true },
  { source: "/en/specialists/jenny-svennbeck", destination: "/en/specialists/endre-soreide", permanent: true },
  { source: "/en/specialists/gunilla-thomasson", destination: "/en/specialists/maria-thompson-clausen", permanent: true },
  { source: "/en/specialists/carina-skeppner-tolvanen", destination: "/en/specialists/linnea-torsnes", permanent: true },
  { source: "/en/specialists/linda-axeback", destination: "/en/specialists/einar-andre-brevik", permanent: true },
];

/**
 * Batch 3 legacy 301s (Erlend SEO audit Aug/Sep 2026).
 * GP menopause guide is restored as CMS content — only EN legacy slug redirects here.
 */
export const LEGACY_REDIRECTS: LegacyRedirect[] = [
  ...ROOT_ARTICLE_REDIRECTS,
  ...EN_SPECIALIST_REDIRECTS,

  // Clinician guide — EN legacy slug only (NO/EN page lives at fastlegeveiledning-overgangsalder).
  {
    source: "/en/guide-for-general-practitioners-menopause",
    destination: "/en/fastlegeveiledning-overgangsalder",
    permanent: true,
  },
  {
    source: "/guide-for-general-practitioners-menopause",
    destination: "/en/fastlegeveiledning-overgangsalder",
    permanent: true,
  },
  {
    source: "/fastlegeveiledning-overgangsalder",
    destination: "/no/fastlegeveiledning-overgangsalder",
    permanent: true,
  },

  // Legacy prisliste URLs (hyphenated single segment: /no/prisliste-for-urologi).
  ...[
    "fertilitet",
    "urologi",
    "gynekologi",
    "revmatolog",
    "handterapeut",
    "sexolog",
    "osteopat-fysioterapeut",
    "gastroenterolog-generell-kirurgi",
    "psykologspesialist",
    "karkirurgi",
    "ernaeringsfysiolog",
    "hud",
  ].flatMap((slug) => [
    {
      source: `/no/prisliste-for-${slug}`,
      destination: "/no/priser",
      permanent: true,
    } as LegacyRedirect,
    {
      source: `/nb/prisliste-for-${slug}`,
      destination: "/nb/priser",
      permanent: true,
    } as LegacyRedirect,
  ]),

  // Slug / path fixes.
  { source: "/no/ovrige/robotassistert-kirurgi", destination: "/no/robotassistert-kirurgi", permanent: true },
  { source: "/nb/ovrige/robotassistert-kirurgi", destination: "/nb/robotassistert-kirurgi", permanent: true },
  { source: "/no/gynekologi/tverrfaglig-team", destination: "/no/gynekologi/tverrfaglig", permanent: true },
  { source: "/nb/gynekologi/tverrfaglig-team", destination: "/nb/gynekologi/tverrfaglig", permanent: true },
  { source: "/no/aapenhetsloven-2025", destination: "/no/personvern", permanent: true },
  { source: "/nb/aapenhetsloven-2025", destination: "/nb/personvern", permanent: true },
  { source: "/en/careers", destination: "/en/career", permanent: true },
  {
    source: "/en/urology/testicle-and-scrotum",
    destination: "/en/urology/testicles-and-scrotum",
    permanent: true,
  },
  {
    source: "/en/behandlinger/urologi/nicolai-wessel",
    destination: "/en/specialists/nicolai-wessel",
    permanent: true,
  },
  {
    source: "/en/sespesialister/carina-skeppner-tolvanen",
    destination: "/en/specialists/linnea-torsnes",
    permanent: true,
  },

  // Legacy clinic / tag paths.
  { source: "/en/klinikk/moss", destination: "/en/clinics/moss", permanent: true },
  { source: "/en/sv/klinikker/moelv", destination: "/en/clinics/moelv", permanent: true },
  { source: "/en/tag/moelv", destination: "/en/clinics/moelv", permanent: true },

  // Retired Swedish clinic pages → nearest live EN destination.
  {
    source: "/en/clinics/gynekologi-stockholm",
    destination: "/en/gynecology/hysteroskopi",
    permanent: true,
  },
  {
    source: "/en/clinics/fertilitet-stockholm",
    destination: "/en/fertility/teamet",
    permanent: true,
  },
  {
    source: "/en/clinics/fertilitet-uppsala-gynhalsan",
    destination: "/en/fertility/teamet",
    permanent: true,
  },
  {
    source: "/en/clinics/cmedical-uppsala-studentgyn-gynhaelsan",
    destination: "/en/clinics",
    permanent: true,
  },
];
