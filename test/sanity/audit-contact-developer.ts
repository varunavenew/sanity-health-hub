import {createClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import path from 'path'

loadEnv({path: path.join(process.cwd(), '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env')})

const PROJECT_ID =
  process.env.SANITY_STUDIO_PROJECT_ID?.trim() || process.env.SANITY_PROJECT_ID?.trim()
const TOKEN = process.env.SANITY_TOKEN?.trim()
console.log(`SAFETY CHECK:\nproject=${PROJECT_ID}\ndataset=developer`)
if (PROJECT_ID !== '9jhqpk3a') throw new Error('bad project')

const client = createClient({
  projectId: PROJECT_ID!,
  dataset: 'developer',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: TOKEN,
})

async function main() {
  const page = await client.fetch(`*[_id=="contactPage"][0]{
    _id,
    title,
    introText,
    slug,
    secondaryCtaLabel,
    secondaryCtaPath,
    "heroImageUrl": heroImage.asset->url,
    ctaCards[]{title, description, ctaText, ctaAction, ctaLink, variant, icon},
    clinicsSection{
      showSection,
      title,
      "clinics": clinics[]->{_id, "title": title[language=="no"][0].value, "slug": slug[language=="no"][0].value.current, sortOrder, address}
    },
    "card2No": ctaCards[1].description[language=="no"][0].value,
    pageSections[]{_key,_type,subtitle,ctaCollection},
    contactForm{title,subtitle,submitButton}
  }`)
  console.log('clinic order:', page?.clinicsSection?.clinics?.map((c: {title?: string}) => c.title))
  console.log('card2No:', page?.card2No)
  console.log(
    'booking subtitle NO:',
    page?.pageSections?.[0]?.subtitle?.find((x: {language?: string}) => x.language === 'no')?.value,
  )
  console.log('ctaCollection:', page?.pageSections?.[0]?.ctaCollection)
  console.log(JSON.stringify(page, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
