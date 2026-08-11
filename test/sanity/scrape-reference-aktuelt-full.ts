#!/usr/bin/env npx tsx
/**
 * Scrape complete Aktuelt listing + every article detail from the reference site.
 *
 *   cd test && npx tsx sanity/scrape-reference-aktuelt-full.ts
 */
import { chromium, type Page } from "playwright";
import fs from "fs";
import path from "path";
import { REFERENCE_LISTING_SLUGS } from "./reference-listing-slugs";

const ACCESS = "cmedical2026";
const BASE = "https://avenewdemo.online";
const OUT = path.join(__dirname, "data/reference-aktuelt-articles.json");

async function unlock(page: Page) {
  await page.waitForTimeout(800);
  const input = page.locator('input[type="password"]');
  if (await input.count()) {
    await input.fill(ACCESS);
    const btn = page.locator('form button[type="submit"], button:has-text("Logg inn")').first();
    if (await btn.count()) await btn.click();
    else await page.keyboard.press("Enter");
    await page.waitForTimeout(2500);
  }
}

async function scrapeListing(page: Page) {
  await page.goto(`${BASE}/aktuelt`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await unlock(page);
  await page.waitForTimeout(2000);

  // Scroll + click "load more" until article count stabilizes
  let last = 0;
  for (let i = 0; i < 30; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(600);
    const more = page
      .locator(
        'button:has-text("Flere"), button:has-text("Vis flere"), button:has-text("Load more"), [class*="load"]',
      )
      .first();
    if (await more.count()) {
      try {
        await more.click({ timeout: 1000 });
        await page.waitForTimeout(1000);
      } catch {
        /* ignore */
      }
    }
    const count = await page.evaluate(
      () => document.querySelectorAll('a[href*="/aktuelt/"]').length,
    );
    if (count === last && i > 5) break;
    last = count;
  }

  return page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/aktuelt/"]'));
    const seen = new Set<string>();
    const cards: Array<{
      slug: string;
      href: string;
      title: string;
      category: string;
      dateText: string;
      excerpt: string;
      image: string;
    }> = [];

    for (const a of links) {
      const href = (a as HTMLAnchorElement).href;
      const m = href.match(/\/aktuelt\/([^/?#]+)/);
      if (!m) continue;
      const slug = m[1];
      if (seen.has(slug)) continue;
      seen.add(slug);

      const text = (a.textContent || "").replace(/\s+/g, " ").trim();
      const img = a.querySelector("img");
      const category =
        a.querySelector('[class*="badge"], span')?.textContent?.trim() || "";
      cards.push({
        slug,
        href,
        title: text.slice(0, 200),
        category,
        dateText: "",
        excerpt: "",
        image: img?.src || "",
      });
    }
    return cards;
  });
}

async function scrapeArticle(page: Page, slug: string) {
  const url = `${BASE}/aktuelt/${slug}`;
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await unlock(page);
  await page.waitForTimeout(2000);

  return page.evaluate((pageUrl) => {
    const main =
      document.querySelector("main") ||
      document.querySelector("article") ||
      document.body;

    const h1El = main.querySelector("h1");
    const h1 = h1El?.textContent?.trim() || "";

    // Category badge near hero
    const badges = Array.from(main.querySelectorAll("span, a")).map((el) =>
      (el.textContent || "").trim(),
    );
    const knownCats = [
      "Pasienthistorier",
      "Fagartikler",
      "Oss i media",
      "Nytt fra oss",
    ];
    const category = badges.find((b) => knownCats.includes(b)) || "";

    // Date
    const bodyText = main.textContent || "";
    const dateMatch = bodyText.match(
      /(\d{1,2}\.\s*(?:januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember)\s*\d{4})/i,
    );
    const dateText = dateMatch?.[1] || "";

    // Hero image — prefer large image near top
    const imgs = Array.from(main.querySelectorAll("img")) as HTMLImageElement[];
    const heroImg =
      imgs.find((img) => (img.naturalWidth || img.width) > 200) || imgs[0];
    const heroImage = heroImg?.currentSrc || heroImg?.src || "";
    const heroAlt = heroImg?.alt || h1;

    // Content blocks from article body region
    const contentRoot =
      (h1El && h1El.closest("section, div")?.parentElement) || main;

    const blocks: Array<{
      type: string;
      text?: string;
      items?: string[];
      src?: string;
      alt?: string;
    }> = [];

    // Walk likely content elements
    const candidates = Array.from(
      contentRoot.querySelectorAll(
        "h2, h3, h4, p, blockquote, ul, ol, figure, img",
      ),
    );

    // Skip nav/footer-ish nodes
    const skipAncestor = (el: Element) => {
      let n: Element | null = el;
      while (n) {
        const tag = n.tagName.toLowerCase();
        if (tag === "header" || tag === "footer" || tag === "nav") return true;
        const cls = (n.className || "").toString().toLowerCase();
        if (
          cls.includes("related") ||
          cls.includes("footer") ||
          cls.includes("nav") ||
          cls.includes("social")
        )
          return true;
        n = n.parentElement;
      }
      return false;
    };

    let pastH1 = false;
    for (const el of candidates) {
      if (el.tagName === "H1" || (el.closest("h1") && el.tagName !== "P")) {
        pastH1 = true;
        continue;
      }
      // Also mark past when we see first content after title area
      if (!pastH1 && el.tagName === "H2") pastH1 = true;
      if (!pastH1) continue;
      if (skipAncestor(el)) continue;

      const tag = el.tagName.toLowerCase();
      const text = (el.textContent || "").replace(/\s+/g, " ").trim();

      if (tag === "h2" && text) {
        // Skip related heading
        if (/relaterte artikler/i.test(text)) break;
        blocks.push({ type: "heading", text });
      } else if (tag === "h3" && text) {
        blocks.push({ type: "subheading", text });
      } else if (tag === "h4" && text) {
        blocks.push({ type: "subheading", text });
      } else if (tag === "blockquote" && text) {
        blocks.push({ type: "quote", text });
      } else if (tag === "ul" || tag === "ol") {
        const items = Array.from(el.querySelectorAll(":scope > li"))
          .map((li) => (li.textContent || "").replace(/\s+/g, " ").trim())
          .filter(Boolean);
        if (items.length) blocks.push({ type: "list", items });
      } else if (tag === "p" && text) {
        // Detect author / bold intro
        if (/^Av\s+/i.test(text)) {
          blocks.push({ type: "author", text });
        } else if (
          el.querySelector("strong, b") &&
          el.textContent &&
          el.querySelector("strong, b")!.textContent === el.textContent.trim()
        ) {
          blocks.push({ type: "bold-intro", text });
        } else {
          blocks.push({ type: "paragraph", text });
        }
      } else if (tag === "figure") {
        const img = el.querySelector("img") as HTMLImageElement | null;
        const caption = el.querySelector("figcaption")?.textContent?.trim();
        if (img?.src) {
          blocks.push({
            type: "image",
            src: img.currentSrc || img.src,
            alt: img.alt || "",
            text: caption || "",
          });
        }
      } else if (tag === "img") {
        const img = el as HTMLImageElement;
        // Skip hero (already captured) if same src
        if (img.src && img.src !== heroImage) {
          blocks.push({
            type: "image",
            src: img.currentSrc || img.src,
            alt: img.alt || "",
          });
        }
      }
    }

    // Related articles
    const related: Array<{ title: string; href: string }> = [];
    const relatedHeading = Array.from(document.querySelectorAll("h2, h3")).find(
      (el) => /relaterte artikler/i.test(el.textContent || ""),
    );
    if (relatedHeading) {
      let sib: Element | null = relatedHeading.parentElement;
      const scope =
        relatedHeading.closest("section") ||
        relatedHeading.parentElement ||
        document.body;
      for (const a of Array.from(scope.querySelectorAll('a[href*="/aktuelt/"]'))) {
        const href = (a as HTMLAnchorElement).href;
        const title = (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 160);
        if (href.includes(pageUrl.split("/").pop() || "___")) continue;
        if (title) related.push({ title, href });
      }
    }

    // Excerpt = first substantial paragraph
    const excerpt =
      blocks.find(
        (b) =>
          (b.type === "paragraph" || b.type === "bold-intro") &&
          (b.text || "").length > 40,
      )?.text || "";

    return {
      slug: pageUrl.split("/").pop() || "",
      url: pageUrl,
      title: h1,
      excerpt,
      category,
      dateText,
      heroImage,
      heroAlt,
      blocks,
      related: related.slice(0, 6),
      blockCount: blocks.length,
    };
  }, url);
}

function parseNorwegianDate(dateText: string): string | null {
  const months: Record<string, string> = {
    januar: "01",
    februar: "02",
    mars: "03",
    april: "04",
    mai: "05",
    juni: "06",
    juli: "07",
    august: "08",
    september: "09",
    oktober: "10",
    november: "11",
    desember: "12",
  };
  const m = dateText
    .toLowerCase()
    .match(/(\d{1,2})\.\s*([a-zæøå]+)\s*(\d{4})/i);
  if (!m) return null;
  const day = m[1].padStart(2, "0");
  const month = months[m[2]];
  if (!month) return null;
  return `${m[3]}-${month}-${day}T12:00:00.000Z`;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  console.log("Scraping listing…");
  const listingCards = await scrapeListing(page);
  console.log(`Listing links found: ${listingCards.length}`);

  // Prefer known reference order, then any extra found
  const slugOrder = [
    ...REFERENCE_LISTING_SLUGS,
    ...listingCards
      .map((c) => c.slug)
      .filter((s) => !REFERENCE_LISTING_SLUGS.includes(s)),
  ];

  const articles: Record<string, unknown> = {};
  for (const slug of slugOrder) {
    console.log(`  scrape ${slug}`);
    try {
      const art = await scrapeArticle(page, slug);
      if (!art.title) {
        console.warn(`  ⚠ no title for ${slug}`);
        continue;
      }
      articles[slug] = {
        ...art,
        publishedAt: parseNorwegianDate(art.dateText),
      };
      console.log(
        `    ✓ ${art.title.slice(0, 50)} | ${art.category} | blocks=${art.blockCount}`,
      );
    } catch (e) {
      console.error(`  ✗ ${slug}`, e);
    }
  }

  const bundle = {
    scrapedAt: new Date().toISOString(),
    source: `${BASE}/aktuelt`,
    featuredSlugs: REFERENCE_LISTING_SLUGS.slice(0, 4),
    listingSlugs: Object.keys(articles),
    listingCards,
    articles,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(bundle, null, 2), "utf8");
  console.log(`\nWrote ${OUT}`);
  console.log(`Articles scraped: ${Object.keys(articles).length}`);

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
