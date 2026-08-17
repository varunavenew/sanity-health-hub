/**
 * Developer-only: align fertility treatment heroes to avenewdemo scrape.
 *
 *   cd test && npx tsx sanity/patch-fertility-heroes-from-demo-developer.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

const ID_BY_SLUG: Record<string, string> = {
  "assistert-befruktning": "treatment-fertilitet-assistert-befruktning",
  infertilitet: "treatment-fertilitet-infertilitet",
  fertilitetsutredning: "treatment-fertilitet-fertilitetsutredning",
  eggfrys: "treatment-fertilitet-eggfrys",
  saedanalyse: "treatment-fertilitet-saedanalyse",
  donorbehandling: "treatment-fertilitet-donorbehandling",
  hysteroskopi: "treatment-fertilitet-hysteroskopi",
  "assistert-befruktning-for-par-og-single":
    "treatment-fertilitet-assistert-befruktning-for-par-og-single",
  "mann-og-kvinne-i-parforhold": "treatment-fertilitet-mann-og-kvinne-i-parforhold",
  "to-kvinner-i-parforhold": "treatment-fertilitet-to-kvinner-i-parforhold",
  "singel-kvinne": "treatment-fertilitet-singel-kvinne",
  "singel-mann": "treatment-fertilitet-singel-mann",
};

function i18nString(no: string, en = no) {
  return [
    { _key: "no", _type: "internationalizedArrayStringValue", language: "no", value: no },
    { _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: en },
  ];
}

function i18nText(no: string, en = no) {
  return [
    { _key: "no", _type: "internationalizedArrayTextValue", language: "no", value: no },
    { _key: "en", _type: "internationalizedArrayTextValue", language: "en", value: en },
  ];
}

type ParsedHero = {
  title: string;
  heroTitle: string;
  heroDesc: string;
  priceLabel: string | null;
  price: string | null;
  points: string[];
  primaryCta: string;
};

function parseSnippet(slug: string, snippet: string, firstPara: string): ParsedHero {
  const lines = snippet
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Breadcrumb ends at slug title line after › Fertilitet ›
  const fertIdx = lines.findIndex((l) => l === "Fertilitet");
  let crumbTitle = "";
  if (fertIdx >= 0 && lines[fertIdx + 2]) {
    // lines: Fertilitet, ›, Title
    crumbTitle = lines[fertIdx + 2] === "›" ? lines[fertIdx + 3] || "" : lines[fertIdx + 2] || "";
  }
  // Clean › artifacts
  crumbTitle = crumbTitle.replace(/^›\s*/, "").trim();

  // Hero title is usually the line after breadcrumb title (may equal crumb)
  // Pattern in snippet: ... › Title \n HeroTitle \n\n Desc
  // After removing empties: ..., Fertilitet, ›, Crumb, HeroTitle, Desc, PriceLabel, Price, CTA...
  let heroTitle = crumbTitle;
  const crumbPos = lines.findIndex((l) => l === crumbTitle);
  if (crumbPos >= 0 && lines[crumbPos + 1] && lines[crumbPos + 1] !== firstPara.slice(0, 40)) {
    // Next line might be hero title if different from description start
    const next = lines[crumbPos + 1];
    if (
      next &&
      !next.startsWith("Det ") &&
      !next.startsWith("Hos ") &&
      !next.startsWith("Om ") &&
      !next.startsWith("Å ") &&
      !next.startsWith("En ") &&
      !next.startsWith("Har ") &&
      !next.startsWith("Flere ") &&
      !next.startsWith("Ønsker ") &&
      !next.startsWith("Svært ") &&
      !next.startsWith("Behandling ") &&
      !next.startsWith("Hysteroskopi er")
    ) {
      // If next is short title-like
      if (next.length < 80) heroTitle = next;
    }
  }

  // Special: fertilitetsutredning uses expressive title
  if (slug === "fertilitetsutredning") {
    heroTitle = "Et trygt første steg";
  }

  const heroDesc = firstPara.trim();

  // Find price block
  const ctaIdx = lines.findIndex((l) => l === "Se ledige tider og book");
  let priceLabel: string | null = null;
  let price: string | null = null;
  if (ctaIdx >= 2) {
    price = lines[ctaIdx - 1] || null;
    priceLabel = lines[ctaIdx - 2] || null;
  }

  // Points after Ring oss
  const ringIdx = lines.findIndex((l) => l === "Ring oss");
  const points: string[] = [];
  if (ringIdx >= 0) {
    for (let i = ringIdx + 1; i < Math.min(ringIdx + 5, lines.length); i++) {
      const l = lines[i];
      if (l.startsWith("Om ") || l.startsWith("Alt du") || l.startsWith("Hvem ")) break;
      if (l === "Kort ventetid" || l === "Ingen henvisning" || l === "Ingen ventetid") {
        points.push(l);
      }
    }
  }
  if (points.length === 0) {
    points.push("Kort ventetid", "Ingen henvisning");
  }

  return {
    title: crumbTitle || heroTitle,
    heroTitle,
    heroDesc,
    priceLabel,
    price,
    points,
    primaryCta: "Se ledige tider og book",
  };
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") throw new Error(`Refusing: ${PROJECT_ID}`);
  if (DATASET !== "developer") throw new Error(`Refusing: ${DATASET}`);

  const file = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "data",
    "demo-fertility-heroes.json",
  );
  if (!fs.existsSync(file)) {
    throw new Error(`Missing demo scrape: ${file}`);
  }
  const scraped = JSON.parse(fs.readFileSync(file, "utf8")) as Record<
    string,
    { paras?: string[]; htmlSnippet?: string }
  >;

  for (const [slug, id] of Object.entries(ID_BY_SLUG)) {
    const row = scraped[slug];
    if (!row?.htmlSnippet || !row.paras?.[0]) {
      console.warn("SKIP no scrape", slug);
      continue;
    }

    const parsed = parseSnippet(slug, row.htmlSnippet, row.paras[0]);
    const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, { id });
    if (!exists) {
      console.warn("SKIP missing doc", id);
      continue;
    }

    const patch: Record<string, unknown> = {
      title: i18nString(parsed.title),
      heroTitle: i18nString(parsed.heroTitle),
      description: i18nText(parsed.heroDesc),
      heroDescription: i18nText(parsed.heroDesc),
      primaryCtaLabel: i18nString(parsed.primaryCta, "See available times and book"),
      callCtaLabel: i18nString("Ring oss", "Call us"),
      hideSeePriser: true,
      heroPoints: parsed.points.map((title, i) => ({
        _key: `hp-${i}`,
        _type: "object",
        title: i18nString(
          title,
          title === "Kort ventetid"
            ? "Short waiting time"
            : title === "Ingen henvisning"
              ? "No referral needed"
              : title,
        ),
      })),
    };

    if (parsed.price) {
      patch.heroPrice = i18nString(
        parsed.price,
        parsed.price.toLowerCase() === "gratis"
          ? "Free"
          : parsed.price.replace("time fra", "appointment from").replace("kr", "NOK").trim(),
      );
    }
    if (parsed.priceLabel) {
      patch.heroPriceLabel = i18nString(
        parsed.priceLabel,
        parsed.priceLabel === "Fertilitetsutredning"
          ? "Fertility assessment"
          : parsed.priceLabel === "Gratis uforpliktende samtale om fertilitet"
            ? "Free no-obligation fertility conversation"
            : parsed.priceLabel,
      );
    }

    console.log(
      DRY_RUN ? "DRY" : "PATCH",
      slug,
      `| title=${parsed.heroTitle}`,
      `| price=${parsed.priceLabel} / ${parsed.price}`,
      `| points=${parsed.points.join("+")}`,
    );

    if (!DRY_RUN) {
      let op = sanityClient.patch(id).set(patch).unset(["heroAvailability"]);
      if (!parsed.priceLabel) op = op.unset(["heroPriceLabel"]);
      await op.commit({ autoGenerateArrayKeys: false });
      try {
        await sanityClient.delete(`drafts.${id}`);
      } catch {
        /* none */
      }
    }
  }

  const verify = await sanityClient.fetch(
    `*[_id=="treatment-fertilitet-assistert-befruktning"][0]{
      "heroTitle": heroTitle[_key=="no"][0].value,
      "heroDesc": heroDescription[_key=="no"][0].value,
      "availability": heroAvailability[_key=="no"][0].value,
      "priceLabel": heroPriceLabel[_key=="no"][0].value,
      "price": heroPrice[_key=="no"][0].value,
      "cta": primaryCtaLabel[_key=="no"][0].value,
      "points": heroPoints[]{"t": title[_key=="no"][0].value}
    }`,
  );
  console.log("\nVerify assistert:", JSON.stringify(verify, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
