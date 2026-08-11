import {createClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import path from 'path'

loadEnv({path: path.join(process.cwd(), '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env.local')})

const PROJECT_ID = process.env.SANITY_PROJECT_ID?.trim()
const TOKEN = process.env.SANITY_TOKEN?.trim()
const DATASET = 'developer'
if (DATASET !== 'developer') throw new Error('refuse')
if (!PROJECT_ID || !TOKEN) throw new Error('missing env')

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: TOKEN,
})

async function main() {
  const doc = await client.fetch(`*[_id=="aboutPage"][0]{pageSections}`)
  const sections = (doc.pageSections || []).map((s: any) => {
    if (s._type !== 'pageSectionSpecialists') return s
    const next = {...s, limit: 100}
    delete next.seeAllLabel
    return next
  })
  await client.patch('aboutPage').set({pageSections: sections}).commit({autoGenerateArrayKeys: true})
  const check = await client.fetch(
    `*[_id=="aboutPage"][0]{pageSections[_type=="pageSectionSpecialists"][0]{limit,seeAllLabel,displayMode,title}}`,
  )
  console.log(JSON.stringify(check, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
