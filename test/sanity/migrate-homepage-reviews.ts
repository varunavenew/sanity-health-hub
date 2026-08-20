/**
 * Migration: Homepage reviews → `googleReview` documents (NO + EN, i18n v5)
 *
 * Schema targets (test/schemaTypes/googleReview.ts):
 *   author  : string
 *   rating  : number
 *   text    : internationalizedArrayText   ← localized (no + en)
 *   date    : date (YYYY-MM-DD)
 *   source  : 'google' | 'legelisten'
 *
 * Source data: src/data/googleReviews.ts (the reviews shown in
 * GoogleReviewsSection on the homepage). Relative Norwegian dates
 * ("5 måneder siden") are converted to absolute ISO dates.
 *
 * Deterministic _ids (`googleReview.static-<id>`) make the script idempotent.
 * By default existing documents are left untouched; FORCE=1 overwrites them.
 *
 * Usage:
 *   cd test
 *   SANITY_TOKEN=xxx npx tsx sanity/migrate-homepage-reviews.ts --dry-run
 *   SANITY_TOKEN=xxx npx tsx sanity/migrate-homepage-reviews.ts
 *   SANITY_TOKEN=xxx FORCE=1 npx tsx sanity/migrate-homepage-reviews.ts
 */
import { sanityClient } from "./config";

const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.env.FORCE === "1";

/* ── internationalized-array v5 helpers ──────────────────────────────────── */

const i18nText = (no: string, en: string) => [
  { _key: "no", _type: "internationalizedArrayTextValue", value: no },
  { _key: "en", _type: "internationalizedArrayTextValue", value: en },
];

/* ── Relative Norwegian date → ISO date ──────────────────────────────────── */

function relativeNoToIso(input: string): string | undefined {
  if (!input) return undefined;
  const s = input.toLowerCase().trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/(\d+)?\s*(dag|uke|måned|maned|år|ar)/);
  if (!m) return undefined;
  const n = Number(m[1] || 1);
  const unit = m[2];
  const d = new Date();
  if (unit.startsWith("dag")) d.setDate(d.getDate() - n);
  else if (unit.startsWith("uke")) d.setDate(d.getDate() - n * 7);
  else if (unit.startsWith("m")) d.setMonth(d.getMonth() - n);
  else d.setFullYear(d.getFullYear() - n);
  return d.toISOString().slice(0, 10);
}

/* ── Reviews (mirrors src/data/googleReviews.ts + EN translations) ───────── */

type Review = {
  id: number;
  author: string;
  rating: number;
  no: string;
  en: string;
  date: string;
  source: "google" | "legelisten";
};

