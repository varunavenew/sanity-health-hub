/**
 * Phase 5 — Migrate Site Settings business reputation from googleReviewSettings.
 *
 * Copies aggregate ratings into siteSettings.businessReputation when missing.
 * Does not delete googleReviewSettings.
 *
 * Usage:
 *   cd test && npm run migrate:site-settings-reputation:dry
 *   cd test && npm run migrate:site-settings-reputation
 */
import {sanityClient as client} from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const SITE_SETTINGS_ID = 'siteSettings'

type SettingsDoc = {
  _id: string
  businessReputation?: {
    googleAverageRating?: number
    legelistenAverageRating?: number
  }
}

async function main() {
  console.log(`Site Settings business reputation migration — DRY_RUN=${DRY_RUN}`)

  const legacy = await client.fetch<{
    googleAverageRating?: number
    legelistenAverageRating?: number
  } | null>(`*[_type == "googleReviewSettings" && !(_id in path("drafts.**"))][0]{
    googleAverageRating,
    legelistenAverageRating
  }`)

  const docs = await client.fetch<SettingsDoc[]>(
    `*[_type == "siteSettings"]{_id, businessReputation}`,
  )

  if (docs.length === 0) {
    console.error('No siteSettings documents found — STOP')
    process.exit(1)
  }

  const googleRating = legacy?.googleAverageRating ?? 4.6
  const legeRating = legacy?.legelistenAverageRating ?? 4.8

  for (const doc of docs) {
    const hasGoogle = typeof doc.businessReputation?.googleAverageRating === 'number'
    const hasLege = typeof doc.businessReputation?.legelistenAverageRating === 'number'
    if (hasGoogle && hasLege) {
      console.log(`skip ${doc._id}: businessReputation already set`)
      continue
    }

    const patch = {
      businessReputation: {
        googleAverageRating: doc.businessReputation?.googleAverageRating ?? googleRating,
        legelistenAverageRating: doc.businessReputation?.legelistenAverageRating ?? legeRating,
      },
    }

    if (DRY_RUN) {
      console.log(`[dry-run] patch ${doc._id}`, patch)
      continue
    }

    await client.patch(doc._id).set(patch).commit()
    console.log(`Updated ${doc._id} businessReputation`)
  }

  console.log(JSON.stringify({dryRun: DRY_RUN, source: legacy, googleRating, legeRating}, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
