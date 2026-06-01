/**
 * Export full treatment page copy from treatmentContent.ts (no images).
 *
 *   node scripts/generate-treatment-full-content-json.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcPath = path.join(root, 'src/data/treatmentContent.ts')
const outPath = path.join(root, 'test/sanity/data/treatment-full-content.json')

let code = fs.readFileSync(srcPath, 'utf8')
code = code.replace(/^import[\s\S]*?;\s*\n/gm, '')
code = code.replace(/^export interface[\s\S]*?^}\s*;?\s*\n/gm, '')
code = code.replace(/export const treatmentContent[^=]*=\s*/, 'const treatmentContent = ')
code = code.replace(/heroImage:\s*[a-zA-Z0-9_]+/g, 'heroImage: ""')
code += '\nreturn treatmentContent;'

const treatmentContent = new Function(code)()
const exported = {}

for (const [key, data] of Object.entries(treatmentContent)) {
  exported[key] = {
    title: data.title ?? '',
    subtitle: data.subtitle ?? '',
    parentCategory: data.parentCategory ?? '',
    description: data.description ?? '',
    benefitsTitle: data.benefitsTitle ?? 'Hvorfor velge oss',
    benefits: data.benefits ?? [],
    process: data.process ?? [],
    faqs: data.faqs ?? [],
    sections: (data.sections ?? []).map((s, i) => ({
      id: s.id || `section-${i}`,
      heading: s.heading,
      content: s.content,
    })),
    linkedServices: data.linkedServices ?? [],
    relatedSpecialistSlugs: data.relatedSpecialists ?? [],
  }
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(exported, null, 2))
console.log(`Wrote ${Object.keys(exported).length} treatments → ${outPath}`)
