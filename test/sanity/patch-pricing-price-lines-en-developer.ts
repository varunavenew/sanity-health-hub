#!/usr/bin/env npx tsx
/**
 * Developer-only: complete English on EVERY pricing price-line field.
 *
 * Reference avenewdemo has no English /priser page — EN is translated from NO
 * while preserving prices, order, and apiActivityId.
 *
 *   cd test && npx tsx sanity/patch-pricing-price-lines-en-developer.ts
 */
import fs from "fs";
import path from "path";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

type I18nVal = {
  _type?: string;
  _key?: string;
  language?: string;
  value?: string;
};

function pick(arr: I18nVal[] | undefined, lang: string): string {
  if (!Array.isArray(arr)) return "";
  const hit = arr.find((x) => x.language === lang || x._key === lang);
  return String(hit?.value ?? "").trim();
}

function setI18n(
  existing: I18nVal[] | undefined,
  no: string,
  en: string,
  valueType: "internationalizedArrayStringValue" | "internationalizedArrayTextValue",
): I18nVal[] {
  const base = Array.isArray(existing) ? [...existing] : [];
  const ensure = (lang: "no" | "en", value: string) => {
    const idx = base.findIndex((x) => x.language === lang || x._key === lang);
    const row: I18nVal = {
      _type: valueType,
      _key: lang,
      language: lang,
      value,
    };
    if (idx >= 0) base[idx] = { ...base[idx], ...row, value };
    else base.push(row);
  };
  ensure("no", no);
  ensure("en", en);
  return base;
}

