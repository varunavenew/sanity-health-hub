/**
 * Repair script: undo accidental i18n-wrapping of specialist.name (and any
 * stray top-level `title` field that was wrongly wrapped on specialist docs).
 *
 * Symptom in Studio: specialist list/preview shows "[object Object]" because
 * `name` is now an internationalizedArray instead of a plain string.
 *
 * What it does:
 *   - For every `specialist` doc:
 *       • If `name` is an array (i18n shape), unwrap to the Norwegian value
 *         (fallback: first available value). Set back as a plain string.
 *       • If a stray `title` field exists, unset it.
 *   - Idempotent: skips docs where `name` is already a string.
 *
 * Usage:
 *   cd test
 *   SANITY_TOKEN=<write_token> npx tsx sanity/repair-specialist-name.ts
 *   DRY_RUN=1 to preview without writing.
 */
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

const pickNo = (v: any): string => {
  if (typeof v === 'string') return v
  if (!Array.isArray(v)) return ''
  const no = v.find((x: any) => (x?.language || x?._key) === 'no')
  return (no?.value || v[0]?.value || '').toString()
}

async function run() {
  console.log(`🔍 Fetching specialist documents${DRY_RUN ? ' (DRY RUN)' : ''}…`)
  const docs: any[] = await sanityClient.fetch(
    `*[_type == "specialist"]{ _id, name, title }`
  )
  console.log(`   Found ${docs.length} specialist(s).`)

  let fixed = 0
  let skipped = 0

  for (const d of docs) {
    const nameNeedsFix = Array.isArray(d.name)
    const hasStrayTitle = d.title !== undefined && d.title !== null

    if (!nameNeedsFix && !hasStrayTitle) {
      skipped++
      continue
    }

    const patch: any = sanityClient.patch(d._id)

    if (nameNeedsFix) {
      const unwrapped = pickNo(d.name)
      if (!unwrapped) {
        console.warn(`   ⚠ ${d._id}: could not unwrap name, skipping.`)
        continue
      }
      patch.set({ name: unwrapped })
      console.log(`   ✓ ${d._id}: name → "${unwrapped}"`)
    }
    if (hasStrayTitle) {
      patch.unset(['title'])
      console.log(`   ✓ ${d._id}: removed stray "title" field`)
    }

    if (!DRY_RUN) await patch.commit()
    fixed++
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ Fixed: ${fixed}`)
  console.log(`⏭  Skipped (already clean): ${skipped}`)
  if (DRY_RUN) console.log('   (DRY RUN — no writes performed)')
}

run().catch((err) => {
  console.error('❌ Repair failed:', err)
  process.exit(1)
})
