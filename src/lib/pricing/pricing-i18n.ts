/** Norwegian → English for Pricing when CMS EN is missing (GROQ falls back to NO). */

const CATEGORY_EN: Record<string, string> = {
  Gynekologi: "Gynecology",
  Urologi: "Urology",
  Fertilitet: "Fertility",
  Ortopedi: "Orthopedics",
  Endokrinologi: "Endocrinology",
  Ernæringsfysiolog: "Clinical nutrition",
  Ernæringsfysiologi: "Clinical nutrition",
  "Forebyggende helse": "Preventive health",
  Gastrokirurgi: "Gastrointestinal surgery",
  "Graviditet og fostermedisin": "Pregnancy and fetal medicine",
  Hudhelse: "Skin health",
  Osteopati: "Osteopathy",
  Overvektskirurgi: "Bariatric surgery",
  Psykologi: "Psychology",
  Revmatologi: "Rheumatology",
  Sexologi: "Sexology",
  Åreknutebehandling: "Varicose vein treatment",
};

const SUBCATEGORY_EN: Record<string, string> = {
  Konsultasjoner: "Consultations",
  "Operasjoner og kirurgi": "Surgery",
  Kirurgi: "Surgery",
  "Robotkirurgi og prostata": "Robotic surgery and prostate",
  Fertilitetsutredning: "Fertility assessment",
  "Assistert befruktning": "Assisted reproduction",
  "Frysebehandlinger (assistert befruktning)":
    "Cryopreservation (assisted reproduction)",
  Inseminasjon: "Insemination",
  "Sædanalyse og mannlig infertilitet": "Semen analysis and male infertility",
  Donorbehandling: "Donor treatment",
  "Nedfrysing og oppbevaring av egne egg": "Egg freezing and storage",
  "Øvrige tjenester": "Other services",
  Håndterapi: "Hand therapy",
  Fysioterapi: "Physiotherapy",
  Endokrinologi: "Endocrinology",
  Ernæringsfysiolog: "Clinical nutrition",
  "Forebyggende helse": "Preventive health",
  Gastrokirurgi: "Gastrointestinal surgery",
  Svangerskapskontroll: "Pregnancy check-ups",
  Fosterdiagnostikk: "Fetal diagnostics",
  "Fødselsforberedelse og oppfølging": "Birth preparation and follow-up",
  "Konsultasjon og priser": "Consultation and prices",
  Hudbehandlinger: "Skin treatments",
  Behandlingsutstyr: "Treatment equipment",
  Hudpleieprodukter: "Skincare products",
  Osteopati: "Osteopathy",
  Overvektskirurgi: "Bariatric surgery",
  Psykologi: "Psychology",
  Revmatologi: "Rheumatology",
  Sexologi: "Sexology",
  Åreknutebehandling: "Varicose vein treatment",
};

const NAME_EN: Record<string, string> = {
  "Generell undersøkelse": "General gynecological examination",
  "Generell gynekologisk undersøkelse": "General gynecological examination",
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

const EN_ALREADY = new Set<string>([
  ...Object.values(CATEGORY_EN),
  ...Object.values(SUBCATEGORY_EN),
  ...Object.values(NAME_EN),
]);

const NORWEGIAN_HINT =
  /[æøåÆØÅ]|prisliste|oversiktlige|veiledende|konsultasjon|undersøkelse|behandling|tjeneste|spesialist|pasient/i;

function collapse(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Translate a CMS pricing string to English when the value is still Norwegian. */
export function translatePricingToEn(text: string): string {
  const key = collapse(text);
  if (!key) return text;
  if (NAME_EN[key]) return NAME_EN[key];
  if (CATEGORY_EN[key]) return CATEGORY_EN[key];
  if (SUBCATEGORY_EN[key]) return SUBCATEGORY_EN[key];
  if (NOTE_EN[key]) return NOTE_EN[key];
  if (EN_ALREADY.has(key)) return key;
  if (/^gratis$/i.test(key)) return "Free";
  if (/^fra\s+/i.test(key)) return key.replace(/^fra\s+/i, "from ");
  if (/^ta kontakt$/i.test(key)) return "Contact us";
  if (/^\d+\s*min$/i.test(key)) return key;
  if (/^\d+\s*minutter$/i.test(key)) return key.replace(/minutter/i, "minutes");
  return key;
}

export function localizePricingText(text: string, locale: "no" | "en"): string {
  if (locale !== "en") return text;
  return translatePricingToEn(text);
}

/** Use CMS copy unless English locale received a Norwegian fallback. */
export function cmsCopyOrI18n(
  cms: string | undefined,
  i18nFallback: string,
  locale: "no" | "en",
): string {
  const value = cms?.trim() ?? "";
  if (!value) return i18nFallback;
  if (locale === "en" && NORWEGIAN_HINT.test(value) && i18nFallback) {
    return i18nFallback;
  }
  return value;
}
