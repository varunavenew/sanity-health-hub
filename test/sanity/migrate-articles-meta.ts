/**
 * Backfill `seo.metaTitle` and `seo.metaDescription` (NO + EN) for the 15
 * editorial/story articles that have neither, on the `developer` dataset.
 *
 * Scope was verified against `production` directly — the 17 "price list"
 * articles already have full metaTitle/metaDescription on production (this
 * migration does NOT touch those). These 15 are the ones genuinely missing
 * it on production too:
 *
 *   article-cmedical-kjoper-livio-oslo
 *   article-cmedical-og-nors-care-inngar-samarbeid-vil-styrke-kvinners-kunnskap-om-egen-helse
 *   article-fra-operasjonsbordet-til-sydpolen-pa-14-maneder
 *   article-historiene-ingen-snakker-om-etter-fodsel
 *   article-jeg-matte-grate-pa-telefonen-for-a-bli-tatt-pa-alvor
 *   article-livio-oslo-blir-en-del-av-cmedical-og-tilbudet-til-pasientene-styrkes
 *   article-maria-falt-i-sahara-og-mellom-alle-stoler-i-helse-norge
 *   article-minis-historie-gjennom-mutterns-oyne
 *   article-nar-kroppen-ikke-fungerer-etter-fodsel-og-ingen-lytter
 *   article-overgangsalderen-er-en-ny-fase-ikke-slutten-pa-noe
 *   article-prostataundersokelse
 *   article-robotassistert-overvektskirurgi-presisjon-trygghet-og-varige-resultater
 *   article-slik-forbereder-hun-seg-til-sydpolen
 *   article-tanken-slo-meg-ikke-at-det-kunne-vaere-meg
 *   article-ved-a-lukke-kvinnehelsegapet-kan-hver-kvinne-fa-syv-flere-friske-dager-i-lopet-av-et-ar
 *
 * Content was written from each article's actual title/excerpt/geoSummary
 * (not fabricated), metaTitle kept under 60 chars and metaDescription under
 * 160 chars per language (verified programmatically before writing).
 *
 * Uses `.patch().set({ "seo.metaTitle": ..., "seo.metaDescription": ... })`
 * — NOT createOrReplace — so nothing else on these documents is touched.
 *
 * This writes to `developer` only. `production` was not touched — it needs
 * its own explicit migration run (ALLOW_PRODUCTION_MIGRATION=true) if desired.
 *
 * Run:
 *   SANITY_TOKEN=<token> bun run test/sanity/migrate-articles-meta.ts
 *   DRY_RUN=1 SANITY_TOKEN=<token> bun run test/sanity/migrate-articles-meta.ts
 */

import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

const i18nString = (no: string, en: string) => [
  { _key: 'no', _type: 'internationalizedArrayStringValue', language: 'no', value: no },
  { _key: 'en', _type: 'internationalizedArrayStringValue', language: 'en', value: en },
]

const i18nText = (no: string, en: string) => [
  { _key: 'no', _type: 'internationalizedArrayTextValue', language: 'no', value: no },
  { _key: 'en', _type: 'internationalizedArrayTextValue', language: 'en', value: en },
]

const META: Record<
  string,
  { metaTitleNo: string; metaTitleEn: string; metaDescNo: string; metaDescEn: string }
