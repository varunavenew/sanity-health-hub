#!/usr/bin/env npx tsx
/**
 * Developer-only: restore Om-section left-column leads for gynekologi (+ graviditet).
 *
 * Root cause: many pages never had reasonsLead in the content file, and
 * patch-gynekologi-om-sections-developer.ts UNSET reasonsLead when empty —
 * so the Om title showed with a blank description.
 *
 *   cd test && npx tsx sanity/patch-gynekologi-om-leads-developer.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GYN_PAGE_CONTENT } from "./data/gynekologi-page-content";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Prefer explicit Om leads from the demo dump; keep intentional overrides. */
const DEMO_LEADS: Record<string, { no: string; en: string }> = {
  blodningsforstyrrelser: {
    no: "Blødningsforstyrrelser må utredes for å utelukke underliggende sykdom. Ofte kan det være naturlige forklaringer som enkelt kan behandles.",
    en: "Abnormal bleeding must be investigated to rule out underlying disease. There are often natural explanations that can be treated simply.",
  },
  overgangsalder: {
    no: "Overgangsalderen deles ofte inn i fasene premenopause, perimenopause, menopause og postmenopause. Det hele starter med premenopausen, som strekker seg fra første menstruasjon og fram til menstruasjonen blir uregelmessig.",
    en: "Menopause is often divided into premenopause, perimenopause, menopause and postmenopause. It begins with premenopause, from the first period until periods become irregular.",
  },
  hysteroskopi: {
    no: "Hysteroskopi er en skånsom gynekologisk undersøkelse der vi bruker et tynt instrument med kamera for å se inn i livmorhulen gjennom livmorhalsen.",
    en: "Hysteroscopy is a gentle gynaecological examination in which a thin camera instrument is passed through the cervix to view the uterine cavity.",
  },
  poi: {
    no: "Hormonforstyrrelser handler om unormale nivåer av hormoner — for mye, for lite eller ujevn produksjon. Disse tegnene bør utredes.",
    en: "Hormonal disorders involve abnormal hormone levels — too much, too little or uneven production. These signs should be investigated.",
  },
  "pms-pmdd": {
    no: "Forskjellen mellom PMS og PMDD ligger i alvorlighetsgrad og hvordan symptomene påvirker livet ditt. Disse tegnene tilsier utredning.",
    en: "The difference between PMS and PMDD is severity and how symptoms affect your life. These signs warrant assessment.",
  },
  cyster: {
    no: "Cyster på eggstokkene er veldig vanlig og i de fleste tilfeller helt ufarlig.",
    en: "Ovarian cysts are very common and, in most cases, entirely harmless.",
  },
  celleforandringer: {
    no: "Celleforandringer er forstadier til kreft og kalles dysplasier. Det finnes flere stadier i økende alvorlighetsgrad. Hvorvidt celleforandringene skal behandles avhenger av hvor alvorlige de er og hvilken type HPV du har.",
    en: "Cervical cell changes are precancerous changes known as dysplasia. There are several grades of increasing severity. Whether the cell changes should be treated depends on how severe they are and which type of HPV you have.",
  },
  vulvalidelser: {
    no: "Kompliserte sykdommer som vulvasykdommer trenger en tverrfaglig tilnærming. Vårt multidisiplinære team består derfor av gynekolog, hudlege, sexolog, psykolog og bekkenbunnsfysioterapeut.",
    en: "Complex conditions such as vulval disease require a multidisciplinary approach. Our multidisciplinary team therefore includes a gynaecologist, dermatologist, sexologist, psychologist and pelvic floor physiotherapist.",
  },
  vaginisme: {
    no: "Vaginisme rammer flere enn du tror, men blir sjelden snakket om. Disse situasjonene fortjener spesialistvurdering.",
    en: "Vaginismus affects more people than you think, but is rarely talked about. These situations deserve specialist assessment.",
  },
  urinlekkasje: {
    no: "Nesten 25 % av alle kvinner rammes av urinlekkasje i løpet av livet - noe som gir redusert livskvalitet.",
    en: "Almost 25% of all women experience urinary incontinence during their lifetime — something that reduces quality of life.",
  },
  urogynekologi: {
    no: "Urogynekologi er fagområdet som utreder og behandler plager i bekkenbunnen — først og fremst vaginale fremfall (prolaps) og urinlekkasje. Under finner du egne sider med utdypende informasjon om hver av tilstandene.",
    en: "Urogynaecology is the field that assesses and treats pelvic floor problems — primarily vaginal prolapse and urinary incontinence. Below you will find dedicated pages with more detail on each condition.",
  },
  "vaginale-fremfall": {
    no: "Vaginalt fremfall, også kjent som prolaps, innebærer at skjedens fremre eller bakre vegg, eller livmor/livmorhals, buker ned i skjeden eller ut av skjedeinngangen.",
    en: "Pelvic organ prolapse occurs when the front or back wall of the vagina, or the uterus or cervix, bulges down into the vagina or beyond the vaginal opening.",
  },
  kirurgi: {
    no: "CMedical tilbyr vi en rekke gynekologiske operasjoner utført av håndplukkede kirurger, som er ledende innen sine felt.",
    en: "At CMedical we offer a range of gynaecological procedures performed by carefully selected surgeons who are leaders in their fields.",
  },
  robotkirurgi: {
    no: "CMedical er den eneste private aktøren i Norge som tilbyr robotassistert kirurgi innen gynekologi. Med da Vinci-systemet utfører vi avanserte inngrep med minimalt invasiv teknikk.",
    en: "CMedical is the only private provider in Norway offering robot-assisted gynaecological surgery. Using the da Vinci system, we perform advanced procedures with minimally invasive techniques.",
  },
  "fjerne-livmor": {
    no: "Fjerning av livmor (hysterektomi) anbefales ved plagsomme muskelknuter (myomer), blødningsforstyrrelser, kreft i livmor eller livmorhals. Det kan også være aktuelt ved endometriose eller ved vedvarende celleforandringer i livmorhals.",
    en: "Removal of the uterus (hysterectomy) is recommended for troublesome fibroids (myomas), abnormal uterine bleeding, or cancer of the uterus or cervix. It may also be relevant for endometriosis or persistent cervical cell changes.",
  },
  labiaplastikk: {
    no: "Det er normalt med ulik størrelse og utseende på kjønnslepper. Noen ganger gir store kjønnslepper smerter ved fysisk aktivitet som sykling, ridning, eller er i veien ved samleie. Da kan kirurgisk reduksjon av kjønnsleppene være løsningen.",
    en: "It is normal for the labia to vary in size and appearance. Sometimes enlarged labia cause pain during physical activity such as cycling or horse riding, or get in the way during intercourse. Surgical reduction of the labia can then be the solution.",
  },
  tverrfaglig: {
    no: "Våre gynekologer jobber kun med den kvinnesykdommen de kan aller best, og ved behov jobber vi i unike ekspert team med psykolog, sexolog, ernæringsfysiolog, fysioterapeut, osteopat og uroterapeut. Denne tverrfagligheten er helt unik!",
    en: "Our gynaecologists work only with the area of women’s health they know best, and when needed we work in unique expert teams with a psychologist, sexologist, dietitian, physiotherapist, osteopath and continence specialist. This multidisciplinary approach is truly unique!",
  },
  endometriose: {
    no: "Endometriet = slimhinnen i livmoren.",
    en: "The endometrium = the lining of the uterus.",
  },
  adenomyose: {
    no: "Symptomene overlapper med endometriose og blødningsforstyrrelser, og tilstanden blir ofte oversett. Disse tegnene fortjener utredning.",
    en: "Symptoms overlap with endometriosis and abnormal bleeding, and the condition is often overlooked. These signs deserve investigation.",
  },
  pcos: {
    no: "PMOS gir svært ulike symptomer. Mange går udiagnostisert i årevis fordi tegnene tolkes hver for seg.",
    en: "PMOS causes very varied symptoms. Many people go undiagnosed for years because the signs are interpreted in isolation.",
  },
  ultralyd: {
    no: "Hos CMedical får du ultralydundersøkelser gjennom hele svangerskapet, fra tidlig ultralyd i uke 6, til organrettet ultralyd i uke 18-20.",
    en: "At CMedical, you can have ultrasound examinations throughout pregnancy, from an early scan at week 6 to a detailed fetal anomaly scan at weeks 18–20.",
  },
  "6-ukerskontroll": {
    no: "På 6-ukerskontrollen har vi hovedfokus på bekkenbunn og din psykiske helse etter fødsel.",
    en: "At the six-week postnatal check we focus on your pelvic floor and mental wellbeing after birth.",
  },
  fodselsskader: {
    no: "Fødselsskader er en samlebetegnelse på plager som kan oppstå etter en fødsel. Det kan være bristninger og arrvev, svekket bekkenbunn, diastase i magemuskulaturen, vaginale fremfall, urin- eller avføringslekkasje, eller smerter ved samleie.",
    en: "Birth injuries is an umbrella term for problems that can occur after childbirth. These may include tears and scar tissue, a weakened pelvic floor, abdominal muscle separation (diastasis), vaginal prolapse, urinary or faecal incontinence, or pain during intercourse.",
  },
  nipt: {
    no: "Fra og med svangerskapsuke 10 kan du ta NIPT-test og tidlig ultralyd hos oss. NIPT er en forkortelse for Non-Invasive Prenatal Test.",
    en: "From pregnancy week 10 you can have an NIPT test and early ultrasound with us. NIPT stands for Non-Invasive Prenatal Test.",
  },
  fostermedisin: {
    no: "Hos oss møter du høyt kompetente, erfarne og dedikerte gynekologer med spesialisering innen fostermedisin, også kalt fostermedisinere. Deres kompetanse er din trygghet.",
    en: "With us you meet highly skilled, experienced and dedicated gynaecologists specialised in fetal medicine. Their expertise is your reassurance.",
  },
  graviditet: {
    no: "Vi ønsker deg velkommen til oppfølging gjennom hele svangerskapet. Vi tilbyr fosterdiagnostikk, som NIPT og tidlig ultralyd. Hos oss jobber fødselsleger, gynekologspesialister og fostermedisinere. Deres kompetanse er din trygghet.",
    en: "You are welcome for follow-up throughout pregnancy. We offer prenatal diagnostics such as NIPT and early ultrasound. Our team includes obstetricians, specialist gynaecologists and fetal medicine doctors. Their expertise is your reassurance.",
  },
};

