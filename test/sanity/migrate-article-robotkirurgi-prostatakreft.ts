#!/usr/bin/env npx tsx
/**
 * Restore article:
 *   /no/aktuelt/vi-tar-opp-kampen-mot-prostatakreft-med-robotkirurgi
 *   /en/news/we-take-up-the-fight-against-prostate-cancer-with-robotic-surgery
 *
 * Source: legacy cmedical-web.vercel.app (NO). EN translated for CMS parity.
 *
 * Run (from test/):
 *   npx tsx sanity/migrate-article-robotkirurgi-prostatakreft.ts
 *
 * Production (explicit):
 *   cross-env ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET=production SANITY_STUDIO_DATASET=production npx tsx sanity/migrate-article-robotkirurgi-prostatakreft.ts
 */
import fs from "fs";
import path from "path";
import { createHash, randomBytes } from "crypto";
import { sanityClient, DATASET, PROJECT_ID } from "./config";
import { i18nString, i18nText } from "./lib/category-landing-i18n";

const DOC_ID = "article-robotkirurgi-prostatakreft";
const SLUG_NO = "vi-tar-opp-kampen-mot-prostatakreft-med-robotkirurgi";
const SLUG_EN = "we-take-up-the-fight-against-prostate-cancer-with-robotic-surgery";

const ASSETS_DIR = path.resolve(__dirname, "../../src/assets");
const HERO_POINTER = "services/urologi-prostata.jpg.asset.json";
const ASSET_HOST =
  process.env.LOVABLE_ASSET_HOST ||
  process.env.ASSET_HOST ||
  "https://id-preview--3dcc4aff-3deb-44f0-b035-de0201b2a94e.lovable.app";

function key() {
  return randomBytes(6).toString("hex");
}

function span(text: string, marks: string[] = []) {
  return { _type: "span" as const, _key: key(), text, marks };
}

function block(style: string, children: ReturnType<typeof span>[], extras: Record<string, unknown> = {}) {
  return {
    _type: "block" as const,
    _key: key(),
    style,
    markDefs: [] as Array<Record<string, unknown>>,
    children,
    ...extras,
  };
}

function h2(text: string) {
  return block("h2", [span(text)]);
}

function p(text: string) {
  return block("normal", [span(text)]);
}

function bulletList(items: string[]) {
  return items.map((item) =>
    block("normal", [span(item)], { listItem: "bullet", level: 1 }),
  );
}

function slugField(no: string, en: string) {
  return [
    {
      _key: key(),
      _type: "internationalizedArraySlugValue",
      language: "no",
      value: { _type: "slug", current: no },
    },
    {
      _key: key(),
      _type: "internationalizedArraySlugValue",
      language: "en",
      value: { _type: "slug", current: en },
    },
  ];
}

function bodyField(noBlocks: ReturnType<typeof block>[], enBlocks: ReturnType<typeof block>[]) {
  return [
    {
      _key: key(),
      _type: "internationalizedArrayBlockContentValue",
      language: "no",
      value: noBlocks,
    },
    {
      _key: key(),
      _type: "internationalizedArrayBlockContentValue",
      language: "en",
      value: enBlocks,
    },
  ];
}