/** Exact NO name → EN name. Covers all current developer price-line names needing EN. */
const NAME_EN: Record<string, string> = {
  "Generell undersøkelse": "General examination",
  "Kontroll / oppfølging": "Follow-up / check-up",
  "Kontroll etter fødsel": "Postpartum check-up",
  "Svangerskapsoppfølging": "Pregnancy follow-up",
  "Ultralyd i svangerskapet": "Pregnancy ultrasound",
  "Fremfall / tyngdefølelse underliv / fødselsskader":
    "Prolapse / pelvic heaviness / birth injuries",
  Urinlekkasje: "Urinary incontinence",
  "Hudlidelser vulva": "Vulvar skin conditions",
  "Digitaltime gynekolog": "Digital appointment with a gynaecologist",
  "Blødningsforstyrrelser / muskelknuter / polypper / hormonelt":
    "Bleeding disorders / fibroids / polyps / hormonal issues",
  "Endometriose / adenomyose": "Endometriosis / adenomyosis",
  Overgangsalder: "Menopause",
  "PMOS / hormonforstyrrelser": "PCOS / hormonal disorders",
  "Smerter i underlivet / vulvodyni / vaginisme":
    "Pelvic pain / vulvodynia / vaginismus",
  "Premenstruelle plager (PMS / PMDD)": "Premenstrual symptoms (PMS / PMDD)",
  "Ammehjelp ved brystbetennelsesproblematikk":
    "Breastfeeding support for mastitis problems",
  "TVT operasjon": "TVT surgery",
  Fremfallsoperasjon: "Prolapse surgery",
  Konisering: "Cone biopsy (conisation)",
  "Botox blære": "Bladder Botox",
  Labiaplastikk: "Labiaplasty",
  Konsultasjon: "Consultation",
  "Konsultasjon utter": "Consultation 60 minutes",
  "Fimose (trang forhud)": "Phimosis (tight foreskin)",
  "Sterilisering (inkl. sædanalyse etter 3 mnd)":
    "Sterilisation (incl. semen analysis after 3 months)",
  "Sædanalyse (ikke infertilitetsutredning)":
    "Semen analysis (not infertility assessment)",
  Refertilisering: "Reversal of sterilisation",
  "RALP (robotkirurgi prostatakreft)":
    "RALP (robotic surgery for prostate cancer)",
  "RASP (robotkirurgi godartet prostataforstørrelse)":
    "RASP (robotic surgery for benign prostatic enlargement)",
  "TUR-P (inklusiv overnatting)": "TUR-P (including overnight stay)",
  "Core Therm (mikrobølge varmebehandling)":
    "CoreTherm (microwave heat treatment)",
  "Fertilitetsutredning og rådgivning inkl. ultralyd":
    "Fertility assessment and counselling incl. ultrasound",
  "Gynekologisk undersøkelse inkl. ultralyd":
    "Gynaecological examination incl. ultrasound",
  "Oppfølgingssamtale med gynekolog etter forsøk/utredning":
    "Follow-up consultation with a gynaecologist after treatment/assessment",
  "Telefon-/webkonsultasjon med gynekolog":
    "Telephone / online consultation with a gynaecologist",
  "Undersøkelse av livmorhulen (SIS)": "Uterine cavity assessment (SIS)",
  "Undersøkelse av eggledere (SIS + HyCoSy)":
    "Fallopian tube assessment (SIS + HyCoSy)",
  "Lavdose hormonbehandling for stimulering av eggløsningper ultralyd":
    "Low-dose hormone treatment for ovulation stimulation per ultrasound",
  "ICSI (mikroinjeksjon)": "ICSI (microinjection)",
  "Nedfrysning av befruktet egg/blastocyst":
    "Freezing of fertilised egg / blastocyst",
  "Avbrutt behandling (IVF/ICSI) før egguthenting":
    "Discontinued treatment (IVF/ICSI) before egg retrieval",
  "Årlig avgift oppbevaring sæd/egg/blastocyster":
    "Annual storage fee for sperm / eggs / blastocysts",
  "Fryseforsøk (FET)Inkluderer prebehandling, undersøkelse, monitorering med ultralyd før tilbakesetting og første svangerskapskontroll":
    "Frozen embryo transfer (FET). Includes pretreatment, examination, ultrasound monitoring before transfer and the first pregnancy check-up",
  "Avbrutt behandling før fryseforsøk":
    "Discontinued treatment before frozen embryo transfer",
  "Inseminasjon med donorsæd (AID)": "Insemination with donor sperm (AID)",
  "Inseminasjon med partnersæd (AIH)": "Insemination with partner sperm (AIH)",
  "Pakkeprisavtale inseminasjon 3 behandlinger":
    "Package price for 3 insemination treatments",
  "Avbrutt behandling inseminasjon": "Discontinued insemination treatment",
  "Sædanalyse etter vasektomiDenne undersøkelsen er inkludert ved vasektomi på CMedical":
    "Semen analysis after vasectomy. This examination is included with vasectomy at CMedical",
  "Nedfrysning av sædceller": "Sperm freezing",
  "PESA/TESA (spermieuthenting)": "PESA/TESA (sperm retrieval)",
  "MicroTESE (inkl. narkose)": "MicroTESE (incl. anaesthesia)",
  Partnerdonasjon: "Partner donation",
  "Eggdonasjon (inkl. tilbakesetting av én blastocyst)Beløpet splittes i to innbetalinger: ved oppstart av behandling og ved nedfrysing av blastocyst":
    "Egg donation (incl. transfer of one blastocyst). The amount is split into two payments: at treatment start and when the blastocyst is frozen",
  "Nedfrysing av sæd til eggdonasjon": "Sperm freezing for egg donation",
  "Tilbakesetting av opptint embryo eggdonasjon":
    "Transfer of thawed embryo after egg donation",
  "Administrasjonskostnad bestilling donoregg":
    "Administration fee for ordering donor eggs",
  "Administrasjonskostnad bestilling donorsæd":
    "Administration fee for ordering donor sperm",
  "Årlig avgift oppbevaring reserverte donorsæd":
    "Annual storage fee for reserved donor sperm",
  "Konsultasjon/utredning": "Consultation / assessment",
  "Graviditetskontroll etter assistert befruktningInkludert i IVF/ICSI-behandling. Pris gjelder ved øvrige behandlinger":
    "Pregnancy check-up after assisted reproduction. Included in IVF/ICSI treatment. Price applies to other treatments",
  "Office-hysteroskopi": "Office hysteroscopy",
  "Tester på livmorslimhinne (ERA/ALICE/EMMA)":
    "Endometrial tests (ERA/ALICE/EMMA)",
  "Administrasjonsgebyr flytting embryo/sæd/egg":
    "Administration fee for transferring embryo / sperm / eggs",
  Resept: "Prescription",
  "Blodprøver tatt hos CMedical": "Blood tests taken at CMedical",
  "Henvisning offentlig sykehus": "Referral to a public hospital",
  Administrasjonsgebyr: "Administration fee",
  "Ikke møtt til fertilitetsutredning (avbest. min 24t før)":
    "Missed fertility assessment appointment (cancel at least 24h before)",
  "Ikke møtt til ultralydkontroll/sædanalyse (avbest. min 24t før)":
    "Missed ultrasound / semen analysis appointment (cancel at least 24h before)",
  "Konsultasjon ortoped skulder": "Orthopaedic consultation – shoulder",
  "Konsultasjon ortoped kne": "Orthopaedic consultation – knee",
  "Konsultasjon ortoped hofte": "Orthopaedic consultation – hip",
  "Konsultasjon ortoped fot/ankel": "Orthopaedic consultation – foot/ankle",
  "Konsultasjon ortoped hånd": "Orthopaedic consultation – hand",
  "Konsultasjon ortoped albue": "Orthopaedic consultation – elbow",
  "Second opinion konsultasjon": "Second opinion consultation",
  "Konsultasjon håndterapeut": "Hand therapist consultation",
  "Oppfølgingstime Fysioterapeut / Osteopat":
    "Follow-up appointment with physiotherapist / osteopath",
  "Endokrinolog  konsultasjon": "Endocrinology consultation",
  "Endokrinolog oppfølging/kontroll": "Endocrinology follow-up / check-up",
  "Klinisk ernæringsfysiolog": "Clinical nutritionist",
  "Klinisk ernæringsfysiolog oppfølging": "Clinical nutritionist follow-up",
  "Helsesjekk (plassholder — pris kommer)Plassholder: endelig pris leveres av kunden.Ta kontakt":
    "Health check (placeholder — price to follow). Placeholder: final price to be provided by the client. Contact us",
  "Blodprøvepakke (plassholder — pris kommer)Plassholder: endelig pris leveres av kunden.Ta kontakt":
    "Blood test package (placeholder — price to follow). Placeholder: final price to be provided by the client. Contact us",
  "Livsstils- og risikovurdering (plassholder — pris kommer)Plassholder: endelig pris leveres av kunden.Ta kontakt":
    "Lifestyle and risk assessment (placeholder — price to follow). Placeholder: final price to be provided by the client. Contact us",
  "Førstegangskonsultasjon fedme vurdering":
    "Initial consultation for obesity assessment",
  "Konsultasjon  (kun samtale)": "Consultation (conversation only)",
  "Anorektoskopi inkl. konsultasjon": "Anorectoscopy incl. consultation",
  "Tillegg strikkbehandling (endetarmsundersøkelse)":
    "Additional rubber band ligation (rectal examination)",
  "Mariskfjerning i lokal": "Skin tag removal under local anaesthesia",
  "Botox for analfissur": "Botox for anal fissure",
  "Småkirurgi i lokal (fettkul, føflekk)":
    "Minor surgery under local anaesthesia (lipoma, mole)",
  "Inngrodd tånegl": "Ingrown toenail",
  Hemorideoperasjon: "Haemorrhoid surgery",
  "Lyskebrokk kikkhullsoperasjon": "Inguinal hernia keyhole surgery",
  "Navlebrokk kikkhullsoperasjon": "Umbilical hernia keyhole surgery",
  Svangerskapskontroll: "Pregnancy check-up",
  "Tidlig ultralyd enkel": "Early ultrasound (basic)",
  "Tidlig ultralyd + NIPT-test": "Early ultrasound + NIPT test",
  "Organrettet ultralyd + NIPT test (uke 12-14)":
    "Detailed anatomy ultrasound + NIPT test (weeks 12–14)",
  "Organrettet ultralyd": "Detailed anatomy ultrasound",
  "Fødselsforberedende samtale": "Birth preparation consultation",
  "Konsultasjon etter abort eller dødfødsel":
    "Consultation after miscarriage or stillbirth",
  "Konsultasjon fødselsangst": "Consultation for fear of childbirth",
  "Konsultasjon traumatisk fødsel": "Consultation after traumatic birth",
  "Ammehjelp ved brystbetennelse": "Breastfeeding support for mastitis",
  "Konsultasjon hudlege (vurdering før behandling)":
    "Dermatologist consultation (assessment before treatment)",
  "HudbehandlingerPris ved konsultasjon":
    "Skin treatments. Price given at consultation",
  "BehandlingsutstyrPris ved konsultasjon":
    "Treatment equipment. Price given at consultation",
  "HudpleieprodukterPris ved konsultasjon":
    "Skincare products. Price given at consultation",
  "Osteopat førstekonsultasjon": "Osteopath – initial consultation",
  "Osteopat oppfølging": "Osteopath – follow-up",
  "Digital konsultasjon fedme vurdering":
    "Digital consultation for obesity assessment",
  "Gastric sleeveTa kontakt": "Gastric sleeve. Contact us",
  "Gastric bypassTa kontakt": "Gastric bypass. Contact us",
  Psykolog: "Psychologist",
  "Psykolog , digitaltime": "Psychologist, digital appointment",
  "Psykolog partime": "Psychologist couple session",
  "Førstegangskonsultasjon revmatolog":
    "Initial consultation with a rheumatologist",
  "Sexolog individuell": "Sexologist – individual",
  "Sexolog for par": "Sexologist for couples",
  "Åreknuteoperasjon (laser/radiofrekvens – ett ben)":
    "Varicose vein surgery (laser/radiofrequency – one leg)",
  "Flebektomi/extripasjon – ett ben": "Phlebectomy / extirpation – one leg",
  // Already had EN, keep mapping for idempotency
  "Blod i urin, cystoskopi": "Blood in urine, cystoscopy",
  Prostataundersøkelse: "Prostate examination",
  "Lavt testosteron": "Low testosterone",
};

