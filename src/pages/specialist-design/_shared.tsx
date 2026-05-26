import { ExternalLink, Quote, User } from "lucide-react";
import { BioBlock, Specialist } from "@/data/specialists";
import { PartialStars } from "@/components/ui/partial-stars";
import { googleReviews, type GoogleReview } from "@/data/googleReviews";

/** Resolve bio blocks the same way SpecialistBio does (richBio first, fallback to text). */
export function getBioBlocks(specialist: Specialist): BioBlock[] {
  if (specialist.richBio && specialist.richBio.length > 0) return specialist.richBio;
  return (specialist.bio?.split("\n\n") || [])
    .filter(Boolean)
    .map((text) => ({ type: "paragraph" as const, text }));
}

/** Render a single rich bio block in a chosen "tone". */
export function RichBioBlock({
  block,
  tone = "light",
}: {
  block: BioBlock;
  tone?: "light" | "warm";
}) {
  const text = tone === "warm" ? "text-brand-dark/85" : "text-foreground/85";
  const muted = tone === "warm" ? "text-brand-dark/55" : "text-muted-foreground";
  const border = tone === "warm" ? "border-brand-dark/15" : "border-foreground/10";
  switch (block.type) {
    case "paragraph":
      return (
        <p className={`text-base md:text-lg font-light leading-[1.85] ${text}`}>
          {block.text}
        </p>
      );
    case "image":
      return (
        <figure className="my-2">
          <img
            src={block.src}
            alt={block.alt || ""}
            loading="lazy"
            className="w-full rounded-sm object-cover"
          />
          {block.caption && (
            <figcaption className={`mt-2 text-xs font-light ${muted}`}>
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "video":
      return (
        <figure className="my-2">
          <video src={block.src} poster={block.poster} controls className="w-full rounded-sm" />
          {block.caption && (
            <figcaption className={`mt-2 text-xs font-light ${muted}`}>
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "embed":
      return (
        <figure className="my-2 aspect-video">
          <iframe
            src={block.url}
            className="w-full h-full rounded-sm"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={block.caption || "Innebygd video"}
          />
          {block.caption && (
            <figcaption className={`mt-2 text-xs font-light ${muted}`}>
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "link":
      return (
        <a
          href={block.href}
          target={block.href.startsWith("http") ? "_blank" : undefined}
          rel={block.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className={`group block p-5 border rounded-sm transition-colors ${border} hover:border-foreground/40`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-normal text-foreground">{block.label}</p>
              {block.description && (
                <p className={`text-xs font-light mt-1 ${muted}`}>{block.description}</p>
              )}
            </div>
            <ExternalLink className="w-4 h-4 text-foreground/40 group-hover:text-foreground transition-colors shrink-0 mt-0.5" />
          </div>
        </a>
      );
  }
}

const categoryKeywords: Record<string, string[]> = {
  gynekologi: ["gynekolog", "kvinne", "ultralyd"],
  fertilitet: ["fertil", "ivf", "egg", "befruktning", "embryo"],
  urologi: ["urolog", "prostata"],
  ortopedi: ["skulder", "kne", "hånd", "fot", "ortoped", "kirurg"],
  annet: [],
};

/** Same matching as SpecialistReviews so demos share the real source of truth. */
export function getRelevantReviews(specialist: Specialist): GoogleReview[] {
  const firstName = specialist.name.split(" ")[0].toLowerCase();
  const lastName = specialist.name.split(" ").slice(-1)[0].toLowerCase();
  const nameMatched = googleReviews.filter(
    (r) =>
      r.text.toLowerCase().includes(firstName) ||
      r.text.toLowerCase().includes(lastName)
  );
  if (nameMatched.length >= 3) return nameMatched.slice(0, 6);
  const keywords = categoryKeywords[specialist.category] || [];
  const catMatched = googleReviews.filter((r) =>
    keywords.some((kw) => r.text.toLowerCase().includes(kw))
  );
  const combined = [...nameMatched];
  for (const r of catMatched) {
    if (!combined.includes(r) && combined.length < 3) combined.push(r);
  }
  for (const r of googleReviews) {
    if (combined.length >= 3) break;
    if (!combined.includes(r)) combined.push(r);
  }
  return combined.slice(0, 3);
}

export const SHARED_FAQS = [
  { id: "henvisning", question: "Henvisning", answer: "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss. Hvis du har henvisning fra fastlege, ta den gjerne med til konsultasjonen." },
  { id: "ventetid", question: "Ventetid", answer: "Vi tilbyr korte ventetider. De fleste får time innen 1-3 dager, avhengig av behandlingstype og tilgjengelighet." },
  { id: "sykemelding", question: "Sykemelding", answer: "Våre spesialister kan skrive sykemelding hvis det er medisinsk grunnlag for det. Dette vurderes individuelt i forbindelse med konsultasjonen." },
  { id: "utredning", question: "Utredning", answer: "Vi tilbyr grundig utredning innen alle våre tjenester. Utredningen tilpasses din situasjon og kan inkludere samtale, undersøkelse, blodprøver og bildediagnostikk." },
  { id: "forsikring", question: "Forsikring", answer: "Vi har avtale med de fleste forsikringsselskaper. Kontakt ditt forsikringsselskap for å sjekke hva din forsikring dekker, og be om å få time hos CMedical." },
];

export function StarsRow({ rating }: { rating: number }) {
  return <PartialStars rating={rating} />;
}

export function ReviewCard({
  review,
  tone = "light",
}: {
  review: GoogleReview;
  tone?: "light" | "white";
}) {
  const isAnonymous = review.name === "Anonym";
  const text = review.text.length > 200 ? review.text.slice(0, 200) + "…" : review.text;
  const bg = tone === "white" ? "bg-white" : "bg-brand-light";
  return (
    <article className={`p-7 rounded-sm border border-brand-dark/10 ${bg}`}>
      <Quote className="w-7 h-7 text-brand-dark/10 rotate-180 mb-3" aria-hidden="true" />
      <div className="mb-3"><PartialStars rating={review.rating} /></div>
      <p className="text-brand-dark font-light leading-relaxed text-sm mb-5">"{text}"</p>
      <div className="pt-4 border-t border-brand-dark/10 flex items-center justify-between">
        <p className={`text-brand-dark text-sm ${isAnonymous ? "italic text-brand-dark/60 font-light" : "font-normal"} flex items-center gap-2`}>
          {isAnonymous && <User className="w-3.5 h-3.5" />}
          {review.name}
        </p>
        <span className="text-xs text-brand-dark/60 font-light">{review.date}</span>
      </div>
    </article>
  );
}