> = {
  'article-cmedical-kjoper-livio-oslo': {
    metaTitleNo: 'CMedical kjøper Livio Oslo | CMedical',
    metaTitleEn: 'CMedical buys Livio Oslo | CMedical',
    metaDescNo: 'CMedical kjøper Livio Oslo, Norges første private fertilitetsklinikk og første med egen egg- og sædbank.',
    metaDescEn: "CMedical acquires Livio Oslo, Norway's first private fertility clinic and the first with its own egg and sperm bank.",
  },
  'article-cmedical-og-nors-care-inngar-samarbeid-vil-styrke-kvinners-kunnskap-om-egen-helse': {
    metaTitleNo: 'CMedical og Nørs Care i samarbeid | CMedical',
    metaTitleEn: 'CMedical and Nørs Care partnership | CMedical',
    metaDescNo: 'CMedical og Nørs Care, bak Norges største kvinnehelseapp Nørs, samarbeider for å øke kvinners kunnskap om fertilitet.',
    metaDescEn: "CMedical and Nørs Care, behind Norway's largest women's health app, partner to boost women's knowledge of fertility.",
  },
  'article-fra-operasjonsbordet-til-sydpolen-pa-14-maneder': {
    metaTitleNo: 'Fra operasjonsbordet til Sydpolen | CMedical',
    metaTitleEn: 'From surgery to the South Pole | CMedical',
    metaDescNo: 'Emma «Mini» Gyllenhammar var 17 år da en alvorlig hofteskade tok fra henne drømmen om Sydpolen. Med hjelp fra CMedical fikk hun livet tilbake.',
    metaDescEn: 'Emma "Mini" Gyllenhammar was 17 when a serious hip injury took her dream of the South Pole. With help from CMedical, she got her life back.',
  },
  'article-historiene-ingen-snakker-om-etter-fodsel': {
    metaTitleNo: 'Historiene ingen snakker om etter fødsel | CMedical',
    metaTitleEn: 'The stories no one talks about after birth | CMedical',
    metaDescNo: 'For mange kvinner er det krevende å snakke om plager etter fødsel. «Astrid» (50) fant til slutt hjelpen hun trengte hos gynekolog Madeleine Engen.',
    metaDescEn: 'For many women it\'s hard to talk about problems after childbirth. "Astrid" (50) finally found the help she needed from gynaecologist Madeleine Engen.',
  },
  'article-jeg-matte-grate-pa-telefonen-for-a-bli-tatt-pa-alvor': {
    metaTitleNo: 'Måtte gråte for å bli tatt på alvor | CMedical',
    metaTitleEn: 'Had to cry to be taken seriously | CMedical',
    metaDescNo: 'Da Kristine fikk sin første sønn, forventet hun en normal tilhelingsprosess. Smertene var uutholdelige, og ingen ville høre på henne.',
    metaDescEn: 'When Kristine had her first son, she expected a normal recovery. The pain was unbearable, and no one would listen to her.',
  },
  'article-livio-oslo-blir-en-del-av-cmedical-og-tilbudet-til-pasientene-styrkes': {
    metaTitleNo: 'Livio Oslo blir en del av CMedical | CMedical',
    metaTitleEn: 'Livio Oslo becomes part of CMedical | CMedical',
    metaDescNo: 'I 1986 åpnet Livio Oslo som Norges første private fertilitetsklinikk. Nå blir den en del av CMedical, og tilbudet til pasientene styrkes.',
    metaDescEn: 'Livio Oslo opened in 1986 as Norway\'s first private fertility clinic. It is now part of CMedical, strengthening the offer to patients.',
  },
  'article-maria-falt-i-sahara-og-mellom-alle-stoler-i-helse-norge': {
    metaTitleNo: 'Maria falt i Sahara – og mellom alle stoler | CMedical',
    metaTitleEn: 'Maria fell in the Sahara – and through the cracks | CMedical',
    metaDescNo: 'Et uhell i Sahara i februar 2024 startet et år med smerte og mistillit. Nå løfter Maria Teresa Cristofoli en stemme for de som ikke blir sett.',
    metaDescEn: 'An accident in the Sahara in Feb 2024 began a year of pain and mistrust. Maria Teresa Cristofoli now raises a voice for those who go unseen.',
  },
  'article-minis-historie-gjennom-mutterns-oyne': {
    metaTitleNo: 'Minis historie gjennom Mutterns øyne | CMedical',
    metaTitleEn: "Mini's story through Mutter's eyes | CMedical",
    metaDescNo: 'For Kathinka «Muttern» Gyllenhammar er det å lede folk gjennom polare områder en jobb. Ingenting kunne forberede henne på datteren Minis reise.',
    metaDescEn: 'For Kathinka "Muttern" Gyllenhammar, guiding people through polar regions is a job. Nothing could prepare her for daughter Mini\'s own journey.',
  },
  'article-nar-kroppen-ikke-fungerer-etter-fodsel-og-ingen-lytter': {
    metaTitleNo: 'Når kroppen ikke fungerer etter fødsel | CMedical',
    metaTitleEn: "When the body doesn't work after birth | CMedical",
    metaDescNo: 'Gynekolog Madeleine Engen om vaginalt fremfall, en av de vanligste og mest oversette fødselsskadene. WHO: 36 % får permanente sekveler.',
    metaDescEn: 'Gynaecologist Madeleine Engen on vaginal prolapse, one of the most common and overlooked birth injuries. WHO: 36% have permanent effects.',
  },
  'article-overgangsalderen-er-en-ny-fase-ikke-slutten-pa-noe': {
    metaTitleNo: 'Overgangsalderen er en ny fase | CMedical',
    metaTitleEn: 'Menopause is a new phase | CMedical',
    metaDescNo: 'Symptomene på overgangsalderen starter ofte tidligere enn mange tror. Gynekolog Birgitte Mitlid-Mork forklarer hva som skjer og hvilken hjelp som finnes.',
    metaDescEn: 'Menopause symptoms often start earlier than most think. Gynaecologist Birgitte Mitlid-Mork explains what happens and what treatment is available.',
  },
  'article-prostataundersokelse': {
    metaTitleNo: 'Hvordan foregår en prostataundersøkelse? | CMedical',
    metaTitleEn: 'How is a prostate examination carried out? | CMedical',
    metaDescNo: 'Urolog Trond Jørgensen forklarer hvordan en prostataundersøkelse foregår, med PSA-blodprøve, ultralyd og rektal undersøkelse. Anbefalt sjekk fra 50 år.',
    metaDescEn: 'Urologist Trond Jørgensen explains how a prostate exam works — PSA blood test, ultrasound and rectal exam. Annual checks are recommended from age 50.',
  },
  'article-robotassistert-overvektskirurgi-presisjon-trygghet-og-varige-resultater': {
    metaTitleNo: 'Robotassistert overvektskirurgi | CMedical',
    metaTitleEn: 'Robot-assisted bariatric surgery | CMedical',
    metaDescNo: 'Som eneste private aktør i Norden tilbyr CMedical robotassistert overvektskirurgi med høy presisjon, 3D-visualisering og erfarne kirurger.',
    metaDescEn: 'As the only private provider in the Nordics, CMedical offers robot-assisted bariatric surgery with high precision, 3D visualisation and experienced surgeons.',
  },
  'article-slik-forbereder-hun-seg-til-sydpolen': {
    metaTitleNo: 'Slik forbereder hun seg til Sydpolen | CMedical',
    metaTitleEn: 'This is how she prepares for the South Pole | CMedical',
    metaDescNo: 'Etter to år med smerter tross tidligere kirurgi måtte Emma «Mini» Gyllenhammar starte på nytt. Etter en vellykket hofteoperasjon trener hun mot Sydpolen.',
    metaDescEn: 'After two years of pain despite prior surgery, Emma "Mini" Gyllenhammar had to start over. After a successful hip operation, she trains for the South Pole.',
  },
  'article-tanken-slo-meg-ikke-at-det-kunne-vaere-meg': {
    metaTitleNo: 'Tanken slo meg ikke at det kunne være meg | CMedical',
    metaTitleEn: "It didn't occur to me it could be me | CMedical",
    metaDescNo: 'Når barn uteblir, tror mange at problemet ligger hos kvinnen — men i én av tre tilfeller er det mannen. Synne og Chris deler sin historie.',
    metaDescEn: "When pregnancy doesn't happen, many assume it's the woman — but in one of three cases it's the man. Synne and Chris share their story.",
  },
  'article-ved-a-lukke-kvinnehelsegapet-kan-hver-kvinne-fa-syv-flere-friske-dager-i-lopet-av-et-ar': {
    metaTitleNo: 'Kvinnehelsegapet gir syv flere friske dager | CMedical',
    metaTitleEn: 'Closing the health gap gives 7 more healthy days | CMedical',
    metaDescNo: 'Økt fokus på kvinnehelse er ikke bare et politisk ansvar, men også lønnsomt. Å lukke kvinnehelsegapet kan gi Norge 80 milliarder kroner innen 2040.',
    metaDescEn: "A focus on women's health isn't just a political duty, it's profitable. Closing the women's health gap could add NOK 80bn to Norway's economy by 2040.",
  },
}

async function main() {
  const ids = Object.keys(META)
  console.log(
    `\n[migrate-articles-meta] ${ids.length} articles — mode=${DRY_RUN ? 'DRY_RUN' : 'WRITE (patch seo.metaTitle/metaDescription only)'}\n`,
  )

  const tx = sanityClient.transaction()
  for (const id of ids) {
    const { metaTitleNo, metaTitleEn, metaDescNo, metaDescEn } = META[id]
    console.log(`  ⇢  ${id}`)
    if (!DRY_RUN) {
      tx.patch(id, (p) =>
        p.set({
          'seo.metaTitle': i18nString(metaTitleNo, metaTitleEn),
          'seo.metaDescription': i18nText(metaDescNo, metaDescEn),
        }),
      )
    }
  }

  if (DRY_RUN) {
    console.log('\n(dry run — no writes)\n')
    return
  }

  const res = await tx.commit({ visibility: 'async' })
  console.log(`\n✅ Committed ${res.results.length} mutations.\n`)
  console.log('NB: developer dataset only. production was not touched.\n')
}

main().catch((e) => {
  console.error('❌ Migration failed:', e)
  process.exit(1)
})
