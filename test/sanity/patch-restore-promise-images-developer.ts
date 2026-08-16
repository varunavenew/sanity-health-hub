/**
 * Developer-only: restore wiped promise images + descriptions on
 * fertility / urologi / ortopedi.
 *
 * Prior image-only restore fetched promises without `desc`, then
 * `.set({promises})` cleared body copy under each card.
 *
 *   cd test && npx tsx sanity/patch-restore-promise-images-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

const PROMISE_IMAGES = [
  "image-dc7e9dd5ae34732d52edfae6e810af2ff0794983-1284x1920-webp", // comfort / tailored
  "image-79d70f57e26a3a54f724284879b6a83cb0fb22f7-1334x2000-jpg", // specialists
  "image-daf99994e94904484bd1e5200164387944b250ed-1420x1080-jpg", // same roof
] as const;

const PROMISE_COPY = [
  {
    // default / ortopedi / urologi
    match: /tilpasset|tailored/,
    descNo:
      "Alle undersøkelser og inngrep tilpasses dine behov og ønsker. Du kan stoppe når som helst, stille spørsmål underveis, og ta med noen om du ønsker det.",
    descEn:
      "All examinations and procedures are tailored to your needs and wishes. You can stop at any time, ask questions along the way, and bring someone with you if you want.",
  },
  {
    match: /komfortabel|comfortable|you decide|du bestemmer/,
    descNo:
      "Alle undersøkelser og inngrep gjøres i ditt tempo. Du kan stoppe når som helst, stille spørsmål underveis, og ta med noen om du ønsker det.",
    descEn:
      "All examinations and procedures are done at your pace. You can stop at any time, ask questions along the way, and bring someone with you if you wish.",
  },
  {
    match: /erfarne|experienced specialists|spesialister med dybde|specialists with/,
    descNo:
      "Hos oss møter du leger som har spesialisert seg innenfor sitt fagfelt — ikke en generalist på utplassering. Du får riktig kompetanse fra første konsultasjon.",
    descEn:
      "With us you meet doctors who have specialised in their field — not a generalist on rotation. You get the right expertise from the first consultation.",
  },
  {
    match: /samme tak|under one roof|everything under/,
    descNo:
      "Trenger du videre utredning, behandling eller oppfølging — vi koordinerer hele forløpet for deg.",
    descEn:
      "If you need further assessment, treatment or follow-up — we coordinate the entire pathway for you.",
  },
] as const;

type I18nRow = {
  _key?: string;
  _type?: string;
  language?: string;
  value?: string;
};

type PromiseRow = {
  _key: string;
  title?: I18nRow[] | null;
  desc?: I18nRow[] | null;
  eyebrow?: I18nRow[] | null;
  image?: { _type?: string; asset?: { _type?: string; _ref?: string } } | null;
  [key: string]: unknown;
};

function imageRef(assetId: string) {
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: assetId },
  };
}

function i18nText(no: string, en: string): I18nRow[] {
  return [
    {
      _key: "no",
      _type: "internationalizedArrayTextValue",
      language: "no",
      value: no,
    },
    {
      _key: "en",
      _type: "internationalizedArrayTextValue",
      language: "en",
      value: en,
    },
  ];
}

function pick(rows: I18nRow[] | null | undefined, lang: "no" | "en"): string {
  if (!Array.isArray(rows)) return "";
  const hit =
    rows.find((r) => r.language === lang || r._key === lang) || rows[0];
  return typeof hit?.value === "string" ? hit.value.trim() : "";
}

function slotForTitle(title: string): number | null {
  const t = title.toLowerCase();
  if (/tilpasset|komfortabel|tailored|comfortable|you decide|du bestemmer/.test(t)) {
    return 0;
  }
  if (
    /erfarne|spesialister|experienced specialists|specialists with|spesialister med/.test(
      t,
    )
  ) {
    return 1;
  }
  if (/samme tak|under one roof|everything under/.test(t)) {
    return 2;
  }
  return null;
}

function copyForTitle(title: string): { descNo: string; descEn: string } | null {
  const t = title.toLowerCase();
  for (const row of PROMISE_COPY) {
    if (row.match.test(t)) return { descNo: row.descNo, descEn: row.descEn };
  }
  return null;
}

function needsDesc(desc: I18nRow[] | null | undefined): boolean {
  const no = pick(desc, "no");
  const en = pick(desc, "en");
  return !no || !en;
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") throw new Error("unexpected project");
  if (DATASET !== "developer") throw new Error("developer only");

  // CRITICAL: fetch full promise objects — never omit desc/eyebrow/image
  // before a later .set({promises}), or those fields are wiped.
  const docs = await sanityClient.fetch<
    Array<{
      _id: string;
      promises?: PromiseRow[];
    }>
  >(`*[
    _type=="treatment" && !(_id in path("drafts.**")) &&
    (references("category-fertilitet") || references("category-urologi") || references("category-ortopedi"))
  ]{
    _id,
    promises[]{ _key, title, desc, eyebrow, image }
  }`);

  for (const id of PROMISE_IMAGES) {
    const ok = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
      id,
    });
    if (!ok) throw new Error(`Missing asset ${id}`);
  }

  let patched = 0;
  let skipped = 0;

  for (const doc of docs) {
    const promises = doc.promises || [];
    if (promises.length === 0) {
      skipped += 1;
      continue;
    }

    let changed = false;
    const next = promises.map((row, index) => {
      const titleNo = pick(row.title, "no");
      const titleEn = pick(row.title, "en");
      const titleForMatch = titleEn || titleNo;
      const slot =
        slotForTitle(titleEn) ??
        slotForTitle(titleNo) ??
        (index < 3 ? index : null);

      let out: PromiseRow = { ...row };

      if (slot !== null) {
        const want = PROMISE_IMAGES[slot];
        if (row.image?.asset?._ref !== want) {
          changed = true;
          out = { ...out, image: imageRef(want) };
        }
      }

      if (needsDesc(row.desc)) {
        const copy =
          copyForTitle(titleForMatch) ||
          (slot !== null
            ? copyForTitle(
                ["tilpasset", "erfarne spesialister", "samme tak"][slot],
              )
            : null);
        if (copy) {
          const existingNo = pick(row.desc, "no");
          const existingEn = pick(row.desc, "en");
          changed = true;
          out = {
            ...out,
            desc: i18nText(existingNo || copy.descNo, existingEn || copy.descEn),
          };
        }
      }

      return out;
    });

    if (!changed) {
      skipped += 1;
      continue;
    }

    console.log(`→ ${doc._id} (restore promise image/desc)`);
    if (!DRY_RUN) {
      await sanityClient
        .patch(doc._id)
        .set({ promises: next })
        .commit({ autoGenerateArrayKeys: true });
      const draftId = `drafts.${doc._id}`;
      const draft = await sanityClient.fetch(`*[_id==$id][0]._id`, {
        id: draftId,
      });
      if (draft) await sanityClient.delete(draftId);
    }
    patched += 1;
  }

  console.log(
    JSON.stringify(
      { dataset: DATASET, dryRun: DRY_RUN, patched, skipped, total: docs.length },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
