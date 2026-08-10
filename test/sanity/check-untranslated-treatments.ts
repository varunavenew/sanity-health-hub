import { sanityClient } from './config'
import { getCachedTranslation } from './lib/translate-free'

const FORCE = process.env.FORCE === '1'
const I18N_VALUE_TYPES = new Set([
  'internationalizedArrayStringValue',
  'internationalizedArrayTextValue',
  'internationalizedArrayBlockContentValue',
])

interface I18nItem {
  _type: string
  _key?: string
  language?: string
  value?: unknown
}

interface Job {
  path: (string | number)[]
  valueType: string
  noValue: unknown
  ptBlocks: boolean
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

function enHasValue(enItem: I18nItem | undefined, noItem: I18nItem | undefined): boolean {
  if (!enItem || enItem.value == null) return false;
  
  if (typeof enItem.value === 'string') {
    const val = enItem.value.trim();
    if (val.length === 0) return false;
    
    if (noItem && typeof noItem.value === 'string') {
      const noVal = noItem.value.trim();
      if (val === noVal && val.length > 8) {
        return false;
      }
    }
    
    if (isNorwegian(val)) {
      return false;
    }
    
    return true;
  }
  
  if (Array.isArray(enItem.value)) {
    if (enItem.value.length === 0) return false;
    
    const textContent = enItem.value
      .map((block: any) => {
        if (block._type === 'block' && Array.isArray(block.children)) {
          return block.children.map((child: any) => child.text || '').join(' ');
        }
        return '';
      })
      .join(' ');
      
    if (isNorwegian(textContent)) {
      return false;
    }
    
    if (noItem && Array.isArray(noItem.value)) {
      if (JSON.stringify(enItem.value) === JSON.stringify(noItem.value)) {
        if (textContent.trim().length > 12) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  return true;
}

function collectJobs(node: unknown, path: (string | number)[], jobs: Job[]) {
  if (node == null) return

  if (Array.isArray(node)) {
    const isI18nArray =
      node.length > 0 &&
      typeof node[0] === 'object' &&
      node[0] !== null &&
      I18N_VALUE_TYPES.has((node[0] as I18nItem)._type)

    if (isI18nArray) {
      const items = node as I18nItem[]
      const noItem = items.find((i) => getLang(i) === 'no')
      const enItem = items.find((i) => getLang(i) === 'en')
      if (noItem && noItem.value != null && (FORCE || !enHasValue(enItem, noItem))) {
        const ptBlocks =
          noItem._type === 'internationalizedArrayBlockContentValue' &&
          Array.isArray(noItem.value)
        jobs.push({
          path,
          valueType: noItem._type,
          noValue: noItem.value,
          ptBlocks,
        })
      }
      return
    }

    node.forEach((child, idx) => collectJobs(child, [...path, idx], jobs))
    return
  }

  if (typeof node === 'object') {
    for (const key of Object.keys(node as object)) {
      if (key.startsWith('_')) continue
      collectJobs((node as Record<string, unknown>)[key], [...path, key], jobs)
    }
  }
}

function collectUniqueStrings(jobs: Job[]): string[] {
  const set = new Set<string>()
  const walkBlocks = (blocks: unknown[]) => {
    for (const block of blocks) {
      const b = block as Record<string, unknown>
      if (b._type === 'block' && Array.isArray(b.children)) {
        for (const child of b.children as Record<string, unknown>[]) {
          if (child._type === 'span' && typeof child.text === 'string') {
            const t = child.text.trim()
            if (t.length >= 2) set.add(t)
          }
        }
      }
    }
  }
  for (const job of jobs) {
    if (job.ptBlocks && Array.isArray(job.noValue)) walkBlocks(job.noValue)
    else if (typeof job.noValue === 'string' && job.noValue.trim()) set.add(job.noValue.trim())
  }
  return [...set]
}

async function main() {
  const docs = await sanityClient.fetch<Record<string, unknown>[]>(
    `*[_type == "treatment"]`
  )
  const docJobs: { doc: Record<string, unknown>; jobs: Job[] }[] = []
  for (const doc of docs) {
    const jobs: Job[] = []
    collectJobs(doc, [], jobs)
    if (jobs.length > 0) docJobs.push({ doc, jobs })
  }

  const allJobs = docJobs.flatMap((d) => d.jobs)
  const uniqueStrings = collectUniqueStrings(allJobs)

  console.log(`Found ${docs.length} treatments, ${docJobs.length} have pending translations.`)
  console.log(`Total fields: ${allJobs.length}, Unique strings to translate: ${uniqueStrings.length}`)

  let cachedCount = 0
  let uncachedStrings: string[] = []

  for (const s of uniqueStrings) {
    const cached = getCachedTranslation(s)
    if (cached) {
      cachedCount++
    } else {
      uncachedStrings.push(s)
    }
  }

  console.log(`In Cache: ${cachedCount} / ${uniqueStrings.length}`)
  console.log(`Not in Cache: ${uncachedStrings.length}`)

  if (uncachedStrings.length > 0) {
    console.log('\n--- First 20 Uncached Strings ---')
    uncachedStrings.slice(0, 20).forEach((s, idx) => {
      console.log(`${idx + 1}: ${s.substring(0, 100)}${s.length > 100 ? '...' : ''}`)
    })
  }
}

main().catch(console.error)
