/**
 * Evaluate singleton section-card chips against live developer documents.
 * Studio-only chip logic — no content writes.
 *
 * Usage: cd test && npx tsx sanity/verify-singleton-editor-chips.ts
 */
import fs from 'fs'
import path from 'path'
import {sanityClient as client} from './config'
import {aboutPageEditorConfig} from './page-editor/pages/aboutSections'
import {servicesPageEditorConfig} from './page-editor/pages/servicesSections'
import {insurancePageEditorConfig} from './page-editor/pages/insuranceSections'
import {pricingPageEditorConfig} from './page-editor/pages/pricingSections'
import {clinicsPageEditorConfig} from './page-editor/pages/clinicsSections'
import {contactPageEditorConfig} from './page-editor/pages/contactSections'
import {newsPageEditorConfig} from './page-editor/pages/newsSections'
import {guidePageEditorConfig} from './page-editor/pages/guideSections'
import {careersPageEditorConfig} from './page-editor/pages/careersSections'
import {privacyPageEditorConfig} from './page-editor/pages/privacySections'
import type {PageEditorConfig} from './page-editor/types'

const CONFIGS: Array<{id: string; config: PageEditorConfig}> = [
  {id: 'aboutPage', config: aboutPageEditorConfig},
  {id: 'servicesPage', config: servicesPageEditorConfig},
  {id: 'insurancePage', config: insurancePageEditorConfig},
  {id: 'pricingPage', config: pricingPageEditorConfig},
  {id: 'clinicsPage', config: clinicsPageEditorConfig},
  {id: 'contactPage', config: contactPageEditorConfig},
  {id: 'newsPage', config: newsPageEditorConfig},
  {id: 'guidePage', config: guidePageEditorConfig},
  {id: 'careersPage', config: careersPageEditorConfig},
  {id: 'privacyPolicyPage', config: privacyPageEditorConfig},
]

function classify(sectionId: string, chips: string[]): string {
  const joined = chips.join(' | ')
  if (chips.includes('Page-owned')) return 'Page-owned'
  if (chips.includes('Collection linked')) return 'Collection'
  if (chips.includes('Legacy') || chips.includes('Legacy only') || chips.includes('Legacy CTA')) {
    return 'Legacy'
  }
  if (
    sectionId === 'specialists' ||
    sectionId === 'articles' ||
    sectionId === 'bookingCta' ||
    sectionId === 'faq'
  ) {
    if (chips.includes('Empty')) return 'Shared Section (unused)'
    return 'Shared Section'
  }
  return 'Page-owned'
}

async function main() {
  const results: Array<{
    page: string
    sections: Array<{
      id: string
      title: string
      chips: string[]
      kind: string
    }>
  }> = []

  for (const {id, config} of CONFIGS) {
    const doc = await client.fetch<Record<string, unknown> | null>(
      `*[_id == $id][0]`,
      {id},
    )
    const sections = config.sections.map((section) => {
      const chips = section.getChips?.(doc || undefined) || ['(no chips)']
      return {
        id: section.id,
        title: section.title,
        chips,
        kind: classify(section.id, chips),
      }
    })
    results.push({page: id, sections})

    console.log(`\n## ${config.title} (${id})`)
    for (const s of sections) {
      const falseNeg =
        s.chips.includes('Not configured') &&
        (s.kind === 'Page-owned' || s.kind === 'Collection' || s.kind === 'Shared Section')
      const mark = s.chips.includes('Empty')
        ? '○'
        : s.chips.includes('Not configured')
          ? '✗'
          : '●'
      console.log(
        `  ${mark} ${s.title.padEnd(22)} ${s.chips.join(' · ')}  [${s.kind}]${
          falseNeg ? ' ⚠' : ''
        }`,
      )
    }
  }

  const out = path.join(process.cwd(), 'sanity', '.verify-singleton-editor-chips.json')
  fs.writeFileSync(out, JSON.stringify({results, generatedAt: new Date().toISOString()}, null, 2))
  console.log(`\nWrote ${out}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
