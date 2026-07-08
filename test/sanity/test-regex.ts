import * as fs from 'fs'
import * as path from 'path'

const content = fs.readFileSync(path.join(__dirname, '..', 'schemaTypes', 'bookingPage.ts'), 'utf8')
const r = /title\s*:\s*(['"`])(.*?)\1/g
let m
while ((m = r.exec(content)) !== null) {
  console.log(m[2])
}
