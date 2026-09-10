import type { Redirect } from "next/dist/lib/load-custom-routes";

type LegacyRedirect = Redirect;

const perm = (source: string, destination: string): LegacyRedirect => ({
  source,
  destination,
  permanent: true,
});

/** Pending SEO redirects (batch 4 — Sep 2026). Listed before wildcards in next.config. */
export const PENDING_REDIRECTS_BATCH_4: LegacyRedirect[] = [
  perm("/no/klinikker/ski", "/no/klinikker"),
  perm("/nb/klinikker/ski", "/no/klinikker"),
  perm("/no/spesialister/kjersti-brenden", "/no/spesialister"),
  perm("/nb/spesialister/kjersti-brenden", "/no/spesialister"),
  perm("/en/specialists/roya-shoja", "/en/specialists"),
  perm("/en/clinics/fertilitet-uppsala-gynhalsan", "/en/clinics"),
  perm("/en/clinics/ski", "/en/clinics"),
  perm("/en/specialists/katarina-lindborg-kosanlioglu", "/en/specialists"),
  perm("/no/spesialister/stephan-stiris", "/no/spesialister"),
  perm("/nb/spesialister/stephan-stiris", "/no/spesialister"),
  perm("/no/prisliste-for-handterapeut", "/no/aktuelt/prisliste-for-handterapeut"),
  perm("/nb/prisliste-for-handterapeut", "/nb/aktuelt/prisliste-for-handterapeut"),
  perm("/no/prisliste-for-revmatolog", "/no/aktuelt/prisliste-for-revmatolog"),
  perm("/nb/prisliste-for-revmatolog", "/nb/aktuelt/prisliste-for-revmatolog"),
  perm("/en/specialists/kristian-ophaug", "/en/specialists"),
  perm("/en/specialists/riina-aarnio", "/en/specialists"),
  perm("/no/prisliste-for-sexolog", "/no/aktuelt/prisliste-for-sexolog"),
  perm("/nb/prisliste-for-sexolog", "/nb/aktuelt/prisliste-for-sexolog"),
  perm("/en/specialists/anamika-choudhury", "/en/specialists"),
  perm("/no/prisliste-for-osteopat-fysioterapeut", "/no/aktuelt/prisliste-for-osteopat-fysioterapeut"),
  perm("/nb/prisliste-for-osteopat-fysioterapeut", "/nb/aktuelt/prisliste-for-osteopat-fysioterapeut"),
  perm(
    "/no/prisliste-for-gastroenterolog-generell-kirurgi",
    "/no/aktuelt/prisliste-for-gastroenterolog-generell-kirurgi",
  ),
  perm(
    "/nb/prisliste-for-gastroenterolog-generell-kirurgi",
    "/nb/aktuelt/prisliste-for-gastroenterolog-generell-kirurgi",
  ),
  perm("/no/spesialister/gunnar-dalen", "/no/spesialister/per-gunnar-dalen"),
  perm("/nb/spesialister/gunnar-dalen", "/no/spesialister/per-gunnar-dalen"),
  perm("/en/specialists/kjersti-brenden", "/en/specialists"),
  perm("/no/spesialister/line-fusdahl-hulleberg", "/no/spesialister"),
  perm("/nb/spesialister/line-fusdahl-hulleberg", "/no/spesialister"),
  perm("/no/ovrige/forebyggende-helse", "/no/ovrige"),
  perm("/nb/ovrige/forebyggende-helse", "/no/ovrige"),
  perm("/en/specialists/lisa-reppert", "/en/specialists"),
  perm("/en/prisliste-for-fertilitet", "/no/aktuelt/prisliste-for-fertilitet"),
  perm("/no/prisliste-for-fertilitet", "/no/aktuelt/prisliste-for-fertilitet"),
  perm("/nb/prisliste-for-fertilitet", "/nb/aktuelt/prisliste-for-fertilitet"),
  perm("/no/prisliste-for-urologi", "/no/aktuelt/prisliste-for-urologi"),
  perm("/nb/prisliste-for-urologi", "/nb/aktuelt/prisliste-for-urologi"),
  perm("/no/prisliste-for-gynekologi", "/no/aktuelt/prisliste-for-gynekologi"),
  perm("/nb/prisliste-for-gynekologi", "/nb/aktuelt/prisliste-for-gynekologi"),
  perm("/no/gynekologi/pms-pmdd", "/no/gynekologi/pms-og-pmdd"),
  perm("/nb/gynekologi/pms-pmdd", "/no/gynekologi/pms-og-pmdd"),
  {
    source: "/no/gynekologi/blodningsfortyrrelser",
    destination: "/no/gynekologi/blodningsforstyrrelser",
    statusCode: 301,
  },
  {
    source: "/nb/gynekologi/blodningsfortyrrelser",
    destination: "/no/gynekologi/blodningsforstyrrelser",
    statusCode: 301,
  },
  {
    source: "/no/behandlinger/gynekologi/blodningsfortyrrelser",
    destination: "/no/gynekologi/blodningsforstyrrelser",
    statusCode: 301,
  },
  {
    source: "/nb/behandlinger/gynekologi/blodningsfortyrrelser",
    destination: "/no/gynekologi/blodningsforstyrrelser",
    statusCode: 301,
  },
  {
    source: "/gynekologi/blodningsfortyrrelser",
    destination: "/no/gynekologi/blodningsforstyrrelser",
    statusCode: 301,
  },
  perm("/en/other/preventive-healthcare", "/en/other"),
  perm("/no/prisliste-for-psykologspesialist", "/no/aktuelt/prisliste-for-psykologspesialist"),
  perm("/nb/prisliste-for-psykologspesialist", "/nb/aktuelt/prisliste-for-psykologspesialist"),
  perm("/en/specialists/gunnar-dalen", "/en/specialists/per-gunnar-dalen"),
  perm("/en/gynecology/pcos-en", "/en/gynecology/poi"),
  perm("/no/spesialister/anamika-choudhury", "/no/spesialister"),
  perm("/nb/spesialister/anamika-choudhury", "/no/spesialister"),
  perm("/en/sespesialister/carina-skeppner-tolvanen", "/en/specialists"),
  perm("/en/specialists/camilla-melin-da-silva", "/en/specialists"),
  perm("/en/specialists/irina-genberg", "/en/specialists"),
  perm("/no/prisliste-for-karkirurgi", "/no/aktuelt/prisliste-for-karkirurgi"),
  perm("/nb/prisliste-for-karkirurgi", "/nb/aktuelt/prisliste-for-karkirurgi"),
  perm("/klinikk/ski", "/no/klinikker"),
  perm("/en/specialists/lisa_alin", "/en/specialists"),
  perm("/en/pricing", "/en/priser"),
  perm("/en/specialists/valentina-leutner", "/en/specialists"),
  perm("/en/specialists/stephan-stiris", "/en/specialists"),
  perm("/en/fertility/prices-fertility", "/en/fertility/infertility"),
  perm("/no/gynekologi/undersokelse", "/no/gynekologi/gynekologisk-undersokelse"),
  perm("/nb/gynekologi/undersokelse", "/no/gynekologi/gynekologisk-undersokelse"),
  perm("/en/specialists/ivana-virijevic", "/en/specialists"),
  perm("/en/specialists/jose-antonio-rodriguez", "/en/specialists"),
  perm("/en/specialists/fertillitetsdoktorn", "/en/specialists"),
  perm("/en/specialists/jenny-svennbeck", "/en/specialists"),
  perm("/en/careers/urolog", "/en/career/urolog"),
  perm("/en/specialists/gunilla-thomasson", "/en/specialists"),
  perm("/en/careers/fertilitetssykepleier", "/en/career/fertilitetssykepleier"),
  perm("/en/bariatric-surgery/sleeve-gastrektomi", "/no/ovrige/sleeve-gastrektomi"),
  perm("/en/fertility/aggfrys", "/no/fertilitet/eggfrys"),
  perm("/en/fertility/agglossningsstimulering", "/en/fertility"),
  perm("/en/fertility/donationsbehandling", "/no/fertilitet/donorbehandling"),
  perm("/en/fertility/spermiefrys", "/en/fertility/semen-analysis"),
  perm("/en/fertility/utredning", "/en/fertility/egg-freezing"),
  perm("/en/gynecology/abort", "/en/gynecology/poi"),
  perm("/en/gynecology/blodningsrubbningar", "/en/gynecology"),
  perm("/en/gynecology/endometrios", "/en/gynecology/endometriosis"),
  perm("/en/gynecology/framfall-urininkontinens-forlossningsskador", "/en/gynecology"),
  perm("/en/gynecology/gynekologisk_undersokning", "/no/gynekologi/gynekologisk-undersokelse"),
  perm("/en/gynecology/gynekologiskt_ultraljud", "/en/gynecology/urogynekologi"),
  perm("/en/gynecology/klimakteriebesvar", "/en/gynecology/menopause"),
  perm("/en/gynecology/nipt", "/no/graviditet/nipt"),
  perm("/en/gynecology/radgivning-preventivmedel", "/en/gynecology"),
  perm("/en/gynecology/spontanabort", "/en/pregnancy/spontanabort"),
  perm("/en/gynecology/test-klamydia-gonorre", "/en/gynecology"),
  perm("/en/gynecology/urininkontinens", "/en/gynecology"),
  perm("/en/gynecology/vaginalt-framfall", "/en/gynecology/vaginale-fremfall"),
  perm("/en/other/robotassistert-kirurgi", "/no/urologi/robotassistert-kirurgi"),
  perm("/en/skin-health/hudpleieprodukter", "/no/ovrige/hudpleieprodukter"),
  perm("/en/specialists/carina-skeppner-tolvanen", "/en/specialists"),
  perm("/en/specialists/henrik-michelsen-wahl", "/en/specialists"),
  perm("/en/specialists/line-jacob", "/en/specialists"),
  perm("/en/specialists/rebecca-ostlund", "/en/specialists"),
  perm("/no/karriere/markedskoordinator-prosjektleder", "/no/karriere"),
  perm("/nb/karriere/markedskoordinator-prosjektleder", "/no/karriere"),
  perm("/no/klinikk/bekkestua-gynekologi-hud", "/no/klinikker"),
  perm("/nb/klinikk/bekkestua-gynekologi-hud", "/no/klinikker"),
  perm("/no/prisliste-for-ernaeringsfysiolog", "/no/aktuelt/prisliste-for-ernaeringsfysiolog"),
  perm("/nb/prisliste-for-ernaeringsfysiolog", "/nb/aktuelt/prisliste-for-ernaeringsfysiolog"),
  perm("/no/prisliste-for-hud", "/no/aktuelt/prisliste-for-hud"),
  perm("/nb/prisliste-for-hud", "/nb/aktuelt/prisliste-for-hud"),
  perm("/no/spesialister/henrik-michelsen-wahl", "/no/spesialister"),
  perm("/nb/spesialister/henrik-michelsen-wahl", "/no/spesialister"),
  perm("/no/spesialister/kristian-ophaug", "/no/spesialister"),
  perm("/nb/spesialister/kristian-ophaug", "/no/spesialister"),
];

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

