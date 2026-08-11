#!/usr/bin/env npx tsx
/**
 * Developer-only: normalize newsPage to match reference Aktuelt structure.
 *
 *   cd test && npx tsx sanity/normalize-aktuelt-developer.ts
 */
import {randomBytes} from 'crypto'
import {DATASET, sanityClient} from './config'
import {patchSingletonFields} from './lib/patch-singleton'
import {i18nString, i18nText} from './lib/category-landing-i18n'

function key(): string {
  return randomBytes(6).toString('hex')
}

/** Reference order from https://avenewdemo.online/aktuelt (2026-08-10, 17 articles). */
const FEATURED_SLUGS = [
  'vi-har-alltid-visst-at-vi-ville-bli-foreldre-sammen',
  '18-maneder-etter-hofteoperasjon-hos-cmedical',
  'madeleine-engen-vinner-av-kvinnehelseprisen-her-awards-2026',
  'overgangsalderen-er-en-ny-fase-ikke-slutten-pa-noe',
]

const LISTING_SLUGS = [
  'vi-har-alltid-visst-at-vi-ville-bli-foreldre-sammen',
  '18-maneder-etter-hofteoperasjon-hos-cmedical',
  'madeleine-engen-vinner-av-kvinnehelseprisen-her-awards-2026',
  'overgangsalderen-er-en-ny-fase-ikke-slutten-pa-noe',
  'nar-kroppen-ikke-fungerer-etter-fodsel-og-ingen-lytter',
  'minis-historie-gjennom-mutterns-oyne',
  'slik-forbereder-hun-seg-til-sydpolen',
  'robotassistert-overvektskirurgi-presisjon-trygghet-og-varige-resultater',
  'fra-operasjonsbordet-til-sydpolen-pa-14-maneder',
  'livio-oslo-blir-en-del-av-cmedical-og-tilbudet-til-pasientene-styrkes',
  'historiene-ingen-snakker-om-etter-fodsel',
  'jeg-matte-grate-pa-telefonen-for-a-bli-tatt-pa-alvor',
  'maria-falt-i-sahara-og-mellom-alle-stoler-i-helse-norge',
  'cmedical-og-nors-care-inngar-samarbeid-vil-styrke-kvinners-kunnskap-om-egen-helse',
  'cmedical-kjoper-livio-oslo',
  'tanken-slo-meg-ikke-at-det-kunne-vaere-meg',
  'ved-a-lukke-kvinnehelsegapet-kan-hver-kvinne-fa-syv-flere-friske-dager-i-lopet-av-et-ar',
]

async function articleIdForSlug(slug: string): Promise<string | null> {
  const id = await sanityClient.fetch<string | null>(
    `*[_type == "article" && !(_id in path("drafts.**")) && coalesce(
      slug[language == "no"][0].value.current,
      slug[_key == "no"][0].value.current,
      slug[0].value.current,
      slug.current
    ) == $slug][0]._id`,
    {slug},
  )
  return id || null
}

async function refsForSlugs(slugs: string[]) {
  const refs = []
  for (const slug of slugs) {
    const id = await articleIdForSlug(slug)
    if (!id) {
      console.warn(`  ⚠ Missing article slug: ${slug}`)
      continue
    }
    refs.push({
      _type: 'reference' as const,
      _ref: id,
      _key: key(),
    })
  }
  return refs
}

async function main() {
  if (DATASET !== 'developer') {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`)
  }

  const featuredRefs = await refsForSlugs(FEATURED_SLUGS)
  const listingRefs = await refsForSlugs(LISTING_SLUGS)

  const patch = {
    featuredArticles: featuredRefs,
    listingArticles: listingRefs,
    listSize: 9,
    socialMode: 'cms',
    socialPostLimit: 4,
    socialSectionTitle: i18nString(
      'Følg oss på sosiale medier',
      'Follow us on social media',
    ),
    instagramSectionTitle: i18nString(
      'Siste innlegg fra Instagram',
      'Latest posts from Instagram',
    ),
    socialPlatformCards: [
      {
        _key: key(),
        _type: 'newsSocialPlatformCard',
        platform: 'instagram',
        title: i18nString('Instagram', 'Instagram'),
        handle: i18nString('@cmedical.no', '@cmedical.no'),
        description: i18nText(
          'Hverdagen i klinikkene, fagtips og nytt fra spesialistene.',
          'Everyday life in the clinics, expert tips and news from our specialists.',
        ),
        url: 'https://www.instagram.com/cmedical.no',
      },
      {
        _key: key(),
        _type: 'newsSocialPlatformCard',
        platform: 'facebook',
        title: i18nString('Facebook', 'Facebook'),
        handle: i18nString('CMedical', 'CMedical'),
        description: i18nText(
          'Nyheter, arrangementer og oppdateringer fra klinikkene.',
          'News, events and updates from our clinics.',
        ),
        url: 'https://www.facebook.com/cmedical.no',
      },
      {
        _key: key(),
        _type: 'newsSocialPlatformCard',
        platform: 'linkedin',
        title: i18nString('LinkedIn', 'LinkedIn'),
        handle: i18nString('CMedical', 'CMedical'),
        description: i18nText(
          'Fagartikler, ledige stillinger og nyheter fra selskapet.',
          'Professional articles, job openings and company news.',
        ),
        url: 'https://www.linkedin.com/company/cmedical',
      },
      {
        _key: key(),
        _type: 'newsSocialPlatformCard',
        platform: 'snapchat',
        title: i18nString('Snapchat', 'Snapchat'),
        handle: i18nString('cmedical', 'cmedical'),
        description: i18nText(
          'Kort og uformelt — bak kulissene hos behandlerne våre.',
          'Short and informal — behind the scenes with our clinicians.',
        ),
        url: 'https://www.snapchat.com/add/cmedical',
      },
    ],
    instagramProfile: {
      profileUrl: 'https://www.instagram.com/cmedical.no',
      username: i18nString('cmedical.no', 'cmedical.no'),
      displayName: i18nString('CMedical Norge', 'CMedical Norway'),
      followLabel: i18nString('Følg', 'Follow'),
      postsCount: '199',
      followersCount: '3 719',
      followingCount: '319',
      category: i18nString('Medisin og helse', 'Medicine and health'),
      bio: i18nText(
        'Vi har samlet spesialister innen gynekologi, fertilitet, urologi og ortopedi.\nMajorstuen Oslo | Bekkestua | Moelv | Moss',
        'We bring together specialists in gynaecology, fertility, urology and orthopaedics.\nMajorstuen Oslo | Bekkestua | Moelv | Moss',
      ),
    },
  }

  await patchSingletonFields('newsPage', patch, 'newsPage')
  console.log('✓ Patched newsPage on developer dataset')
  console.log(`  featuredArticles: ${featuredRefs.length}`)
  console.log(`  listingArticles: ${listingRefs.length}`)
  console.log('  socialPlatformCards: 4')
  console.log('  instagramProfile: configured')
  console.log('\nNOTE: Editorial order matches reference Aktuelt listing (17 articles).')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
