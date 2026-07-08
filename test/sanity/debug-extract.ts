import * as fs from 'fs'
import * as path from 'path'

const filePath = path.join(__dirname, '..', 'schemaTypes', 'bookingPage.ts')
const content = fs.readFileSync(filePath, 'utf8')
const strings: string[] = []

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

console.log('Total strings extracted:', strings.length)
console.log('Contains "Klinikk (valgfritt)":', strings.includes('Klinikk (valgfritt)'))
console.log('Contains "Overskrift":', strings.includes('Overskrift'))
console.log('All strings:', strings)