const reviews: Review[] = [
  {
    id: 1,
    author: "Trude Pedersen",
    rating: 5,
    no: "Fantastisk opplevelse- hyggelig og dyktig lege. Fikk meg til å føle meg veldig trygg og fikk nyttig informasjon. Legen heter Siri Kløkstad",
    en: "Fantastic experience — a kind and skilled doctor. She made me feel very safe and gave me useful information. The doctor's name is Siri Kløkstad.",
    date: "5 måneder siden",
    source: "google",
  },
  {
    id: 2,
    author: "Kaja Kollsgård",
    rating: 5,
    no: "Har hatt en veldig behagelig og fin opplevelse med eggfrys på CMedical. Min lege Jackson var svært dyktig og betryggende. Ved selve egguttaket var Birgitte og Jeanett så gode til å få meg til å slappe av og føle med trygg, at opplevelsen var tilnærmet smertefri. Sykepleier Line fulgte meg opp og hele veien og ga meg all informasjon jeg trengte. Anbefaler CMedical på det sterkeste.",
    en: "I had a very comfortable and pleasant experience with egg freezing at CMedical. My doctor Jackson was highly skilled and reassuring. During the egg retrieval, Birgitte and Jeanett were so good at helping me relax and feel safe that the experience was almost painless. Nurse Line followed me up all the way and gave me all the information I needed. I highly recommend CMedical.",
    date: "7 måneder siden",
    source: "google",
  },
  {
    id: 3,
    author: "Børge Thue",
    rating: 5,
    no: "God servise, gjennomføringsevne. Fantastisk personale og flotte lokaler og god meny.",
    en: "Great service and execution. Fantastic staff, lovely facilities and good food.",
    date: "1 måned siden",
    source: "google",
  },
  {
    id: 4,
    author: "Basse Grefsrud",
    rating: 5,
    no: "Fra start til etter operasjonen har alt gått på skinner veldig fornøyd",
    en: "From start to after the surgery everything went smoothly — very satisfied.",
    date: "2 uker siden",
    source: "google",
  },
  {
    id: 5,
    author: "Thor Gustavsen",
    rating: 5,
    no: "Etter robotassistert kirurgi for prostatakreft av kirurg Nicolai Wessel, er jeg utrolig fornøyd. Både før og etter operasjonen. Fikk helt super informasjon om alt jeg lurte på og Nicolai Wessel var utrolig sympatisk og brukte god tid med meg etter operasjonen. Hele teamet rundt meg med anestesilege og sykepleier var profesjonelle og jeg følte meg så godt ivaretatt. Tusen takk til alle sammen",
    en: "After robot-assisted surgery for prostate cancer by surgeon Nicolai Wessel, I am incredibly satisfied — both before and after the operation. I received excellent information about everything I wondered about, and Nicolai Wessel was extremely kind and took plenty of time with me after surgery. The whole team, including the anaesthetist and nurse, was professional and I felt very well cared for. Thank you all so much.",
    date: "2 måneder siden",
    source: "google",
  },
  {
    id: 6,
    author: "Kjell Olav Rebne",
    rating: 5,
    no: "Full score på alle punkter fra mottakelse, forberedelse til operasjon, operasjon, oppvåkning, etterbehandling, mat, service og kompetanse hele veien. Ansvalig lege var Trond Jørgensen",
    en: "Top marks on every point: reception, preparation for surgery, the operation itself, recovery, aftercare, food, service and expertise all the way. The doctor in charge was Trond Jørgensen.",
    date: "1 måned siden",
    source: "google",
  },
  {
    id: 7,
    author: "Anders Engh",
    rating: 5,
    no: "Jeg fikk påvist artrose i håndleddet mitt og ble henvist til Jan Ragnar Haugstvedt! Ekstremt dyktig håndkirurg og en usedvanlig hyggelig kar! Hele opplevelsen fra ankomst operasjonsdag av Anne Emilie, til teamet med Margrethe i spissen gjorde en litt skummel dag til det motsatte! De første 14 dagene etter inngrepet har vært tilnærmet smertefritt. Kan anbefale klinikken på det sterkeste og takker for opplevelsen. Keep up the good work!",
    en: "I was diagnosed with osteoarthritis in my wrist and referred to Jan Ragnar Haugstvedt! An extremely skilled hand surgeon and an exceptionally kind man. The whole experience — from arriving on the day of surgery with Anne Emilie, to the team led by Margrethe — turned a slightly scary day into the opposite. The first 14 days after the procedure have been almost pain-free. I can warmly recommend the clinic and thank them for the experience. Keep up the good work!",
    date: "4 måneder siden",
    source: "google",
  },
  {
    id: 8,
    author: "Tiril Charlotte Ulrichsen",
    rating: 5,
    no: "Jeg hadde en veldig fin opplevelse hos CMedical. Ble tatt godt imot, og følte meg både hørt og forstått gjennom hele timen. Gynekologen Ida var nøye i arbeidet og fikk meg til å føle meg trygg og godt ivaretatt. Jeg kommer absolutt til å anbefale CMedical og kommer tilbake!",
    en: "I had a very good experience at CMedical. I was welcomed warmly and felt both heard and understood throughout the appointment. The gynaecologist Ida was thorough and made me feel safe and well cared for. I will definitely recommend CMedical and will come back!",
    date: "1 måned siden",
    source: "google",
  },
  {
    id: 9,
    author: "Cato Ingebretsen",
    rating: 5,
    no: "Jeg hadde en særskilt god opplevelse ved bruk av CMedical i fm. en kompleks, større skulderoperasjon i november 2024. CMedical var svært imøtekommende og profesjonelle. Spesielt må jeg fremheve overlege Kristian Marstrand Warholm som så min motivasjon og ga meg muligheten til operasjonen på tross av min høye alder (60). Allerede etter to måneder var jeg i gang med styrketrening og ett år senere er jeg sterkere i skulderen enn noen gang. En stor og hjertelig takk til Kristian og Team CMedical.",
    en: "I had a particularly good experience with CMedical in connection with a complex, major shoulder operation in November 2024. CMedical was very accommodating and professional. I especially want to highlight senior consultant Kristian Marstrand Warholm, who saw my motivation and gave me the opportunity for surgery despite my age (60). After just two months I was back to strength training, and a year later my shoulder is stronger than ever. A big and heartfelt thank you to Kristian and Team CMedical.",
    date: "2 måneder siden",
    source: "google",
  },
  {
    id: 10,
    author: "Martine Widing",
    rating: 5,
    no: "Hyggelig og god opplevelse. Følte meg godt ivaretatt :)",
    en: "Pleasant and good experience. I felt well taken care of :)",
    date: "3 måneder siden",
    source: "legelisten",
  },
  {
    id: 11,
    author: "Anonym",
    rating: 5,
    no: "Nydelig sted med fantastiske mennesker. Fikk veldig god hjelp av legene og sykepleierne. Super opplevelse med nedfrysning av egg.",
    en: "Lovely place with wonderful people. I got great help from the doctors and nurses. A superb experience with egg freezing.",
    date: "6 måneder siden",
    source: "legelisten",
  },
  {
    id: 12,
    author: "Anonym",
    rating: 5,
    no: "Utførte IVF her i 2023 og endte opp med en nydelig gutt etter 3 forsøk. Kan ikke garantere andre å være så heldig, men kan garantere at CMedical vil ta godt vare på deg i gjennom hele prosessen. Har ingen ting å klage på.",
    en: "I did IVF here in 2023 and ended up with a beautiful boy after 3 attempts. I can't promise anyone else the same luck, but I can promise that CMedical will take good care of you throughout the process. Nothing to complain about.",
    date: "11 måneder siden",
    source: "legelisten",
  },
  {
    id: 13,
    author: "Terje Schults",
    rating: 5,
    no: "Veldig prof behandling, veldig hyggelig og seriøse medarbeidere. Rommet var fantastisk",
    en: "Very professional treatment, very kind and dedicated staff. The room was fantastic.",
    date: "3 måneder siden",
    source: "google",
  },
  {
    id: 14,
    author: "Anonym",
    rating: 5,
    no: "Ingvild Aanerud er en dyktig osteopat med stor kunnskap. Hun er varm, lyttende, trygg og har et stort engasjement for pasientene sine. Ingvild er spesielt god på kvinnehelse. Jeg kan virkelig anbefale henne.",
    en: "Ingvild Aanerud is a skilled osteopath with great knowledge. She is warm, attentive, reassuring and deeply committed to her patients. Ingvild is especially good at women's health. I can truly recommend her.",
    date: "7 måneder siden",
    source: "legelisten",
  },
];

