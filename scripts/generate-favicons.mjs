/**
 * Generate all CMedical favicon assets from the high-res CM mark.
 *
 * - Source: src/assets/logos/cm-initials.png (1080×1080)
 * - Applies a full circular mask (transparent outside) — matches legacy site tab icon
 * - Lanczos downscale — never upscales
 *
 * Usage: node scripts/generate-favicons.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";

const SOURCE = "src/assets/logos/cm-initials.png";
const OUT_DIR = "public";

const PNG_SIZES = [
  { size: 16, name: "favicon-16x16.png" },
  { size: 32, name: "favicon-32x32.png" },
  { size: 48, name: "favicon-48x48.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 192, name: "android-chrome-192x192.png" },
  { size: 512, name: "android-chrome-512x512.png" },
];

const ICO_SIZES = [16, 32, 48];
/** Embedded density for SVG favicon (4× a 32 viewBox). */
const SVG_EMBED_SIZE = 128;

/** Perfect circle inscribed in the square canvas (matches old-site circular favicon). */
function circleMaskSvg(size) {
  const c = size / 2;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<circle cx="${c}" cy="${c}" r="${c}" fill="#fff"/>` +
      `</svg>`,
  );
}

async function circularPng(size) {
  const resized = await sharp(SOURCE)
    .resize(size, size, { fit: "cover", kernel: sharp.kernel.lanczos3 })
    .ensureAlpha()
    .png()
    .toBuffer();

  const mask = await sharp(circleMaskSvg(size)).resize(size, size).png().toBuffer();

  // dest-in: keep logo only inside the circle → transparent outside
  return sharp(resized)
    .composite([{ input: mask, blend: "dest-in" }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

function buildIco(entries) {
  const count = entries.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + dirEntrySize * count;
  const dirs = [];
  for (const e of entries) {
    const w = e.size >= 256 ? 0 : e.size;
    const h = e.size >= 256 ? 0 : e.size;
    const entry = Buffer.alloc(16);
    entry.writeUInt8(w, 0);
    entry.writeUInt8(h, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(e.buf.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirs.push(entry);
    offset += e.buf.length;
  }
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  return Buffer.concat([header, ...dirs, ...entries.map((e) => e.buf)]);
}

async function main() {
  const meta = await sharp(SOURCE).metadata();
  if (!meta.width || meta.width < 512) {
    throw new Error(`Source too small (${meta.width}px). Refusing to generate.`);
  }
  console.log(`Source: ${SOURCE} (${meta.width}×${meta.height})`);
  console.log("Mask: full circle (legacy-site style)");

  for (const { size, name } of PNG_SIZES) {
    const buf = await circularPng(size);
    fs.writeFileSync(path.join(OUT_DIR, name), buf);
    const m = await sharp(buf).metadata();
    console.log(`  ${name}: ${m.width}×${m.height}, ${buf.length}B`);
  }

  const icoEntries = [];
  for (const size of ICO_SIZES) {
    icoEntries.push({ size, buf: await circularPng(size) });
  }
  const ico = buildIco(icoEntries);
  fs.writeFileSync(path.join(OUT_DIR, "favicon.ico"), ico);
  console.log(`  favicon.ico: sizes ${ICO_SIZES.join(",")}, ${ico.length}B`);

  const embed = await circularPng(SVG_EMBED_SIZE);
  const b64 = embed.toString("base64");
  const dataUri = `data:image/png;base64,${b64}`;
  const view = 32;
  const c = view / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${view} ${view}" role="img" aria-label="CMedical">
  <defs>
    <clipPath id="cm-circle">
      <circle cx="${c}" cy="${c}" r="${c}"/>
    </clipPath>
  </defs>
  <image width="${view}" height="${view}" href="${dataUri}" xlink:href="${dataUri}" clip-path="url(#cm-circle)"/>
</svg>
`;
  fs.writeFileSync(path.join(OUT_DIR, "favicon.svg"), svg);
  console.log(`  favicon.svg: circular clip, ${Buffer.byteLength(svg)}B`);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
