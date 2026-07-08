import * as fs from 'fs'
import * as path from 'path'

const SCHEMA_DIR = path.join(__dirname, '..', 'schemaTypes')
const OUTPUT_FILE = path.join(__dirname, '..', 'untranslated_norwegian.json')

const NORWEGIAN_PATTERN = /[æøåÆØÅ]|\b(og|eller|av|til|på|for|med|en|et|som|de|den|det|vi|du|jeg|han|hun|vises|knapp|tekst|tittel|overskrift|beskrivelse|bilde|side|lenke|time|bestill|spesialist|anmeldelse|kategori|tjeneste|klinikk|kontakt|karriere|nyheter|priser|forsikring|om|oss|brukes|valgfritt|tall|verdi|sidetittel|seksjon|rekkefølge|anmeldelser|bilder|undertekst|etikett|f\.eks|hvis|sett|skjerm|kart|adresse|e-post|telefon|navn|rolle|spesialister|klinikker|nyheter|påkrevd|må|skråstrek|forløp|symptomer|høyre|personvernerklæringen|språk|først)\b/i

function run() {
  const files = fs.readdirSync(SCHEMA_DIR)
  const norwegianStrings = new Set<string>()

  for (const file of files) {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(path.join(SCHEMA_DIR, file), 'utf8')
      
      // Extract string literals
      const regex = /(['"`])(.*?)\1/g
      let match
      while ((match = regex.exec(content)) !== null) {
        const val = match[2].trim()
        if (val && val.length > 1 && !val.includes('${')) {
          if (NORWEGIAN_PATTERN.test(val)) {
            // Check if it's not already pure English by some chance
            norwegianStrings.add(val)
          }
        }
      }
    }
  }

  const list = Array.from(norwegianStrings).sort()
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(list, null, 2), 'utf8')
  console.log(`Found ${list.length} Norwegian strings. Saved to ${OUTPUT_FILE}`)
}

run()
