/** English copy for category landing seeds (pairs with categoryPageContent NO). */

export type CategoryEnCopy = {
  title: string;
  subtitle: string;
  description: string;
  longDescription?: string;
  servicesHeading: string;
  servicesIntro: string;
  groups: Array<{ label: string; serviceNames: string[] }>;
  journey: Array<{ title: string; body: string }>;
  closingTitle: string;
  closingBody: string;
  closingCta: string;
  segmentsEyebrow: string;
  segmentsTitle: string;
  segmentsTitleLine2: string;
  whyTitle: string;
  whyDescription: string;
  specialistsTitle: string;
  specialistsSeeAll: string;
};

const serviceEn: Record<string, string> = {
  "Gynekologisk undersøkelse": "Gynecological examination",
  "Urinlekkasje": "Urinary incontinence",
  "Endometriose": "Endometriosis",
  "Overgangsalder": "Menopause",
  "Vaginale fremfall": "Pelvic organ prolapse",
  "Blødningsforstyrrelser": "Bleeding disorders",
  "Celleforandringer": "Cell changes",
  "Cyster på eggstokkene": "Ovarian cysts",
  "Fjerne livmor": "Hysterectomy",
  "PMS og PMDD": "PMS and PMDD",
  "Labiaplastikk": "Labiaplasty",
  "Vulvalidelser": "Vulvar conditions",
  "Gynekologisk kirurgi": "Gynecological surgery",
  "Robotassistert kirurgi": "Robot-assisted surgery",
  "Infertilitet": "Infertility",
  "Assistert befruktning": "Assisted fertilisation",
  "Assistert befruktning med donor": "Donor treatment",
  "Eggfrys": "Egg freezing",
  "Hysteroskopi": "Hysteroscopy",
  "IVF": "IVF",
  "Vårt team": "Our team",
  "Sædanalyse": "Semen analysis",
  "Blære og urinveier": "Bladder and urinary tract",
  "Forhud": "Foreskin",
  "Mannlig infertilitet": "Male infertility",
  "Nyrer": "Kidneys",
  "Prostata": "Prostate",
  "Refertilisering": "Reversal of sterilisation",
  "Sterilisering": "Sterilisation",
  "Testikler og pung": "Testicles and scrotum",
  "Fot og ankel": "Foot and ankle",
  "Hofte": "Hip",
  "Hånd og albue": "Hand and elbow",
  "Kne": "Knee",
  "Ultralyd": "Ultrasound",
  "NIPT": "NIPT",
  "Fosterdiagnostikk": "Fetal diagnostics",
  "Svangerskapsteam": "Pregnancy team",
  "Endokrinologi": "Endocrinology",
  "Ernæringsfysiolog": "Nutritionist",
  "Hudlege": "Dermatology",
  "Hudhelse": "Skin health",
  "Gastrokirurgi": "Gastrointestinal surgery",
  "Overvektskirurgi": "Bariatric surgery",
  "Plastikkirurgi": "Plastic surgery",
  "Åreknuter": "Varicose veins",
  "Osteopati": "Osteopathy",
  "Revmatologi": "Rheumatology",
  "Psykologi": "Psychology",
  "Sexologi": "Sexology",
};

export function translateServiceName(no: string): string {
  return serviceEn[no] ?? no;
}

/** Norwegian segment headings (pairs with segments* fields on CategoryEnCopy). */
export const categorySegmentsNo: Record<
  string,
  { eyebrow: string; title: string; titleLine2: string }
> = {
  gynekologi: {
    eyebrow: "Hvordan kan vi hjelpe?",
    title: "Finn riktig vei",
    titleLine2: "for dine kvinnehelsebehov.",
  },
  urologi: {
    eyebrow: "Hvordan kan vi hjelpe?",
    title: "Urologisk behandling",
    titleLine2: "for kvinner og menn.",
  },
  ortopedi: {
    eyebrow: "Våre spesialiteter",
    title: "Ortopedisk behandling",
    titleLine2: "fra fot til skulder.",
  },
  graviditet: {
    eyebrow: "Svangerskapstjenester",
    title: "Omsorg for deg",
    titleLine2: "og barnet ditt.",
  },
  "flere-fagomrader": {
    eyebrow: "Fagområder",
    title: "Flere fagfelt",
    titleLine2: "under ett tak.",
  },
};

