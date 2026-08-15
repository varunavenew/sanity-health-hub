#!/usr/bin/env npx tsx
/**
 * Fertility category landing parity vs https://avenewdemo.online/fertilitet
 *
 * DEVELOPER DATASET ONLY.
 *
 * Run from test/:
 *   npx tsx sanity/migrate-fertility-parity.ts
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient, DATASET, PROJECT_ID } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const ASSETS_DIR = path.resolve(__dirname, "../../src/assets");
const TMP_DIR = path.resolve(__dirname, "../../tmp/pw/fertility-media");
const FERT = "/fertilitet";
const AUDIENCE_BASE = `${FERT}/assistert-befruktning-for-par-og-single`;

console.log("▶ Fertility parity migration");
console.log(`  Project: ${PROJECT_ID}`);
console.log(`  Dataset: ${DATASET}`);
console.log(`  Dry run: ${DRY_RUN ? "yes" : "no"}`);

if (DATASET !== "developer") {
  console.error("ABORT: dataset is not developer");
  process.exit(1);
}

type I18nItem = {
  _type: string;
  _key?: string;
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

type SanityImageRef = {
  _type: "image";
  asset: { _type: "reference"; _ref: string };
};

type SanityFileRef = {
  _type: "file";
  asset: { _type: "reference"; _ref: string };
};

const uploadCache = new Map<string, string>();

async function download(url: string, dest: string): Promise<string> {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) return dest;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`  ↓ ${path.basename(dest)} (${buf.length} bytes)`);
  return dest;
}

async function uploadImageBuffer(
  filePath: string,
  filename: string,
): Promise<SanityImageRef> {
  if (uploadCache.has(filePath)) {
    return {
      _type: "image",
      asset: { _type: "reference", _ref: uploadCache.get(filePath)! },
    };
  }
  const buffer = fs.readFileSync(filePath);
  console.log(`  📸 Uploading ${filename}…`);
  const asset = await sanityClient.assets.upload("image", buffer, {
    filename,
    contentType: "image/jpeg",
  });
  uploadCache.set(filePath, asset._id);
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function uploadVideoFile(
  relativePath: string,
  filename: string,
): Promise<SanityFileRef | null> {
  const fullPath = path.join(ASSETS_DIR, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠ Video not found: ${relativePath}`);
    return null;
  }
  if (uploadCache.has(fullPath)) {
    return {
      _type: "file",
      asset: { _type: "reference", _ref: uploadCache.get(fullPath)! },
    };
  }
  const buffer = fs.readFileSync(fullPath);
  console.log(`  🎬 Uploading ${filename}…`);
  const asset = await sanityClient.assets.upload("file", buffer, {
    filename,
    contentType: "video/mp4",
  });
  uploadCache.set(fullPath, asset._id);
  return { _type: "file", asset: { _type: "reference", _ref: asset._id } };
}

function tagLink(no: string, en: string, href: string) {
  return {
    _key: `tag-${Math.random().toString(16).slice(2, 10)}`,
    _type: "categoryLandingSegmentTagLink",
    label: i18nString(no, en),
    href,
  };
}

async function main() {
  const refAssets = {
    audienceCouple:
      "https://avenewdemo.online/__l5e/assets-v1/51e2e0b1-c7d9-434e-82db-6b275d3da089/heterofilt-par.png",
    audienceWomen:
      "https://avenewdemo.online/__l5e/assets-v1/2fe7da95-1b5a-4ac3-ae26-b1ca748a98a1/to-kvinner.png",
    audienceSingleWoman:
      "https://avenewdemo.online/__l5e/assets-v1/7257a594-7bbc-46a9-b480-39417efb1786/singel-kvinne.png",
    audienceSingleMan:
      "https://avenewdemo.online/__l5e/assets-v1/4b7e73bf-97e2-4101-b5c8-a2475271dfa3/mannlig-fertilitet.png",
    whyLounge:
      "https://avenewdemo.online/assets/hero-clinic-lounge-DbDf08fL.jpg",
    heroPoster:
      "https://avenewdemo.online/__l5e/assets-v1/fd678617-7652-459d-bda5-472e273b8324/hero-fertilitet.jpg",
  };

  let imgCouple: SanityImageRef | null = null;
  let imgWomen: SanityImageRef | null = null;
  let imgSingleWoman: SanityImageRef | null = null;
  let imgSingleMan: SanityImageRef | null = null;
  let whyImage: SanityImageRef | null = null;
  let heroPoster: SanityImageRef | null = null;
  let heroVideo: SanityFileRef | null = null;

  if (!DRY_RUN) {
    const [p1, p2, p3, p4, pWhy, pPoster] = await Promise.all([
      download(refAssets.audienceCouple, path.join(TMP_DIR, "aud-couple.jpg")),
      download(refAssets.audienceWomen, path.join(TMP_DIR, "aud-women.jpg")),
      download(refAssets.audienceSingleWoman, path.join(TMP_DIR, "aud-single-w.jpg")),
      download(refAssets.audienceSingleMan, path.join(TMP_DIR, "aud-single-m.jpg")),
      download(refAssets.whyLounge, path.join(TMP_DIR, "why-lounge.jpg")),
      download(refAssets.heroPoster, path.join(TMP_DIR, "hero-poster.jpg")),
    ]);
    [imgCouple, imgWomen, imgSingleWoman, imgSingleMan, whyImage, heroPoster] =
      await Promise.all([
        uploadImageBuffer(p1, "fertilitet-audience-couple.jpg"),
        uploadImageBuffer(p2, "fertilitet-audience-women.jpg"),
        uploadImageBuffer(p3, "fertilitet-audience-single-woman.jpg"),
        uploadImageBuffer(p4, "fertilitet-audience-single-man.jpg"),
        uploadImageBuffer(pWhy, "fertilitet-why-lounge.jpg"),
        uploadImageBuffer(pPoster, "fertilitet-hero-poster.jpg"),
      ]);
    heroVideo =
      (await uploadVideoFile("hero1/hero/fertilitet-video.mp4", "fertilitet-hero-video.mp4")) ||
      (await uploadVideoFile("hero1/fertilitet-video.mp4", "fertilitet-hero-video.mp4")) ||
      (await uploadVideoFile("hero/fertilitet-video.mp4", "fertilitet-hero-video.mp4"));
  }

  const current = await sanityClient.fetch(`*[_id == "category-fertilitet"][0]{
    landingPage,
    pageSections,
    heroMedia,
    heroImage,
    heroVideo
  }`);

  if (!current?.landingPage) {
    console.error("ABORT: category-fertilitet.landingPage missing");
    process.exit(1);
  }

  const lp = current.landingPage as Record<string, any>;
  const segments = lp.segmentsSection || {};
  const existingSegments = Array.isArray(segments.segments) ? segments.segments : [];
  const hasDonor = existingSegments.some((s: any) =>
    JSON.stringify(s?.title || "").includes("donor"),
  );

  const donorSegment = {
    _key: "donor",
    id: "donor",
    title: i18nString("Jeg ønsker å bli donor", "I want to become a donor"),
    description: i18nText(
      "Som egg- eller sæddonor kan du hjelpe andre med å bli foreldre. Vi forklarer hva det innebærer, hvilke krav som gjelder og hvordan forløpet foregår — etter norsk lov.",
      "As an egg or sperm donor you can help others become parents. We explain what it involves, the requirements and how the process works — under Norwegian law.",
    ),
    tagLinks: [
      tagLink("Eggdonasjon", "Egg donation", `${FERT}/donorbehandling`),
      tagLink("Sæddonasjon", "Sperm donation", `${FERT}/donorbehandling`),
      tagLink("Donorbehandling", "Donor treatment", `${FERT}/donorbehandling`),
    ],
    ctaLabel: i18nString("Les mer", "Read more"),
    href: `${FERT}/donorbehandling`,
  };

  const nextSegments = hasDonor
    ? existingSegments
    : [...existingSegments, donorSegment];

  const whySection = {
    ...lp.whySection,
    title: i18nString(
      "Det beste fra to klinikker — samlet på ett sted.",
      "The best of two clinics — in one place.",
    ),
    description: i18nText(
      "Velkommen til CMedical komplette private fertilitetstilbud. Hos oss i CMedical får du erfaring, spisskompetanse og moderne teknologi samlet på ett sted – enten du er ny pasient eller kommer fra en annen klinikk.\n\nLivio Oslo er nå en del av CMedical. Som Norges eldste fertilitetsklinikk bringer Livio med seg lang erfaring og solid fagkompetanse inn i CMedical. Sammen tilbyr vi et helhetlig og trygt fertilitetstilbud, basert på kvalitet, kontinuitet og omsorg.",
      "Welcome to CMedical’s complete private fertility offering. With us you get experience, specialist expertise and modern technology in one place – whether you are a new patient or coming from another clinic.\n\nLivio Oslo is now part of CMedical. As Norway’s oldest fertility clinic, Livio brings long experience and solid clinical expertise into CMedical.",
    ),
    steps: [
      {
        _key: "w1",
        number: "01",
        title: i18nString("IVF og kirurgi på ett sted", "IVF and surgery in one place"),
        description: i18nText(
          "CMedical er den første klinikken i Norden med IVF-behandling og kirurgi samlet på ett sted, og vi tilbyr forskningsbasert behandling kombinert med personlig tilpasset oppfølging.",
          "CMedical is the first clinic in the Nordics with IVF treatment and surgery gathered in one place, offering research-based treatment with personalised follow-up.",
        ),
      },
      {
        _key: "w2",
        number: "02",
        title: i18nString(
          "Moderne teknologi i laboratoriet",
          "Modern technology in the laboratory",
        ),
        description: i18nText(
          "CMedical Fertilitet benytter det nyeste innen teknologiske hjelpemidler. Vi har en time-lapse-inkubator som sikrer nøyaktig og trygg overvåkning av befruktede egg, samt elektronisk overvåkning av alle steg i en prøverørsbehandling. Alle apparater er tilkoblet et eksternt alarmsystem som sikrer trygg oppbevaring av humane celler.",
          "CMedical Fertility uses the latest technological tools, including a time-lapse incubator and electronic monitoring of every step in IVF treatment.",
        ),
      },
      {
        _key: "w3",
        number: "03",
        title: i18nString("Tett oppfølging hele veien", "Close follow-up all the way"),
        description: i18nText(
          "Fertilitetsbehandling kan oppleves som både følelsesmessig og fysisk krevende. Synes du det er vanskelig å sette seg inn i alt? Du er ikke alene. Ta gjerne kontakt med oss for en uforpliktende og kostnadsfri prat med en av våre sykepleiere, eller bestill time til konsultasjon.",
          "Fertility treatment can feel emotionally and physically demanding. You are not alone — contact us for a free, no-obligation chat with a nurse, or book a consultation.",
        ),
      },
    ],
    footerLinkLabel: i18nString("Les mer om klinikken", "Learn more about the clinic"),
    footerLinkHref: "/om-oss",
    imageAlt: i18nString("CMedical fertilitetsklinikk", "CMedical fertility clinic"),
    ...(whyImage ? { image: whyImage } : {}),
  };

  const audiencesSection = {
    ...lp.audiencesSection,
    title: i18nString(
      "Assistert befruktning — for par og single",
      "Assisted fertilisation — for couples and singles",
    ),
    titleAccent: i18nString("", ""),
    readMoreLabel: i18nString("Les mer", "Read more"),
    audiences: [
      {
        _key: "a1",
        title: i18nString("Mann og kvinne i parforhold", "Man and woman as a couple"),
        description: i18nText(
          "Har dere prøvd en stund – uten å lykkes? Mange av parene som kommer til oss har forsøkt å bli gravide over tid. Uansett hvor dere er i prosessen, møter vi dere med forståelse og respekt.",
          "Have you been trying for a while without success? Many couples who come to us have tried for some time. Wherever you are in the process, we meet you with understanding and respect.",
        ),
        href: `${AUDIENCE_BASE}#mann-og-kvinne-i-parforhold`,
        ctaLabel: i18nString("Les mer", "Read more"),
        ...(imgCouple ? { image: imgCouple } : {}),
      },
      {
        _key: "a2",
        title: i18nString("To kvinner i parforhold", "Two women as a couple"),
        description: i18nText(
          "Flere og flere kvinner velger å få barn sammen som par. Hos oss møter dere et fagmiljø med erfaring, trygghet og forståelse for deres situasjon.",
          "More and more women choose to have children together as a couple. With us you meet a clinical team with experience, safety and understanding for your situation.",
        ),
        href: `${AUDIENCE_BASE}#to-kvinner-i-parforhold`,
        ctaLabel: i18nString("Les mer", "Read more"),
        ...(imgWomen ? { image: imgWomen } : {}),
      },
      {
        _key: "a3",
        title: i18nString("Singel kvinne", "Single woman"),
        description: i18nText(
          "Ønsker du å få barn på egen hånd – eller bevare muligheten for senere? Mange kvinner kommer til oss for å utforske mulighetene – enten de er klare for behandling, ønsker mer kunnskap, eller vurderer å fryse ned egg for fremtiden.",
          "Do you want a child on your own — or to preserve the option for later? Many women come to us to explore the possibilities.",
        ),
        href: `${AUDIENCE_BASE}#singel-kvinne`,
        ctaLabel: i18nString("Les mer", "Read more"),
        ...(imgSingleWoman ? { image: imgSingleWoman } : {}),
      },
      {
        _key: "a4",
        title: i18nString("Singel mann", "Single man"),
        description: i18nText(
          "Ønsker du å få innsikt i din fertilitet? En sædanalyse gir viktig informasjon om sædkvaliteten din – og kunnskap gjør det lettere å ta gode valg, både nå og i fremtiden.",
          "Want insight into your fertility? A semen analysis gives important information about sperm quality — and knowledge makes it easier to make good choices.",
        ),
        href: `${AUDIENCE_BASE}#singel-mann`,
        ctaLabel: i18nString("Les mer", "Read more"),
        ...(imgSingleMan ? { image: imgSingleMan } : {}),
      },
    ],
  };

  const expertAreasSection = {
    ...lp.expertAreasSection,
    title: i18nString(
      "Utredning og behandling — tilpasset din situasjon.",
      "Investigation and treatment — tailored to your situation.",
    ),
    areas: (lp.expertAreasSection?.areas || []).map((area: any) => {
      const titleNo = area?.title?.find?.((t: any) => t.language === "no")?.value || "";
      if (titleNo.includes("Nedfrys")) {
        return {
          ...area,
          title: i18nString("Nedfrysning av egg", "Egg freezing"),
        };
      }
      if (titleNo === "Mannlig infertilitet") {
        return {
          ...area,
          description: i18nText(
            "Utredning og behandling av mannlig fruktbarhet — i samarbeid med urologene våre.",
            "Investigation and treatment of male fertility — in collaboration with our urologists.",
          ),
        };
      }
      return area;
    }),
  };

  const symptomsSection = {
    ...lp.symptomsSection,
    items: (lp.symptomsSection?.items || []).map((item: any) => {
      const symptomNo =
        item?.symptom?.find?.((t: any) => t.language === "no")?.value || "";
      if (symptomNo.includes("PCOS") || symptomNo.includes("PMOS")) {
        return {
          ...item,
          symptom: i18nString(
            "Uregelmessig syklus eller mistanke om PMOS",
            "Irregular cycle or suspected PMOS",
          ),
        };
      }
      return item;
    }),
  };

  const servicesSection = {
    ...lp.servicesSection,
    groups: (lp.servicesSection?.groups || []).map((group: any, gi: number) => ({
      ...group,
      label:
        gi === 0
          ? i18nString("Undersøkelse og utredning", "Examination and investigation")
          : gi === 1
            ? i18nString("Behandling", "Treatment")
            : group.label,
      items: (group.items || []).map((item: any) => {
        const titleNo =
          item?.title?.find?.((t: any) => t.language === "no")?.value || "";
        if (titleNo.includes("Nedfrys")) {
          return {
            ...item,
            title: i18nString("Nedfrysning av egg", "Egg freezing"),
          };
        }
        return item;
      }),
    })),
  };

  const pageSections = (current.pageSections || []).map((section: any) => {
    if (section._type === "pageSectionSpecialists") {
      return {
        ...section,
        limit: 8,
        displayMode: "category",
        categorySlug: "fertilitet",
        variant: "carousel",
      };
    }
    if (section._type === "pageSectionBookingCta") {
      return {
        ...section,
        title: i18nString("Bestill time hos spesialist", "Book an appointment with a specialist"),
        subtitle: i18nString(
          "Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.",
          "Choose service, clinic and clinician – all in one simple booking.",
        ),
        primaryLabel: i18nString("Bestill time nå", "Book now"),
        primaryPath: "/booking?kategori=fertilitet",
        showSecondaryButton: true,
        secondaryLabel: i18nString("Ring oss", "Call us"),
        bookingCategory: {
          _type: "reference",
          _ref: "category-fertilitet",
        },
      };
    }
    return section;
  });

  // Ensure booking CTA exists
  if (!pageSections.some((s: any) => s._type === "pageSectionBookingCta")) {
    pageSections.push({
      _key: "ps-cta",
      _type: "pageSectionBookingCta",
      title: i18nString("Bestill time hos spesialist", "Book an appointment with a specialist"),
      subtitle: i18nString(
        "Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.",
        "Choose service, clinic and clinician – all in one simple booking.",
      ),
      primaryLabel: i18nString("Bestill time nå", "Book now"),
      primaryPath: "/booking?kategori=fertilitet",
      showSecondaryButton: true,
      secondaryLabel: i18nString("Ring oss", "Call us"),
    });
  }

  const heroMedia =
    heroVideo || heroPoster
      ? {
          _type: "media",
          mediaType: "video",
          videoSource: "upload",
          ...(heroVideo ? { videoFile: heroVideo } : {}),
          ...(heroPoster
            ? { image: heroPoster }
            : current.heroMedia?.image
              ? { image: current.heroMedia.image }
              : {}),
        }
      : current.heroMedia;

  const landingPage = {
    ...lp,
    segmentsSection: {
      ...segments,
      segments: nextSegments,
    },
    whySection,
    audiencesSection,
    expertAreasSection,
    symptomsSection,
    servicesSection,
    sectionOrder: [
      "segments",
      "why",
      "audiences",
      "expertAreas",
      "symptoms",
      "services",
      "support",
      "results",
      "reviews",
      "spotlight",
      "specialists",
    ],
  };

  const patch: Record<string, unknown> = {
    landingPage,
    pageSections,
    faqCollection: null,
    faqs: [],
    faqSectionTitle: null,
  };
  if (heroMedia) patch.heroMedia = heroMedia;
  if (heroPoster) patch.heroImage = heroPoster;
  if (heroVideo) patch.heroVideo = heroVideo;

  if (DRY_RUN) {
    console.log("Would patch category-fertilitet:");
    console.log("  + donor segment:", !hasDonor);
    console.log("  + why / audiences / expert / symptoms / services");
    console.log("  + booking CTA copy");
    console.log("  + unset faqCollection");
    console.log("  + hero media video:", Boolean(heroVideo));
    return;
  }

  await sanityClient
    .patch("category-fertilitet")
    .set(patch)
    .unset(["faqCollection", "faqSectionTitle"])
    .commit();

  // Also patch draft twin if present
  const draft = await sanityClient.fetch(
    `*[_id == "drafts.category-fertilitet"][0]._id`,
  );
  if (draft) {
    await sanityClient
      .patch("drafts.category-fertilitet")
      .set(patch)
      .unset(["faqCollection", "faqSectionTitle"])
      .commit();
    console.log("✓ Also patched drafts.category-fertilitet");
  }

  const verify = await sanityClient.fetch(`*[_id == "category-fertilitet"][0]{
    "audienceTitles": landingPage.audiencesSection.audiences[].title[language=="no"][0].value,
    "whySteps": landingPage.whySection.steps[].title[language=="no"][0].value,
    "segmentTitles": landingPage.segmentsSection.segments[].title[language=="no"][0].value,
    "expertTitle": landingPage.expertAreasSection.title[language=="no"][0].value,
    "bookingTitle": pageSections[_type=="pageSectionBookingCta"][0].title[language=="no"][0].value,
    "faqCollection": faqCollection,
    "heroMediaType": heroMedia.mediaType,
    "heroFile": heroMedia.file.asset->url,
    "specLimit": pageSections[_type=="pageSectionSpecialists"][0].limit
  }`);
  console.log("✓ Patched category-fertilitet on developer");
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
