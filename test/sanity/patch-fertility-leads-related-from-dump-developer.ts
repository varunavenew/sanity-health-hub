#!/usr/bin/env npx tsx
/**
 * Developer-only: fix fertility Om leads + related lists from CMedical dump.
 *
 * Fixes:
 * - Missing reasonsLead on hub + 4 audience pages (left column empty under Om title)
 * - Truncated … leads on donorbehandling / sædanalyse
 * - Hub related list (dump: clinical + audience, not 4 audience-only)
 * - Audience related order to match dump (clinical first, then siblings)
 *
 *   cd test && npx tsx sanity/patch-fertility-leads-related-from-dump-developer.ts
 *   DRY_RUN=1 npx tsx sanity/patch-fertility-leads-related-from-dump-developer.ts
 */
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

const IDS = {
  fertilitetsutredning: "treatment-fertilitet-fertilitetsutredning",
  assistert: "treatment-fertilitet-assistert-befruktning",
  eggfrys: "treatment-fertilitet-eggfrys",
  donor: "treatment-fertilitet-donorbehandling",
  saedanalyse: "treatment-fertilitet-saedanalyse",
  infertilitet: "treatment-fertilitet-infertilitet",
  hysteroskopi: "treatment-fertilitet-hysteroskopi",
  parOgSingle: "treatment-fertilitet-assistert-befruktning-for-par-og-single",
  mannKvinne: "treatment-fertilitet-mann-og-kvinne-i-parforhold",
  toKvinner: "treatment-fertilitet-to-kvinner-i-parforhold",
  singelKvinne: "treatment-fertilitet-singel-kvinne",
  singelMann: "treatment-fertilitet-singel-mann",
} as const;

/** Dump-aligned related order (exclude self at apply time). */
const RELATED_BY_ID: Record<string, string[]> = {
  [IDS.parOgSingle]: [
    IDS.infertilitet,
    IDS.assistert,
    IDS.eggfrys,
    IDS.donor,
    IDS.hysteroskopi,
    IDS.saedanalyse,
    IDS.mannKvinne,
    IDS.toKvinner,
    IDS.singelKvinne,
    IDS.singelMann,
  ],
  [IDS.mannKvinne]: [
    IDS.infertilitet,
    IDS.assistert,
    IDS.eggfrys,
    IDS.donor,
    IDS.hysteroskopi,
    IDS.saedanalyse,
    IDS.parOgSingle,
    IDS.toKvinner,
    IDS.singelKvinne,
    IDS.singelMann,
  ],
  [IDS.toKvinner]: [
    IDS.infertilitet,
    IDS.assistert,
    IDS.eggfrys,
    IDS.donor,
    IDS.hysteroskopi,
    IDS.saedanalyse,
    IDS.parOgSingle,
    IDS.mannKvinne,
    IDS.singelKvinne,
    IDS.singelMann,
  ],
  [IDS.singelKvinne]: [
    IDS.infertilitet,
    IDS.assistert,
    IDS.eggfrys,
    IDS.donor,
    IDS.hysteroskopi,
    IDS.saedanalyse,
    IDS.parOgSingle,
    IDS.mannKvinne,
    IDS.toKvinner,
    IDS.singelMann,
  ],
  [IDS.singelMann]: [
    IDS.infertilitet,
    IDS.assistert,
    IDS.eggfrys,
    IDS.donor,
    IDS.hysteroskopi,
    IDS.saedanalyse,
    IDS.parOgSingle,
    IDS.mannKvinne,
    IDS.toKvinner,
    IDS.singelKvinne,
  ],
};

const LEADS: Record<string, string> = {
  [IDS.parOgSingle]:
    "Hos oss er det plass til ulike veier til det samme ønsket – å få barn. Assistert befruktning kan benyttes av mann og kvinne i parforhold, to kvinner i parforhold, og kvinner som ønsker å bli mor på egen hånd nå eller bevare mulighetene for å bli gravid i fremtiden.",
  [IDS.mannKvinne]:
    "Har dere prøvd en stund – uten å lykkes? Mange av parene som kommer til oss har forsøkt å bli gravide over tid. Uansett hvor dere er i prosessen, møter vi dere med forståelse og respekt.",
  [IDS.toKvinner]:
    "Flere og flere kvinner velger å få barn sammen som par. Hos oss møter dere et fagmiljø med erfaring, trygghet og forståelse for deres situasjon.",
  [IDS.singelKvinne]:
    "Ønsker du å få barn på egen hånd – eller bevare muligheten for senere? Mange kvinner kommer til oss for å utforske mulighetene – enten de er klare for behandling, ønsker mer kunnskap, eller vurderer å fryse ned egg for fremtiden.",
  [IDS.singelMann]:
    "Ønsker du å få innsikt i din fertilitet? En sædanalyse gir viktig informasjon om sædkvaliteten din – og kunnskap gjør det lettere å ta gode valg, både nå og i fremtiden.",
  // Fix truncated CMS leads (ellipsis cut mid-word)
  [IDS.donor]:
    "Behandling med donorsæd eller donerte egg kan være aktuelt for mange. I Norge er det ikke tillatt med samtidig donasjon av egg og sæd (såkalt dobbeldonasjon) og single kvinner i Norge får derfor ikke tilbud om eggdonasjon i henhold til bioteknologiloven.",
  [IDS.saedanalyse]:
    "En sædanalyse er en trygg og enkel måte å kartlegge mannens sædkvalitet på. Prøven gir viktig informasjon om antall, bevegelighet og utseende på spermiene, og brukes ofte som første steg når du ønsker å undersøke fertilitet eller planlegger assistert befruktning.",
};

