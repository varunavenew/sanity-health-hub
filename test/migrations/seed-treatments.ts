/**
 * Sanity migration: seed Behandlingskategorier + Behandlinger
 * -----------------------------------------------------------
 * Seeds the six treatment categories (Gynekologi, Fertilitet, Urologi,
 * Ortopedi, Graviditet, Flere fagområder) and all sub-treatments listed in
 * `src/data/serviceCategories.ts` (kept mirrored inline here so the script is
 * fully self-contained and can run inside the Studio without importing app code).
 *
 * Behaviour:
 *  - Uses deterministic `_id`s so re-running is idempotent
 *  - Uses `createIfNotExists` — will NEVER overwrite existing content
 *  - Sets `title` / `slug` / `categoryId` / `sortOrder` / `parentCategoryLabel`
 *    and a category reference on every sub-treatment
 *  - All localized string fields are written as internationalizedArray with
 *    a `no` (Norwegian Bokmål) entry
 *
 * How to run (from the `test/` folder):
 *   bunx sanity exec migrations/seed-treatments.ts --with-user-token
 *
 * You can safely dry-run first by exporting DRY_RUN=1:
 *   DRY_RUN=1 bunx sanity exec migrations/seed-treatments.ts --with-user-token
 */

import {getCliClient} from 'sanity/cli'

// ─── Data (mirrors src/data/serviceCategories.ts) ────────────────────────────

type SubTreatment = {slug: string; title: string}
type Category = {
  categoryId: string
  slug: string
  title: string
  sortOrder: number
  treatments: SubTreatment[]
}

const slugFromPath = (p: string) => p.split('/').filter(Boolean).slice(-1)[0]

