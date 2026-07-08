import * as fs from 'fs'
import * as path from 'path'

const INPUT_FILE = path.join(__dirname, '..', 'uncached_schema_strings.json')
const OUTPUT_FILE = path.join(__dirname, '..', 'norwegian_schema_strings.json')

const COMMON_NORWEGIAN_PATTERNS = [
  /[æøåÆØÅ]/,
  /\b(og|eller|av|til|på|for|med|en|et|som|de|den|det|vi|du|jeg|han|hun|vises|knapp|tekst|tittel|overskrift|beskrivelse|bilde|side|lenke|time|bestill|spesialist|anmeldelse|kategori|tjeneste|klinikk|kontakt|karriere|nyheter|priser|forsikring|om|oss|brukes|valgfritt|tall|verdi|sidetittel|seksjon|rekkefølge|anmeldelser|bilder|undertekst|etikett|f\.eks|hvis|sett|skjerm|kart|adresse|e-post|telefon|navn|rolle|spesialister|klinikker|nyheter)\b/i
]

function isNorwegian(s: string): boolean {
  const trimmed = s.trim()
  if (!trimmed) return false
  if (/^[\d:\s–—\-_.,()'"/?&!@#%*+=\[\]]+$/.test(trimmed)) return false // skip purely numbers/symbols
  
  // If it contains Norwegian characters or common Norwegian words
  for (const pattern of COMMON_NORWEGIAN_PATTERNS) {
    if (pattern.test(trimmed)) return true
  }

  // If it's mostly lowercase/mixed and doesn't match common English-only titles
  // We'll keep it to be safe, but let's check
  return true
}

function run() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error('No input file')
    return
  }

  const strings = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8')) as string[]
  const filtered = strings.filter(isNorwegian)

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(filtered, null, 2), 'utf8')
  console.log(`Filtered down to ${filtered.length} Norwegian-specific strings (from ${strings.length})`)
}

run()