/* ── Run ─────────────────────────────────────────────────────────────────── */

const docId = (id: number) => `googleReview.static-${id}`;

async function run() {
  console.log(
    `🔍 ${reviews.length} homepage review(s) to migrate${DRY_RUN ? " (DRY RUN)" : ""}${FORCE ? " [FORCE]" : ""}\n`
  );

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const r of reviews) {
    const iso = relativeNoToIso(r.date);
    const doc = {
      _id: docId(r.id),
      _type: "googleReview",
      author: r.author,
      rating: r.rating,
      text: i18nText(r.no, r.en),
      source: r.source,
      ...(iso ? { date: iso } : {}),
    };

    try {
      if (!DRY_RUN) {
        if (FORCE) {
          await sanityClient.createOrReplace(doc);
        } else {
          const existing = await sanityClient.getDocument(doc._id);
          if (existing) {
            console.log(`⏭  Exists: ${r.author} (${doc._id})`);
            skipped++;
            continue;
          }
          await sanityClient.create(doc);
        }
      }
      console.log(`✓ ${r.author} — ${r.source}${iso ? ` · ${iso}` : ""}`);
      created++;
    } catch (err: any) {
      console.error(`✗ Failed: ${r.author} — ${err?.message || err}`);
      errors++;
    }
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`Written:  ${created}`);
  console.log(`Skipped:  ${skipped}`);
  console.log(`Errors:   ${errors}`);
  if (DRY_RUN) console.log("\n(dry run — no changes committed)");
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