const BODY_NO = [
  h2("Tusenvis av tilfeller av prostatakreft i Norge årlig"),
  p(
    "Økt PSA-screening av menn over 45 år fører til at stadig flere tilfeller av prostatakreft oppdages tidligere i forløpet. De fleste menn har ikke symptomer på prostatakreft før det blir alvorlig. «Hadde alle menn vært flinkere til å gå til legen ville de fleste tilfeller av alvorlig prostatakreft vært avverget», forteller vår urolog Trond Jørgensen.",
  ),
  p(
    "Ifølge NHI er det omtrent 15 % risiko for å få prostatakreft en eller annen gang i løpet av livet. Mange av mennene som rammes trenger prostataoperasjon:",
  ),
  ...bulletList([
    "5000 nye tilfeller av prostatakreft årlig",
    "1000 menn dør hvert år av prostatakreft",
    "55 000 menn lever med diagnosen",
  ]),
  p(
    "Du tar aktivt grep mot prostatakreft ved å ta én PSA-blodprøve i året. Økte PSA-verdier kan være en indikasjon på sykdom. Regelmessig PSA-blodprøve gjør det mulig å oppdage sykdom tidlig i forløpet, slik at kurativ behandling som robotoperasjon er mulig å gjøre på en skånsom måte.",
  ),
  p(
    "Ikke bare skal prostataoperasjon kurere prostatakreft, men det er viktig å unngå senkomplikasjoner som ereksjonssvikt og urininkontinens. Kikkhullsoperasjoner og robotkirurgi på prostata ble innført rundt 2000-tallet og har vært et viktig bidrag til å bedre resultatene.",
  ),
  h2("Robotkirurgi er viktig i kampen mot prostatakreft"),
  p(
    "Robotkirurgi på prostata er en kikkhullsoperasjon hvor kirurgen styrer robotarmer. Instrumentene og et kamera føres inn via små snitt. Robotarmene er svært presise, slik at instrumentene skjelver mindre enn ved vanlige operasjoner. I tillegg blir fingerbevegelsene til kirurgen behandlet i datamaskinen, slik at bevegelsene til robotarmene blir enda stødigere.",
  ),
  p(
    "Det er en skånsom metode som gir raskere rehabilitering og gode resultater. Robotkirurgi benyttes mye i hele den vestlige verden for denne typen operasjoner. Hos CMedical tilbys pasientene behagelige enrom med hotellstandard for overnatting. Sykemeldingsperioden er normalt sett ikke mer enn to uker, med mindre pasienten har en fysisk krevende jobb.",
  ),
  h2("Robotkirurgene ved CMedical"),
  p(
    "«De siste årene har robotoperasjon totalt tatt over for denne typen inngrep. Vi er to kirurger som har vært så heldige å være med på prosjektet med privat robot. Vi har lang erfaring med denne typen inngrep fra det offentlige og har operert over 2000 inngrep i løpet av de siste 10–12 årene», forteller robotkirurg Bjørn Brennhovd.",
  ),
  p(
    "Bjørn Brennhovd og Nicolai Wessel er CMedicals to robotkirurger. Brennhovd innførte robotkirurgi i Norge tilbake i 2004. Han hadde da vært teamleder for urologiske kreftoperasjoner ved Radiumhospitalet med mange års erfaring. Brennhovd har drevet opplæring i Norge og utfører 100–150 inngrep hvert år.",
  ),
  p(
    "Nicolai Wessel er en av de mest erfarne kirurgene og urologene i Europa når det gjelder robotassistert kirurgi. Wessel startet med robotkirurgi tilbake i 2007, og han har over 1400 robotassisterte prostatakreftoperasjoner. Han har også spesiell kompetanse innen prostatakreft og laparoskopiske, urologiske prosedyrer.",
  ),
  h2("Ledende innen robotkirurgi og prostata"),
  p(
    "Robotkirurgi på prostata har gitt store forbedringer og resultater. Til syvende og sist er det likevel kirurgens kunnskap og ferdigheter som er avgjørende. Robotoperasjoner gjør det imidlertid enklere for robotkirurgene å utvikle sine evner.",
  ),
  p(
    "Tidlig diagnostikk med PSA-screening mener vi er avgjørende i kampen mot prostatakreft. Pasientene kan da lettere inndeles i risikogrupper og få bedre tilpasset behandling. Dette gir bedre prognose for kreftsituasjonen og et bedre utgangspunkt for livskvalitet etter robotkirurgi.",
  ),
  p(
    "«Min anbefaling er at alle menn 50+ bør ta en årlig PSA-blodprøve, og gjerne i sammenheng med at bilen er på service – så du ikke glemmer det», oppfordrer tidligere pasient Tor Egil Austebø.",
  ),
  h2("Hvor kan jeg få utført robotkirurgi i Norge?"),
  p(
    "CMedical har kort ventetid på ledende eksperter innen urologi og robotkirurgi i Norge og resten av Skandinavia. Du kan benytte deg av din helseforsikring hos oss. Ta kontakt for mer informasjon eller for å bestille PSA-blodprøve.",
  ),
];

