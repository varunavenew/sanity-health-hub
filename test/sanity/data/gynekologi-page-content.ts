export type ReasonI18n = {
  titleNo: string;
  titleEn: string;
  descNo: string;
  descEn: string;
};

export type PageContent = {
  titleNo: string;
  titleEn: string;
  heroTitleNo: string;
  heroTitleEn: string;
  heroLeadNo: string;
  heroLeadEn: string;
  heroPriceNo?: string | null;
  heroPriceEn?: string | null;
  heroPriceLabelNo?: string | null;
  heroPriceLabelEn?: string | null;
  reasonsTitleNo: string;
  reasonsTitleEn: string;
  reasonsLeadNo?: string;
  reasonsLeadEn?: string;
  /** Default accordion in the gynekologi patch; override when demo uses open prose. */
  reasonsLayout?: "prose" | "accordion" | "auto";
  midCtaNo: string;
  midCtaEn: string;
  /** "standard" = Tilpasset... ; "comfort" = Du bestemmer... */
  promiseVariant: "standard" | "comfort";
  relatedSlugs?: string[];
  reasons: ReasonI18n[];
};

type PromiseCard = {
  titleNo: string;
  titleEn: string;
  descNo: string;
  descEn: string;
};

const gynCta = {
  no: "Snakk med en av våre gynekologer",
  en: "Talk to one of our gynaecologists",
} as const;

const pregnancyCta = {
  no: "Snakk med svangerskapsteamet vårt",
  en: "Talk to our pregnancy care team",
} as const;

export const SHARED_UI = {
  shortWait: { no: "Kort ventetid", en: "Short waiting time" },
  noReferral: { no: "Ingen henvisning", en: "No referral needed" },
  bookCta: { no: "Se ledige tider og book", en: "See available times and book" },
  callCta: { no: "Ring oss", en: "Call us" },
  related: { no: "Relaterte tjenester", en: "Related services" },
  seeAllGyn: { no: "Se alle gynekologi-tjenester", en: "See all gynaecology services" },
  seeAllGrav: { no: "Se alle graviditet-tjenester", en: "See all pregnancy services" },
  specialistsTitle: { no: "Spesialister som utfører dette", en: "Specialists who perform this" },
  seeAllGynDocs: { no: "Se alle gynekologer", en: "See all gynaecologists" },
  seeAllSpecs: { no: "Se alle spesialister", en: "See all specialists" },
  bookingTitle: { no: "Bestill time hos spesialist", en: "Book an appointment with a specialist" },
  bookingDesc: {
    no: "Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.",
    en: "Choose service, clinic and clinician – all in one simple booking.",
  },
  bookNow: { no: "Bestill time nå", en: "Book an appointment now" },
  specialistsIntro: {
    no: "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.",
    en: "Experience, specialist expertise and modern technology gathered in one place.",
  },
} as const;

const experiencedSpecialists: PromiseCard = {
  titleNo: "Erfarne spesialister",
  titleEn: "Experienced specialists",
  descNo:
    "Hos oss møter du leger som har spesialisert seg innenfor sitt fagfelt — ikke en generalist på utplassering. Du får riktig kompetanse fra første konsultasjon.",
  descEn:
    "With us, you meet doctors who have specialised in their field — not a generalist on rotation. You receive the right expertise from your first consultation.",
};

export const PROMISE_COPY: Record<"standard" | "comfort", readonly PromiseCard[]> = {
  standard: [
    {
      titleNo: "Tilpasset dine behov",
      titleEn: "Tailored to your needs",
      descNo:
        "Alle undersøkelser og inngrep tilpasses dine behov og ønsker. Du kan stoppe når som helst, stille spørsmål underveis, og ta med noen om du ønsker det.",
      descEn:
        "All examinations and procedures are tailored to your needs and wishes. You can stop at any time, ask questions along the way and bring someone with you if you wish.",
    },
    experiencedSpecialists,
    {
      titleNo: "Alt under samme tak",
      titleEn: "Everything under one roof",
      descNo:
        "Trenger du videre utredning, behandling eller oppfølging — vi koordinerer hele forløpet for deg.",
      descEn:
        "If you need further assessment, treatment or follow-up, we coordinate your entire care pathway.",
    },
  ],
  comfort: [
    {
      titleNo: "Du bestemmer hva du er komfortabel med",
      titleEn: "You decide what you are comfortable with",
      descNo:
        "Alle undersøkelser og inngrep gjøres i ditt tempo. Du kan stoppe når som helst, stille spørsmål underveis, og ta med noen om du ønsker det.",
      descEn:
        "All examinations and procedures are carried out at your pace. You can stop at any time, ask questions along the way and bring someone with you if you wish.",
    },
    experiencedSpecialists,
    {
      titleNo: "Alt under samme tak",
      titleEn: "Everything under one roof",
      descNo:
        "Trenger du videre utredning, behandling eller oppfølging, koordinerer vi hele forløpet for deg. Ved behov kan vi også koble inn sexolog, ernæringsfysiolog, osteopat, fysioterapeut eller psykologhjelp — samlet under samme tak.",
      descEn:
        "If you need further assessment, treatment or follow-up, we coordinate your entire care pathway. When needed, we can also involve a sexologist, dietitian, osteopath, physiotherapist or psychologist — all under one roof.",
    },
  ],
};

