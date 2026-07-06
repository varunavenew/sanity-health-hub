import type { ImageRef } from "@/lib/media";

/** Linked treatmentCategory from Sanity (Tilknyttede kategorier). */
export interface SpecialistSanityCategory {
  categoryId: string;
  slug: string;
  title: string;
  categoryNumericId?: number;
  heroImage?: string;
}

export type SpecialistCategory =
  | "gynekologi"
  | "fertilitet"
  | "urologi"
  | "ortopedi"
  | "annet";

export interface SpecialistFaq {
  question: string;
  answer: string;
  category?: string;
}

export interface SpecialistPatientReview {
  id: string;
  name: string;
  text: string;
  rating: number;
  date?: string;
}

export interface SpecialistRelatedSection {
  eyebrow?: string;
  heading?: string;
  ctaLabel?: string;
  ctaPath?: string;
  specialists?: Specialist[];
}

export interface SpecialistClinicRef {
  label: string;
  slug: string;
}

export type SpecialistBioBlock =
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; alt?: string; caption?: string }
  | { type: "video"; src: string; poster?: string; caption?: string }
  | { type: "embed"; url: string; caption?: string }
  | { type: "link"; href: string; label: string; description?: string };

export interface Specialist {
  _createdAt?: string;
  name: string;
  title: string;
  subtitle?: string;
  expertise: string[];
  image: ImageRef;
  category: SpecialistCategory;
  slug: string;
  bio?: string;
  /** Full biografi from Sanity `bio` (portable text). Takes precedence over shortBio when set. */
  bioBody?: unknown[];
  richBio?: SpecialistBioBlock[];
  education?: string;
  experience?: string;
  languages?: string[];
  clinics?: string[];
  clinicRefs?: SpecialistClinicRef[];
  /** Categories linked in Sanity Studio — drives inline booking section. */
  sanityCategories?: SpecialistSanityCategory[];
  /** Metodika wbactivitygroup IDs from Sanity (e.g. 8, 10). */
  bookingCategoryIds?: number[];
  sortOrder?: number;
  /** FAQ section heading from Sanity (`faqSectionTitle`). */
  faqSectionTitle?: string;
  /** FAQ rows selected in Studio. */
  faqs?: SpecialistFaq[];
  /** Google reviews selected in Studio for «Hva pasientene sier». */
  patientReviews?: SpecialistPatientReview[];
  /** CMS-driven «Andre spesialister» section (optional). */
  relatedSpecialistsSection?: SpecialistRelatedSection;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: unknown;
    noIndex?: boolean;
  };
  geoSummary?: string;
}