const BODY_EN = [
  h2("Thousands of prostate cancer cases in Norway every year"),
  p(
    "Increased PSA screening of men over 45 means more prostate cancer cases are detected earlier. Most men have no symptoms before the disease becomes serious. “If all men were better at seeing their doctor, most cases of serious prostate cancer could be prevented,” says our urologist Trond Jørgensen.",
  ),
  p(
    "According to the Norwegian Institute of Public Health, there is roughly a 15% lifetime risk of prostate cancer. Many of the men affected need prostate surgery:",
  ),
  ...bulletList([
    "5,000 new cases of prostate cancer every year",
    "1,000 men die of prostate cancer each year",
    "55,000 men live with the diagnosis",
  ]),
  p(
    "You can take active steps against prostate cancer by having one PSA blood test per year. Elevated PSA levels may indicate disease. Regular PSA testing makes it possible to detect cancer early, when curative treatment such as robotic surgery can be performed in a gentle way.",
  ),
  p(
    "Prostate surgery should not only cure prostate cancer, but also avoid late complications such as erectile dysfunction and urinary incontinence. Keyhole surgery and robotic prostate surgery were introduced around the 2000s and have made an important contribution to better outcomes.",
  ),
  h2("Robotic surgery is vital in the fight against prostate cancer"),
  p(
    "Robotic prostate surgery is a keyhole procedure in which the surgeon controls robotic arms. Instruments and a camera are inserted through small incisions. The arms are highly precise, so instruments shake less than in conventional surgery. The surgeon’s finger movements are processed by the computer so the robotic arms move even more steadily.",
  ),
  p(
    "It is a gentle method that enables faster recovery and good results. Robotic surgery is widely used across the Western world for this type of operation. At CMedical, patients are offered comfortable single rooms with hotel-standard accommodation. Sick leave is normally no more than two weeks, unless the patient has a physically demanding job.",
  ),
  h2("The robotic surgeons at CMedical"),
  p(
    "“In recent years robotic surgery has completely taken over for this type of procedure. We are two surgeons who have been fortunate to be part of the private robot project. We have long experience with these procedures from the public sector and have performed more than 2,000 operations over the last 10–12 years,” says robotic surgeon Bjørn Brennhovd.",
  ),
  p(
    "Bjørn Brennhovd and Nicolai Wessel are CMedical’s two robotic surgeons. Brennhovd introduced robotic surgery in Norway back in 2004 after many years leading urological cancer surgery at Radiumhospitalet. He has trained surgeons in Norway and performs 100–150 procedures each year.",
  ),
  p(
    "Nicolai Wessel is one of the most experienced surgeons and urologists in Europe in robotic-assisted surgery. He started with robotic surgery in 2007 and has performed more than 1,400 robotic prostate cancer operations. He also has special expertise in prostate cancer and laparoscopic urological procedures.",
  ),
  h2("Leading in robotic surgery and prostate care"),
  p(
    "Robotic prostate surgery has delivered major improvements and results. Ultimately, however, it is the surgeon’s knowledge and skills that matter most. Robotic operations nevertheless make it easier for surgeons to refine their technique.",
  ),
  p(
    "We believe early diagnosis through PSA screening is crucial in the fight against prostate cancer. Patients can then be grouped by risk and receive better tailored treatment, improving prognosis and the foundation for quality of life after robotic surgery.",
  ),
  p(
    "“My recommendation is that all men aged 50+ should have an annual PSA blood test — perhaps when the car is in for service, so you don’t forget,” encourages former patient Tor Egil Austebø.",
  ),
  h2("Where can I have robotic surgery in Norway?"),
  p(
    "CMedical offers short waiting times with leading experts in urology and robotic surgery in Norway and the rest of Scandinavia. You can use your health insurance with us. Contact us for more information or to book a PSA blood test.",
  ),
];

