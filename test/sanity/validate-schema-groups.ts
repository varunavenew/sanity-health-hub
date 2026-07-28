/**
 * Validate Sanity document schemas for undefined groups/fieldsets.
 * Catches Studio errors like: Field group "content" is not defined for schema type "clinicPage"
 *
 * Usage:
 *   cd test
 *   npx tsx sanity/validate-schema-groups.ts
 */
import {schemaTypes} from '../schemaTypes/index'

type SchemaField = {
  name?: string
  group?: string
  fieldset?: string
  fields?: SchemaField[]
  of?: SchemaField[]
  type?: string
}

type SchemaDoc = {
  name?: string
  title?: string
  type?: string
  groups?: Array<{name: string; title?: string}>
  fieldsets?: Array<{name: string; options?: {collapsible?: boolean; collapsed?: boolean}}>
  fields?: SchemaField[]
}

const SINGLETON_PAGE_TYPES = [
  'aboutPage',
  'servicesPage',
  'insurancePage',
  'pricingPage',
  'clinicsPage',
  'contactPage',
  'newsPage',
  'guidePage',
  'careersPage',
  'privacyPolicyPage',
] as const

/** Non-singleton types that use pageSectionsFieldForGroup with custom groups. */
const EXTRA_VALIDATED_TYPES = ['clinicPage'] as const

const REQUIRED_COLLAPSED_FIELDSETS = [
  'testimonials',
  'sharedSections',
  'seo',
  'legacy',
  'advanced',
] as const

type Issue = {type: string; message: string}

function validateSchema(schema: SchemaDoc, issues: Issue[]) {
  if (schema.type !== 'document' || !schema.name || !schema.fields) return

  const definedGroups = new Set((schema.groups || []).map((g) => g.name))
  const definedFieldsets = new Set((schema.fieldsets || []).map((f) => f.name))

  // Only top-level document fields use document groups/fieldsets in Studio.
  for (const field of schema.fields) {
    const label = `${schema.name}.${field.name || '(unnamed)'}`
    if (field.group && !definedGroups.has(field.group)) {
      issues.push({
        type: schema.name,
        message: `${label}: group "${field.group}" is not defined on schema`,
      })
    }
    if (field.fieldset && !definedFieldsets.has(field.fieldset)) {
      issues.push({
        type: schema.name,
        message: `${label}: fieldset "${field.fieldset}" is not defined on schema`,
      })
    }
  }

  if (
    SINGLETON_PAGE_TYPES.includes(schema.name as (typeof SINGLETON_PAGE_TYPES)[number]) ||
    EXTRA_VALIDATED_TYPES.includes(schema.name as (typeof EXTRA_VALIDATED_TYPES)[number])
  ) {
    // clinicPage: only group/fieldset checks above (no singleton fieldset requirements)
    if (!SINGLETON_PAGE_TYPES.includes(schema.name as (typeof SINGLETON_PAGE_TYPES)[number])) {
      return
    }
    for (const required of ['hero', 'content'] as const) {
      if (!definedGroups.has(required)) {
        issues.push({
          type: schema.name,
          message: `Singleton page missing required group "${required}"`,
        })
      }
    }
    for (const fsName of REQUIRED_COLLAPSED_FIELDSETS) {
      const fs = schema.fieldsets?.find((f) => f.name === fsName)
      if (!fs) {
        issues.push({
          type: schema.name,
          message: `Singleton page missing fieldset "${fsName}"`,
        })
        continue
      }
      const collapsed = fs.options?.collapsed === true
      const collapsible = fs.options?.collapsible === true
      if (!collapsed || !collapsible) {
        issues.push({
          type: schema.name,
          message: `Fieldset "${fsName}" must be collapsible and collapsed by default`,
        })
      }
    }
  }
}

function run() {
  const issues: Issue[] = []
  const documents = (schemaTypes as SchemaDoc[]).filter((s) => s?.type === 'document')

  for (const schema of documents) {
    validateSchema(schema, issues)
  }

  console.log('▶ Schema group / fieldset validation')
  console.log(`  Document types scanned: ${documents.length}`)
  console.log(`  Singleton pages checked: ${SINGLETON_PAGE_TYPES.length}`)

  if (!issues.length) {
    console.log('\n✓ No group/fieldset issues found')
    return
  }

  console.log(`\n✗ ${issues.length} issue(s):\n`)
  for (const issue of issues) {
    console.log(`  [${issue.type}] ${issue.message}`)
  }
  process.exitCode = 1
}

run()
