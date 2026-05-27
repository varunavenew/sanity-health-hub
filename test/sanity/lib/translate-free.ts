/**
 * Free machine translation without API keys.
 * Providers: lingva (default) | mymemory | google (avoid — rate limits easily)
 */
import * as fs from 'fs'
import * as path from 'path'
import { translate as googleTranslate } from '@vitalets/google-translate-api'

const CACHE_FILE =
  process.env.TRANSLATION_CACHE ||
  path.join(__dirname, '..', '.translation-cache.json')

const SEED_FILE = path.join(__dirname, '..', 'translation-cache.seed.json')
const HOSTS_CACHE_FILE = path.join(__dirname, '..', '.lingva-hosts.json')

const DELAY_MS = Number(process.env.TRANSLATE_DELAY_MS || 1500)
const PROVIDER = (process.env.TRANSLATE_PROVIDER || 'lingva').toLowerCase()
const CONTINUE_ON_ERROR = process.env.CONTINUE_ON_ERROR !== '0'
const OFFLINE_ONLY = process.env.OFFLINE_ONLY === '1'
/** Google is rate-limited on many IPs — off unless explicitly enabled */
const ENABLE_GOOGLE_FALLBACK = process.env.ENABLE_GOOGLE_FALLBACK === '1'

const LINGVA_INSTANCES_URL =
  'https://raw.githubusercontent.com/thedaviddelta/lingva-translate/main/instances.json'

const DEFAULT_LINGVA_HOSTS = [
  'lingva.ml',
  'translate.plausibility.cloud',
  'translate.jae.fi',
  'translate.dr460nf1r3.org',
  'translate.igna.wtf',
  'lingva.lunar.icu',
  'translate.projectsegfau.lt',
]

type Cache = Record<string, string>

let cache: Cache = {}
let dirty = false
let workingHosts: string[] | null = null

function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      cache = { ...cache, ...JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')) }
    }
  } catch {
    /* ignore */
  }
  try {
    if (fs.existsSync(SEED_FILE)) {
      cache = { ...JSON.parse(fs.readFileSync(SEED_FILE, 'utf8')), ...cache }
    }
  } catch {
    /* ignore */
  }
}

export function saveCache() {
  if (!dirty) return
  fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true })
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
  dirty = false
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function hostFromInstance(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

async function probeLingvaHost(host: string): Promise<boolean> {
  try {
    const url = `https://${host}/api/v1/no/en/${encodeURIComponent('Les mer')}`
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) })
    if (!res.ok) return false
    const json = await res.json()
    return typeof json?.translation === 'string' && json.translation.length > 0
  } catch {
    return false
  }
}

/** Pick working Lingva mirrors once per run (cached on disk for 1 hour). */
export async function getWorkingLingvaHosts(): Promise<string[]> {
  if (workingHosts) return workingHosts

  try {
    if (fs.existsSync(HOSTS_CACHE_FILE)) {
      const saved = JSON.parse(fs.readFileSync(HOSTS_CACHE_FILE, 'utf8')) as {
        at: number
        hosts: string[]
      }
      if (Date.now() - saved.at < 60 * 60 * 1000 && saved.hosts.length > 0) {
        workingHosts = saved.hosts
        return workingHosts
      }
    }
  } catch {
    /* ignore */
  }

  let candidates = [...DEFAULT_LINGVA_HOSTS]
  if (process.env.LINGVA_HOSTS) {
    candidates = process.env.LINGVA_HOSTS.split(',').map((h) => h.trim())
  } else {
    try {
      const res = await fetch(LINGVA_INSTANCES_URL, { signal: AbortSignal.timeout(10_000) })
      if (res.ok) {
        const list = (await res.json()) as string[]
        candidates = list.map(hostFromInstance)
      }
    } catch {
      /* use defaults */
    }
  }

  // Never use known-bad mirror that spams 403 in logs
  candidates = candidates.filter((h) => !h.includes('garudalinux'))

  const ok: string[] = []
  console.log('  Probing Lingva mirrors…')
  for (const host of candidates) {
    if (await probeLingvaHost(host)) {
      ok.push(host)
      console.log(`    ✓ ${host}`)
    }
  }

  if (ok.length === 0) {
    console.warn('  ⚠ No Lingva mirrors responded — will skip or use MyMemory fallback')
  }

  workingHosts = ok
  fs.writeFileSync(
    HOSTS_CACHE_FILE,
    JSON.stringify({ at: Date.now(), hosts: ok }, null, 2)
  )
  return ok
}

