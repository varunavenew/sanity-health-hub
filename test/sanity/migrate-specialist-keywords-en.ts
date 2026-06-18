#!/usr/bin/env npx tsx
import {sanityClient} from './config'

type I18nValue = {_type?: string; _key?: string; language?: string; value?: string}
type SpecialistDoc = {
  _id: string
  name?: string
  role?: string | I18nValue[]
  subtitle?: string | I18nValue[]
  specialties?: Array<string | I18nValue[]>
}

const DRY_RUN = process.env.DRY_RUN === '1'

const TERM_MAP: Array<[string, string]> = [
  ['Gynekologisk kirurg', 'Gynecological surgeon'],
  ['Fødselslege', 'Obstetrician'],
  ['Fostermedisiner', 'Fetal medicine specialist'],
  ['Overvektskirurgi', 'Obesity surgery'],
  ['Gastrokirurg', 'Gastrointestinal surgeon'],
  ['Robotkirurg', 'Robotic surgeon'],
  ['Embryolog', 'Embryologist'],
  ['Fertilitet', 'Fertility'],
  ['Uroterapeut', 'Urotherapist'],
  ['Urologi', 'Urology'],
  ['Urolog', 'Urologist'],
  ['Ortopedi', 'Orthopedics'],
  ['Ortoped', 'Orthopedic surgeon'],
  ['Gynekolog', 'Gynecologist'],
  ['Gynekologi', 'Gynecology'],
  ['Spesialist', 'Specialist'],
  ['Kirurg', 'Surgeon'],
  ['Endoskopi', 'Endoscopy'],
  ['Androlog', 'Andrologist'],
  ['Seksolog', 'Sexologist'],
]

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function translateKeywords(noText: string): string {
  let result = noText
  const sorted = [...TERM_MAP].sort((a, b) => b[0].length - a[0].length)
  for (const [no, en] of sorted) {
    result = result.replace(new RegExp(`\\b${escapeRegExp(no)}\\b`, 'gi'), en)
  }
  return result
}

function readI18n(value: string | I18nValue[] | undefined, lang: 'no' | 'en'): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  const matchLang = value.find((v) => (v.language || v._key) === lang)?.value
  if (matchLang) return matchLang
  const matchNo = value.find((v) => (v.language || v._key) === 'no')?.value
  if (matchNo) return matchNo
  return value[0]?.value || ''
}

function asI18nArray(no: string, en: string): I18nValue[] {
  return [
    {
      _type: 'internationalizedArrayStringValue',
      _key: 'no',
      language: 'no',
      value: no,
    },
    {
      _type: 'internationalizedArrayStringValue',
      _key: 'en',
      language: 'en',
      value: en,
    },
  ]
}

async function run() {
  const specialists = await sanityClient.fetch<SpecialistDoc[]>(
    `*[_type == "specialist" && !(_id in path("drafts.**"))]{_id, name, role, subtitle, specialties}`,
  )

  if (!specialists.length) {
    console.log('No specialist documents found.')
    return
  }

  let changed = 0
  for (const doc of specialists) {
    const noRole = readI18n(doc.role, 'no')
    const noSubtitle = readI18n(doc.subtitle, 'no')
    const role = noRole ? asI18nArray(noRole, translateKeywords(noRole)) : undefined
    const subtitle = noSubtitle
      ? asI18nArray(noSubtitle, translateKeywords(noSubtitle))
      : undefined

    const specialties = Array.isArray(doc.specialties)
      ? doc.specialties
          .map((entry, index) => {
            const raw =
              entry && typeof entry === 'object' && !Array.isArray(entry) && 'label' in entry
                ? (entry as { label?: string | I18nValue[] }).label
                : entry
            const noValue = readI18n(raw as string | I18nValue[], 'no')
            const translated = asI18nArray(noValue, translateKeywords(noValue))
            const existing =
              entry && typeof entry === 'object' && !Array.isArray(entry)
                ? (entry as { _key?: string })
                : undefined
            return {
              _type: 'specialtyItem',
              _key: existing?._key || `spec-${index}`,
              label: translated,
            }
          })
          .filter((item) => Array.isArray(item.label) && item.label.length > 0)
      : undefined

    const setPayload: Record<string, unknown> = {}
    if (role) setPayload.role = role
    if (subtitle) setPayload.subtitle = subtitle
    if (specialties) setPayload.specialties = specialties
    if (!Object.keys(setPayload).length) continue

    changed += 1
    if (DRY_RUN) {
      console.log(`DRY ${doc._id} ${doc.name || ''}`)
      continue
    }

    await sanityClient.patch(doc._id).set(setPayload).commit()
  }

  console.log(
    `✓ ${DRY_RUN ? 'Would update' : 'Updated'} ${changed} specialist docs with EN keyword translations`,
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