const CATEGORIES: Category[] = [
  {
    categoryId: 'gynekologi',
    slug: 'gynekologi',
    title: 'Gynekologi',
    sortOrder: 10,
    treatments: [
      {slug: 'tverrfaglig', title: 'Tverrfaglig team'},
      {slug: 'undersokelse', title: 'Gynekologisk undersøkelse'},
      {slug: 'urinlekkasje', title: 'Urinlekkasje'},
      {slug: 'endometriose', title: 'Endometriose'},
      {slug: 'overgangsalder', title: 'Overgangsalder'},
      {slug: 'vaginale-fremfall', title: 'Vaginale fremfall'},
      {slug: 'urogynekologi', title: 'Urogynekologi'},
      {slug: 'blodningsforstyrrelser', title: 'Blødningsforstyrrelser'},
      {slug: 'celleforandringer', title: 'Celleforandringer'},
      {slug: 'cyster', title: 'Cyster på eggstokkene'},
      {slug: 'fjerne-livmor', title: 'Fjerne livmor'},
      {slug: 'fostermedisin', title: 'Fostermedisin'},
      {slug: 'fodselsskader', title: 'Fødselsskader'},
      {slug: 'graviditet', title: 'Graviditet'},
      {slug: 'kirurgi', title: 'Gynekologisk kirurgi'},
      {slug: 'hysteroskopi', title: 'Hysteroskopi'},
      {slug: 'labiaplastikk', title: 'Labiaplastikk'},
      {slug: 'pmos', title: 'PMOS'},
      {slug: 'pms-pmdd', title: 'PMS og PMDD'},
      {slug: 'robotkirurgi', title: 'Robotassistert kirurgi'},
      {slug: 'spontanabort', title: 'Spontanabort'},
      {slug: 'vulvalidelser', title: 'Vulvalidelser'},
    ],
  },
  {
    categoryId: 'graviditet',
    slug: 'graviditet',
    title: 'Graviditet',
    sortOrder: 20,
    treatments: [
      {slug: 'ultralyd', title: 'Ultralyd'},
      {slug: 'nipt', title: 'NIPT'},
      {slug: 'svangerskapsteam', title: 'Svangerskapsteam'},
      {slug: 'fosterdiagnostikk', title: 'Fosterdiagnostikk'},
    ],
  },
  {
    categoryId: 'fertilitet',
    slug: 'fertilitet',
    title: 'Fertilitet',
    sortOrder: 30,
    treatments: [
      {slug: 'infertilitet', title: 'Infertilitet'},
      {slug: 'assistert-befruktning', title: 'Assistert befruktning'},
      {slug: 'fertilitetsutredning', title: 'Fertilitetsutredning'},
      {slug: 'eggfrys', title: 'Eggfrys'},
      {slug: 'donorbehandling', title: 'Donorbehandling'},
      {
        slug: 'assistert-befruktning-for-par-og-single',
        title: 'Assistert befruktning for par og single',
      },
      {slug: 'hysteroskopi', title: 'Hysteroskopi'},
      {slug: 'saedanalyse', title: 'Sædanalyse'},
    ],
  },
  {
    categoryId: 'urologi',
    slug: 'urologi',
    title: 'Urologi',
    sortOrder: 40,
    treatments: [
      {slug: 'blaere', title: 'Blære og urinveier'},
      {slug: 'forhud', title: 'Forhud'},
      {slug: 'infertilitet', title: 'Mannlig infertilitet'},
      {slug: 'nyrer', title: 'Nyrer'},
      {slug: 'prostata', title: 'Prostata'},
      {slug: 'refertilisering', title: 'Refertilisering'},
      {slug: 'robotkirurgi', title: 'Robotassistert kirurgi'},
      {slug: 'sterilisering', title: 'Sterilisering'},
      {slug: 'testikler', title: 'Testikler og pung'},
    ],
  },
  {
    categoryId: 'ortopedi',
    slug: 'ortopedi',
    title: 'Ortopedi',
    sortOrder: 50,
    treatments: [
      {slug: 'fot-ankel', title: 'Fot og ankel'},
      {slug: 'hofte', title: 'Hofte'},
      {slug: 'hand-albue', title: 'Hånd og albue'},
      {slug: 'kne', title: 'Kne'},
      {slug: 'skulder', title: 'Skulder'},
    ],
  },
  {
    categoryId: 'flere-fagomrader',
    slug: 'flere-fagomrader',
    title: 'Flere fagområder',
    sortOrder: 60,
    treatments: [
      {slug: 'endokrinologi', title: 'Endokrinologi'},
      {slug: 'ernaringsfysiolog', title: 'Ernæringsfysiolog'},
      {slug: 'hudhelse', title: 'Hudhelse'},
      {slug: 'hudhelse/hudbehandlinger', title: 'Hudbehandlinger'},
      {slug: 'behandlingsutstyr', title: 'Behandlingsutstyr'},
      {slug: 'hudpleieprodukter', title: 'Hudpleieprodukter'},
      {slug: 'gastrokirurgi', title: 'Mage- og tarmlidelser (Gastrokirurgi)'},
      {slug: 'gastrokirurgi/overvektskirurgi', title: 'Overvektskirurgi (slankeoperasjon)'},
      {slug: 'gastrokirurgi/brokkoperasjon', title: 'Brokkoperasjon'},
      {
        slug: 'gastrokirurgi/hemorroider-og-endetarmsplager',
        title: 'Hemorroider og endetarmsplager (rektocele)',
      },
      {slug: 'osteopati', title: 'Osteopati'},
      {slug: 'plastikkirurgi', title: 'Plastikkirurgi'},
      {slug: 'psykologi', title: 'Psykologi'},
      {slug: 'revmatologi', title: 'Revmatologi'},
      {slug: 'robotkirurgi', title: 'Robotassistert kirurgi'},
      {slug: 'sexologi', title: 'Sexologi'},
      {slug: 'areknuter', title: 'Åreknutebehandling'},
    ],
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DRY_RUN = process.env.DRY_RUN === '1'

// internationalizedArrayString / Text entries look like:
//   [{_key: 'no', _type: 'internationalizedArrayStringValue', value: '...'}]
const i18n = (value: string, key = 'no') => [
  {
    _key: key,
    _type: 'internationalizedArrayStringValue',
    value,
  },
]

const catDocId = (categoryId: string) => `treatmentCategory.${categoryId}`
const treatmentDocId = (categoryId: string, slug: string) =>
  `treatment.${categoryId}.${slug.replace(/\//g, '-')}`

// ─── Migration ───────────────────────────────────────────────────────────────

async function run() {
  const client = getCliClient({apiVersion: '2024-01-01'})

  console.log(
    `\n🌱  Seeding treatment content into "${client.config().dataset}" (project ${client.config().projectId})`,
  )
  if (DRY_RUN) console.log('   (DRY_RUN=1 — no writes will be made)\n')

  const tx = client.transaction()
  let createdCategories = 0
  let createdTreatments = 0

  for (const cat of CATEGORIES) {
    const catId = catDocId(cat.categoryId)
    const categoryDoc = {
      _id: catId,
      _type: 'treatmentCategory',
      title: i18n(cat.title),
      slug: {_type: 'slug', current: cat.slug},
      categoryId: cat.categoryId,
      sortOrder: cat.sortOrder,
    }
    tx.createIfNotExists(categoryDoc as any)
    createdCategories++

    for (let i = 0; i < cat.treatments.length; i++) {
      const t = cat.treatments[i]
      const treatmentDoc = {
        _id: treatmentDocId(cat.categoryId, t.slug),
        _type: 'treatment',
        title: i18n(t.title),
        slug: {_type: 'slug', current: slugFromPath(t.slug)},
        category: {_type: 'reference', _ref: catId},
        parentCategoryLabel: i18n(cat.title),
        sortOrder: (i + 1) * 10,
      }
      tx.createIfNotExists(treatmentDoc as any)
      createdTreatments++
    }
  }

  console.log(
    `   Prepared ${createdCategories} categories and ${createdTreatments} treatments (createIfNotExists — existing docs are untouched).`,
  )

  if (DRY_RUN) {
    console.log('\n✅  Dry run complete. Re-run without DRY_RUN=1 to commit.\n')
    return
  }

  const res = await tx.commit({visibility: 'async'})
  console.log(`\n✅  Committed transaction (${res.results.length} mutations).\n`)
}

run().catch((err) => {
  console.error('❌  Migration failed:', err)
  process.exit(1)
})
