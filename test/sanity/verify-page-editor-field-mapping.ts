/**
 * Verify every singleton page-editor section maps to real schema field names,
 * and that the shared filter finds Content/SEO fields when only Hero is selected.
 *
 * Run: npx tsx sanity/verify-page-editor-field-mapping.ts
 */
import {schemaTypes} from '../schemaTypes'
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
import {homepagePageEditorConfig} from './page-editor/pages/homepageSections'
import {
  filterMembersByFieldNames,
  listMemberFieldNames,
  resolveMembersForSectionFiltering,
  type FormMemberLike,
} from './page-editor/filterMembers'
import type {PageEditorConfig} from './page-editor/types'

const pages: {
  id: string
  schemaName: string
  config: PageEditorConfig
  hasGroups: boolean
}[] = [
  {id: 'homepage', schemaName: 'homepage', config: homepagePageEditorConfig, hasGroups: false},
  {id: 'about', schemaName: 'aboutPage', config: aboutPageEditorConfig, hasGroups: true},
  {id: 'services', schemaName: 'servicesPage', config: servicesPageEditorConfig, hasGroups: true},
  {id: 'insurance', schemaName: 'insurancePage', config: insurancePageEditorConfig, hasGroups: true},
  {id: 'pricing', schemaName: 'pricingPage', config: pricingPageEditorConfig, hasGroups: true},
  {id: 'clinics', schemaName: 'clinicsPage', config: clinicsPageEditorConfig, hasGroups: true},
  {id: 'contact', schemaName: 'contactPage', config: contactPageEditorConfig, hasGroups: true},
  {id: 'news', schemaName: 'newsPage', config: newsPageEditorConfig, hasGroups: true},
  {id: 'guide', schemaName: 'guidePage', config: guidePageEditorConfig, hasGroups: true},
  {id: 'careers', schemaName: 'careersPage', config: careersPageEditorConfig, hasGroups: true},
  {id: 'privacy', schemaName: 'privacyPolicyPage', config: privacyPageEditorConfig, hasGroups: true},
]

function schemaFieldNames(schemaName: string): Set<string> {
  const doc = (schemaTypes as {name?: string; fields?: {name?: string}[]}[]).find(
    (t) => t?.name === schemaName,
  )
  if (!doc?.fields) {
    throw new Error(`Schema missing: ${schemaName}`)
  }
  return new Set(doc.fields.map((f) => f.name).filter((n): n is string => Boolean(n)))
}

function buildSimulatedMembers(
  schemaName: string,
  selectedGroup: string | null,
): {members: FormMemberLike[]; _allMembers: FormMemberLike[]} {
  const doc = (schemaTypes as {name?: string; fields?: any[]}[]).find((t) => t?.name === schemaName)
  const fields: any[] = doc?.fields || []
  const byFieldset = new Map<string, FormMemberLike[]>()
  const top: FormMemberLike[] = []

  for (const field of fields) {
    const group = field.group as string | undefined
    const inSelectedGroup =
      !selectedGroup || !group || group === selectedGroup || selectedGroup === 'all-fields'
    const member: FormMemberLike = {
      kind: 'field',
      name: field.name,
      inSelectedGroup,
      hidden: field.hidden === true ? true : undefined,
    }
    if (field.fieldset) {
      const list = byFieldset.get(field.fieldset) || []
      list.push(member)
      byFieldset.set(field.fieldset, list)
    } else {
      top.push(member)
    }
  }

  const all: FormMemberLike[] = [...top]
  for (const [name, setMembers] of byFieldset) {
    const anySelected = setMembers.some((m) => m.inSelectedGroup !== false)
    all.push({
      kind: 'fieldSet',
      name,
      inSelectedGroup: anySelected,
      fieldSet: {name, members: setMembers},
    })
  }

  const members = all
    .map((m) => {
      if (m.kind === 'field') return m.inSelectedGroup === false ? null : m
      if (m.kind === 'fieldSet' && m.fieldSet?.members) {
        const filtered = m.fieldSet.members.filter((c) => c.inSelectedGroup !== false)
        if (!filtered.length) return null
        return {
          ...m,
          inSelectedGroup: true,
          fieldSet: {...m.fieldSet, members: filtered},
        }
      }
      return m
    })
    .filter(Boolean) as FormMemberLike[]

  return {members, _allMembers: all}
}

let failures = 0
const report: string[] = []

for (const page of pages) {
  const schemaFields = schemaFieldNames(page.schemaName)
  report.push(`\n## ${page.id} (${page.schemaName})`)
  const selectedGroup = page.hasGroups ? 'hero' : null
  const sim = buildSimulatedMembers(page.schemaName, selectedGroup)
  const source = resolveMembersForSectionFiltering(sim)

  for (const section of page.config.sections) {
    if (section.infoPanel) {
      report.push(`  o ${section.id.padEnd(18)} info panel (no fields)`)
      continue
    }
    if (section.fields.length === 0) {
      report.push(`  o ${section.id.padEnd(18)} notice-only (0 fields)`)
      continue
    }

    const missingInSchema = section.fields.filter((f) => !schemaFields.has(f))
    const filtered = filterMembersByFieldNames(source, section.fields, {
      flattenFieldSets: false,
      includeOutsideSelectedGroup: true,
    })
    const found = listMemberFieldNames(filtered)
    const missingInFilter = section.fields.filter((f) => !found.includes(f))

    const broken = filterMembersByFieldNames(sim.members, section.fields, {
      flattenFieldSets: false,
      includeOutsideSelectedGroup: true,
    })
    const brokenMissing = section.fields.filter(
      (f) => !listMemberFieldNames(broken).includes(f),
    )

    if (missingInSchema.length || missingInFilter.length) {
      failures += 1
      report.push(
        `  X ${section.id.padEnd(18)} mapped=[${section.fields.join(', ')}] ` +
          (missingInSchema.length ? `MISSING_SCHEMA=[${missingInSchema.join(', ')}] ` : '') +
          (missingInFilter.length ? `MISSING_FILTER=[${missingInFilter.join(', ')}]` : ''),
      )
    } else {
      const wouldHaveFailed = brokenMissing.length > 0
      report.push(
        `  OK ${section.id.padEnd(18)} fields=[${section.fields.join(', ')}]` +
          (wouldHaveFailed ? '  (would fail on members-only / active-group)' : ''),
      )
    }
  }
}

console.log(report.join('\n'))
console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'}: ${failures} section mapping failure(s)`)
process.exit(failures === 0 ? 0 : 1)