function i18nText(no: string, en: string) {
  return [
    {
      _type: "internationalizedArrayTextValue",
      _key: "no",
      language: "no",
      value: no,
    },
    {
      _type: "internationalizedArrayTextValue",
      _key: "en",
      language: "en",
      value: en,
    },
  ];
}

function firstPara(text: string | undefined | null): string {
  return (text || "").trim().split(/\n\n+/)[0]?.trim() || "";
}

function resolveLead(slug: string): { no: string; en: string } | null {
  const demo = DEMO_LEADS[slug];
  if (demo?.no) return demo;
  const content = GYN_PAGE_CONTENT[slug];
  if (!content) return null;
  const no = content.reasonsLeadNo?.trim() || firstPara(content.heroLeadNo);
  const en = content.reasonsLeadEn?.trim() || firstPara(content.heroLeadEn);
  if (!no || !en) return null;
  return { no, en };
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing: dataset "${DATASET}" (developer only)`);
  }

  const docs = await sanityClient.fetch<Array<{ _id: string; slug: string }>>(
    `*[
      _type=="treatment" &&
      (
        references(*[_type=="treatmentCategory" && categoryId=="gynekologi"][0]._id) ||
        references(*[_type=="treatmentCategory" && categoryId=="graviditet"][0]._id)
      ) &&
      !(_id in path("drafts.**"))
    ]{
      _id,
      "slug": coalesce(
        slug[language=="no"][0].value.current,
        slug[_key=="no"][0].value.current,
        slug[0].value.current
      )
    }`,
  );

  let updated = 0;
  let skipped = 0;

  for (const doc of docs) {
    const slug = doc.slug;
    if (!slug || !GYN_PAGE_CONTENT[slug]) {
      skipped++;
      continue;
    }
    const lead = resolveLead(slug);
    if (!lead) {
      console.log("skip (no lead):", slug);
      skipped++;
      continue;
    }

    console.log(DRY_RUN ? "DRY" : "PATCH", slug, "→", JSON.stringify(lead.no).slice(0, 90) + "…");
    if (!DRY_RUN) {
      await sanityClient
        .patch(doc._id)
        .set({ reasonsLead: i18nText(lead.no, lead.en) })
        .commit({ autoGenerateArrayKeys: false });
      try {
        await sanityClient.delete(`drafts.${doc._id}`);
      } catch {
        /* no draft */
      }
    }
    updated++;
  }

  // Keep content file in sync for pages that still lack reasonsLeadNo
  const contentPath = path.join(__dirname, "data", "gynekologi-page-content.ts");
  let source = fs.readFileSync(contentPath, "utf8");
  let fileEdits = 0;
  for (const [slug, lead] of Object.entries(DEMO_LEADS)) {
    const page = GYN_PAGE_CONTENT[slug];
    if (!page || page.reasonsLeadNo?.trim()) continue;
    // Insert after reasonsTitleEn line inside the slug block
    const marker = `  "${slug}":`;
    const altMarker = `  ${slug}:`;
    const start = source.includes(marker)
      ? source.indexOf(marker)
      : source.indexOf(altMarker);
    if (start < 0) continue;
    const titleEnIdx = source.indexOf("reasonsTitleEn:", start);
    if (titleEnIdx < 0 || titleEnIdx - start > 2500) continue;
    const lineEnd = source.indexOf("\n", titleEnIdx);
    const nextChunk = source.slice(lineEnd, lineEnd + 80);
    if (nextChunk.includes("reasonsLeadNo")) continue;
    const insert =
      `\n    reasonsLeadNo:\n      ${JSON.stringify(lead.no)},\n` +
      `    reasonsLeadEn:\n      ${JSON.stringify(lead.en)},`;
    source = source.slice(0, lineEnd) + insert + source.slice(lineEnd);
    fileEdits++;
  }
  if (!DRY_RUN && fileEdits > 0) {
    fs.writeFileSync(contentPath, source);
    console.log(`\nUpdated gynekologi-page-content.ts (+${fileEdits} reasonsLead fields)`);
  } else {
    console.log(`\nContent file edits: ${fileEdits}`);
  }

  console.log(`\nDone. ${DRY_RUN ? "Would update" : "Updated"} ${updated}, skipped ${skipped}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
