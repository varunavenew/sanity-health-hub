/**
 * Export treatment sections from src/data/treatmentContent.ts → JSON for Sanity migrations.
 *
 *   npx tsx --import ./scripts/treatment-content-loader.mjs scripts/export-treatment-sections.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { treatmentContent } from "../src/data/treatmentContent.ts";

const root = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(root, "../test/sanity/data/treatment-sections.json");

type Section = { id?: string; heading: string; content: string };

const exported: Record<string, Section[]> = {};

for (const [key, data] of Object.entries(treatmentContent)) {
  const sections = data.sections;
  if (sections?.length) {
    exported[key] = sections.map((s, i) => ({
      id: s.id || `section-${i}`,
      heading: s.heading,
      content: s.content,
    }));
  }
}

fs.writeFileSync(outPath, JSON.stringify(exported, null, 2), "utf8");
console.log(`Wrote ${Object.keys(exported).length} treatments to ${outPath}`);
