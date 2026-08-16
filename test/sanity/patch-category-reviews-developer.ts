#!/usr/bin/env npx tsx
/**
 * Developer-only: «Ord vi er takknemlige for» reviews for all category landings.
 * NO verbatim from avenewdemo + EN translations.
 * Stars + Google/Legelisten badges are rendered by the frontend from each review's `source`.
 *
 *   cd test && npx tsx sanity/patch-category-reviews-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

type I18nItem = {
  _type: string;
  _key: string;
  language: string;
  value: string;
};

function i18nString(no: string, en: string): I18nItem[] {
  return [
    { _type: "internationalizedArrayStringValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayStringValue", _key: "en", language: "en", value: en },
  ];
}

function i18nText(no: string, en: string): I18nItem[] {
  return [
    { _type: "internationalizedArrayTextValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayTextValue", _key: "en", language: "en", value: en },
  ];
}

function review(
  key: string,
  textNo: string,
  textEn: string,
  author: string,
  dateNo: string,
  dateEn: string,
  source: "google" | "legelisten" = "google",
) {
  return {
    _key: key,
    _type: "categoryLandingReview",
    text: i18nText(textNo, textEn),
    author,
    date: i18nString(dateNo, dateEn),
    source,
  };
}

const SECTION_TITLE = i18nString(
  "Ord vi er takknemlige for",
  "Words we are grateful for",
);

const PATCHES: Array<{ id: string; reviews: ReturnType<typeof review>[] }> = [
  {
    id: "category-fertilitet",
    reviews: [
      review(
        "r1",
        "Vi følte oss trygge fra første møte. De tok seg virkelig tid til å bli kjent med oss og vårt utgangspunkt — og det betød alt.",
        "We felt safe from the first meeting. They really took time to get to know us and our starting point — and that meant everything.",
        "Hilde",
        "IVF-forløp 2024",
        "IVF journey 2024",
      ),
      review(
        "r2",
        "Profesjonelle, varme og tydelige hele veien. Endelig følte vi at noen lyttet og hadde en plan vi kunne forstå.",
        "Professional, warm and clear all the way. Finally we felt that someone listened and had a plan we could understand.",
        "Marte og Jonas",
        "1 måned siden",
        "1 month ago",
        "legelisten",
      ),
      review(
        "r3",
        "Korte ventetider, dyktige spesialister og et tilbud som faktisk er tilpasset oss. Anbefales på det sterkeste.",
        "Short waiting times, skilled specialists and an offer that is truly tailored to us. Highly recommended.",
        "Sara L.",
        "3 måneder siden",
        "3 months ago",
      ),
    ],
  },
  {
    id: "category-gynekologi",
    reviews: [
      review(
        "r1",
        "Trygg og god konsultasjon. Endelig en gynekolog som tok seg tid og forsto plagene mine.",
        "Safe and good consultation. Finally a gynaecologist who took time and understood my symptoms.",
        "Anne K.",
        "2 måneder siden",
        "2 months ago",
      ),
      review(
        "r2",
        "Fryktet konsultasjonen, men ble møtt med varme og kompetanse. Anbefales på det varmeste.",
        "I feared the consultation, but was met with warmth and competence. Highly recommended.",
        "Marit S.",
        "3 måneder siden",
        "3 months ago",
        "legelisten",
      ),
      review(
        "r3",
        "Veldig fornøyd. Korte ventetider, dyktig spesialist og tydelige svar — slik kvinnehelse bør være.",
        "Very satisfied. Short waiting times, skilled specialist and clear answers — this is how women's health should be.",
        "Ingrid L.",
        "1 måned siden",
        "1 month ago",
      ),
    ],
  },
  {
    id: "category-urologi",
    reviews: [
      review(
        "r1",
        "Endelig en urolog som tok seg tid til å forklare. Trygt og profesjonelt fra første minutt.",
        "Finally a urologist who took time to explain. Safe and professional from the first minute.",
        "Per H.",
        "1 måned siden",
        "1 month ago",
      ),
      review(
        "r2",
        "Rask time, grundig undersøkelse og tydelig plan. Slik skal det være.",
        "Quick appointment, thorough examination and a clear plan. This is how it should be.",
        "Jan E.",
        "3 måneder siden",
        "3 months ago",
        "legelisten",
      ),
      review(
        "r3",
        "Vasektomi gjort på under en time, helt smertefritt. Veldig fornøyd med oppfølgingen.",
        "Vasectomy done in under an hour, completely painless. Very happy with the follow-up.",
        "Tom S.",
        "2 måneder siden",
        "2 months ago",
      ),
    ],
  },
  {
    id: "category-ortopedi",
    reviews: [
      review(
        "r1",
        "Endelig fikk jeg en klar diagnose og en plan. Ortopeden tok seg tid og forklarte alt grundig.",
        "Finally I got a clear diagnosis and a plan. The orthopaedic specialist took time and explained everything thoroughly.",
        "Knut R.",
        "2 måneder siden",
        "2 months ago",
      ),
      review(
        "r2",
        "Operert på kneet og tilbake i trening på 8 uker. Profesjonelt fra start til slutt.",
        "Knee surgery and back in training in 8 weeks. Professional from start to finish.",
        "Mari T.",
        "3 måneder siden",
        "3 months ago",
        "legelisten",
      ),
      review(
        "r3",
        "Second opinion som forandret alt. Anbefales på det varmeste.",
        "A second opinion that changed everything. Highly recommended.",
        "Lars B.",
        "1 måned siden",
        "1 month ago",
      ),
    ],
  },
  {
    id: "category-graviditet",
    reviews: [
      review(
        "r1",
        "Jeg ble møtt med ro og tid. Endelig en jordmor som husket meg fra forrige time og som så hele situasjonen.",
        "I was met with calm and time. Finally a midwife who remembered me from the previous appointment and who saw the whole situation.",
        "Ingrid",
        "Svangerskap 2025",
        "Pregnancy 2025",
      ),
      review(
        "r2",
        "Vi tok NIPT og tidlig ultralyd her, og fikk en grundig forklaring vi forsto. Trygghet i en sårbar tid.",
        "We had NIPT and an early ultrasound here, and got a thorough explanation we understood. Reassurance in a vulnerable time.",
        "Anna og Henrik",
        "2 måneder siden",
        "2 months ago",
        "legelisten",
      ),
      review(
        "r3",
        "Etter en tøff fødsel forrige gang trengte jeg samtaler før vi turte å prøve igjen. Det betød alt.",
        "After a tough birth last time I needed conversations before we dared to try again. It meant everything.",
        "Kine M.",
        "4 måneder siden",
        "4 months ago",
      ),
    ],
  },
  {
    id: "category-flere-fagomrader",
    reviews: [
      review(
        "r1",
        "Endelig en psykolog som virkelig lyttet. Jeg følte meg sett fra første time.",
        "Finally a psychologist who really listened. I felt seen from the first session.",
        "Hanne L.",
        "1 måned siden",
        "1 month ago",
      ),
      review(
        "r2",
        "Kombinasjonen av ernæringsfysiolog og endokrinolog forandret hverdagen min.",
        "The combination of a clinical nutritionist and an endocrinologist changed my everyday life.",
        "Eva M.",
        "3 måneder siden",
        "3 months ago",
        "legelisten",
      ),
      review(
        "r3",
        "Hudlegen var grundig og forklarte alt. Trygg behandling i hyggelige omgivelser.",
        "The dermatologist was thorough and explained everything. Safe treatment in pleasant surroundings.",
        "Sondre K.",
        "2 måneder siden",
        "2 months ago",
      ),
    ],
  },
];

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  const summary: Record<string, unknown> = {};

  for (const patch of PATCHES) {
    const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
      id: patch.id,
    });
    if (!exists) throw new Error(`Missing document ${patch.id}`);

    await sanityClient
      .patch(patch.id)
      .unset(["landingPage.reviewsSection.eyebrow"])
      .set({
        "landingPage.reviewsSection.title": SECTION_TITLE,
        "landingPage.reviewsSection.reviews": patch.reviews,
      })
      .commit({ autoGenerateArrayKeys: true });

    summary[patch.id] = await sanityClient.fetch(
      `*[_id==$id][0]{
        "titleNo": landingPage.reviewsSection.title[language=="no"][0].value,
        "titleEn": landingPage.reviewsSection.title[language=="en"][0].value,
        "eyebrow": landingPage.reviewsSection.eyebrow,
        "reviews": landingPage.reviewsSection.reviews[]{
          author,
          "dateNo": date[language=="no"][0].value,
          "dateEn": date[language=="en"][0].value,
          "textNo": text[language=="no"][0].value
        }
      }`,
      { id: patch.id },
    );
    console.log(`✓ ${patch.id}`);
  }

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