export const categoryLandingEn: Record<string, CategoryEnCopy> = {
  gynekologi: {
    title: "Gynecology",
    subtitle: "No waiting list • No referral needed",
    description:
      "Welcome to CMedical Women's Health and our specialists in gynecology, fertility and surgery. We offer focused, comprehensive care with direct access to the right expertise.",
    longDescription:
      "You will meet gynecologists who specialize in what they do best, with multidisciplinary care when needed.",
    servicesHeading: "Everything under one roof",
    servicesIntro:
      "Our leading gynecologists work within these areas:",
    groups: [
      { label: "Routine care", serviceNames: ["Gynecological examination", "Cell changes"] },
      {
        label: "When something feels wrong",
        serviceNames: ["Endometriosis", "Bleeding disorders", "Ovarian cysts", "PMS and PMDD", "Vulvar conditions"],
      },
      { label: "Life transitions", serviceNames: ["Urinary incontinence", "Menopause", "Pelvic organ prolapse"] },
      {
        label: "When surgery is the answer",
        serviceNames: ["Hysterectomy", "Labiaplasty", "Gynecological surgery", "Robot-assisted surgery"],
      },
    ],
    journey: [
      { title: "Book when it suits you", body: "Online booking 24/7. No referral. Short waiting times." },
      { title: "A conversation that matters", body: "A gynecologist focused on your needs. We review history, symptoms and goals." },
      { title: "Assessment and plan", body: "A typical assessment takes about 30 minutes, with a clear plan in plain language." },
      { title: "Multidisciplinary follow-up", body: "Fertility, urology, nutrition, osteopathy, physiotherapy and psychology when needed." },
    ],
    closingTitle: "Ready when you are",
    closingBody: "Booking takes two minutes. No referral. We send confirmation and preparation details.",
    closingCta: "Book gynecology appointment",
    segmentsEyebrow: "How can we help?",
    segmentsTitle: "Find the right path",
    segmentsTitleLine2: "for your women's health needs.",
    whyTitle: "Why CMedical for gynecology",
    whyDescription: "Leading specialists and multidisciplinary teams in one place.",
    specialistsTitle: "Meet our gynecology specialists",
    specialistsSeeAll: "See all gynecology specialists",
  },
  urologi: {
    title: "Urology",
    subtitle: "No waiting list • No referral needed",
    description:
      "Urology covers conditions of the urinary tract and male reproductive organs. Our specialists can help with pain, voiding problems or a general check-up.",
    longDescription: "CMedical has some of the leading urology specialists in the Nordics.",
    servicesHeading: "Urology specialists",
    servicesIntro: "Our specialists work in these areas:",
    groups: [
      { label: "Bladder and urine", serviceNames: ["Bladder and urinary tract", "Kidneys"] },
      { label: "Men's health", serviceNames: ["Foreskin", "Testicles and scrotum", "Male infertility"] },
      { label: "Prostate", serviceNames: ["Prostate", "Robot-assisted surgery"] },
      { label: "Family planning", serviceNames: ["Sterilisation", "Reversal of sterilisation"] },
    ],
    journey: [
      { title: "Book when it suits you", body: "Online booking 24/7. No referral. Short waiting times." },
      { title: "Consultation with a specialist", body: "A urologist focused on your condition and history." },
      { title: "Assessment and plan", body: "Clinical examination and a clear treatment plan." },
      { title: "Treatment and follow-up", body: "From conservative care to advanced urologic surgery." },
    ],
    closingTitle: "Ready when you are",
    closingBody: "Booking takes two minutes. No referral.",
    closingCta: "Book urology appointment",
    segmentsEyebrow: "How can we help?",
    segmentsTitle: "Urology care",
    segmentsTitleLine2: "for women and men.",
    whyTitle: "Why CMedical for urology",
    whyDescription: "Nordic-leading expertise and short waiting times.",
    specialistsTitle: "Meet our urology specialists",
    specialistsSeeAll: "See all urology specialists",
  },
  ortopedi: {
    title: "Orthopedics",
    subtitle: "No waiting list • No referral needed",
    description:
      "Orthopedics treats muscles, bones, joints and tendons. Our surgeons are experts in shoulder, hand, foot and elbow conditions.",
    longDescription: "Some of the country's leading surgeons treat advanced cases here.",
    servicesHeading: "Experienced specialists",
    servicesIntro: "Our orthopedists specialize in:",
    groups: [
      { label: "Lower limb", serviceNames: ["Foot and ankle", "Knee"] },
      { label: "Hip and pelvis", serviceNames: ["Hip"] },
      { label: "Upper limb", serviceNames: ["Hand and elbow"] },
      { label: "Complex cases", serviceNames: ["Hip", "Knee"] },
    ],
    journey: [
      { title: "Book when it suits you", body: "Online booking. No referral. Short waits, including second opinions." },
      { title: "Clinical examination", body: "An experienced orthopedist assesses your injury or condition." },
      { title: "Diagnosis and plan", body: "Modern imaging and an updated treatment plan." },
      { title: "Treatment and rehab", body: "Close follow-up through surgery and physiotherapy." },
    ],
    closingTitle: "Ready when you are",
    closingBody: "Booking takes two minutes. No referral.",
    closingCta: "Book orthopedics appointment",
    segmentsEyebrow: "Our specialties",
    segmentsTitle: "Orthopedic care",
    segmentsTitleLine2: "from foot to shoulder.",
    whyTitle: "Why CMedical for orthopedics",
    whyDescription: "University-hospital level expertise in a private setting.",
    specialistsTitle: "Meet our orthopedic specialists",
    specialistsSeeAll: "See all orthopedic specialists",
  },
  graviditet: {
    title: "Pregnancy and fetal medicine",
    subtitle: "Short waiting times • No referral needed",
    description:
      "Safe, holistic pregnancy care with experienced fetal medicine specialists, midwives and psychologists.",
    longDescription: "From early ultrasound and NIPT to postnatal follow-up.",
    servicesHeading: "Support through your journey",
    servicesIntro: "Services for pregnancy and after birth:",
    groups: [
      { label: "Early pregnancy", serviceNames: ["Ultrasound", "NIPT"] },
      { label: "Diagnostics", serviceNames: ["Fetal diagnostics"] },
      { label: "Holistic care", serviceNames: ["Pregnancy team"] },
    ],
    journey: [
      { title: "Book the appointment you need", body: "Single visits or full pregnancy pathways. No referral." },
      { title: "Safe assessment", body: "Fetal medicine specialists and midwives take their time." },
      { title: "A plan for you", body: "Based on your wishes and stage of pregnancy." },
      { title: "Holistic follow-up", body: "Psychology, physiotherapy and postnatal care when needed." },
    ],
    closingTitle: "Ready when you are",
    closingBody: "Booking takes two minutes. No referral.",
    closingCta: "Book appointment",
    segmentsEyebrow: "Pregnancy services",
    segmentsTitle: "Care for you",
    segmentsTitleLine2: "and your baby.",
    whyTitle: "Why CMedical for pregnancy",
    whyDescription: "Experienced fetal medicine team and flexible appointments.",
    specialistsTitle: "Meet our pregnancy specialists",
    specialistsSeeAll: "See all pregnancy specialists",
  },
  "flere-fagomrader": {
    title: "More specialties",
    subtitle: "Short waiting times • No referral needed",
    description:
      "Leading specialists in gastroenterology, rheumatology, dermatology, nutrition, vascular surgery, osteopathy, psychology and sexology.",
    longDescription: "Specialists often work in cross-disciplinary teams. Contact us with any questions.",
    servicesHeading: "Specialists across disciplines",
    servicesIntro: "Leading experts in:",
    groups: [
      { label: "Skin, hormones and nutrition", serviceNames: ["Endocrinology", "Nutritionist", "Dermatology", "Skin health"] },
      {
        label: "Surgery and gastroenterology",
        serviceNames: ["Gastrointestinal surgery", "Bariatric surgery", "Plastic surgery", "Robot-assisted surgery"],
      },
      { label: "Body and movement", serviceNames: ["Osteopathy", "Rheumatology", "Varicose veins"] },
      { label: "Mental health and intimacy", serviceNames: ["Psychology", "Sexology"] },
    ],
    journey: [
      { title: "Book when it suits you", body: "Online booking. No referral." },
      { title: "Talk to the right specialist", body: "Focused expertise in your area of need." },
      { title: "Assessment and plan", body: "A holistic view and a concrete plan." },
      { title: "Cross-disciplinary care", body: "Teams across specialties when needed." },
    ],
    closingTitle: "Ready when you are",
    closingBody: "Booking takes two minutes. No referral.",
    closingCta: "Book appointment",
    segmentsEyebrow: "Specialties",
    segmentsTitle: "More areas",
    segmentsTitleLine2: "of expertise.",
    whyTitle: "Why CMedical",
    whyDescription: "Nordic-leading specialists across disciplines.",
    specialistsTitle: "Meet our specialists",
    specialistsSeeAll: "See all specialists",
  },
};
