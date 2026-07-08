import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

const SCHEMA_DIR = path.join(__dirname, '..', 'schemaTypes')
const TRANSLATIONS_FILE = path.join(__dirname, '..', 'schema_translations.json')

// Comprehensive dictionary to fix Norwegian strings that were missed or mapped incorrectly
const CORRECTIONS: Record<string, string> = {
  "Innhold": "Content",
  "Sidetittel": "Page Title",
  "Undertittel": "Subtitle",
  "Overskrift": "Heading",
  "Tittel": "Title",
  "Ikon": "Icon",
  "Etikett": "Label",
  "Undertekst": "Subheading",
  "Kategorinavn": "Category Name",
  "GEO-sammendrag": "GEO Summary",
  "Spørsmål": "Question",
  "Svar": "Answer",
  "Overordnet kategori": "Parent Category",
  "Introduksjonstekst": "Introduction Text",
  "Hero-tittel": "Hero Title",
  "Hero-ingress": "Hero Introduction",
  "Kort biografi": "Short Biography",
  "FAQ-overskrift": "FAQ Heading",
  "Lenketekst": "Link Text",
  "Badge-tekst": "Badge Text",
  "FAQ — seksjonstittel": "FAQ — Section Title",
  "FAQ-spørsmål": "FAQ Question",
  "FAQ-svar": "FAQ Answer",
  "Laster-tekst": "Loading Text",
  "Feilmelding for siden": "Error Message for the Page",
  "Lenketekst: Les mer": "Link Text: Read More",
  "Våre verdier": "Our values",
  "Beskrivelse": "Description",
  "Seksjon — klinikker": "Section — clinics",
  "Vis seksjonen": "Show section",
  "Velg rekkefølge. La stå tom for å liste alle publiserte klinikker automatisk.": "Select order. Leave empty to automatically list all published clinics.",
  "F.eks. «Våre klinikker»": "E.g. 'Our clinics'",
  "Klinikker (valgfritt)": "Clinics (optional)",
  "Kontakt-modal": "Contact Modal",
  "SEO": "SEO",
  "Kategori-nøkler": "Category Keys",
  "Klinikkmerker": "Clinic Badges",
  "Klinikkmerker per kategori": "Clinic Badges per Category",
  "Sortering": "Sorting",
  "Klinikk (valgfritt)": "Clinic (optional)",
  "Bilde": "Image",
  "Tekst": "Text",
  "Avbryt": "Cancel",
  "Feilmeldinger": "Error Messages",
  "Uten tittel": "Untitled",
  "URL-slug": "URL Slug",
  "Én slug per språk. Genereres fra tittel; kan redigeres for engelske URL-er.": "One slug per language. Generated from title; can be edited for English URLs.",
  "Én slug per språk. Genereres fra kildefeltet; kan redigeres manuelt.": "One slug per language. Generated from source field; can be edited manually.",
  "SEO-innstillinger er påkrevd": "SEO settings are required",
  "Meta-tittel (norsk) er påkrevd": "Meta title (Norwegian) is required",
  "Meta-tittel (engelsk) er påkrevd": "Meta title (English) is required",
  "Meta-beskrivelse (norsk) er påkrevd": "Meta description (Norwegian) is required",
  "Meta-beskrivelse (engelsk) er påkrevd": "Meta description (English) is required",
  "Innhold for markedsføringslandingssiden (f.eks. /fertilitet). Alle felt er påkrevd (norsk + engelsk).": "Content for the marketing landing page (e.g. /fertilitet). All fields are required (Norwegian + English).",
  "Innholdsseksjoner": "Content Sections",
  "Uten tittel": "Untitled",
  "Processing name": "Process step",
}

function run() {
  console.log('Restoring clean schemaTypes files via git restore...')
  try {
    execSync('git restore schemaTypes/', { cwd: path.join(__dirname, '..') })
    console.log('Git restore completed successfully.')
  } catch (e) {
    console.error('Git restore failed:', (e as Error).message)
  }

  const translations = fs.existsSync(TRANSLATIONS_FILE) 
    ? JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, 'utf8')) 
    : {}

  // Merge the translations and apply corrections
  const merged = { ...translations, ...CORRECTIONS }
  
  // Save cache
  fs.writeFileSync(TRANSLATIONS_FILE, JSON.stringify(merged, null, 2), 'utf8')
  console.log(`Successfully merged translations! Total dictionary size: ${Object.keys(merged).length}`)

  // Read and apply translations to each schema file
  const files = fs.readdirSync(SCHEMA_DIR)
  let filesModified = 0

  for (const file of files) {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const filePath = path.join(SCHEMA_DIR, file)
      let content = fs.readFileSync(filePath, 'utf8')
      let modified = false

      // Sort keys by length in descending order to avoid partial replacement of substring patterns
      const sortedKeys = Object.keys(merged).sort((a, b) => b.length - a.length)

      for (const norwegian of sortedKeys) {
        const english = merged[norwegian]
        const escapedKey = norwegian.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
        
        // Match strings in single quotes, double quotes or backticks
        const singleQuoteRegex = new RegExp(`'${escapedKey}'`, 'g')
        const doubleQuoteRegex = new RegExp(`"${escapedKey}"`, 'g')
        const backtickRegex = new RegExp(`\`${escapedKey}\``, 'g')

        if (singleQuoteRegex.test(content)) {
          const escapedVal = english.replace(/'/g, "\\'")
          content = content.replace(singleQuoteRegex, `'${escapedVal}'`)
          modified = true
        }
        if (doubleQuoteRegex.test(content)) {
          const escapedVal = english.replace(/"/g, '\\"')
          content = content.replace(doubleQuoteRegex, `"${escapedVal}"`)
          modified = true
        }
        if (backtickRegex.test(content)) {
          const escapedVal = english.replace(/`/g, '\\`')
          content = content.replace(backtickRegex, `\`${escapedVal}\``)
          modified = true
        }
      }

      // Also translate validation suffix terms on the fly in i18n.ts
      if (file === 'i18n.ts') {
        const rules = [
          { from: 'URL-slug (norsk) er påkrevd', to: 'URL slug (Norwegian) is required' },
          { from: 'URL-slug (engelsk) er påkrevd', to: 'URL slug (English) is required' },
          { from: 'SEO-innstillinger er påkrevd', to: 'SEO settings are required' },
          { from: 'Meta-tittel (norsk) er påkrevd', to: 'Meta title (Norwegian) is required' },
          { from: 'Meta-tittel (engelsk) er påkrevd', to: 'Meta title (English) is required' },
          { from: 'Meta-beskrivelse (norsk) er påkrevd', to: 'Meta description (Norwegian) is required' },
          { from: 'Meta-beskrivelse (engelsk) er påkrevd', to: 'Meta description (English) is required' },
          { from: '(norsk) er påkrevd', to: '(Norwegian) is required' },
          { from: '(engelsk) er påkrevd', to: '(English) is required' },
          { from: 'Uten tittel', to: 'Untitled' },
        ]
        for (const rule of rules) {
          if (content.includes(rule.from)) {
            content = content.replaceAll(rule.from, rule.to)
            modified = true
          }
        }
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8')
        filesModified++
        console.log(`Applied translations to: ${file}`)
      }
    }
  }

  console.log(`Success! Modified ${filesModified} schema files.`)
}

run()
