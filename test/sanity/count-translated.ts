import * as fs from 'fs'
import * as path from 'path'

const TRANSLATIONS_FILE = path.join(__dirname, '..', 'schema_translations.json')

function run() {
  if (!fs.existsSync(TRANSLATIONS_FILE)) {
    console.log('No translations file found.')
    return
  }

  const translations = JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, 'utf8')) as Record<string, string>
  let translatedCount = 0
  let identicalCount = 0

  for (const [key, val] of Object.entries(translations)) {
    if (key.trim().toLowerCase() !== val.trim().toLowerCase()) {
      translatedCount++
    } else {
      identicalCount++
    }
  }

  console.log(`Total keys: ${Object.keys(translations).length}`)
  console.log(`Translated keys (key !== value): ${translatedCount}`)
  console.log(`Identical keys (key === value): ${identicalCount}`)
}

run()
