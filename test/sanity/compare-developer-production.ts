/**
 * Read-only: compare key Treatment/Pricing/Homepage metrics
 * between developer and production (project 9jhqpk3a).
 *
 * Does not write. Uses two clients.
 */
import {createClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import path from 'path'

loadEnv({path: path.join(process.cwd(), '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env')})

const PROJECT_ID =
  process.env.SANITY_STUDIO_PROJECT_ID?.trim() ||
  process.env.SANITY_PROJECT_ID?.trim() ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()
const TOKEN = process.env.SANITY_TOKEN?.trim()

if (!PROJECT_ID || !TOKEN) {
  console.error('Missing SANITY_PROJECT_ID / SANITY_TOKEN')
  process.exit(1)
}

function client(dataset: string) {
  return createClient({
    projectId: PROJECT_ID!,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: TOKEN,
  })
}

const QUERY = `{
  "publishedTreatments": count(*[_type == "treatment" && !(_id in path("drafts.**"))]),
  "draftTreatments": count(*[_type == "treatment" && _id in path("drafts.**")]),
  "missingCategories": count(*[_type == "treatment" && !(_id in path("drafts.**")) && count(coalesce(categories[_ref != null], [])) == 0]),
  "specialistsBands": count(*[_type == "treatment" && !(_id in path("drafts.**")) && count(pageSections[_type == "pageSectionSpecialists"]) > 0]),
  "missingDisplayMode": count(*[_type == "treatment" && !(_id in path("drafts.**")) && count(pageSections[_type == "pageSectionSpecialists" && !(displayMode in ["all","manual","category"])]) > 0]),
  "insuranceWithCollection": count(*[_type == "treatment" && !(_id in path("drafts.**")) && count(pageSections[_type == "pageSectionInsurance" && defined(insuranceCollection._ref)]) > 0]),
  "insuranceBands": count(*[_type == "treatment" && !(_id in path("drafts.**")) && count(pageSections[_type == "pageSectionInsurance"]) > 0]),
  "homepage": *[_type == "homepage" && !(_id in path("drafts.**"))][0]{
    specialistsSection{displayMode, layout, maxItems}
  },
  "pricing": *[_id == "pricingPage"][0]{
    "hasSection": defined(specialistsSection),
    specialistsSection{displayMode, layout, maxItems}
  },
  "pricingDraft": *[_id == "drafts.pricingPage"][0]{
    "hasSection": defined(specialistsSection),
    specialistsSection{displayMode, layout, maxItems}
  }
}`

async function run() {
  const [developer, production] = await Promise.all([
    client('developer').fetch(QUERY),
    client('production').fetch(QUERY),
  ])

  console.log(
    JSON.stringify(
      {
        projectId: PROJECT_ID,
        developer,
        production,
        note: 'Read-only comparison. Making developer identical to production requires dataset copy/export-import.',
      },
      null,
      2,
    ),
  )
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
