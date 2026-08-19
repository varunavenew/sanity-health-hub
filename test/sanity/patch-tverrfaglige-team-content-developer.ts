#!/usr/bin/env npx tsx
/**
 * Developer-only: rebuild themePage-tverrfaglige-team with landing-page content
 * and the «Fagområdene våre» image-card section.
 *
 *   cd test && npx tsx sanity/patch-tverrfaglige-team-content-developer.ts
 */
import { createHash } from "crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_ROOT = path.resolve(__dirname, "../../src/assets");
const PAGE_ID = "themePage-tverrfaglige-team";
const ASSET_HOST =
  process.env.LOVABLE_ASSET_HOST ||
  process.env.ASSET_HOST ||
  "https://id-preview--3dcc4aff-3deb-44f0-b035-de0201b2a94e.lovable.app";

let i18nKeyCounter = 0;
const i18nKey = () =>
  `i18n-${Date.now().toString(36)}-${(i18nKeyCounter++).toString(36)}`;

const i18nString = (no: string, en: string) => [
  {
    _type: "internationalizedArrayStringValue",
    _key: i18nKey(),
    language: "no",
    value: no,
  },
  {
    _type: "internationalizedArrayStringValue",
    _key: i18nKey(),
    language: "en",
    value: en,
  },
];

const i18nText = (no: string, en: string) => [
  {
    _type: "internationalizedArrayTextValue",
    _key: i18nKey(),
    language: "no",
    value: no,
  },
  {
    _type: "internationalizedArrayTextValue",
    _key: i18nKey(),
    language: "en",
    value: en,
  },
];

function readPointerUrl(pointerRelPath: string): string | null {
  const abs = path.resolve(ASSETS_ROOT, pointerRelPath);
  if (!fs.existsSync(abs)) return null;
  const json = JSON.parse(fs.readFileSync(abs, "utf8"));
  return typeof json.url === "string" ? json.url : null;
}