async function lingvaNoToEn(text: string, hosts: string[]): Promise<string> {
  const encoded = encodeURIComponent(text.slice(0, 1800))
  let lastErr: Error | null = null
  for (const host of hosts) {
    try {
      const url = `https://${host}/api/v1/no/en/${encoded}`
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000) })
      if (!res.ok) {
        lastErr = new Error(`${host} HTTP ${res.status}`)
        continue
      }
      const json = await res.json()
      const out = json?.translation
      if (typeof out !== 'string' || !out.trim()) {
        lastErr = new Error(`${host} empty`)
        continue
      }
      return out.trim()
    } catch (e) {
      lastErr = e instanceof Error ? e : new Error(String(e))
    }
  }
  throw lastErr || new Error('All Lingva hosts failed')
}

async function googleNoToEn(text: string): Promise<string> {
  const res = await googleTranslate(text, { from: 'no', to: 'en' })
  return res.text?.trim() || ''
}

async function myMemoryNoToEn(text: string): Promise<string> {
  await sleep(2000)
  const q = encodeURIComponent(text.slice(0, 450))
  const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=no%7Cen`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`)
  const json = await res.json()
  if (json.quotaFinished) throw new Error('MyMemory quota finished')
  const out = json?.responseData?.translatedText
  if (typeof out !== 'string' || !out.trim()) throw new Error('MyMemory empty')
  return out.trim()
}

async function translateOnce(text: string): Promise<string> {
  if (PROVIDER === 'google') return googleNoToEn(text)
  if (PROVIDER === 'mymemory') return myMemoryNoToEn(text)

  const hosts = await getWorkingLingvaHosts()
  if (hosts.length > 0) {
    try {
      return await lingvaNoToEn(text, hosts)
    } catch (e) {
      if (!ENABLE_GOOGLE_FALLBACK) {
        try {
          return await myMemoryNoToEn(text)
        } catch {
          throw e
        }
      }
      console.warn(`    ⚠ Lingva failed — trying Google (set ENABLE_GOOGLE_FALLBACK=0 to avoid)`)
      return googleNoToEn(text)
    }
  }

  if (ENABLE_GOOGLE_FALLBACK) return googleNoToEn(text)
  return myMemoryNoToEn(text)
}

export async function translateNoToEn(text: string): Promise<string> {
  const trimmed = text?.trim()
  if (!trimmed) return ''

  loadCache()
  if (cache[trimmed]) return cache[trimmed]

  if (OFFLINE_ONLY) {
    if (CONTINUE_ON_ERROR) return ''
    throw new Error(`No cache entry for: ${trimmed.slice(0, 60)}…`)
  }

  await sleep(DELAY_MS)
  try {
    const translated = await translateOnce(trimmed)
    if (!translated) return ''
    cache[trimmed] = translated
    dirty = true
    saveCache() // save after every success so Ctrl+C does not lose progress
    return translated
  } catch (e) {
    if (CONTINUE_ON_ERROR) {
      console.warn(`    ⚠ skip: ${(e as Error).message}`)
      return ''
    }
    throw e
  }
}

export function getCacheSize(): number {
  loadCache()
  return Object.keys(cache).length
}

export function getCachedTranslation(text: string): string | undefined {
  loadCache()
  return cache[text?.trim()]
}
