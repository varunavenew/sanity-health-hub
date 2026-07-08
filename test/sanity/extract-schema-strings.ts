import * as fs from 'fs'
import * as path from 'path'

const SCHEMA_DIR = path.join(__dirname, '..', 'schemaTypes')

function extractStringsFromFile(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf8')
  const strings: string[] = []

  // Simple regex to find title: '...' or title: "..."
  // and description: '...' or description: "..."
  const regexes = [
    /title\s*:\s*(['"`])(.*?)\1/g,
    /description\s*:\s*(['"`])(.*?)\1/g,
    /placeholder\s*:\s*(['"`])(.*?)\1/g,
    /label\s*:\s*(['"`])(.*?)\1/g,
  ]

  for (const regex of regexes) {
    let match
    while ((match = regex.exec(content)) !== null) {
      const val = match[2].trim()
      if (val && val.length > 1 && !val.includes('${')) {
        strings.push(val)
      }
    }
  }

  return strings
}

function run() {
  const allStrings = new Set<string>()
  const files = fs.readdirSync(SCHEMA_DIR)

  for (const file of files) {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const filePath = path.join(SCHEMA_DIR, file)
      const fileStrings = extractStringsFromFile(filePath)
      for (const s of fileStrings) {
        allStrings.add(s)
      }
    }
  }

  const sorted = Array.from(allStrings).sort()
  const targetPath = path.join(__dirname, '..', 'schema_strings.json')
  fs.writeFileSync(targetPath, JSON.stringify(sorted, null, 2), 'utf8')
  console.log(`Extracted ${sorted.length} unique UI strings to ${targetPath}`)
}

run()