export const GYN_PAGE_CONTENT: Record<string, PageContent> = {
  undersokelse: {
    titleNo: "Gynekologisk undersøkelse",
    titleEn: "Gynaecological examination",
    heroTitleNo: "Gynekologisk undersøkelse",
    heroTitleEn: "Gynaecological examination",
    heroLeadNo:
      "Hos CMedical hjelper vi deg med alt innen gynekologiske problemstillinger – fra utredning til behandling. Vi har et bredt behandlingstilbud av høyeste kvalitet. Hos oss møter du engasjerte gynekologer som jobber med den kvinnesykdommen de kan best.",
    heroLeadEn:
      "At CMedical, we help with all types of gynaecological concerns — from assessment to treatment. We offer a broad range of high-quality care. You will meet dedicated gynaecologists who focus on the area of women’s health they know best.",
    heroPriceNo: "fra 2 100 kr",
    heroPriceEn: "from NOK 2,100",
    heroPriceLabelNo: "Gynekologisk undersøkelse",
    heroPriceLabelEn: "Gynaecological examination",
    reasonsTitleNo: "Slik foregår det",
    reasonsTitleEn: "How it works",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "standard",
    relatedSlugs: [
      "tverrfaglig",
      "urinlekkasje",
      "endometriose",
      "overgangsalder",
      "vaginale-fremfall",
      "blodningsforstyrrelser",
      "celleforandringer",
      "cyster",
    ],
    reasons: [
      {
        titleNo: "Samtale",
        titleEn: "Consultation",
        descNo: "Vi starter med en grundig samtale om din helse, eventuelle symptomer og bekymringer.",
        descEn: "We begin with a thorough discussion of your health, symptoms and any concerns you may have.",
      },
      {
        titleNo: "Undersøkelse",
        titleEn: "Examination",
        descNo: "Gynekologisk undersøkelse tilpasset dine behov, inkludert ultralyd ved behov.",
        descEn: "A gynaecological examination tailored to your needs, including ultrasound where indicated.",
      },
      {
        titleNo: "Vurdering og plan",
        titleEn: "Assessment and plan",
        descNo: "Din gynekolog gjennomgår funnene med deg og lager en eventuell videre plan.",
        descEn: "Your gynaecologist reviews the findings with you and agrees a plan for any further care.",
      },
    ],
  },

  ultralyd: {
    titleNo: "Ultralyd i svangerskapet",
    titleEn: "Ultrasound in pregnancy",
    heroTitleNo: "Ultralyd i svangerskapet",
    heroTitleEn: "Ultrasound in pregnancy",
    heroLeadNo:
      "Hos CMedical får du ultralydundersøkelser gjennom hele svangerskapet, fra tidlig ultralyd i uke 6, til organrettet ultralyd i uke 18-20. Våre fostermedisinere og gynekologer bruker det nyeste utstyret for best mulig bildekvalitet og diagnostikk.",
    heroLeadEn:
      "At CMedical, you can have ultrasound examinations throughout pregnancy, from an early scan at week 6 to a detailed fetal anomaly scan at weeks 18–20. Our fetal medicine specialists and gynaecologists use the latest equipment for the best possible image quality and diagnostics.",
    reasonsTitleNo: "Om ultralyd i svangerskapet",
    reasonsTitleEn: "About ultrasound in pregnancy",
    reasonsLeadNo:
      "Hos CMedical får du ultralydundersøkelser gjennom hele svangerskapet, fra tidlig ultralyd i uke 6, til organrettet ultralyd i uke 18-20.",
    reasonsLeadEn:
      "At CMedical, you can have ultrasound examinations throughout pregnancy, from an early scan at week 6 to a detailed fetal anomaly scan at weeks 18–20.",
    midCtaNo: pregnancyCta.no,
    midCtaEn: pregnancyCta.en,
    promiseVariant: "standard",
    relatedSlugs: [
      "graviditet",
      "spontanabort",
      "fodselsskader",
      "fostermedisin",
      "6-ukerskontroll",
      "nipt",
      "svangerskapsteam",
      "fosterdiagnostikk",
    ],
    reasons: [
      {
        titleNo: "Om ultralyd i svangerskapet",
        titleEn: "Ultrasound scans during pregnancy",
        descNo:
          "Vi skiller mellom tidlig ultralyd uke 6–10, uke 11–14, og ultralyd fra uke 14+0. Vi gjør også organrettet ultralyd i uke 18-20, eller ultralyd senere i svangerskapet ved behov eller ønske.",
        descEn:
          "We distinguish between early ultrasound at weeks 6–10, weeks 11–14, and ultrasound from week 14+0. We also perform detailed fetal anomaly scans at weeks 18–20, or later scans if needed or requested.",
      },
      {
        titleNo: "Vi tar hensyn til dine behov",
        titleEn: "We take your needs into account",
        descNo:
          "Dersom du ønsker, er det fullt mulig å ta med seg en partner eller en støttespiller til ultralydtimen. Hos oss er det viktig at du føler deg komfortabel og trygg.",
        descEn:
          "If you wish, you are welcome to bring a partner or support person to the ultrasound appointment. It is important to us that you feel comfortable and safe.",
      },
    ],
  },

  hysteroskopi: {
    titleNo: "Hysteroskopi",
    titleEn: "Hysteroscopy",
    heroTitleNo: "Hysteroskopi",
    heroTitleEn: "Hysteroscopy",
    heroLeadNo:
      "Hysteroskopi er en skånsom gynekologisk undersøkelse der vi bruker et tynt instrument med kamera for å se inn i livmorhulen gjennom livmorhalsen. Undersøkelsen gir en grundig oversikt og gjør det mulig å oppdage årsaker til plager som ellers kan være vanskelig å finne.",
    heroLeadEn:
      "Hysteroscopy is a gentle gynaecological examination in which a thin camera instrument is passed through the cervix to view the uterine cavity. It provides a detailed view and can identify causes of symptoms that may otherwise be difficult to detect.",
    reasonsTitleNo: "Om hysteroskopi",
    reasonsTitleEn: "About hysteroscopy",
    reasonsLeadNo:
      "Hysteroskopi er en skånsom gynekologisk undersøkelse der vi bruker et tynt instrument med kamera for å se inn i livmorhulen gjennom livmorhalsen.",
    reasonsLeadEn:
      "Hysteroscopy is a gentle gynaecological examination in which a thin camera instrument is passed through the cervix to view the uterine cavity.",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "standard",
    reasons: [
      {
        titleNo: "Office-hysteroskopi",
        titleEn: "Outpatient hysteroscopy",
        descNo:
          "Vi tilbyr også office-hysteroskopi som kan gjennomføres uten narkose eller bedøvelse, og umiddelbart ved besøk hos gynekolog.",
        descEn:
          "We also offer outpatient hysteroscopy, which can be performed without general or local anaesthesia during your visit to the gynaecologist.",
      },
    ],
  },

  endometriose: {
    titleNo: "Endometriose",
    titleEn: "Endometriosis",
    heroTitleNo: "Endometriose",
    heroTitleEn: "Endometriosis",
    heroLeadNo: "Endometriet = slimhinnen i livmoren.",
    heroLeadEn: "The endometrium = the lining of the uterus.",
    heroPriceNo: "fra 3 200 kr",
    heroPriceEn: "from NOK 3,200",
    heroPriceLabelNo: "Endometriose",
    heroPriceLabelEn: "Endometriosis",
    reasonsTitleNo: "Om endometriose",
    reasonsTitleEn: "About endometriosis",
    reasonsLeadNo: "Endometriet = slimhinnen i livmoren.",
    reasonsLeadEn: "The endometrium = the lining of the uterus.",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "standard",
    relatedSlugs: [
      "tverrfaglig",
      "undersokelse",
      "urinlekkasje",
      "overgangsalder",
      "vaginale-fremfall",
      "blodningsforstyrrelser",
      "celleforandringer",
      "cyster",
    ],
    reasons: [
      {
        titleNo: "Symptomer",
        titleEn: "Symptoms",
        descNo:
          "Symptomene på endometriose er individuelle. Det vanligste symptomet er smerter ved menstruasjonen eller utenom. Smertene kan variere i styrke fra minimale menstruasjonssmerter til invalidiserende smerter. Andre symptomer kan være kvalme, diaré eller forstoppelse, økt trettbarhet, smerter ved vannlatning eller ved samleie. Omtrent 10% av kvinner rammes, og hele 30% av disse lider av underlivssmerter.",
        descEn:
          "Symptoms of endometriosis vary from person to person. The most common is pain during or outside menstruation, ranging from mild period pain to disabling pain. Other symptoms may include nausea, diarrhoea or constipation, increased fatigue, and pain when passing urine or during intercourse. About 10% of women are affected, and as many as 30% of these experience pelvic pain.",
      },
      {
        titleNo: "Kirurgi",
        titleEn: "Surgery",
        descNo:
          "Vi tilbyr både tradisjonell kikkhullskirurgi (laparoskopi) og robotkirurgi ved sanering av endometriose. CMedical er den eneste private aktøren i Norge som tilbyr operasjon med robot ved endometriose. Robotkirurgi er en presis og skånsom operasjonsmetode.\n\nVed kirurgi vil endometriose på bukhinnen, i bekkenet, arrvev og sammenvoksinger klippes bort. Roboten er spesielt egnet til finkirurgi der en vil unngå nærliggende nerver og blodkar.",
        descEn:
          "We offer both conventional keyhole surgery (laparoscopy) and robot-assisted surgery for endometriosis excision. CMedical is the only private provider in Norway offering robotic surgery for endometriosis. Robotic surgery is a precise and gentle technique.\n\nDuring surgery, endometriosis on the peritoneum and in the pelvis, as well as scar tissue and adhesions, is excised. The robot is particularly suited to fine surgery close to nerves and blood vessels.",
      },
    ],
  },

  adenomyose: {
    titleNo: "Adenomyose",
    titleEn: "Adenomyosis",
    heroTitleNo: "Når livmoren verker innenfra",
    heroTitleEn: "When the pain comes from within the uterus",
    heroLeadNo:
      "Adenomyose er en tilstand der endometrievev vokser inn i livmormuskelen. Det gir kraftige menssmerter, langvarige blødninger og kan påvirke fertiliteten. Tilstanden går ofte hånd i hånd med endometriose og utredes derfor samlet hos oss.",
    heroLeadEn:
      "Adenomyosis is a condition in which endometrial tissue grows into the muscular wall of the uterus. It can cause severe period pain and prolonged bleeding and may affect fertility. It often occurs alongside endometriosis, so we assess the two conditions together.",
    reasonsTitleNo: "Symptomer på adenomyose",
    reasonsTitleEn: "Symptoms of adenomyosis",
    reasonsLeadNo:
      "Symptomene overlapper med endometriose og blødningsforstyrrelser, og tilstanden blir ofte oversett. Disse tegnene fortjener utredning.",
    reasonsLeadEn:
      "Symptoms overlap with endometriosis and abnormal bleeding, and the condition is often overlooked. These signs warrant assessment.",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "comfort",
    relatedSlugs: ["endometriose", "blodningsforstyrrelser", "fjerne-livmor"],
    reasons: [
      ["Kraftige menssmerter", "Severe period pain", "Smerter som forverres over tid og ikke lindres av vanlige smertestillende.", "Pain that worsens over time and is not relieved by ordinary painkillers."],
      ["Langvarige og kraftige blødninger", "Prolonged, heavy bleeding", "Blødninger som varer mer enn 7 dager eller er svært rikelige.", "Bleeding lasting more than seven days or which is very heavy."],
      ["Trykk og tyngdefølelse i underlivet", "Pelvic pressure and heaviness", "Forstørret livmor kan gi press i bekkenet og korsryggen.", "An enlarged uterus can cause pressure in the pelvis and lower back."],
      ["Smerter ved samleie", "Pain during intercourse", "Dype smerter under eller etter samleie er ikke normalt.", "Deep pain during or after intercourse is not normal."],
      ["Vansker med å bli gravid", "Difficulty becoming pregnant", "Adenomyose kan påvirke implantasjon og fertilitet — og bør vurderes i utredning.", "Adenomyosis may affect implantation and fertility and should be considered during fertility assessment."],
      ["Utmattelse ved menstruasjon", "Fatigue during menstruation", "Kraftige blødninger kan gi jernmangel og vedvarende tretthet.", "Heavy bleeding can cause iron deficiency and persistent fatigue."],
    ].map(([titleNo, titleEn, descNo, descEn]) => ({ titleNo, titleEn, descNo, descEn })),
  },

  pcos: {
    titleNo: "PMOS",
    titleEn: "PMOS",
    heroTitleNo: "PMOS er mer enn cyster",
    heroTitleEn: "PMOS is more than cysts",
    heroLeadNo:
      "Polyendokrint metabolsk ovarialsyndrom (PMOS), tidligere Polycystisk ovariesyndrom (PCOS), er en hormonell forstyrrelse som gir mange ulike symptomer. Vi hjelper deg slik at du får en bedre hverdag.",
    heroLeadEn:
      "Polyendocrine metabolic ovarian syndrome (PMOS), formerly Polycystic ovary syndrome (PCOS), is a hormonal disorder that can cause many different symptoms. We help you so that you get a better everyday life.",
    heroPriceNo: "fra 3 200 kr",
    heroPriceEn: "from NOK 3,200",
    reasonsTitleNo: "Tegn på PMOS og slik utreder vi",
    reasonsTitleEn: "Signs of PMOS and how we assess it",
    reasonsLeadNo:
      "PMOS gir svært ulike symptomer. Mange går udiagnostisert i årevis fordi tegnene tolkes hver for seg.",
    reasonsLeadEn:
      "PMOS causes a wide range of symptoms. Many people remain undiagnosed for years because each sign is considered in isolation.",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "comfort",
    relatedSlugs: ["blodningsforstyrrelser", "pms-pmdd", "poi"],
    reasons: [
      {
        titleNo: "Uregelmessig eller manglende menstruasjon",
        titleEn: "Irregular or absent periods",
        descNo: "Lange sykluser eller fravær av mens er et av de tydeligste tegnene.",
        descEn: "Long cycles or absent periods are among the clearest signs.",
      },
      {
        titleNo: "Akne, fet hud og økt hårvekst",
        titleEn: "Acne, oily skin and excess hair growth",
        descNo: "Hormonell akne og mer hårvekst i ansikt, på bryst eller mage kan henge sammen med PMOS.",
        descEn: "Hormonal acne and increased hair growth on the face, chest or abdomen may be associated with PMOS.",
      },
      {
        titleNo: "Vansker med å bli gravid",
        titleEn: "Difficulty becoming pregnant",
        descNo: "Manglende eggløsning er en vanlig årsak til redusert fertilitet ved PMOS.",
        descEn: "Absent ovulation is a common cause of reduced fertility in PMOS.",
      },
      {
        titleNo: "Vektendringer, tretthet og humørsvingninger",
        titleEn: "Weight changes, fatigue and mood changes",
        descNo: "Insulinresistens og hormonell ubalanse kan påvirke vekt, energi og psykisk helse.",
        descEn: "Insulin resistance and hormonal imbalance can affect weight, energy and mental wellbeing.",
      },
      {
        titleNo: "Slik utreder vi",
        titleEn: "How we assess PMOS",
        descNo:
          "Utredningen bygger på sykehistorie, menstruasjonsmønster, symptomer og klinisk undersøkelse. Ved behov gjør vi ultralyd av eggstokkene og tar hormon- og stoffskifteprøver samt prøver for blodsukker og andre metabolske risikofaktorer. Sammen lager vi en behandlingsplan tilpasset om du ønsker barn nå, senere eller ikke.",
        descEn:
          "Assessment includes your medical history, menstrual pattern, symptoms and a clinical examination. Where appropriate, we perform an ovarian ultrasound and blood tests for hormones, thyroid function, glucose regulation and other metabolic risk factors. Together, we make a treatment plan tailored to whether you want children now, later or not at all.",
      },
    ],
  },

  pmos: {
    titleNo: "PMOS",
    titleEn: "PMOS",
    heroTitleNo: "PMOS",
    heroTitleEn: "PMOS",
    heroLeadNo:
      "Polyendokrint Metabolsk Ovarialsyndrom (PMOS) kjennetegnes ved at kjønnshormonene er i ubalanse. (Tidligere ble dette omtalt som Polycystisk ovariesyndrom (PMOS), men endret diagnosenavn 12. mai 2026.)",
    heroLeadEn:
      "Polyendocrine Metabolic Ovarian Syndrome (PMOS) is characterised by an imbalance in sex hormones. (It was previously known as Polycystic ovary syndrome (PMOS); the diagnostic name changed on 12 May 2026.)",
    heroPriceNo: "Pris fra 3.200 kr",
    heroPriceEn: "from NOK 3,200",
    heroPriceLabelNo: "PMOS",
    heroPriceLabelEn: "PMOS",
    reasonsTitleNo: "Om PMOS",
    reasonsTitleEn: "About PMOS",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["blodningsforstyrrelser", "pms-pmdd", "poi"],
    reasons: [],
  },

  poi: {
    titleNo: "POI (prematur ovariesvikt)",
    titleEn: "POI (premature ovarian insufficiency)",
    heroTitleNo: "Når hormonene svikter tidlig",
    heroTitleEn: "When ovarian function declines early",
    heroLeadNo:
      "Prematur ovariesvikt (POI) er en hormonell forstyrrelse der eggstokkene mister funksjon før 40 års alder. Det gir uregelmessig eller uteblitt menstruasjon, hetetokter, søvnproblemer og påvirker fertiliteten. Vi tilbyr grundig utredning, moderne hormonbehandling og tett oppfølging.",
    heroLeadEn:
      "Premature ovarian insufficiency (POI) is a hormonal condition in which ovarian function declines before the age of 40. It can cause irregular or absent periods, hot flushes and sleep problems, and affects fertility. We offer thorough assessment, modern hormone treatment and close follow-up.",
    reasonsTitleNo: "Tegn på POI og hormonforstyrrelser",
    reasonsTitleEn: "Signs of POI and hormonal disorders",
    reasonsLeadNo:
      "Hormonforstyrrelser handler om unormale nivåer av hormoner — for mye, for lite eller ujevn produksjon. Disse tegnene bør utredes.",
    reasonsLeadEn:
      "Hormonal disorders involve abnormal hormone levels — too much, too little or uneven production. These signs should be investigated.",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "comfort",
    relatedSlugs: ["pcos", "overgangsalder"],
    reasons: [
      ["Uregelmessig eller uteblitt menstruasjon", "Irregular or absent periods", "Sykluser som blir sjeldnere, uregelmessige eller opphører før 40 år.", "Periods that become less frequent, irregular or stop before the age of 40."],
      ["Hetetokter og nattesvette", "Hot flushes and night sweats", "Klassiske symptomer på østrogenmangel — også i ung alder.", "Classic symptoms of oestrogen deficiency, including at a young age."],
      ["Søvnproblemer og tretthet", "Sleep problems and fatigue", "Hormonell ubalanse kan forstyrre søvn og gi vedvarende utmattelse.", "Hormonal imbalance can disrupt sleep and cause persistent fatigue."],
      ["Humørsvingninger og nedstemthet", "Mood changes and low mood", "Endringer i psyke og energi kan ha hormonell bakgrunn.", "Changes in mood and energy may have a hormonal cause."],
      ["Vaginal tørrhet", "Vaginal dryness", "Slimhinneendringer og ubehag ved samleie kan komme tidlig ved POI.", "Changes to the vaginal tissues and discomfort during intercourse can occur early in POI."],
      ["Vansker med å bli gravid", "Difficulty becoming pregnant", "Redusert eggreserve gir nedsatt fertilitet — vi kobler inn fertilitetsteamet.", "A reduced ovarian reserve lowers fertility; we involve our fertility team where needed."],
    ].map(([titleNo, titleEn, descNo, descEn]) => ({ titleNo, titleEn, descNo, descEn })),
  },

  "pms-pmdd": {
    titleNo: "PMS og PMDD",
    titleEn: "PMS and PMDD",
    heroTitleNo: "Når menstruasjon tar over halve livet",
    heroTitleEn: "When your menstrual cycle takes over half your life",
    heroLeadNo:
      "PMDD er en alvorlig form for premenstruelt syndrom og rammer 3–8 % av kvinner. Hos oss møter du spesialister som tar plagene på alvor — og tilbyr moderne behandling.",
    heroLeadEn:
      "PMDD is a severe form of premenstrual syndrome affecting 3–8% of women. Our specialists take your symptoms seriously and offer modern treatment.",
    reasonsTitleNo: "Når er det mer enn «bare PMS»?",
    reasonsTitleEn: "When is it more than ‘just PMS’?",
    reasonsLeadNo:
      "Forskjellen mellom PMS og PMDD ligger i alvorlighetsgrad og hvordan symptomene påvirker livet ditt.",
    reasonsLeadEn:
      "The difference between PMS and PMDD is the severity of symptoms and how much they affect your life.",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "comfort",
    relatedSlugs: ["pcos", "endometriose"],
    reasons: [
      ["Kraftige humørsvingninger", "Severe mood changes", "Sinne, gråt eller fortvilelse i ukene før mensen — som forsvinner når mensen kommer.", "Anger, tearfulness or despair in the weeks before your period that lifts when menstruation begins."],
      ["Angst og indre uro", "Anxiety and inner restlessness", "Følelse av at ting tårner seg opp — kun i siste del av syklusen.", "A sense that everything is becoming overwhelming, confined to the latter part of the cycle."],
      ["Nedstemthet og håpløshet", "Low mood and hopelessness", "Depressive tanker som kommer og går med syklusen.", "Depressive thoughts that come and go with the menstrual cycle."],
      ["Konflikter i nære relasjoner", "Conflict in close relationships", "Plagene påvirker forhold til partner, barn eller kolleger.", "Symptoms affect relationships with your partner, children or colleagues."],
      ["Søvnproblemer", "Sleep problems", "Innsovning, oppvåkning eller mareritt forsterket av syklusen.", "Difficulty falling asleep, waking during the night or nightmares that worsen with the cycle."],
      ["Sykmeldinger eller fravær", "Sick leave or absence", "Når plagene gjør at du ikke kan jobbe eller fungere normalt.", "When symptoms prevent you from working or functioning normally."],
    ].map(([titleNo, titleEn, descNo, descEn]) => ({ titleNo, titleEn, descNo, descEn })),
  },

  blodningsforstyrrelser: {
    titleNo: "Blødningsforstyrrelser",
    titleEn: "Abnormal uterine bleeding",
    heroTitleNo: "Blødningsforstyrrelser",
    heroTitleEn: "Abnormal uterine bleeding",
    heroLeadNo:
      "Blødningsforstyrrelser kan være at intervallet mellom menstruasjonene endrer seg, at de blir hyppigere eller sjeldnere. Det kan være at mengden blod som kommer hver gang øker eller minker, eller det kan være blødninger som kommer mellom menstruasjoner.",
    heroLeadEn:
      "Abnormal bleeding may be that the interval between periods changes, becoming more or less frequent. It may be that the amount of blood each time increases or decreases, or it may be bleeding that comes between periods.",
    heroPriceNo: "fra 3 200 kr",
    heroPriceEn: "from NOK 3,200",
    reasonsTitleNo: "Om blødningsforstyrrelser",
    reasonsTitleEn: "About abnormal uterine bleeding",
    reasonsLeadNo:
      "Blødningsforstyrrelser må utredes for å utelukke underliggende sykdom. Ofte kan det være naturlige forklaringer som enkelt kan behandles.",
    reasonsLeadEn:
      "Abnormal bleeding must be investigated to rule out underlying disease. There are often natural explanations that can be treated simply.",
    reasonsLayout: "prose",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "standard",
    reasons: [
      {
        titleNo: "Vanlige årsaker",
        titleEn: "Common causes",
        descNo:
          "Vanlige årsaker til blødningsforstyrrelser kan være overgangsalder, seksuelt overførbare infeksjoner, polypper eller muskelknuter, graviditet eller hormonelle ubalanser.\n\nBlødningsforstyrrelser som kommer etter overgangsalderen skal alltid utredes. Det gjøres gjerne med ultralyd og en vevsprøve fra livmorhulen. Videre oppfølging og behandling avhenger av dette prøvesvaret.",
        descEn:
          "Common causes of abnormal bleeding include menopause, sexually transmitted infections, polyps or fibroids, pregnancy, or hormonal imbalances.\n\nBleeding that starts after menopause must always be investigated. This is usually done with ultrasound and a tissue sample from the uterine lining. Further follow-up and treatment depend on the result.",
      },
      {
        titleNo: "Prevensjon",
        titleEn: "Contraception",
        descNo:
          "Dersom du bruker prevensjon kan du få uregelmessige blødninger. Det kan ofte løses ved å bytte prevensjonsmiddel.",
        descEn:
          "If you use contraception, you may get irregular bleeding. Changing contraceptive method will often resolve it.",
      },
    ],
  },

  cyster: {
    titleNo: "Cyster på eggstokkene",
    titleEn: "Ovarian cysts",
    heroTitleNo: "Cyster på eggstokkene",
    heroTitleEn: "Ovarian cysts",
    heroLeadNo: "Cyster på eggstokkene er veldig vanlig og i de fleste tilfeller helt ufarlig.",
    heroLeadEn: "Ovarian cysts are very common and, in most cases, entirely harmless.",
    reasonsTitleNo: "Om cyster på eggstokkene",
    reasonsTitleEn: "About ovarian cysts",
    reasonsLeadNo:
      "Cyster på eggstokkene er veldig vanlig og i de fleste tilfeller helt ufarlig.",
    reasonsLeadEn:
      "Ovarian cysts are very common and, in most cases, entirely harmless.",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "standard",
    reasons: [
      {
        titleNo: "Tegn",
        titleEn: "Signs and symptoms",
        descNo: "Smerter eller trykk nederst i magen, oppblåsthet, smerter ved samleie, uregelmessige menstruasjoner eller akutte sterke smerter hvis en cyste sprekker eller vrir seg.",
        descEn: "Lower abdominal pain or pressure, bloating, pain during intercourse, irregular periods or sudden severe pain if a cyst ruptures or twists.",
      },
      {
        titleNo: "Former for cyste",
        titleEn: "Types of cyst",
        descNo: "Dermoider, endometriomer og cystadenomer kan skilles fra funksjonelle cyster ved ultralyd. De er vanligvis godartede, men forsvinner ikke av seg selv og må noen ganger opereres.",
        descEn: "Dermoid cysts, endometriomas and cystadenomas can be distinguished from functional cysts on ultrasound. They are usually benign but do not resolve by themselves and sometimes require surgery.",
      },
      {
        titleNo: "Før og etter overgangsalder",
        titleEn: "Before and after menopause",
        descNo: "Før overgangsalderen er de fleste cyster godartede. Etter overgangsalderen er cyster mindre vanlige og risikoen for kreft høyere, så blodprøver og flere bildeundersøkelser kan være nødvendig.",
        descEn: "Before menopause, most cysts are benign. After menopause, cysts are less common and the risk of malignancy is higher, so blood tests and further imaging may be required.",
      },
      {
        titleNo: "Behandling",
        titleEn: "Treatment",
        descNo: "Cyster som er store, ikke forsvinner og gir plager, anbefales ofte fjernet ved kikkhullsoperasjon.",
        descEn: "Cysts that are large, persistent and symptomatic are often removed by keyhole surgery.",
      },
    ],
  },

  celleforandringer: {
    titleNo: "Celleforandringer",
    titleEn: "Cervical cell changes",
    heroTitleNo: "Celleforandringer",
    heroTitleEn: "Cervical cell changes",
    heroLeadNo:
      "Celleforandringer er forstadier til kreft og kalles dysplasier. Det finnes flere stadier i økende alvorlighetsgrad. Hvorvidt celleforandringene skal behandles avhenger av hvor alvorlige de er og hvilken type HPV du har.",
    heroLeadEn:
      "Cervical cell changes are precancerous changes known as dysplasia. There are several grades of increasing severity. Whether the cell changes should be treated depends on how severe they are and which type of HPV you have.",
    reasonsTitleNo: "Om celleforandringer",
    reasonsTitleEn: "About cervical cell changes",
    reasonsLeadNo:
      "Celleforandringer er forstadier til kreft og kalles dysplasier. Det finnes flere stadier i økende alvorlighetsgrad. Hvorvidt celleforandringene skal behandles avhenger av hvor alvorlige de er og hvilken type HPV du har.",
    reasonsLeadEn:
      "Cervical cell changes are precancerous changes known as dysplasia. There are several grades of increasing severity. Whether the cell changes should be treated depends on how severe they are and which type of HPV you have.",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "standard",
    reasons: [
      {
        titleNo: "HPV og celleforandring",
        titleEn: "HPV and cervical cell changes",
        descNo: "Utvikling av livmorhalskreft tar flere år. Screening med HPV-test hvert femte år redder liv. Etter påvist eller behandlet HPV eller celleforandringer følges du tettere.",
        descEn: "Cervical cancer usually develops over several years. HPV screening every five years saves lives. If HPV or cell changes are detected or treated, you will be monitored more closely.",
      },
      {
        titleNo: "Behandling",
        titleEn: "Treatment",
        descNo: "Lavgradige forandringer går ofte tilbake av seg selv. Høygradige forandringer vurderes med kolposkopi og vevsprøver. Ved behov behandles de med konisering.",
        descEn: "Low-grade changes often regress without treatment. High-grade changes are assessed by colposcopy and biopsy and, where needed, treated with a cone biopsy.",
      },
      {
        titleNo: "Konisering",
        titleEn: "Cone biopsy",
        descNo: "Konisering er et lite kirurgisk inngrep der en del av livmorhalsen fjernes for å hindre at celleforandringer utvikler seg til kreft. Inngrepet kan gjøres i lokalbedøvelse eller narkose.",
        descEn: "A cone biopsy is a minor surgical procedure that removes part of the cervix to prevent abnormal cells from developing into cancer. It can be performed under local or general anaesthesia.",
      },
    ],
  },

  vulvalidelser: {
    titleNo: "Vulvalidelser",
    titleEn: "Vulval conditions",
    heroTitleNo: "Vulvalidelser",
    heroTitleEn: "Vulval conditions",
    heroLeadNo:
      "Kompliserte sykdommer som vulvasykdommer trenger en tverrfaglig tilnærming. Vårt multidisiplinære team består derfor av gynekolog, hudlege, sexolog, psykolog og bekkenbunnsfysioterapeut. Avhengig av vulvovaginal lidelse og diagnose, vil du få tilbud om videre konsultasjon med andre spesialister.",
    heroLeadEn:
      "Complex conditions such as vulval disease require a multidisciplinary approach. Our multidisciplinary team therefore includes a gynaecologist, dermatologist, sexologist, psychologist and pelvic floor physiotherapist. Depending on the vulvovaginal condition and diagnosis, you will be offered further consultation with other specialists.",
    reasonsTitleNo: "Om vulvalidelser",
    reasonsTitleEn: "About vulval conditions",
    reasonsLeadNo:
      "Kompliserte sykdommer som vulvasykdommer trenger en tverrfaglig tilnærming. Vårt multidisiplinære team består derfor av gynekolog, hudlege, sexolog, psykolog og bekkenbunnsfysioterapeut.",
    reasonsLeadEn:
      "Complex conditions such as vulval disease require a multidisciplinary approach. Our multidisciplinary team therefore includes a gynaecologist, dermatologist, sexologist, psychologist and pelvic floor physiotherapist.",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["vaginisme", "tverrfaglig"],
    reasons: [
      {
        titleNo: "Infeksjoner",
        titleEn: "Infections",
        descNo: "Infeksjon eller ubalanse i vaginalfloraen kan skyldes seksuelt overførbare infeksjoner, sopp, bakteriell vaginose eller aerob vaginitt. Mikroskopi av utflod kan gi rask diagnose og målrettet behandling.",
        descEn: "Infection or imbalance of the vaginal flora may be caused by sexually transmitted infections, thrush, bacterial vaginosis or aerobic vaginitis. Microscopy of vaginal discharge can provide a prompt diagnosis and guide treatment.",
      },
      {
        titleNo: "Vaginal tørrhet",
        titleEn: "Vaginal dryness",
        descNo: "Østrogenmangel kan gi tørrhet, hyppige urinveisinfeksjoner, smerter ved samleie, sprekker, svie og kløe. Plagene bør undersøkes.",
        descEn: "Oestrogen deficiency can cause dryness, recurrent urinary tract infections, pain during intercourse, fissures, burning and itching. These symptoms should be assessed.",
      },
      {
        titleNo: "Vaginisme",
        titleEn: "Vaginismus",
        descNo: "Ufrivillige sammentrekninger i bekkenbunnsmuskulaturen kan gi smerter ved samleie, tampongbruk, sykling eller trange klær. Det finnes behandling.",
        descEn: "Involuntary pelvic floor contractions can cause pain during intercourse, tampon use, cycling or when wearing tight clothing. Effective treatment is available.",
      },
      {
        titleNo: "Vulvodyni",
        titleEn: "Vulvodynia",
        descNo: "Vulvodyni er kroniske smerter i vulva, som kan være generaliserte eller lokale. Tverrfaglig behandling kan redusere smerter og bedre livskvalitet og seksualfunksjon.",
        descEn: "Vulvodynia is chronic vulval pain that may be generalised or localised. Multidisciplinary treatment can reduce pain and improve quality of life and sexual function.",
      },
      {
        titleNo: "Botoxbehandling for vaginisme/vulvalidelser",
        titleEn: "Botulinum toxin treatment for vaginismus and vulval pain",
        descNo: "Botox kan redusere ufrivillig muskelspenning slik at samleie, undersøkelse eller tampongbruk blir mindre smertefullt. Behandlingen vurderes av erfaren gynekolog og tilpasses deg.",
        descEn: "Botulinum toxin can reduce involuntary muscle tension, making intercourse, examinations or tampon use less painful. An experienced gynaecologist assesses suitability and tailors treatment to you.",
      },
    ],
  },

  vaginisme: {
    titleNo: "Vaginisme",
    titleEn: "Vaginismus",
    heroTitleNo: "Vaginisme",
    heroTitleEn: "Vaginismus",
    heroLeadNo:
      "Vaginisme beskriver smerter i bekkenbunnsmuskulaturen som ofte oppstår ved forsøk på samleie, bruk av tampong, gynekologisk undersøkelse, sykling eller trange klær. Smertene skyldes ufrivillige sammentrekninger. Det finnes god behandling — og du er ikke alene.",
    heroLeadEn:
      "Vaginismus describes pelvic floor pain that often occurs during attempted intercourse, tampon use, a gynaecological examination, cycling or when wearing tight clothing. The pain is caused by involuntary muscle contractions. Effective treatment is available — and you are not alone.",
    reasonsTitleNo: "Når bør du ta kontakt?",
    reasonsTitleEn: "When should you seek help?",
    reasonsLeadNo:
      "Vaginisme rammer flere enn du tror, men blir sjelden snakket om. Disse situasjonene fortjener spesialistvurdering.",
    reasonsLeadEn:
      "Vaginismus affects more people than you think, but is rarely talked about. These situations deserve specialist assessment.",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "comfort",
    relatedSlugs: ["vulvalidelser", "undersokelse", "fodselsskader"],
    reasons: [
      ["Smerter ved samleie", "Pain during intercourse", "Ufrivillige spenninger som gjør penetrasjon vanskelig eller umulig.", "Involuntary tightening that makes penetration difficult or impossible."],
      ["Umulig å bruke tampong", "Unable to use a tampon", "Kroppen strammer seg til når noe skal føres inn.", "The body tightens when insertion is attempted."],
      ["Frykt for gynekologisk undersøkelse", "Fear of gynaecological examinations", "Tidligere vonde opplevelser eller vedvarende angst for underlivsundersøkelser.", "Previous painful experiences or persistent anxiety about intimate examinations."],
      ["Smerter ved sykling eller trange klær", "Pain when cycling or wearing tight clothing", "Trykk mot bekkenbunnen utløser smerter i hverdagen.", "Pressure on the pelvic floor triggers pain in everyday life."],
      ["Vedvarende bekkenbunnsspenninger", "Persistent pelvic floor tension", "Kroppen klarer ikke slippe muskulaturen — verken bevisst eller ubevisst.", "The pelvic floor muscles remain tense, consciously or unconsciously."],
    ].map(([titleNo, titleEn, descNo, descEn]) => ({ titleNo, titleEn, descNo, descEn })),
  },

  urinlekkasje: {
    titleNo: "Urinlekkasje",
    titleEn: "Urinary incontinence",
    heroTitleNo: "Urinlekkasje",
    heroTitleEn: "Urinary incontinence",
    heroLeadNo:
      "Nesten 25 % av alle kvinner rammes av urinlekkasje i løpet av livet - noe som gir redusert livskvalitet. Hos oss møter du noen av landets fremste eksperter på urinlekkasje og du får effektiv behandling for alle typer urinveislekkasje, tilpasset deg.",
    heroLeadEn:
      "Almost 25% of all women experience urinary incontinence during their lifetime — something that reduces quality of life. With us you meet some of the country’s leading specialists in urinary incontinence, and you receive effective treatment for all types of urinary leakage, tailored to you.",
    heroPriceNo: "fra 2 100 kr",
    heroPriceEn: "from NOK 2,100",
    reasonsTitleNo: "Om urinlekkasje",
    reasonsTitleEn: "About urinary incontinence",
    reasonsLeadNo:
      "Nesten 25 % av alle kvinner rammes av urinlekkasje i løpet av livet - noe som gir redusert livskvalitet.",
    reasonsLeadEn:
      "Almost 25% of all women experience urinary incontinence during their lifetime — something that reduces quality of life.",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["urogynekologi", "vaginale-fremfall", "fodselsskader"],
    reasons: [
      {
        titleNo: "Typer urinlekkasje",
        titleEn: "Types of urinary incontinence",
        descNo:
          "Stressinkontinens er lekkasje ved fysisk aktivitet, hoste eller latter og skyldes ofte svekket støttevev eller muskulatur etter fødsel eller tungt fysisk arbeid.\n\nTranginkontinens er en plutselig, sterk trang til å late vannet etterfulgt av lekkasje. Feil i nervesignalene gjør at blæremuskelen trekker seg sammen ukontrollert. Kronisk urinveisinfeksjon eller betennelse i blæreveggen kan gi lignende symptomer.\n\nBlandingsinkontinens er en kombinasjon av stress- og tranginkontinens.",
        descEn:
          "Stress incontinence is leakage during physical activity, coughing or laughing, often caused by weakened supporting tissue or muscles after childbirth or heavy physical work.\n\nUrge incontinence is a sudden, strong need to urinate followed by leakage. Abnormal nerve signals cause the bladder muscle to contract involuntarily. Chronic urinary tract infection or inflammation of the bladder wall can cause similar symptoms.\n\nMixed incontinence is a combination of stress and urge incontinence.",
      },
      {
        titleNo: "Behandling",
        titleEn: "Treatment",
        descNo:
          "Behandlingen avhenger av typen lekkasje, hvor mye du lekker og risikofaktorer som BMI og tidligere kirurgi. Alternativene inkluderer blæretrening, bekkenbunnstrening, legemidler og ulike operasjoner. Ved samtidig vaginalt fremfall og stressinkontinens behandles fremfallet vanligvis først.",
        descEn:
          "Treatment depends on the type and amount of leakage and risk factors such as BMI and previous surgery. Options include bladder training, pelvic floor exercises, medication and several surgical procedures. If pelvic organ prolapse and stress incontinence occur together, the prolapse is usually treated first.",
      },
    ],
  },

  urogynekologi: {
    titleNo: "Urogynekologi",
    titleEn: "Urogynaecology",
    heroTitleNo: "Fremfall og urinlekkasje hører sammen",
    heroTitleEn: "Prolapse and urinary incontinence are closely linked",
    heroLeadNo:
      "Urogynekologi handler om plager i bekkenbunnen – særlig vaginale fremfall (prolaps) og urinlekkasje. Hos oss møter du noen av Nordens fremste eksperter, og tilstandene utredes og behandles samlet av vårt uro-gynekologiske team.",
    heroLeadEn:
      "Urogynaecology covers pelvic floor conditions — particularly vaginal prolapse and urinary incontinence. With us you meet some of the Nordic region’s leading specialists, and the conditions are assessed and treated together by our uro-gynaecology team.",
    reasonsTitleNo: "Hva er urogynekologi?",
    reasonsTitleEn: "What is urogynaecology?",
    reasonsLeadNo:
      "Urogynekologi er fagområdet som utreder og behandler plager i bekkenbunnen — først og fremst vaginale fremfall (prolaps) og urinlekkasje. Under finner du egne sider med utdypende informasjon om hver av tilstandene.",
    reasonsLeadEn:
      "Urogynaecology is the field that assesses and treats pelvic floor problems — primarily vaginal prolapse and urinary incontinence. Below you will find dedicated pages with more detail on each condition.",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "comfort",
    relatedSlugs: ["urinlekkasje", "vaginale-fremfall", "robotkirurgi"],
    reasons: [
      {
        titleNo: "Vaginale fremfall (prolaps)",
        titleEn: "Pelvic organ prolapse",
        descNo: "Når skjedevegg, livmor eller livmorhals buker ned i skjeden. Les mer på siden om vaginale fremfall.",
        descEn: "This occurs when the vaginal wall, uterus or cervix bulges down into the vagina. Read more on our pelvic organ prolapse page.",
      },
      {
        titleNo: "Urinlekkasje (inkontinens)",
        titleEn: "Urinary incontinence",
        descNo: "Stress-, trang- og blandingsinkontinens. Les mer på siden om urinlekkasje.",
        descEn: "Stress, urge and mixed incontinence. Read more on our urinary incontinence page.",
      },
    ],
  },

  "vaginale-fremfall": {
    titleNo: "Vaginale fremfall",
    titleEn: "Pelvic organ prolapse",
    heroTitleNo: "Vaginale fremfall",
    heroTitleEn: "Pelvic organ prolapse",
    heroLeadNo:
      "Vaginalt fremfall, også kjent som prolaps, innebærer at skjedens fremre eller bakre vegg, eller livmor/livmorhals, buker ned i skjeden eller ut av skjedeinngangen.",
    heroLeadEn:
      "Pelvic organ prolapse occurs when the front or back wall of the vagina, or the uterus or cervix, bulges down into the vagina or beyond the vaginal opening.",
    reasonsTitleNo: "Om vaginale fremfall",
    reasonsTitleEn: "About pelvic organ prolapse",
    reasonsLeadNo:
      "Vaginalt fremfall, også kjent som prolaps, innebærer at skjedens fremre eller bakre vegg, eller livmor/livmorhals, buker ned i skjeden eller ut av skjedeinngangen.",
    reasonsLeadEn:
      "Pelvic organ prolapse occurs when the front or back wall of the vagina, or the uterus or cervix, bulges down into the vagina or beyond the vaginal opening.",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["urogynekologi", "urinlekkasje", "robotkirurgi"],
    reasons: [
      {
        titleNo: "Behandling",
        titleEn: "Treatment",
        descNo:
          "Behandlingen avhenger av alvorlighetsgrad og symptomer og kan omfatte bekkenbunnstrening, støtteinnretninger som pessar eller kirurgi. Hos oss møter du noen av Nordens fremste eksperter på fremfall.",
        descEn:
          "Treatment depends on severity and symptoms and may include pelvic floor training, support devices such as a pessary, or surgery. You will meet some of the Nordic region’s leading prolapse specialists.",
      },
    ],
  },

  overgangsalder: {
    titleNo: "Overgangsalder",
    titleEn: "Menopause",
    heroTitleNo: "Overgangsalder",
    heroTitleEn: "Menopause",
    heroLeadNo:
      "Symptomer på overgangsalderen starter ofte i første halvdel av 40-årene, opplevelsene kan variere mye fra kvinne til kvinne. For noen er overgangen knapt merkbar, mens andre opplever så store utfordringer at det påvirker hverdagen deres betydelig.",
    heroLeadEn:
      "Menopausal symptoms often begin in the early forties; experiences can vary a great deal from woman to woman. For some, the transition is barely noticeable, while others face challenges that significantly affect everyday life.",
    heroPriceNo: "fra 3 200 kr",
    heroPriceEn: "from NOK 3,200",
    reasonsTitleNo: "Om overgangsalder",
    reasonsTitleEn: "About menopause",
    reasonsLeadNo:
      "Overgangsalderen deles ofte inn i fasene premenopause, perimenopause, menopause og postmenopause. Det hele starter med premenopausen, som strekker seg fra første menstruasjon og fram til menstruasjonen blir uregelmessig. Deretter følger perimenopausen der østrogen og progesteron faller, menstruasjonen kan bli uregelmessig og hormonfallet kan påvirke kvinners fysiske og emosjonelle velvære. Menopause er dagen der det er 12 måneder siden sist menstruasjon. Etter denne dagen tilbringes resten av livet i postmenopausen, der østrogennivået forblir lavt.",
    reasonsLeadEn:
      "Menopause is often divided into the phases premenopause, perimenopause, menopause and postmenopause. It begins with premenopause, from the first period until cycles become irregular. Then comes perimenopause, when oestrogen and progesterone fall, periods may become irregular, and the hormonal shift can affect physical and emotional wellbeing. Menopause is the day when it has been 12 months since the last period. After that day, the rest of life is spent in postmenopause, when oestrogen levels remain low.",
    reasonsLayout: "accordion",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "standard",
    // Relaterte tjenester = gyn nav order (demo), excluding self.
    relatedSlugs: [
      "tverrfaglig",
      "undersokelse",
      "urinlekkasje",
      "endometriose",
      "vaginale-fremfall",
    ],
    reasons: [
      {
        titleNo: "Symptomer",
        titleEn: "Symptoms",
        descNo:
          "Vanlige symptomer inkluderer:\n- Uregelmessig menstruasjon/blødningsforstyrrelser\n- Hetetokter og/eller nattesvette\n- Hjernetåke/konsentrasjonsvansker\n- Økt irritabilitet\n- Tar lettere til tårene/emosjonell\n- Redusert hukommelse\n- Søvnproblemer\n- Endringer i hud og hår\n- Smerter i ledd og muskler\n- Hyppigere hodepine\n- Redusert sexlyst\n- Urinveisinfeksjoner og tørrhet i skjeden\n\nPå lengre sikt øker risikoen for tilstander som beinskjørhet, hjerte- og karsykdommer, høyt kolesterol og blodtrykk, depresjon og muligens demens. Dette skyldes nedgang i østrogen-, progesteron- og testosteronproduksjonen. Heldigvis finnes trygge og effektive behandlingsalternativer som hjelper deg med å håndtere symptomene, gir økt livskvalitet og reduserer risiko for fremtidige helseproblemer.",
        descEn:
          "Common symptoms include:\n- Irregular periods / bleeding disorders\n- Hot flushes and/or night sweats\n- Brain fog / concentration difficulties\n- Increased irritability\n- Becoming more emotional / tearful\n- Reduced memory\n- Sleep problems\n- Changes in skin and hair\n- Joint and muscle pain\n- More frequent headaches\n- Reduced libido\n- Urinary tract infections and vaginal dryness\n\nOver time, the risks of conditions such as osteoporosis, cardiovascular disease, high cholesterol and blood pressure, depression and possibly dementia increase. This is due to falling oestrogen, progesterone and testosterone production. Safe and effective treatments can help you manage symptoms, improve quality of life and reduce future health risks.",
      },
      {
        titleNo: "Behandling",
        titleEn: "Treatment",
        descNo:
          "En kartleggingssamtale er en personlig og grundig konsultasjon med en eller flere av våre spesialister. Målet er å forstå dine individuelle utfordringer og behov i forbindelse med overgangsalderen. Samtalen varer i omtrent 45 minutter og inkluderer:\n- En detaljert gjennomgang av sykdomshistorie og livssituasjon.\n- Gynekologisk undersøkelse og relevante blodprøver ved behov.\n- Utarbeidelse av en tilpasset behandlingsplan.\n\nI samråd med deg kan vi tilby tverrfaglig oppfølging for å styrke behandlingen. Dette kan inkludere samarbeid med ernæringsfysiolog, osteopat, sexolog eller psykolog, basert på dine ønsker og behov.\n\nEn oppfølgingstime må bestilles etter 6 måneder. Våre eksperter er tilgjengelige ved ytterligere behov.\n\nVårt mål er å tilby deg en helhetlig og tilpasset behandling som gir merkbare forbedringer i din helse og livskvalitet gjennom overgangsalderen.\n\nVi hjelper deg med å ta hverdagen tilbake. Hos oss møter du et kompetent og engasjert team som lytter, veileder og utvikler en behandlingsplan som er tilpasset dine utfordringer og behov.",
        descEn:
          "An initial assessment is a personal, thorough consultation with one or more of our specialists. The goal is to understand your individual challenges and needs in connection with menopause. The appointment lasts about 45 minutes and includes:\n- A detailed review of your medical history and life situation.\n- A gynaecological examination and relevant blood tests where needed.\n- An individually tailored treatment plan.\n\nTogether with you, we can offer multidisciplinary follow-up to strengthen treatment. This may include a dietitian, osteopath, sexologist or psychologist, based on your wishes and needs.\n\nA follow-up appointment should be booked after 6 months. Our experts remain available if you need further support.\n\nOur aim is holistic, tailored care that delivers noticeable improvements in your health and quality of life through menopause.\n\nWe help you take everyday life back. With us you meet a competent, engaged team that listens, guides and builds a plan around your challenges and needs.",
      },
      {
        titleNo: "Fastlegeveiledning overgangsalder",
        titleEn: "Menopause guidance for GPs",
        descNo:
          "Vi har utarbeidet en egen veiledning for fastleger om utredning og behandling av peri- og menopausale kvinner. Veilederen baserer seg på Norsk gynekologisk veileder 2024, NICE NG23 (2024), British Menopause Society (BMS) retningslinjer og European Society of Endocrinology (ESE) kliniske retningslinjer 2025.\n\n[Les fastlegeveiledning for overgangsalder →](/fastlegeveiledning-overgangsalder)",
        descEn:
          "We have prepared dedicated guidance for GPs on assessing and treating perimenopausal and menopausal women. It is based on the 2024 Norwegian gynaecology guideline, NICE NG23 (2024), British Menopause Society (BMS) guidance and European Society of Endocrinology (ESE) clinical guidelines 2025.\n\n[Read the GP menopause guidance →](/en/fastlegeveiledning-overgangsalder)",
      },
    ],
  },

  kirurgi: {
    titleNo: "Gynekologisk kirurgi",
    titleEn: "Gynaecological surgery",
    heroTitleNo: "Gynekologisk kirurgi",
    heroTitleEn: "Gynaecological surgery",
    heroLeadNo:
      "CMedical tilbyr vi en rekke gynekologiske operasjoner utført av håndplukkede kirurger, som er ledende innen sine felt. Hos oss er både trygghet og god kommunikasjon viktig, og vi sørger for at du føler deg godt ivaretatt gjennom hele behandlingsforløpet.",
    heroLeadEn:
      "At CMedical we offer a range of gynaecological procedures performed by carefully selected surgeons who are leaders in their fields. Safety and clear communication matter to us, and we make sure you feel well looked after throughout your treatment.",
    heroPriceNo: "fra 9 930 kr",
    heroPriceEn: "from NOK 9,930",
    reasonsTitleNo: "Om gynekologisk kirurgi",
    reasonsTitleEn: "About gynaecological surgery",
    reasonsLeadNo:
      "CMedical tilbyr vi en rekke gynekologiske operasjoner utført av håndplukkede kirurger, som er ledende innen sine felt.",
    reasonsLeadEn:
      "At CMedical we offer a range of gynaecological procedures performed by carefully selected surgeons who are leaders in their fields.",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["robotkirurgi", "fjerne-livmor", "labiaplastikk"],
    reasons: [
      {
        titleNo: "Våre tjenester innen gynekologisk kirurgi",
        titleEn: "Our gynaecological surgery services",
        descNo: "Vi opererer fremfall og urinlekkasje, utfører hysterektomi, fjerner polypper, muskelknuter, endometriose, eggstokkcyster, arrvev og celleforandringer, og tilbyr labiaplastikk.",
        descEn: "We perform surgery for prolapse and urinary incontinence, hysterectomy, removal of polyps, fibroids, endometriosis, ovarian cysts, scar tissue and cervical cell changes, and labiaplasty.",
      },
      {
        titleNo: "Robotassistert kirurgi",
        titleEn: "Robot-assisted surgery",
        descNo: "Som eneste private aktør i Norge tilbyr vi robotassistert gynekologisk kirurgi. Metoden gir høy presisjon, lavere risiko for blødning, nerve- og organskade og ofte kortere sykehusopphold.",
        descEn: "We are the only private provider in Norway offering robot-assisted gynaecological surgery. The technique provides high precision, lowers the risk of bleeding and injury to nerves or organs, and often shortens the hospital stay.",
      },
    ],
  },

  robotkirurgi: {
    titleNo: "Robotassistert kirurgi – Gynekologi",
    titleEn: "Robot-assisted gynaecological surgery",
    heroTitleNo: "Robotassistert kirurgi – Gynekologi",
    heroTitleEn: "Robot-assisted gynaecological surgery",
    heroLeadNo:
      "CMedical er den eneste private aktøren i Norge som tilbyr robotassistert kirurgi innen gynekologi. Med da Vinci-systemet utfører vi avanserte inngrep med minimalt invasiv teknikk.",
    heroLeadEn:
      "CMedical is the only private provider in Norway offering robot-assisted gynaecological surgery. Using the da Vinci system, we perform advanced procedures with minimally invasive techniques.",
    reasonsTitleNo: "Om robotassistert kirurgi",
    reasonsTitleEn: "About robot-assisted surgery",
    reasonsLeadNo:
      "CMedical er den eneste private aktøren i Norge som tilbyr robotassistert kirurgi innen gynekologi. Med da Vinci-systemet utfører vi avanserte inngrep med minimalt invasiv teknikk.",
    reasonsLeadEn:
      "CMedical is the only private provider in Norway offering robot-assisted gynaecological surgery. Using the da Vinci system, we perform advanced procedures with minimally invasive techniques.",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["kirurgi", "endometriose", "fjerne-livmor"],
    reasons: [
      {
        titleNo: "Robotassistert kirurgi",
        titleEn: "Robot-assisted surgery",
        descNo:
          "Kirurgen styrer instrumentene elektronisk fra en konsoll ved siden av pasienten. Et høyoppløselig stereoskopisk 3D-kamera og presise instrumenter gir svært god oversikt og tilgang. Små snitt gir mindre ubehag og blødning, færre komplikasjoner og raskere rekonvalesens. Metoden er særlig nyttig ved dyp endometriose, hysterektomi og annen kompleks kirurgi i bekkenet.",
        descEn:
          "The surgeon controls the instruments electronically from a console beside the patient. A high-resolution stereoscopic 3D camera and precise instruments provide excellent visibility and access. Small incisions mean less discomfort and bleeding, fewer complications and faster recovery. The technique is particularly useful for deep endometriosis, hysterectomy and other complex pelvic surgery.",
      },
      {
        titleNo: "Safe Histology Surgery",
        titleEn: "Safe Histology Surgery",
        descNo: "Vi kombinerer skånsom robotassistert kirurgi med nøyaktig vevsdiagnostikk under inngrepet, slik at kirurgen kan tilpasse operasjonen presist til funnene.",
        descEn: "We combine gentle robot-assisted surgery with accurate tissue diagnosis during the procedure, allowing the surgeon to tailor the operation precisely to the findings.",
      },
    ],
  },

  "fjerne-livmor": {
    titleNo: "Fjerne livmor",
    titleEn: "Hysterectomy",
    heroTitleNo: "Fjerne livmor",
    heroTitleEn: "Hysterectomy",
    heroLeadNo:
      "Fjerning av livmor (hysterektomi) anbefales ved plagsomme muskelknuter (myomer), blødningsforstyrrelser, kreft i livmor eller livmorhals. Det kan også være aktuelt ved endometriose eller ved vedvarende celleforandringer i livmorhals.",
    heroLeadEn:
      "Removal of the uterus (hysterectomy) is recommended for troublesome fibroids (myomas), abnormal uterine bleeding, or cancer of the uterus or cervix. It may also be relevant for endometriosis or persistent cervical cell changes.",
    reasonsTitleNo: "Om å fjerne livmoren",
    reasonsTitleEn: "About hysterectomy",
    reasonsLeadNo:
      "Fjerning av livmor (hysterektomi) anbefales ved plagsomme muskelknuter (myomer), blødningsforstyrrelser, kreft i livmor eller livmorhals. Det kan også være aktuelt ved endometriose eller ved vedvarende celleforandringer i livmorhals.",
    reasonsLeadEn:
      "Removal of the uterus (hysterectomy) is recommended for troublesome fibroids (myomas), abnormal uterine bleeding, or cancer of the uterus or cervix. It may also be relevant for endometriosis or persistent cervical cell changes.",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["robotkirurgi", "kirurgi", "adenomyose"],
    reasons: [
      {
        titleNo: "Fjerning av livmor (hysterektomi)",
        titleEn: "Removal of the uterus (hysterectomy)",
        descNo: "Vi fjerner vanligvis livmoren skånsomt med kikkhulls- eller robotassistert kirurgi. Ved vanskelig anatomi kan et lite bikinisnitt være nødvendig. Du får detaljert informasjon, kirurgens telefonnummer og tett oppfølging. Eggstokkene beholdes vanligvis dersom du ikke har kommet i overgangsalderen.",
        descEn: "The uterus is usually removed using minimally invasive keyhole or robot-assisted surgery. If the anatomy is difficult, a small bikini-line incision may be needed. You receive detailed information, direct contact details for your surgeon and close follow-up. The ovaries are usually retained if you have not reached menopause.",
      },
      {
        titleNo: "Etter operasjonen",
        titleEn: "After surgery",
        descNo: "Det er få langtidsbivirkninger etter inngrepet, og seksualfunksjonen kan være som før. Hvor raskt du kommer deg avhenger av operasjonsmetode og individuelle forhold.",
        descEn: "There are few long-term side effects, and sexual function can remain as before. Recovery time depends on the surgical method and individual circumstances.",
      },
    ],
  },

  labiaplastikk: {
    titleNo: "Labiaplastikk",
    titleEn: "Labiaplasty",
    heroTitleNo: "Labiaplastikk",
    heroTitleEn: "Labiaplasty",
    heroLeadNo:
      "Det er normalt med ulik størrelse og utseende på kjønnslepper. Noen ganger gir store kjønnslepper smerter ved fysisk aktivitet som sykling, ridning, eller er i veien ved samleie. Da kan kirurgisk reduksjon av kjønnsleppene være løsningen.",
    heroLeadEn:
      "It is normal for the labia to vary in size and appearance. Sometimes enlarged labia cause pain during physical activity such as cycling or horse riding, or get in the way during intercourse. Surgical reduction of the labia can then be the solution.",
    heroPriceNo: "fra 40 000 kr",
    heroPriceEn: "from NOK 40,000",
    reasonsTitleNo: "Om labiaplastikk",
    reasonsTitleEn: "About labiaplasty",
    reasonsLeadNo:
      "Det er normalt med ulik størrelse og utseende på kjønnslepper. Noen ganger gir store kjønnslepper smerter ved fysisk aktivitet som sykling, ridning, eller er i veien ved samleie. Da kan kirurgisk reduksjon av kjønnsleppene være løsningen.",
    reasonsLeadEn:
      "It is normal for the labia to vary in size and appearance. Sometimes enlarged labia cause pain during physical activity such as cycling or horse riding, or get in the way during intercourse. Surgical reduction of the labia can then be the solution.",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["kirurgi", "vulvalidelser"],
    reasons: [
      {
        titleNo: "Hva er labiaplastikk?",
        titleEn: "What is labiaplasty?",
        descNo:
          "Labiaplastikk reduserer størrelsen på de indre kjønnsleppene. Inngrepet gjøres i narkose og tar omtrent 20 minutter. Det brukes fine kirurgiske teknikker med skalpell og lett diatermi, og stingene løser seg opp av seg selv.\n\nRisikoen omfatter blødning, infeksjon, arrdannelse og nedsatt følsomhet. Derfor er det viktig å velge en erfaren kirurg. Tilhelingen tar vanligvis noen uker, mens fullstendig tilheling kan ta flere måneder. Du får grundige råd om tiden etter operasjonen.",
        descEn:
          "Labiaplasty reduces the size of the labia minora. The procedure is performed under general anaesthesia and takes about 20 minutes. Fine surgical techniques using a scalpel and light diathermy are used, and the dissolvable sutures do not need to be removed.\n\nRisks include bleeding, infection, scarring and reduced sensation, so choosing an experienced surgeon is important. Initial recovery usually takes a few weeks, while complete healing may take several months. You receive detailed aftercare advice.",
      },
    ],
  },

  tverrfaglig: {
    titleNo: "Tverrfaglig team: Osteopat, Sexolog, Psykolog, Ernæring",
    titleEn: "Multidisciplinary team: osteopathy, sexology, psychology and nutrition",
    heroTitleNo: "Tverrfaglig team: Osteopat, Sexolog, Psykolog, Ernæring",
    heroTitleEn: "Multidisciplinary team: osteopathy, sexology, psychology and nutrition",
    heroLeadNo:
      "Våre gynekologer jobber kun med den kvinnesykdommen de kan aller best, og ved behov jobber vi i unike ekspert team med psykolog, sexolog, ernæringsfysiolog, fysioterapeut, osteopat og uroterapeut. Denne tverrfagligheten er helt unik!",
    heroLeadEn:
      "Our gynaecologists work only with the area of women’s health they know best, and when needed we work in unique expert teams with a psychologist, sexologist, dietitian, physiotherapist, osteopath and continence specialist. This multidisciplinary approach is truly unique!",
    reasonsTitleNo: "Vårt tverrfaglige team",
    reasonsTitleEn: "Our multidisciplinary team",
    reasonsLeadNo:
      "Våre gynekologer jobber kun med den kvinnesykdommen de kan aller best, og ved behov jobber vi i unike ekspert team med psykolog, sexolog, ernæringsfysiolog, fysioterapeut, osteopat og uroterapeut. Denne tverrfagligheten er helt unik!",
    reasonsLeadEn:
      "Our gynaecologists work only with the area of women’s health they know best, and when needed we work in unique expert teams with a psychologist, sexologist, dietitian, physiotherapist, osteopath and continence specialist. This multidisciplinary approach is truly unique!",
    midCtaNo: gynCta.no,
    midCtaEn: gynCta.en,
    promiseVariant: "standard",
    relatedSlugs: ["overgangsalder", "endometriose", "fodselsskader", "undersokelse"],
    reasons: [
      ["Osteopat", "Osteopath", "Manuell behandling som supplerer medisinsk utredning ved vulvasmerter, bekkenbunnsdysfunksjon og muskel- og skjelettplager.", "Manual treatment that complements medical assessment for vulval pain, pelvic floor dysfunction and musculoskeletal problems."],
      ["Sexolog", "Sexologist", "Terapeutiske samtaler og veiledning om seksuell helse, funksjon, lyst, selvbilde og intimitet.", "Therapeutic conversations and guidance on sexual health, function, desire, self-image and intimacy."],
      ["Psykolog", "Psychologist", "Hjelp til å sortere tanker og følelser, håndtere smerter og få støtte gjennom krevende behandlingsforløp.", "Help with processing thoughts and emotions, managing pain and receiving support through demanding treatment."],
      ["Ernæringsfysiolog", "Dietitian", "Individuell kostholdsveiledning med betydning for hormoner, fertilitet, overgangsalder og generell helse.", "Individual nutrition advice relevant to hormones, fertility, menopause and general health."],
    ].map(([titleNo, titleEn, descNo, descEn]) => ({ titleNo, titleEn, descNo, descEn })),
  },

  "6-ukerskontroll": {
    titleNo: "6-ukerskontroll etter fødsel",
    titleEn: "Six-week postnatal check",
    heroTitleNo: "6-ukerskontroll etter fødsel",
    heroTitleEn: "Six-week postnatal check",
    heroLeadNo:
      "På 6-ukerskontrollen har vi hovedfokus på bekkenbunn og din psykiske helse etter fødsel. Du treffer erfaren gynekolog som går grundig gjennom hvordan kroppen har hentet seg inn, sjekker bekkenbunnsmuskulaturen og tar seg tid til hvordan du har det.",
    heroLeadEn:
      "At the six-week postnatal check we focus on your pelvic floor and mental wellbeing after birth. You meet an experienced gynaecologist who carefully reviews how your body has recovered, checks your pelvic floor muscles and takes time to discuss how you are feeling.",
    heroPriceNo: "fra 2 100 kr",
    heroPriceEn: "from NOK 2,100",
    heroPriceLabelNo: "6-ukerskontroll etter fødsel",
    heroPriceLabelEn: "Six-week postnatal check",
    reasonsTitleNo: "Om 6-ukerskontroll etter fødsel",
    reasonsTitleEn: "About the six-week postnatal check",
    reasonsLeadNo:
      "På 6-ukerskontrollen har vi hovedfokus på bekkenbunn og din psykiske helse etter fødsel.",
    reasonsLeadEn:
      "At the six-week postnatal check we focus on your pelvic floor and mental wellbeing after birth.",
    midCtaNo: pregnancyCta.no,
    midCtaEn: pregnancyCta.en,
    promiseVariant: "standard",
    relatedSlugs: [
      "graviditet",
      "spontanabort",
      "fodselsskader",
      "fostermedisin",
      "ultralyd",
      "nipt",
      "svangerskapsteam",
      "fosterdiagnostikk",
    ],
    reasons: [
      {
        titleNo: "Bekkenbunn og fødselsskader",
        titleEn: "Pelvic floor and birth injuries",
        descNo:
          "Vi undersøker bekkenbunnsmuskulaturen og ser etter rifter, arrvev og eventuelle skader som ikke har grodd som de skal. Ved behov henviser vi videre til fysioterapeut eller uroterapeut, eller vurderer behandling hos oss.",
        descEn:
          "We examine the pelvic floor muscles and look for tears, scar tissue and any injuries that have not healed as they should. Where needed, we refer you to a physiotherapist or continence specialist, or assess treatment with us.",
      },
      {
        titleNo: "Psykisk helse etter fødsel",
        titleEn: "Postnatal mental health",
        descNo:
          "Tiden etter fødsel kan være krevende. Vi setter av tid til hvordan du har det, og kan koble deg videre til psykolog dersom du ønsker det.",
        descEn:
          "The time after birth can be demanding. We make time to discuss how you are feeling and can connect you with a psychologist if you wish.",
      },
      {
        titleNo: "Prevensjon og samliv",
        titleEn: "Contraception and intimacy",
        descNo:
          "Vi går gjennom prevensjon etter fødsel og snakker om samliv, tørrhet og smerter ved samleie dersom det er aktuelt.",
        descEn:
          "We discuss contraception after birth and talk about intimacy, dryness and pain during intercourse where relevant.",
      },
    ],
  },

  fodselsskader: {
    titleNo: "Fødselsskader",
    titleEn: "Birth injuries",
    heroTitleNo: "Fødselsskader",
    heroTitleEn: "Birth injuries",
    heroLeadNo:
      "Fødselsskader er en samlebetegnelse på plager som kan oppstå etter en fødsel. Det kan være bristninger og arrvev, svekket bekkenbunn, diastase i magemuskulaturen, vaginale fremfall, urin- eller avføringslekkasje, eller smerter ved samleie. De fleste av disse plagene kan utredes og behandles.",
    heroLeadEn:
      "Birth injuries is an umbrella term for problems that can occur after childbirth. These may include tears and scar tissue, a weakened pelvic floor, abdominal muscle separation (diastasis), vaginal prolapse, urinary or faecal incontinence, or pain during intercourse. Most of these problems can be assessed and treated.",
    reasonsTitleNo: "Om fødselsskader",
    reasonsTitleEn: "About birth injuries",
    reasonsLeadNo:
      "Fødselsskader er en samlebetegnelse på plager som kan oppstå etter en fødsel. Det kan være bristninger og arrvev, svekket bekkenbunn, diastase i magemuskulaturen, vaginale fremfall, urin- eller avføringslekkasje, eller smerter ved samleie.",
    reasonsLeadEn:
      "Birth injuries is an umbrella term for problems that can occur after childbirth, including tears and scar tissue, a weakened pelvic floor, abdominal muscle separation, vaginal prolapse, urinary or faecal incontinence, or pain during intercourse.",
    midCtaNo: pregnancyCta.no,
    midCtaEn: pregnancyCta.en,
    promiseVariant: "standard",
    relatedSlugs: [
      "graviditet",
      "spontanabort",
      "fostermedisin",
      "ultralyd",
      "6-ukerskontroll",
      "nipt",
      "svangerskapsteam",
      "fosterdiagnostikk",
    ],
    reasons: [
      ["Bristninger og arrvev", "Tears and scar tissue", "Rifter og arrvev etter fødsel som kan gi smerter eller nedsatt funksjon.", "Tears and scar tissue after birth that may cause pain or reduced function."],
      ["Svekket bekkenbunn", "Weakened pelvic floor", "Svekket støtte i bekkenbunnen etter fødsel.", "Reduced pelvic floor support after childbirth."],
      ["Diastase (delte magemuskler)", "Diastasis (separated abdominal muscles)", "Delte rette magemuskler etter graviditet og fødsel.", "Separation of the rectus abdominis muscles after pregnancy and birth."],
      ["Vaginalt fremfall", "Vaginal prolapse", "Fremfall av skjedevegg, livmor eller andre bekkenorganer.", "Prolapse of the vaginal wall, uterus or other pelvic organs."],
      ["Urinlekkasje", "Urinary incontinence", "Urinlekkasje etter fødsel.", "Urinary leakage after childbirth."],
      ["Avføringslekkasje", "Faecal incontinence", "Vansker med å holde på avføring eller luft etter fødselsskade.", "Difficulty controlling stool or wind after birth injury."],
      ["Samleiesmerter og seksuelle plager", "Pain during intercourse and sexual problems", "Smerter eller andre seksuelle plager etter fødsel.", "Pain or other sexual problems after childbirth."],
      ["Tverrfaglig tilnærming", "Multidisciplinary care", "Utredning og behandling i samarbeid mellom flere spesialiteter under samme tak.", "Assessment and treatment with several specialties working together under one roof."],
    ].map(([titleNo, titleEn, descNo, descEn]) => ({ titleNo, titleEn, descNo, descEn })),
  },

  nipt: {
    titleNo: "NIPT",
    titleEn: "NIPT",
    heroTitleNo: "NIPT",
    heroTitleEn: "NIPT",
    heroLeadNo:
      "Fra og med svangerskapsuke 10 kan du ta NIPT-test og tidlig ultralyd hos oss. NIPT er en forkortelse for Non-Invasive Prenatal Test. Ved hjelp av en blodprøve fra armen til mor, kombinert med en ultralydundersøkelse, kan du undersøke om fosteret har trisomi 13, 18 eller 21, også kjent som kromosomavvik.",
    heroLeadEn:
      "From week 10 of pregnancy you can have a NIPT test and early ultrasound with us. NIPT stands for Non-Invasive Prenatal Test. Using a blood sample from the mother’s arm, combined with an ultrasound examination, we can screen for trisomy 13, 18 or 21 — chromosomal conditions.",
    heroPriceNo: "fra 8 990 kr",
    heroPriceEn: "from NOK 8,990",
    heroPriceLabelNo: "NIPT",
    heroPriceLabelEn: "NIPT",
    reasonsTitleNo: "Om NIPT",
    reasonsTitleEn: "About NIPT",
    reasonsLeadNo:
      "Fra og med svangerskapsuke 10 kan du ta NIPT-test og tidlig ultralyd hos oss. NIPT er en forkortelse for Non-Invasive Prenatal Test.",
    reasonsLeadEn:
      "From week 10 of pregnancy you can have a NIPT test and early ultrasound with us. NIPT stands for Non-Invasive Prenatal Test.",
    midCtaNo: pregnancyCta.no,
    midCtaEn: pregnancyCta.en,
    promiseVariant: "standard",
    relatedSlugs: [
      "graviditet",
      "spontanabort",
      "fodselsskader",
      "fostermedisin",
      "ultralyd",
      "6-ukerskontroll",
      "svangerskapsteam",
      "fosterdiagnostikk",
    ],
    reasons: [
      {
        titleNo: "Hva undersøker NIPT?",
        titleEn: "What does NIPT screen for?",
        descNo:
          "Ved hjelp av en blodprøve fra armen til mor, kombinert med en ultralydundersøkelse, kan du undersøke om fosteret har trisomi 13, 18 eller 21, også kjent som kromosomavvik.",
        descEn:
          "Using a maternal blood sample combined with ultrasound, we can screen for trisomy 13, 18 or 21 — chromosomal conditions.",
      },
      {
        titleNo: "Er NIPT trygt?",
        titleEn: "Is NIPT safe?",
        descNo:
          "Da vi kun trenger en blodprøve fra mor, er det ingen økt risiko for abort, slik det for eksempel kan være ved morkakeprøve eller fostervannsprøve.",
        descEn:
          "Because we only need a blood sample from the mother, there is no increased risk of miscarriage, unlike procedures such as chorionic villus sampling or amniocentesis.",
      },
      {
        titleNo: "Fosterdiagnostikk hos spesialist",
        titleEn: "Prenatal diagnosis with a specialist",
        descNo:
          "Dr. Ashi Ahmad hos oss har fått virksomhetsgodkjenning for å tilby fosterdiagnostikk til gravide kvinner. Ashi Ahmad er spesialist i gynekologi og fødselshjelp og har doktorgrad i epidemiologi og fødselshjelp.",
        descEn:
          "Dr Ashi Ahmad at CMedical is authorised to provide prenatal diagnosis for pregnant women. She is a specialist in obstetrics and gynaecology and holds a doctorate in epidemiology and obstetrics.",
      },
    ],
  },

  fosterdiagnostikk: {
    titleNo: "Fosterdiagnostikk",
    titleEn: "Prenatal diagnosis",
    heroTitleNo: "Fosterdiagnostikk",
    heroTitleEn: "Prenatal diagnosis",
    heroLeadNo:
      "Fosterdiagnostikk omfatter ulike undersøkelser for å vurdere fosterets helse og utvikling. Vi tilbyr et bredt spekter av diagnostiske metoder, fra ultralydundersøkelser og blodprøver til mer avanserte tester.",
    heroLeadEn:
      "Prenatal diagnosis covers various examinations to assess the health and development of the fetus. We offer a wide range of diagnostic methods, from ultrasound and blood tests to more advanced investigations.",
    heroPriceNo: "fra 2 100 kr",
    heroPriceEn: "from NOK 2,100",
    heroPriceLabelNo: "Fosterdiagnostikk",
    heroPriceLabelEn: "Prenatal diagnosis",
    reasonsTitleNo: "Om fosterdiagnostikk",
    reasonsTitleEn: "About prenatal diagnosis",
    midCtaNo: pregnancyCta.no,
    midCtaEn: pregnancyCta.en,
    promiseVariant: "standard",
    relatedSlugs: [
      "graviditet",
      "spontanabort",
      "fodselsskader",
      "fostermedisin",
      "ultralyd",
      "6-ukerskontroll",
      "nipt",
      "svangerskapsteam",
    ],
    reasons: [],
  },

  fostermedisin: {
    titleNo: "Fostermedisin",
    titleEn: "Fetal medicine",
    heroTitleNo: "Fostermedisin",
    heroTitleEn: "Fetal medicine",
    heroLeadNo:
      "Hos oss møter du høyt kompetente, erfarne og dedikerte gynekologer med spesialisering innen fostermedisin, også kalt fostermedisinere. Deres kompetanse er din trygghet.",
    heroLeadEn:
      "With us you meet highly skilled, experienced and dedicated gynaecologists specialising in fetal medicine. Their expertise is your reassurance.",
    reasonsTitleNo: "Om fostermedisin",
    reasonsTitleEn: "About fetal medicine",
    reasonsLeadNo:
      "Hos oss møter du høyt kompetente, erfarne og dedikerte gynekologer med spesialisering innen fostermedisin, også kalt fostermedisinere. Deres kompetanse er din trygghet.",
    reasonsLeadEn:
      "With us you meet highly skilled, experienced and dedicated gynaecologists specialising in fetal medicine. Their expertise is your reassurance.",
    midCtaNo: pregnancyCta.no,
    midCtaEn: pregnancyCta.en,
    promiseVariant: "standard",
    relatedSlugs: [
      "graviditet",
      "spontanabort",
      "fodselsskader",
      "ultralyd",
      "6-ukerskontroll",
      "nipt",
      "svangerskapsteam",
      "fosterdiagnostikk",
    ],
    reasons: [
      {
        titleNo: "Tidlig ultralyd",
        titleEn: "Early ultrasound",
        descNo:
          "Vi skiller mellom tidlig ultralyd uke 6-10, uke 11-14, og ultralyd fra uke 14+0. Tidlig ultralyd uke 6-10 utføres ved hjelp av en innvendig probe. Dette er helt ufarlig og smertefritt for både barnet og deg.",
        descEn:
          "We distinguish between early ultrasound at weeks 6–10, weeks 11–14, and ultrasound from week 14+0. Early ultrasound at weeks 6–10 is performed with an internal probe. This is completely safe and painless for both you and the baby.",
      },
      {
        titleNo: "Fosterdiagnostikk",
        titleEn: "Prenatal diagnosis",
        descNo:
          "Dr. Ashi Ahmad har fått virksomhetsgodkjenning for å tilby fosterdiagnostikk til gravide kvinner. Ashi Ahmad er spesialist i gynekologi og fødselshjelp og har doktorgrad i epidemiologi og fødselshjelp.",
        descEn:
          "Dr Ashi Ahmad is authorised to provide prenatal diagnosis for pregnant women. She is a specialist in obstetrics and gynaecology and holds a doctorate in epidemiology and obstetrics.",
      },
    ],
  },

  graviditet: {
    titleNo: "Graviditet",
    titleEn: "Pregnancy",
    heroTitleNo: "Graviditet",
    heroTitleEn: "Pregnancy",
    heroLeadNo:
      "Vi ønsker deg velkommen til oppfølging gjennom hele svangerskapet. Vi tilbyr fosterdiagnostikk, som NIPT og tidlig ultralyd. Hos oss jobber fødselsleger, gynekologspesialister og fostermedisinere. Deres kompetanse er din trygghet.",
    heroLeadEn:
      "You are welcome to pregnancy care throughout your pregnancy. We offer prenatal diagnosis such as NIPT and early ultrasound. Our team includes obstetricians, specialist gynaecologists and fetal medicine specialists. Their expertise is your reassurance.",
    reasonsTitleNo: "Om graviditet",
    reasonsTitleEn: "About pregnancy",
    reasonsLeadNo:
      "Vi ønsker deg velkommen til oppfølging gjennom hele svangerskapet. Vi tilbyr fosterdiagnostikk, som NIPT og tidlig ultralyd. Hos oss jobber fødselsleger, gynekologspesialister og fostermedisinere. Deres kompetanse er din trygghet.",
    reasonsLeadEn:
      "You are welcome to pregnancy care throughout your pregnancy. We offer prenatal diagnosis such as NIPT and early ultrasound. Our team includes obstetricians, specialist gynaecologists and fetal medicine specialists. Their expertise is your reassurance.",
    midCtaNo: pregnancyCta.no,
    midCtaEn: pregnancyCta.en,
    promiseVariant: "standard",
    relatedSlugs: [
      "spontanabort",
      "fodselsskader",
      "fostermedisin",
      "ultralyd",
      "6-ukerskontroll",
      "nipt",
      "svangerskapsteam",
      "fosterdiagnostikk",
    ],
    reasons: [
      ["Ultralyd", "Ultrasound", "Ultralydundersøkelser gjennom hele svangerskapet.", "Ultrasound examinations throughout pregnancy."],
      ["NIPT", "NIPT", "Non-invasiv prenatal test for kromosomavvik.", "Non-invasive prenatal test for chromosomal conditions."],
      ["6-ukerskontroll", "Six-week postnatal check", "Kontroll med fokus på bekkenbunn og psykisk helse etter fødsel.", "A check focused on the pelvic floor and mental wellbeing after birth."],
      ["Traumatisk fødsel", "Traumatic birth", "Oppfølging og støtte etter en traumatisk fødselsopplevelse.", "Follow-up and support after a traumatic birth experience."],
      ["Fødselsangst", "Fear of childbirth", "Hjelp og veiledning ved fødselsangst.", "Help and guidance if you fear childbirth."],
      ["For partnere", "For partners", "Informasjon og støtte for partnere i svangerskapet.", "Information and support for partners during pregnancy."],
    ].map(([titleNo, titleEn, descNo, descEn]) => ({ titleNo, titleEn, descNo, descEn })),
  },

  spontanabort: {
    titleNo: "Spontanabort",
    titleEn: "Miscarriage",
    heroTitleNo: "Spontanabort",
    heroTitleEn: "Miscarriage",
    heroLeadNo:
      "I følge internasjonale retningslinjer blir dessverre ikke kvinner med spontanabort fulgt opp tilstrekkelig i Norge. Spontanabort oppleves for de aller fleste som et tap og da hjelper det lite å høre at det er naturens gang.",
    heroLeadEn:
      "According to international guidelines, women who experience miscarriage are unfortunately not followed up adequately in Norway. For most people, miscarriage is experienced as a loss — and being told that it is simply nature taking its course offers little comfort.",
    reasonsTitleNo: "Om spontanabort",
    reasonsTitleEn: "About miscarriage",
    midCtaNo: pregnancyCta.no,
    midCtaEn: pregnancyCta.en,
    promiseVariant: "standard",
    relatedSlugs: [
      "graviditet",
      "fodselsskader",
      "fostermedisin",
      "ultralyd",
      "6-ukerskontroll",
      "nipt",
      "svangerskapsteam",
      "fosterdiagnostikk",
    ],
    reasons: [],
  },

  svangerskapsteam: {
    titleNo: "Graviditetsoppfølging",
    titleEn: "Pregnancy care",
    heroTitleNo: "Graviditetsoppfølging",
    heroTitleEn: "Pregnancy care",
    heroLeadNo:
      "Vi gir deg helhetlig graviditetsoppfølging gjennom hele svangerskapet. Teamet består av erfarne gynekologer og fostermedisinere som samarbeider for å gi deg den tryggeste oppfølgingen.",
    heroLeadEn:
      "We provide comprehensive pregnancy care throughout your pregnancy. The team consists of experienced gynaecologists and fetal medicine specialists who work together to give you the safest possible follow-up.",
    reasonsTitleNo: "Om graviditetsoppfølging",
    reasonsTitleEn: "About pregnancy care",
    midCtaNo: pregnancyCta.no,
    midCtaEn: pregnancyCta.en,
    promiseVariant: "standard",
    relatedSlugs: [
      "graviditet",
      "spontanabort",
      "fodselsskader",
      "fostermedisin",
      "ultralyd",
      "6-ukerskontroll",
      "nipt",
      "fosterdiagnostikk",
    ],
    reasons: [],
  },
};