/** Hub first accordion: keep eligibility body; move shared intro to reasonsLead. */
const HUB_FIRST_REASON_DESC =
  "Uansett livssituasjon møter vi deg eller dere med respekt, trygghet og forståelse. Noen har prøvd lenge uten å lykkes. Andre er helt i startfasen og ønsker å vite mer om mulighetene. For mange kan det være et stort steg å ta kontakt – derfor er vi opptatt av å gjøre veien inn så trygg og forutsigbar som mulig. Rammene for behandling er regulert av Bioteknologiloven. For kvinner er øvre aldersgrense ved inseminasjon eller innsetting av befruktet egg satt til 46 år. I forkant av behandling må alle testes for hepatitt B og C samt HIV. Blodprøvene må være tatt i løpet av de siste 24 månedene før oppstart av IVF-behandling.";

function refKey() {
  return randomBytes(6).toString("hex");
}

function refs(ids: readonly string[]) {
  return ids.map((id) => ({
    _type: "reference" as const,
    _ref: id,
    _key: refKey(),
  }));
}

function i18nText(no: string) {
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
      value: no,
    },
  ];
}

function pick(v: unknown): string | null {
  if (typeof v === "string") return v;
  if (!Array.isArray(v)) return null;
  const no = v.find(
    (x: { language?: string; _key?: string }) =>
      x?.language === "no" || x?._key === "no",
  ) as { value?: unknown } | undefined;
  const val = no?.value ?? (v[0] as { value?: unknown })?.value;
  return typeof val === "string" ? val : null;
}

async function discardDraft(id: string) {
  const draftId = `drafts.${id}`;
  const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  });
  if (exists) {
    if (!DRY_RUN) await sanityClient.delete(draftId);
    console.log(`  deleted ${draftId}`);
  }
}

async function patchLead(id: string, lead: string) {
  console.log(`→ lead ${id}`);
  if (!DRY_RUN) {
    await sanityClient.patch(id).set({ reasonsLead: i18nText(lead) }).commit();
  }
  await discardDraft(id);
}

async function patchRelated(id: string, relatedIds: string[]) {
  const ids = relatedIds.filter((r) => r !== id);
  console.log(`→ related ${id} (${ids.length})`);
  if (!DRY_RUN) {
    await sanityClient
      .patch(id)
      .set({ "relatedSection.items": refs(ids) })
      .commit({ autoGenerateArrayKeys: true });
  }
  await discardDraft(id);
}

async function trimHubFirstReason() {
  const id = IDS.parOgSingle;
  const reasons = await sanityClient.fetch<
    Array<Record<string, unknown>> | null
  >(`*[_id==$id][0].reasons[]`, { id });
  if (!reasons?.length) {
    console.warn("  hub reasons missing");
    return;
  }

  const first = reasons[0];
  const title = pick(first.title);
  if (title !== "Hvem kan få hjelp hos oss?") {
    console.warn(`  unexpected first reason title: ${title}`);
    return;
  }

  const next = reasons.map((row, i) => {
    if (i !== 0) return row;
    return {
      ...row,
      desc: i18nText(HUB_FIRST_REASON_DESC),
    };
  });

  console.log(`→ trim hub first reason desc (${HUB_FIRST_REASON_DESC.length} chars)`);
  if (!DRY_RUN) {
    await sanityClient.patch(id).set({ reasons: next }).commit({
      autoGenerateArrayKeys: true,
    });
  }
  await discardDraft(id);
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing dataset "${DATASET}" — developer only`);
  }

  console.log(`DRY_RUN=${DRY_RUN} dataset=${DATASET}`);

  for (const [id, lead] of Object.entries(LEADS)) {
    const exists = await sanityClient.fetch<string | null>(
      `*[_id==$id && !(_id in path("drafts.**"))][0]._id`,
      { id },
    );
    if (!exists) {
      console.warn(`skip missing ${id}`);
      continue;
    }
    await patchLead(id, lead);
  }

  await trimHubFirstReason();

  for (const [id, related] of Object.entries(RELATED_BY_ID)) {
    const exists = await sanityClient.fetch<string | null>(
      `*[_id==$id && !(_id in path("drafts.**"))][0]._id`,
      { id },
    );
    if (!exists) {
      console.warn(`skip missing ${id}`);
      continue;
    }
    await patchRelated(id, related);
  }

  // Verify hub
  const hub = await sanityClient.fetch(
    `*[_id==$id][0]{
      "lead": reasonsLead[_key=="no"][0].value,
      "r0": reasons[0].desc[_key=="no"][0].value,
      "relatedN": count(relatedSection.items)
    }`,
    { id: IDS.parOgSingle },
  );
  console.log("\n✓ hub verify");
  console.log(
    JSON.stringify(
      {
        leadStart: String(hub?.lead || "").slice(0, 80),
        r0Start: String(hub?.r0 || "").slice(0, 80),
        relatedN: hub?.relatedN,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
