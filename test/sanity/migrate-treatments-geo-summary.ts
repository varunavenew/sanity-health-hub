/**
 * Backfill `geoSummary` (NO + EN) for the 15 `treatment` documents that had
 * none (58 of 73 treatments already had it — checked via a read-only GROQ
 * query; always both-or-neither, no partial cases).
 *
 * Summaries below are written from each document's actual `description` /
 * `heroDescription` / `reasons` content, matching the length and factual,
 * plain-prose style already used across the other 58 treatments
 * (~70-150 chars, states what the treatment is / who it's for).
 *
 * Uses `.patch().set({ geoSummary })` — NOT createOrReplace — so only the
 * `geoSummary` field is touched; every other field is left exactly as-is.
 *
 * Run:
 *   npx tsx sanity/migrate-treatments-geo-summary.ts
 *   DRY_RUN=1 npx tsx sanity/migrate-treatments-geo-summary.ts
 */

import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

const i18nText = (no: string, en: string) => [
  { _key: 'no', _type: 'internationalizedArrayTextValue', language: 'no', value: no },
  { _key: 'en', _type: 'internationalizedArrayTextValue', language: 'en', value: en },
]

const GEO_SUMMARIES: Record<string, { no: string; en: string }> = {
  'treatment-fertilitet-assistert-befruktning-for-par-og-single': {
    no: 'Assistert befruktning for par, to kvinner eller single kvinner som ønsker å bli gravide.',
    en: 'Assisted fertilization for couples, female couples or single women who want to become pregnant.',
  },
  'treatment-flere-fagomrader-behandlingsutstyr': {
    no: 'Laser- og IPL-behandling hos hudlege for rødhet, pigmentflekker og solskadet hud.',
    en: 'Laser and IPL treatment by a dermatologist for redness, pigment spots and sun-damaged skin.',
  },
  'treatment-flere-fagomrader-gastrokirurgi-brokkoperasjon': {
    no: 'Robotassistert kikkhullsoperasjon av lyskebrokk, med skånsomt forløp og kort inngrepstid.',
    en: 'Robot-assisted keyhole surgery for inguinal hernia, with a gentle recovery and short procedure time.',
  },
  'treatment-flere-fagomrader-gastrokirurgi-hemorroider-og-endetarmsplager': {
    no: 'Utredning og kirurgisk behandling av hemorroider og marisker i endetarmen.',
    en: 'Assessment and surgical treatment of hemorrhoids and piles in the rectum.',
  },
  'treatment-flere-fagomrader-hudbehandlinger': {
    no: 'Medisinsk forankrede hudbehandlinger utført av hudlege, tilpasset den enkelte.',
    en: 'Medically based skin treatments performed by a dermatologist, tailored to the individual.',
  },
  'treatment-flere-fagomrader-hudbehandlinger-elastisitet-og-volum': {
    no: 'Behandlinger hos hudlege mot redusert hudelastisitet og volumtap som følger med alderen.',
    en: 'Dermatologist treatments for reduced skin elasticity and volume loss that come with age.',
  },
  'treatment-flere-fagomrader-hudbehandlinger-foflekksjekk': {
    no: 'Dermatoskopisk føflekksjekk hos hudlege for tidlig oppdagelse av hudforandringer.',
    en: 'Dermatoscopic mole check by a dermatologist for early detection of skin changes.',
  },
  'treatment-flere-fagomrader-hudbehandlinger-forbedring-av-hudstruktur': {
    no: 'Microneedling, mesoterapi og andre behandlinger mot ujevn hudtekstur og aknearr.',
    en: 'Microneedling, mesotherapy and other treatments for uneven skin texture and acne scars.',
  },
  'treatment-flere-fagomrader-hudbehandlinger-kosmetisk-dermatologi': {
    no: 'Vurdering og behandling av både medisinske hudtilstander og kosmetisk dermatologi.',
    en: 'Assessment and treatment of both medical skin conditions and cosmetic dermatology.',
  },
  'treatment-flere-fagomrader-hudbehandlinger-pigmentforandringer-og-solskader': {
    no: 'Vurdering og behandling av pigmentflekker og solskadet hud hos hudlege.',
    en: 'Assessment and treatment of pigment spots and sun-damaged skin by a dermatologist.',
  },
  'treatment-flere-fagomrader-hudbehandlinger-rodhet-og-synlige-blodkar': {
    no: 'Behandling av diffus rødhet og synlige blodkar i ansiktet, blant annet ved rosacea.',
    en: 'Treatment of diffuse facial redness and visible blood vessels, including rosacea.',
  },
  'treatment-flere-fagomrader-hudpleieprodukter': {
    no: 'SkinCeuticals medisinske hudpleieprodukter for å beskytte, korrigere og forebygge hudskader.',
    en: 'SkinCeuticals medical-grade skincare to protect, correct and prevent skin damage.',
  },
  'treatment-gynekologi-fodselsskader': {
    no: 'Utredning og behandling av fødselsskader som bristninger, svekket bekkenbunn og fremfall.',
    en: 'Assessment and treatment of birth injuries such as tears, weakened pelvic floor and prolapse.',
  },
  'treatment-gynekologi-fostermedisin': {
    no: 'Fostermedisin med tidlig ultralyd, NIPT og fosterdiagnostikk hos spesialist.',
    en: 'Fetal medicine with early ultrasound, NIPT and fetal diagnostics by a specialist.',
  },
  'treatment-gynekologi-pmos': {
    no: 'PMOS (tidligere PCOS) gir hormonubalanse, uregelmessig eggløsning og økt risiko for infertilitet.',
    en: 'PMOS (formerly PCOS) causes hormonal imbalance, irregular ovulation and increased infertility risk.',
  },
}

async function main() {
  const ids = Object.keys(GEO_SUMMARIES)
  console.log(
    `\n[migrate-treatments-geo-summary] ${ids.length} treatments — mode=${DRY_RUN ? 'DRY_RUN' : 'WRITE (patch geoSummary only)'}\n`,
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
}

main().catch((e) => {
  console.error('❌ Migration failed:', e)
  process.exit(1)
})
