import { sanityClient } from './config'
import { getCachedTranslation, translateNoToEn } from './lib/translate-free'

const DRY_RUN = process.env.DRY_RUN !== '0'

interface I18nItem {
  _type: string
  _key?: string
  language?: string
  value?: unknown
}

function getLang(item: I18nItem): string | undefined {
  return item.language || item._key
}

function isNorwegian(text: string): boolean {
  const t = text.toLowerCase();
  if (/[æøå]/.test(t)) return true;
  const noWords = [
    ' og ', ' eller ', ' som ', ' med ', ' fra ', ' til ', ' inngrep ',
    ' inngrepet ', ' pasient ', ' pasientene ', ' refertilisering ', 
    ' sterilisering ', ' sæd ', ' sædleder ', ' sædlederne ', ' sædblæren ', 
    ' testiklene ', ' sædceller ', ' sædprøve ', ' sæduttømmingen ', 
    ' narkose ', ' reise ', ' hjem ', ' samme ', ' dag ', ' spesialist ',
    ' er en ', ' for menn ', ' man ', ' kutter ', ' transportere ',
    ' av pasientene ', ' kan regne ', ' få spermier ', ' etter inngrepet ',
    ' gjøres i ', ' lett narkose ', ' kan reise ', ' en kontroll ', ' måned ',
    ' måneder ', ' etter inngrepet ', ' stoffskifte ', ' hormonsykdommer ',
    ' hormonutredning ', ' ventetid ', ' henvisning '
  ];
  for (const word of noWords) {
    if (t.includes(word)) return true;
  }
  return false;
}

function enNeedsTranslation(enItem: I18nItem | undefined, noItem: I18nItem | undefined): boolean {
  if (!enItem || enItem.value == null) return true;
  
  if (typeof enItem.value === 'string') {
    const val = enItem.value.trim();
    if (val.length === 0) return true;
    
    if (noItem && typeof noItem.value === 'string') {
      const noVal = noItem.value.trim();
      if (val === noVal && val.length > 8) {
        return true;
      }
    }
    
    if (isNorwegian(val)) {
      return true;
    }
    
    return false;
  }
  
  return false;
}

async function run() {
  console.log('▶ Migrate Treatment Intro to English')
  console.log(`  Dry run: ${DRY_RUN ? '✓ (no writes)' : '✗ (will commit changes to Sanity)'}\n`)

  const docs = await sanityClient.fetch<Record<string, unknown>[]>(
    `*[_type == "treatment"]`
  )

  console.log(`Found ${docs.length} treatment documents.\n`)

  let processed = 0
  let skipped = 0
  let errors = 0

  for (const doc of docs) {
    const titleObj = doc.title as I18nItem[] | undefined
    const titleNoObj = titleObj?.find(i => getLang(i) === 'no')
    const treatmentTitle = typeof titleNoObj?.value === 'string' ? titleNoObj.value : String(doc._id)

    const descArray = doc.description as I18nItem[] | undefined
    if (!descArray || !Array.isArray(descArray)) {
      console.log(`  · [${treatmentTitle}] skipped: no description field`)
      skipped++
      continue
    }

    const noItem = descArray.find(i => getLang(i) === 'no')
    const enItem = descArray.find(i => getLang(i) === 'en')

    if (!noItem || typeof noItem.value !== 'string' || !noItem.value.trim()) {
      console.log(`  · [${treatmentTitle}] skipped: no Norwegian intro text value`)
      skipped++
      continue
    }

    const noVal = noItem.value.trim()

    if (!enNeedsTranslation(enItem, noItem)) {
      console.log(`  · [${treatmentTitle}] skipped: English translation already valid`)
      skipped++
      continue
    }

    // Need translation
    console.log(`  ✎ [${treatmentTitle}] needs English translation.`)
    console.log(`    NO: "${noVal.substring(0, 100)}${noVal.length > 100 ? '...' : ''}"`)

    try {
      let enVal = getCachedTranslation(noVal)
      if (enVal) {
        console.log(`    [CACHE MATCH] -> "${enVal.substring(0, 100)}${enVal.length > 100 ? '...' : ''}"`)
      } else {
        console.log(`    Translating via free API...`)
        enVal = await translateNoToEn(noVal)
        if (enVal) {
          console.log(`    [TRANSLATED] -> "${enVal.substring(0, 100)}${enVal.length > 100 ? '...' : ''}"`)
        }
      }

      if (!enVal) {
        console.warn(`    ✗ Failed to translate intro for ${treatmentTitle}`)
        errors++
        continue
      }

      // Update/add EN value
      const updatedDesc = [...descArray]
      const enIdx = updatedDesc.findIndex(i => getLang(i) === 'en')
      if (enIdx >= 0) {
        updatedDesc[enIdx] = {
          ...updatedDesc[enIdx],
          _key: 'en',
          language: 'en',
          value: enVal
        }
      } else {
        updatedDesc.push({
          _type: noItem._type || 'internationalizedArrayTextValue',
          _key: 'en',
          language: 'en',
          value: enVal
        })
      }

      if (DRY_RUN) {
        console.log(`    ℹ Dry run: would patch description array`)
      } else {
        console.log(`    Committed patch to Sanity.`)
        await sanityClient
          .patch(String(doc._id))
          .set({ description: updatedDesc })
          .commit({ autoGenerateArrayKeys: true })
      }
      processed++
    } catch (e) {
      console.error(`    ✗ Error:`, (e as Error).message)
      errors++
    }
  }

  console.log(`\nMigration completed:`)
  console.log(`- Translated/Updated: ${processed}`)
  console.log(`- Skipped: ${skipped}`)
  console.log(`- Errors: ${errors}`)
}

run().catch(console.error)