async function fetchBuffer(url: string): Promise<Buffer | null> {
  const full = url.startsWith("http") ? url : `${ASSET_HOST}${url}`;
  try {
    const res = await fetch(full, { signal: AbortSignal.timeout(120_000) });
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

async function uploadFromPointer(pointerRelPath: string): Promise<string> {
  const url = readPointerUrl(pointerRelPath);
  if (!url) throw new Error(`Missing pointer: ${pointerRelPath}`);
  const buf = await fetchBuffer(url);
  if (!buf) throw new Error(`Download failed: ${pointerRelPath}`);
  const filename = path.basename(pointerRelPath).replace(".asset.json", "");
  const sha1hash = createHash("sha1").update(buf).digest("hex");
  const existing = await sanityClient.fetch<{ _id: string } | null>(
    `*[_type=="sanity.imageAsset" && sha1hash==$sha1hash][0]{_id}`,
    { sha1hash },
  );
  if (existing?._id) return existing._id;
  const asset = await sanityClient.assets.upload("image", buf, {
    filename,
    contentType: "image/jpeg",
  });
  return asset._id;
}

const SPECIALTY_CARDS = [
  {
    key: "gynekologi",
    title: i18nString("Gynekologi", "Gynecology"),
    href: i18nString("/gynekologi", "/gynecology"),
    pointer: "services/gynekologi-hero.jpg.asset.json",
    alt: i18nString("Gynekologi", "Gynecology"),
  },
  {
    key: "ortopedi",
    title: i18nString("Ortopedi", "Orthopedics"),
    href: i18nString("/ortopedi", "/orthopedics"),
    pointer: "services/ortopedi-hero.jpg.asset.json",
    alt: i18nString("Ortopedi", "Orthopedics"),
  },
  {
    key: "urologi",
    title: i18nString("Urologi", "Urology"),
    href: i18nString("/urologi", "/urology"),
    pointer: "services/urologi-hero.jpg.asset.json",
    alt: i18nString("Urologi", "Urology"),
  },
  {
    key: "fertilitet",
    title: i18nString("Fertilitet", "Fertility"),
    href: i18nString("/fertilitet", "/fertility"),
    pointer: "services/fertilitet-hero.jpg.asset.json",
    alt: i18nString("Fertilitet", "Fertility"),
  },
  {
    key: "graviditet",
    title: i18nString("Graviditet", "Pregnancy"),
    href: i18nString("/graviditet", "/pregnancy"),
    pointer: "services/graviditet-hero.jpg.asset.json",
    alt: i18nString("Graviditet", "Pregnancy"),
  },
  {
    key: "tjenester",
    title: i18nString("Flere tjenester", "More services"),
    href: i18nString("/tjenester", "/services"),
    pointer: "services/flere-hero.jpg.asset.json",
    alt: i18nString("Flere tjenester", "More services"),
  },
] as const;

const SUPPORT_SPECIALTIES = [
  {
    key: "osteopat",
    title: i18nString("Osteopat", "Osteopath"),
    description: i18nText(
      "Manuell behandlingsform som komplementerer medisinsk utredning og behandling ved muskel-skjelettplager, bekkenbunnsdysfunksjon og smerter etter operasjon.",
      "A manual therapy that complements medical assessment and treatment for musculoskeletal issues, pelvic floor dysfunction and post-operative pain.",
    ),
  },
  {
    key: "fysioterapeut",
    title: i18nString("Fysioterapeut", "Physiotherapist"),
    description: i18nText(
      "Målrettet trening og rehabilitering for og etter kirurgi, med spesialkompetanse på bekkenbunn og bevegelsesapparat.",
      "Targeted training and rehabilitation before and after surgery, with specialist expertise in pelvic floor and the musculoskeletal system.",
    ),
  },
  {
    key: "sexolog",
    title: i18nString("Sexolog", "Sexologist"),
    description: i18nText(
      "Terapeutiske samtaler for støtte, veiledning og råd knyttet til seksuell helse, funksjon, lyst, selvbilde og intimitet.",
      "Therapeutic conversations offering support, guidance and advice on sexual health, function, desire, self-image and intimacy.",
    ),
  },
  {
    key: "psykolog",
    title: i18nString("Psykolog", "Psychologist"),
    description: i18nText(
      "Samtalepartner for å sortere tanker og følelser, håndtere smerter, og motta støtte gjennom utfordrende behandlingsforløp.",
      "A conversation partner to help process thoughts and feelings, manage pain, and receive support through challenging treatment pathways.",
    ),
  },
  {
    key: "ernaeringsfysiolog",
    title: i18nString("Ernæringsfysiolog", "Nutritionist"),
    description: i18nText(
      "Individuelt tilpasset kostholdsrådgivning med betydning for hormoner, fertilitet, restitusjon etter kirurgi og generell helse.",
      "Individually tailored dietary guidance with impact on hormones, fertility, recovery after surgery and general health.",
    ),
  },
  {
    key: "uroterapeut",
    title: i18nString("Uroterapeut", "Urotherapist"),
    description: i18nText(
      "Spesialisert oppfølging av blære- og bekkenbunnsfunksjon, ofte i samarbeid med gynekolog eller urolog.",
      "Specialist follow-up for bladder and pelvic floor function, often in collaboration with a gynecologist or urologist.",
    ),
  },
] as const;

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  console.log(`project=${PROJECT_ID} dataset=${DATASET}`);

  const heroAssetId = await uploadFromPointer("hero/tverrfaglig-team-hero-v2.jpg.asset.json");
  console.log(`hero image → ${heroAssetId}`);

  const cards = [];
  for (const card of SPECIALTY_CARDS) {
    const assetId = await uploadFromPointer(card.pointer);
    console.log(`card ${card.key} → ${assetId}`);
    cards.push({
      _key: `card-${card.key}`,
      title: card.title,
      href: card.href,
      imageAlt: card.alt,
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: assetId },
      },
    });
  }

  const doc = {
    _type: "themePage",
    _id: PAGE_ID,
    title: i18nString("Tverrfaglig kirurgisk team", "Multidisciplinary surgical team"),
    slug: { _type: "slug", current: "tverrfaglige-team" },
    heroImage: {
      _type: "image",
      asset: { _type: "reference", _ref: heroAssetId },
    },
    introTexts: [
      i18nText(
        "Hos CMedical jobber du aldri med bare én spesialist alene. Våre kirurgere og spesialister – innen gynekologi, ortopedi, urologi og fertilitet – samarbeider tett på tvers av fagfelt, og trekker inn ekspertise fra psykolog, sexolog, ernæringsfysiolog, fysioterapeut, osteopat og uroterapeut når det trengs. Denne tverrfagligheten er helt unik, og sikrer at du får riktig behandling uansett hvor sammensatt problemstillingen din er.",
        "At CMedical, you never work with just one specialist alone. Our surgeons and specialists — in gynecology, orthopedics, urology and fertility — collaborate closely across disciplines, drawing on psychologists, sexologists, nutritionists, physiotherapists, osteopaths and urotherapists when needed. This multidisciplinary approach is truly unique, ensuring you receive the right treatment no matter how complex your situation.",
      ),
    ],
    sections: [
      {
        _key: "section-om",
        heading: i18nString(
          "Om vårt tverrfaglige kirurgiske team",
          "About our multidisciplinary surgical team",
        ),
        paragraphs: [
          "Kroppen er ikke inndelt i fagområder – det er heller ikke behandlingen vår. Mange pasienter har plager som griper inn i flere fagfelt samtidig: bekkenbunnsplager som involverer både gynekolog og urolog, ledd- og skjelettplager som krever både ortopedi og fysioterapi, eller kroniske smerter der psykolog og ernæringsfysiolog er en like viktig del av behandlingen som kirurgen selv.",
          "Derfor har vi bygget opp CMedical rundt tverrfaglige team. Spesialistene våre jobber kun med det de kan aller best innenfor sitt felt, og samarbeider ved behov på tvers av:",
        ],
        bulletPoints: [
          i18nString(
            "Gynekologi – kvinnehelse, bekkenbunn, hormoner og underlivskirurgi",
            "Gynecology — women's health, pelvic floor, hormones and pelvic surgery",
          ),
          i18nString(
            "Ortopedi – ledd, skjelett, idrettsskader og protesekirurgi",
            "Orthopedics — joints, bones, sports injuries and joint replacement surgery",
          ),
          i18nString(
            "Urologi – urinveier, prostata og mannlig underlivshelse",
            "Urology — urinary tract, prostate and men's pelvic health",
          ),
          i18nString(
            "Fertilitet og graviditet – utredning, assistert befruktning og oppfølging gjennom hele forløpet",
            "Fertility and pregnancy — assessment, assisted reproduction and follow-up throughout the entire pathway",
          ),
        ],
      },
    ],
    supportSpecialtiesSection: {
      intro: i18nText(
        "I tillegg til de medisinske spesialistene trekker vi inn støttefag som utfyller den kirurgiske og medisinske behandlingen:",
        "In addition to our medical specialists, we involve supporting disciplines that complement surgical and medical treatment:",
      ),
      items: SUPPORT_SPECIALTIES.map((item) => ({
        _key: `support-${item.key}`,
        title: item.title,
        description: item.description,
      })),
    },
    specialtyAreasSection: {
      title: i18nString("Fagområdene våre", "Our specialties"),
      cards,
    },
    ctaText: i18nString("Bestill time", "Book appointment"),
    ctaLink: "/booking",
    seo: {
      metaTitle: i18nString(
        "Tverrfaglig kirurgisk team",
        "Multidisciplinary surgical team",
      ),
      metaDescription: i18nText(
        "Hos CMedical samarbeider kirurgere og spesialister på tvers av fagfelt – med støttefag som psykolog, sexolog, fysioterapeut og uroterapeut når du trenger det.",
        "At CMedical, surgeons and specialists collaborate across disciplines — with supporting specialties such as psychologists, sexologists, physiotherapists and urotherapists when you need them.",
      ),
    },
    geoSummary: i18nText(
      "Tverrfaglig kirurgisk team hos CMedical — gynekologi, ortopedi, urologi, fertilitet og støttefag under samme tak.",
      "CMedical multidisciplinary surgical team — gynecology, orthopedics, urology, fertility and supporting specialties under one roof.",
    ),
  };

  await sanityClient.createOrReplace(doc);

  const draftId = `drafts.${PAGE_ID}`;
  const draft = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  });
  if (draft) {
    await sanityClient.delete(draftId);
    console.log(`deleted ${draftId}`);
  }

  const verify = await sanityClient.fetch(
    `*[_id==$id][0]{
      "titleNo": title[language=="no"][0].value,
      "cards": specialtyAreasSection.cards[]{
        "titleNo": title[language=="no"][0].value,
        "hrefNo": href[language=="no"][0].value,
        "hrefEn": href[language=="en"][0].value
      }
    }`,
    { id: PAGE_ID },
  );
  console.log("\n✅ themePage-tverrfaglige-team updated");
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