const NOTE_EN: Record<string, string> = {
  "30 min": "30 min",
  "20 min": "20 min",
  "45 min": "45 min",
  "60 min": "60 min",
  "50 min": "50 min",
  "80 min": "80 min",
  "1 time": "1 hour",
};

function translatePriceLabel(no: string): string {
  const t = no.trim();
  if (!t) return t;
  if (/^gratis$/i.test(t)) return "Free";
  if (/^fra\s+/i.test(t)) return t.replace(/^fra\s+/i, "from ");
  // Pure price tokens stay identical (incl. Norwegian thousand dots)
  return t;
}

function translateName(no: string): string {
  if (NAME_EN[no]) return NAME_EN[no];
  // Fallback: try trimmed / collapsed whitespace
  const collapsed = no.replace(/\s+/g, " ").trim();
  if (NAME_EN[collapsed]) return NAME_EN[collapsed];
  throw new Error(`Missing EN translation for name: ${JSON.stringify(no)}`);
}

async function main() {
  console.log({ PROJECT_ID, DATASET });
  if (DATASET !== "developer") {
    throw new Error("Refusing to patch outside developer dataset.");
  }

  const page = await sanityClient.fetch(`*[_type=="pricingPage" && !(_id in path("drafts.**"))][0]{
    _id,
    priceCategories
  }`);
  if (!page?._id) throw new Error("pricingPage missing");

  let lines = 0;
  let nameUpdated = 0;
  let labelUpdated = 0;
  let noteUpdated = 0;
  let alreadyEn = 0;
  const reportRows: Array<Record<string, unknown>> = [];

  const cats = (page.priceCategories || []).map((cat: any) => {
    const subcategories = (cat.subcategories || []).map((sub: any) => {
      const items = (sub.items || []).map((item: any) => {
        lines++;
        const nameNo = pick(item.name, "no") || pick(item.name, "en");
        const nameEnPrev = pick(item.name, "en");
        const labelNo = pick(item.priceLabel, "no");
        const labelEnPrev = pick(item.priceLabel, "en");
        const noteNo = pick(item.note, "no");
        const noteEnPrev = pick(item.note, "en");

        const nameEn = translateName(nameNo);
        const labelEn = labelNo ? translatePriceLabel(labelNo) : "";
        const noteEn = noteNo
          ? NOTE_EN[noteNo] ??
            (/^\d+\s*min$/i.test(noteNo)
              ? noteNo
              : (() => {
                  throw new Error(`Missing EN note for: ${JSON.stringify(noteNo)}`);
                })())
          : "";

        const nameChanged = nameEnPrev !== nameEn;
        const labelChanged = Boolean(labelNo) && labelEnPrev !== labelEn;
        const noteChanged = Boolean(noteNo) && noteEnPrev !== noteEn;

        if (!nameChanged && nameEnPrev && nameEnPrev !== nameNo) alreadyEn++;
        if (nameChanged) nameUpdated++;
        if (labelChanged) labelUpdated++;
        if (noteChanged) noteUpdated++;

        reportRows.push({
          category: pick(cat.categoryName, "no"),
          subcategory: pick(sub.label, "no"),
          nameNo,
          nameEn,
          nameSource:
            nameEnPrev && nameEnPrev !== nameNo && nameEnPrev === nameEn
              ? "Existing"
              : "Norwegian translation",
          priceLabelNo: labelNo,
          priceLabelEn: labelEn,
          noteNo,
          noteEn,
          price: item.price,
          apiActivityId: item.apiActivityId ?? null,
          changed: nameChanged || labelChanged || noteChanged,
        });

        return {
          ...item,
          name: setI18n(item.name, nameNo, nameEn, "internationalizedArrayStringValue"),
          priceLabel: labelNo
            ? setI18n(
                item.priceLabel,
                labelNo,
                labelEn,
                "internationalizedArrayStringValue",
              )
            : item.priceLabel,
          note: noteNo
            ? setI18n(item.note, noteNo, noteEn, "internationalizedArrayStringValue")
            : item.note,
          // preserve price + apiActivityId untouched
          price: item.price,
          apiActivityId: item.apiActivityId,
        };
      });
      return { ...sub, items };
    });
    return { ...cat, subcategories };
  });

  await sanityClient.patch(page._id).set({ priceCategories: cats }).commit();
  try {
    await sanityClient.delete(`drafts.${page._id}`);
  } catch {
    /* none */
  }

  const summary = {
    projectId: PROJECT_ID,
    dataset: DATASET,
    pricingPageId: page._id,
    lines,
    nameUpdated,
    labelUpdated,
    noteUpdated,
    alreadyCorrectEn: alreadyEn,
    englishFromReference: 0,
    englishTranslatedFromNorwegian: nameUpdated + alreadyEn > 0 ? lines - 0 : lines,
  };

  const outPath = path.join(
    process.cwd(),
    "..",
    "tmp",
    "pricing-en-line-patch-report.json",
  );
  fs.writeFileSync(
    outPath,
    JSON.stringify({ summary, rows: reportRows }, null, 2),
    "utf8",
  );
  console.log(JSON.stringify(summary, null, 2));
  console.log("Report →", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