async function uploadHeroImage(): Promise<string | null> {
  const pointerPath = path.join(ASSETS_DIR, HERO_POINTER);
  if (!fs.existsSync(pointerPath)) {
    console.warn(`  ⚠ Hero image pointer not found: ${HERO_POINTER}`);
    return null;
  }
  const pointer = JSON.parse(fs.readFileSync(pointerPath, "utf8"));
  const url =
    typeof pointer.url === "string"
      ? pointer.url.startsWith("http")
        ? pointer.url
        : `${ASSET_HOST}${pointer.url}`
      : null;
  if (!url) {
    console.warn(`  ⚠ Hero image pointer has no url: ${HERO_POINTER}`);
    return null;
  }
  const res = await fetch(url, { signal: AbortSignal.timeout(120_000) });
  if (!res.ok) {
    console.warn(`  ⚠ Hero image download failed (${res.status}): ${url}`);
    return null;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  const filename = pointer.original_filename || `${SLUG_NO}.jpg`;
  const sha1hash = createHash("sha1").update(buffer).digest("hex");
  const existing = await sanityClient.fetch<{ _id: string } | null>(
    `*[_type=="sanity.imageAsset" && sha1hash==$sha1hash][0]{_id}`,
    { sha1hash },
  );
  if (existing?._id) return existing._id;
  const asset = await sanityClient.assets.upload("image", buffer, {
    filename,
    contentType: pointer.content_type || "image/jpeg",
  });
  return asset._id;
}

async function migrate() {
  console.log(`Restoring ${DOC_ID} on ${PROJECT_ID}/${DATASET}…`);

  const imageAssetId = await uploadHeroImage();

  const doc: Record<string, unknown> = {
    _id: DOC_ID,
    _type: "article",
    title: i18nString(
      "Vi tar opp kampen mot prostatakreft med robotkirurgi",
      "We take up the fight against prostate cancer with robotic surgery",
    ),
    slug: slugField(SLUG_NO, SLUG_EN),
    excerpt: i18nText(
      "Økt PSA-screening oppdager prostatakreft tidligere. CMedicals robotkirurger Bjørn Brennhovd og Nicolai Wessel tilbyr skånsom robotkirurgi med kort ventetid.",
      "Increased PSA screening detects prostate cancer earlier. CMedical robotic surgeons Bjørn Brennhovd and Nicolai Wessel offer gentle robotic surgery with short waiting times.",
    ),
    category: "Fagartikler",
    publishedAt: "2024-06-01T08:00:00.000Z",
    body: bodyField(BODY_NO, BODY_EN),
    geoSummary: i18nText(
      "CMedical tar opp kampen mot prostatakreft med robotkirurgi. Urolog Trond Jørgensen anbefaler årlig PSA-test, og robotkirurgene Bjørn Brennhovd og Nicolai Wessel har lang erfaring med skånsomme inngrep.",
      "CMedical takes up the fight against prostate cancer with robotic surgery. Urologist Trond Jørgensen recommends annual PSA testing, and robotic surgeons Bjørn Brennhovd and Nicolai Wessel have extensive experience with gentle procedures.",
    ),
    seo: {
      _type: "seo",
      metaTitle: i18nString(
        "Vi tar opp kampen mot prostatakreft med robotkirurgi | CMedical",
        "We take up the fight against prostate cancer | CMedical",
      ),
      metaDescription: i18nText(
        "Les om robotkirurgi mot prostatakreft hos CMedical. Årlig PSA-test, kort ventetid og erfarne robotkirurger Bjørn Brennhovd og Nicolai Wessel.",
        "Read about robotic surgery for prostate cancer at CMedical. Annual PSA testing, short waiting times and experienced robotic surgeons.",
      ),
      noIndex: false,
    },
  };

  if (imageAssetId) {
    doc.primaryImage = {
      _type: "image",
      alt: i18nString(
        "Vi tar opp kampen mot prostatakreft med robotkirurgi",
        "We take up the fight against prostate cancer with robotic surgery",
      ),
      asset: { _type: "reference", _ref: imageAssetId },
    };
  }

  await sanityClient.createIfNotExists({ _id: DOC_ID, _type: "article" });
  await sanityClient.patch(DOC_ID).set(doc).commit();
  console.log("✅ Article restored and published fields set.");
  console.log(`   NO: /no/aktuelt/${SLUG_NO}`);
  console.log(`   EN: /en/news/${SLUG_EN}`);

  const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://cmedical.no";
  if (revalidateSecret) {
    const res = await fetch(`${siteUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sanity-revalidate-secret": revalidateSecret,
      },
      body: JSON.stringify({
        _type: "article",
        slug: doc.slug,
      }),
    });
    if (res.ok) {
      console.log("✅ Production cache revalidated.");
    } else {
      console.warn(`  ⚠ Revalidate failed (${res.status}): ${await res.text()}`);
    }
  } else if (DATASET === "production") {
    console.log(
      "ℹ Set SANITY_REVALIDATE_SECRET to bust Vercel cache immediately, or redeploy / wait ~10 min.",
    );
  }
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
