/**
 * Read-only: list clinics on developer (and optionally compare production).
 * SAFETY: developer reads by default. Set COMPARE_PRODUCTION=1 for read-only prod too.
 */
import {createClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import path from 'path'

loadEnv({path: path.join(process.cwd(), '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env')})

const PROJECT_ID =
  process.env.SANITY_STUDIO_PROJECT_ID?.trim() ||
  process.env.SANITY_PROJECT_ID?.trim()
const TOKEN = process.env.SANITY_TOKEN?.trim()

function client(dataset: string) {
  console.log(`SAFETY CHECK:\nproject=${PROJECT_ID}\ndataset=${dataset}`)
  return createClient({
    projectId: PROJECT_ID!,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: TOKEN,
  })
}

const Q = `{
  "clinics": *[_type == "clinicPage" && !(_id in path("drafts.**"))] | order(sortOrder asc) {
    _id,
    "title": coalesce(title[_key == "no"][0].value, title[0].value),
    "slugNb": slug.no.current,
    "slugEn": slug.en.current,
    sortOrder,
    address,
    phone,
    "hasPrimaryImage": defined(primaryImage.asset),
    "hasHeroMedia": defined(heroMedia),
    "descNb": coalesce(description[_key == "no"][0].value, description[0].value)
  },
  "ski": *[_type == "clinicPage" && (
    _id match "*ski*" ||
    slug.no.current == "ski" ||
    slug.en.current == "ski" ||
    title[_key == "no"][0].value match "*Ski*"
  )]{ _id, "slugNb": slug.no.current, "title": title },
  "page": *[_type == "clinicsPage" && !(_id in path("drafts.**"))][0]{
    _id,
    "heroEyebrow": coalesce(heroEyebrow[_key == "no"][0].value, heroEyebrow[0].value),
    "heroTitle": coalesce(heroTitle[_key == "no"][0].value, heroTitle[0].value),
    "heroDescription": coalesce(heroDescription[_key == "no"][0].value, heroDescription[0].value),
    "hasHeroImage": defined(heroImage.asset) || defined(heroMedia),
    "pageSections": pageSections[]{_type, _key}
  }
}`

async function run() {
  const data = await client('developer').fetch(Q)
  console.log(JSON.stringify({dataset: 'developer', ...data}, null, 2))
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
