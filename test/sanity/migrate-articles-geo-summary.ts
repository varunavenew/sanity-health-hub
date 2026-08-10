/**
 * Backfill `geoSummary` (NO + EN) for articles that have none.
 *
 * 17 published `article` documents had no `geoSummary` at all (checked via a
 * read-only GROQ query — none were partially missing, always both-or-neither).
 * Summaries below are written from each document's actual `excerpt`/`body`
 * content. Three documents (article-prisliste-karkirurgi,
 * article-robotkirurgi-prostatakreft, article-stillingsutlysning) have no
 * body copy in the CMS at all — their summaries are necessarily thin,
 * title-only placeholders; real body content should be authored for them.
 *
 * Uses `.patch().set({ geoSummary })` — NOT createOrReplace — so only the
 * `geoSummary` field is touched; every other field on these documents is
 * left exactly as-is.
 *
 * Run:
 *   SANITY_TOKEN=<token> bun run test/sanity/migrate-articles-geo-summary.ts
 *   DRY_RUN=1 SANITY_TOKEN=<token> bun run test/sanity/migrate-articles-geo-summary.ts
 */

import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

const i18nText = (no: string, en: string) => [
  { _key: 'no', _type: 'internationalizedArrayTextValue', language: 'no', value: no },
  { _key: 'en', _type: 'internationalizedArrayTextValue', language: 'en', value: en },
]