/** Retired specialist profiles → listing (not another person). */
const EN_SPECIALIST_LISTING = "/en/specialists";
const EN_SPECIALIST_REDIRECTS: LegacyRedirect[] = [
  perm("/en/specialists/stylianos-triantafyllidis", EN_SPECIALIST_LISTING),
  perm("/en/specialists/kristina-torn", EN_SPECIALIST_LISTING),
  perm("/en/specialists/hashem-amini", EN_SPECIALIST_LISTING),
  perm("/en/specialists/marcus-bergman", EN_SPECIALIST_LISTING),
  perm("/en/specialists/christina-ertl", EN_SPECIALIST_LISTING),
  perm("/en/specialists/birgitta-essen", EN_SPECIALIST_LISTING),
  perm("/en/specialists/cennet-akdeni", "/en/specialists/cennet-akdeniz"),
  perm("/en/specialists/pia-ekman-zgryzniak", EN_SPECIALIST_LISTING),
  perm("/en/specialists/helene-haesert", EN_SPECIALIST_LISTING),
  perm("/en/specialists/jan-rapp", EN_SPECIALIST_LISTING),
  perm("/en/specialists/karina-varasteh", EN_SPECIALIST_LISTING),
  perm("/en/specialists/adam-abdulmajeed", EN_SPECIALIST_LISTING),
  perm("/en/specialists/malin-karlsson", EN_SPECIALIST_LISTING),
  perm("/en/specialists/anna-maria-kanold", EN_SPECIALIST_LISTING),
  perm("/en/specialists/marie-olsson", EN_SPECIALIST_LISTING),
  perm("/en/specialists/ida-wikander", EN_SPECIALIST_LISTING),
  perm("/en/specialists/maria-palmqvist", EN_SPECIALIST_LISTING),
  perm("/en/specialists/kristin-vallstroem", EN_SPECIALIST_LISTING),
  perm("/en/specialists/tyra-bjoerklund", EN_SPECIALIST_LISTING),
  perm("/en/specialists/helena-litorp", EN_SPECIALIST_LISTING),
  perm("/en/specialists/mikaela-moberg", EN_SPECIALIST_LISTING),
  perm("/en/specialists/hans-siltberg", EN_SPECIALIST_LISTING),
  perm("/en/specialists/sara-johansson", EN_SPECIALIST_LISTING),
  perm("/en/specialists/teres-faellmar", EN_SPECIALIST_LISTING),
  perm("/en/specialists/annelie-hansson", EN_SPECIALIST_LISTING),
  perm("/en/specialists/karolina-gimdal", EN_SPECIALIST_LISTING),
  perm("/en/specialists/tord-naessen", EN_SPECIALIST_LISTING),
  perm("/en/specialists/karin-holmsten", EN_SPECIALIST_LISTING),
  perm("/en/specialists/hanna-svanstroem", EN_SPECIALIST_LISTING),
  perm("/en/specialists/nazanin-shojaei", EN_SPECIALIST_LISTING),
  perm("/en/specialists/linda-axeback", EN_SPECIALIST_LISTING),
];

/**
 * Batch 3 legacy 301s (Erlend SEO audit Aug/Sep 2026).
 * GP menopause guide is restored as CMS content — only EN legacy slug redirects here.
 */
export const LEGACY_REDIRECTS: LegacyRedirect[] = [
  ...PENDING_REDIRECTS_BATCH_4,
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

  // Remaining prisliste URLs not covered by batch 4 → /priser.
  ...["privatbetalende"].flatMap((slug) => [
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
    source: "/en/clinics/cmedical-uppsala-studentgyn-gynhaelsan",
    destination: "/en/clinics",
    permanent: true,
  },
];
