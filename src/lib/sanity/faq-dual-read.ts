/**
 * Dual-read FAQ resolution: prefer FAQ Collection questions when usable,
 * otherwise fall back to a page-level legacy `faqs[]` list.
 * Used by Homepage, Treatment Category, Treatment, Specialist, Clinic, Services, and Pricing.
 */

export type ResolvedFaqItem = {
  question: string;
  answer: string;
};

function asPlainString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (typeof value === "object" && !Array.isArray(value) && "value" in value) {
    const inner = (value as { value: unknown }).value;
    if (typeof inner === "string") return inner;
  }
  if (Array.isArray(value)) {
    const first = value[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && "value" in first) {
      const inner = (first as { value: unknown }).value;
      if (typeof inner === "string") return inner;
    }
  }
  return "";
}

function mapFaqRows(value: unknown): ResolvedFaqItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const faq = row as { question?: unknown; answer?: unknown; sortOrder?: number };
      return {
        question: asPlainString(faq.question),
        answer: asPlainString(faq.answer),
        sortOrder: typeof faq.sortOrder === "number" ? faq.sortOrder : 0,
      };
    })
    .filter(
      (faq): faq is ResolvedFaqItem & { sortOrder: number } =>
        Boolean(faq?.question && faq.answer),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ question, answer }) => ({ question, answer }));
}

/**
 * Prefer FAQ Collection questions when the collection has at least one usable
 * Q&A; otherwise keep the legacy page `faqs[]` item list.
 * Empty collection reference (or collection with no valid questions) falls back.
 */
export function resolveFaqsFromCollection(
  faqCollection: unknown,
  legacyFaqs: unknown,
): ResolvedFaqItem[] {
  const collection =
    faqCollection && typeof faqCollection === "object"
      ? (faqCollection as { questions?: unknown; faqs?: unknown })
      : null;
  const collectionRows =
    Array.isArray(collection?.questions) && collection.questions.length > 0
      ? collection.questions
      : collection?.faqs;
  const fromCollection = mapFaqRows(collectionRows);
  if (fromCollection.length > 0) return fromCollection;
  return mapFaqRows(legacyFaqs);
}