const GEO_SUMMARIES: Record<string, { no: string; en: string }> = {
  'article-la-deg-operere-i-norge': {
    no: 'Gard Lauvsnes i Colosseum Mann oppfordrer menn med prostatakreft til å velge behandling i Norge fremfor utlandet, og peker på topp ekspertise og robotkirurgi – uten rett til pasientskadeerstatning ved behandling i utlandet.',
    en: 'Gard Lauvsnes of Colosseum Mann urges men with prostate cancer to choose treatment in Norway rather than abroad, citing top expertise and robotic surgery — noting patients have no right to compensation for treatment received abroad.',
  },
  'article-prisliste-ernaeringsfysiolog': {
    no: 'Prisliste for konsultasjon hos ernæringsfysiolog hos CMedical: 1.490 kroner for 45 minutter og 1.990 kroner for 60 minutter.',
    en: 'Price list for a nutritionist consultation at CMedical: NOK 1,490 for 45 minutes and NOK 1,990 for 60 minutes.',
  },
  'article-prisliste-fertilitet': {
    no: 'Prisliste for fertilitetsbehandling hos CMedical. Medisinkostnader dekkes separat av HELFO, mens embryoovervåking med RI-Witness System og Embryoscope er inkludert i prisen.',
    en: 'Price list for fertility treatment at CMedical. Medication costs are covered separately by HELFO, while embryo monitoring with the RI-Witness System and Embryoscope is included in the price.',
  },
  'article-prisliste-gastroenterolog': {
    no: 'Prisliste for gastroenterologi og generell kirurgi hos CMedical, fra konsultasjon (2.100 kr) til kikkhullsoperasjon for lyske- og navlebrokk (fra 45.000 kr).',
    en: 'Price list for gastroenterology and general surgery at CMedical, ranging from a consultation (NOK 2,100) to keyhole surgery for inguinal and umbilical hernia (from NOK 45,000).',
  },
  'article-prisliste-gynekologi': {
    no: 'Prisliste for gynekologiske tjenester hos CMedical, fra konsultasjon (fra 2.150 kr) til operasjoner som TVT og fremfallsoperasjon (fra 37.500 kr).',
    en: 'Price list for gynaecology services at CMedical, from a consultation (from NOK 2,150) to procedures such as TVT and prolapse surgery (from NOK 37,500).',
  },
  'article-prisliste-handterapeut': {
    no: 'Prisliste for håndterapeut hos CMedical: konsultasjon 30 minutter fra 850 kroner.',
    en: 'Price list for a hand therapist at CMedical: a 30-minute consultation from NOK 850.',
  },
  'article-prisliste-hud': {
    no: 'Prisliste for hudbehandlinger hos CMedical, inkludert konsultasjon, aknekontroll, føflekkfjerning, botox, kjemisk peeling og fillerbehandling.',
    en: 'Price list for skin treatments at CMedical, including consultation, acne control, mole removal, Botox, chemical peels and filler treatments.',
  },
  'article-prisliste-karkirurgi': {
    no: 'Prisliste for karkirurgi hos CMedical.',
    en: 'Price list for vascular surgery at CMedical.',
  },
  'article-prisliste-osteopat-fysioterapeut': {
    no: 'Prisliste for osteopat og fysioterapeut hos CMedical: førstegangskonsultasjon fra 1.300 kroner, konsultasjon 1.670 kroner og oppfølging 890 kroner.',
    en: 'Price list for osteopath and physiotherapist services at CMedical: first consultation from NOK 1,300, consultation NOK 1,670 and follow-up NOK 890.',
  },
  'article-prisliste-privatbetalende': {
    no: 'Generell prisinformasjon for privatbetalende pasienter hos CMedical, med forbehold om prisendringer.',
    en: 'General pricing information for private-paying patients at CMedical, subject to price changes.',
  },
  'article-prisliste-psykologspesialist': {
    no: 'Prisliste for psykologspesialist hos CMedical: konsultasjon 60 minutter for 1.900 kroner.',
    en: 'Price list for a psychologist specialist at CMedical: a 60-minute consultation for NOK 1,900.',
  },
  'article-prisliste-revmatolog': {
    no: 'Prisliste for revmatolog hos CMedical: konsultasjon fra 3.150 kroner.',
    en: 'Price list for a rheumatologist at CMedical: consultation from NOK 3,150.',
  },
  'article-prisliste-sexolog': {
    no: 'Prisliste for sexolog hos CMedical: konsultasjon fra 1.600 kroner.',
    en: 'Price list for a sexologist at CMedical: consultation from NOK 1,600.',
  },
  'article-prisliste-urologi': {
    no: 'Prisliste for urologiske tjenester hos CMedical, fra konsultasjon (fra 1.900 kr) til robotkirurgi for prostata (RALP/RASP fra 178.500 kr).',
    en: 'Price list for urology services at CMedical, from a consultation (from NOK 1,900) to robotic prostate surgery (RALP/RASP from NOK 178,500).',
  },
  'article-prostataundersokelse': {
    no: 'Urolog Trond Jørgensen forklarer hvordan en prostataundersøkelse foregår – PSA-blodprøve, ultralyd og rektal undersøkelse – og anbefaler årlig sjekk fra 50 år. I Norge får rundt 5.000 menn prostatakreft årlig, og 12,5 % rammes innen fylte 75 år.',
    en: 'Urologist Trond Jørgensen explains how a prostate examination works — a PSA blood test, ultrasound and rectal exam — and recommends annual checks from age 50. Around 5,000 men in Norway are diagnosed with prostate cancer each year, and 12.5% will be diagnosed by age 75.',
  },
  'article-robotkirurgi-prostatakreft': {
    no: 'CMedical omtaler sitt tilbud innen robotkirurgi for prostatakreft.',
    en: "CMedical on its robotic surgery offering for prostate cancer.",
  },
  'article-stillingsutlysning': {
    no: 'Stillingsutlysning hos CMedical: operasjonssykepleier og anestesisykepleier.',
    en: 'Job posting at CMedical: operating room nurse and anaesthesia nurse.',
  },
}

async function main() {
  const ids = Object.keys(GEO_SUMMARIES)
  console.log(
    `\n[migrate-articles-geo-summary] ${ids.length} articles — mode=${DRY_RUN ? 'DRY_RUN' : 'WRITE (patch geoSummary only)'}\n`,
  )

  const tx = sanityClient.transaction()
  for (const id of ids) {
    const { no, en } = GEO_SUMMARIES[id]
    console.log(`  ⇢  ${id}`)
    if (!DRY_RUN) {
      tx.patch(id, (p) => p.set({ geoSummary: i18nText(no, en) }))
    }
  }

  if (DRY_RUN) {
    console.log('\n(dry run — no writes)\n')
    return
  }

  const res = await tx.commit({ visibility: 'async' })
  console.log(`\n✅ Committed ${res.results.length} mutations.\n`)
  console.log(
    'NB: article-prisliste-karkirurgi, article-robotkirurgi-prostatakreft and\n' +
      'article-stillingsutlysning have no body copy in the CMS — their geoSummary\n' +
      'is a thin, title-only placeholder. Author real content for these three.\n',
  )
}

main().catch((e) => {
  console.error('❌ Migration failed:', e)
  process.exit(1)
})
