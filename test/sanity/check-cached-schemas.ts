import * as fs from 'fs'
import * as path from 'path'

const STRINGS_FILE = path.join(__dirname, '..', 'schema_strings.json')
const CACHE_FILE = path.join(__dirname, '.translation-cache.json')

function run() {
  if (!fs.existsSync(STRINGS_FILE)) {
    console.error('strings file not found')
    return
  }
  const strings = JSON.parse(fs.readFileSync(STRINGS_FILE, 'utf8')) as string[]
  const cache = fs.existsSync(CACHE_FILE) ? JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')) : {}

  let cachedCount = 0
  const uncached: string[] = []

  for (const s of strings) {
    const trimmed = s.trim()
    if (!trimmed) continue
    
    if (cache[trimmed]) {
      cachedCount++
    } else {
      uncached.push(trimmed)
    }
  }

  console.log(`Total strings: ${strings.length}`)
  console.log(`Cached: ${cachedCount}`)
  console.log(`Uncached: ${uncached.length}`)
  
  // Write uncached strings to a new file for easy viewing
  const targetPath = path.join(__dirname, '..', 'uncached_schema_strings.json')
  fs.writeFileSync(targetPath, JSON.stringify(uncached, null, 2), 'utf8')
}

run()
