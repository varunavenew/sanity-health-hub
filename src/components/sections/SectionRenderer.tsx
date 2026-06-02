import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/sanityClient";
import { getIcon } from "@/lib/icons";

/**
 * Master template SectionRenderer
 *
 * Reads sections[] from a Sanity document (treatmentCategory, treatment, article)
 * and renders each block in order. Sections with `enabled === false` are skipped.
 *
 * Field values are assumed to already be language-normalized (no/en resolved)
 * by `normalizeI18n` in useSanity.ts — so a `heading` field is a plain string
 * by the time it reaches a component here.
 */

type Section = { _type: string; _key?: string; enabled?: boolean; anchorId?: string; [k: string]: any };

const formatInlineMarkdown = (text: string): string =>
 String(text || "")
 .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline">$1</a>')
 .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
 .replace(/_(.*?)_/g, "<em>$1</em>");

/* ───────────────────────── Section components ───────────────────────── */

const HeroBlock = (s: Section) => {
 const hasImage = Boolean(s.image);
 return (
 <section id={s.anchorId} className={`relative ${hasImage ? "bg-brand-dark text-brand-light" : "bg-brand-light text-foreground"} overflow-hidden`}>
 {hasImage && (
 <>
 <div
 className="absolute inset-0 bg-cover bg-center"
 style={{ backgroundImage: `url(${getImageUrl(s.image)})` }}
 aria-hidden
 />
 <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/85 via-brand-dark/60 to-brand-dark/20" aria-hidden />
 </>
 )}
 <div className="container mx-auto px-6 md:px-16 py-24 md:py-36 relative max-w-3xl">
 {s.heading && (
 <h1 className={`text-4xl md:text-6xl font-light mb-6 leading-[1.05] ${hasImage ? "text-brand-light" : "text-foreground"}`}>
 {s.heading}
 </h1>
 )}
 {s.subheading && (
 <p className={`text-base md:text-lg max-w-2xl font-light leading-relaxed whitespace-pre-line ${hasImage ? "text-brand-light/85" : "text-muted-foreground"}`}>
 {s.subheading}
 </p>
 )}
 {s.ctaLabel && s.ctaHref && (
 <div className="mt-10">
 <Button asChild size="lg" variant={hasImage ? "secondary" : "default"}>
 <Link to={s.ctaHref}>{s.ctaLabel}</Link>
 </Button>
 </div>
 )}
 </div>
 </section>
 );
};

const IntroBlock = (s: Section) => (
 <section id={s.anchorId} className="py-12 md:py-20 bg-brand-light">
 <div className="container mx-auto px-6 md:px-16 max-w-3xl">
 {s.heading && <h2 className="text-2xl md:text-3xl font-light mb-6 text-foreground">{s.heading}</h2>}
 {s.body && (
 <div
 className="text-muted-foreground font-light whitespace-pre-line leading-relaxed"
 dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(s.body) }}
 />
 )}
 </div>
 </section>
);

const StatsBlock = (s: Section) => {
 const dark = s.background === "dark";
 return (
 <section
 id={s.anchorId}
 className={`py-12 md:py-16 ${dark ? "bg-brand-dark text-brand-light" : "bg-brand-light text-foreground"}`}
 >
 <div className="container mx-auto px-6 md:px-16">
 {s.heading && <h2 className="text-2xl md:text-3xl font-light mb-10">{s.heading}</h2>}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
 {(s.items || []).map((item: any, i: number) => (
 <div key={item._key || i}>
 <div className="text-3xl md:text-5xl font-light mb-2">{item.value}</div>
 <div className={`text-sm font-light ${dark ? "text-brand-light/70" : "text-muted-foreground"}`}>
 {item.label}
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>
 );
};

const FaqBlock = (s: Section) => (
 <section id={s.anchorId} className="py-14 md:py-20 bg-brand-light">
 <div className="container mx-auto px-6 md:px-16 max-w-3xl">
 {s.heading && <h2 className="text-2xl md:text-3xl font-light mb-6 text-foreground">{s.heading}</h2>}
 {s.intro && <p className="text-muted-foreground font-light mb-8">{s.intro}</p>}
 <div className="divide-y divide-border border-y border-border">
 {(s.items || []).map((item: any, i: number) => (
 <details key={item._key || i} className="group py-5">
 <summary className="cursor-pointer flex items-center justify-between text-foreground font-normal text-[15px]">
 {item.question}
 <span className="ml-4 text-muted-foreground group-open:rotate-45 transition-transform">+</span>
 </summary>
 <p className="mt-3 text-muted-foreground font-light text-sm leading-relaxed whitespace-pre-line">
 {item.answer}
 </p>
 </details>
 ))}
 </div>
 </div>
 </section>
);

const CtaBlock = (s: Section) => {
 const dark = s.background !== "light";
 return (
 <section
 id={s.anchorId}
 className={`py-16 md:py-24 ${dark ? "bg-brand-dark text-brand-light" : "bg-brand-light text-foreground"}`}
 >
 <div className="container mx-auto px-6 md:px-16 max-w-2xl text-center">
 {s.heading && <h2 className="text-2xl md:text-4xl font-light mb-4">{s.heading}</h2>}
 {s.body && (
 <p className={`font-light mb-8 ${dark ? "text-brand-light/80" : "text-muted-foreground"}`}>{s.body}</p>
 )}
 {s.ctaLabel && s.ctaHref && (
 <Button asChild size="lg" variant={dark ? "secondary" : "default"}>
 <Link to={s.ctaHref}>{s.ctaLabel}</Link>
 </Button>
 )}
 </div>
 </section>
 );
};

const ServicesListBlock = (s: Section) => {
 const items =
 (s.treatmentRefs?.length
 ? s.treatmentRefs.map((t: any) => ({ label: t.title, path: `/behandlinger/${t.categorySlug || ""}/${t.slug}` }))
 : s.manualItems) || [];
 return (
 <section id={s.anchorId} className="py-14 md:py-20 bg-brand-light">
 <div className="container mx-auto px-6 md:px-16">
 {s.heading && <h2 className="text-2xl md:text-3xl font-light mb-3 text-foreground">{s.heading}</h2>}
 {s.intro && <p className="text-muted-foreground font-light max-w-2xl mb-10">{s.intro}</p>}
 <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
 {items.map((it: any, i: number) => (
 <li key={i} className="border-b border-border py-3">
 {it.path ? (
 <Link to={it.path} className="flex items-center justify-between text-foreground hover:opacity-70 transition">
 <span className="font-light">{it.label}</span>
 <span aria-hidden>→</span>
 </Link>
 ) : (
 <span className="font-light text-foreground">{it.label}</span>
 )}
 </li>
 ))}
 </ul>
 </div>
 </section>
 );
};

const ServiceGroupsBlock = (s: Section) => (
 <section id={s.anchorId} className="py-14 md:py-20 bg-brand-light">
 <div className="container mx-auto px-6 md:px-16">
 {s.heading && <h2 className="text-2xl md:text-3xl font-light mb-10 text-foreground">{s.heading}</h2>}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {(s.groups || []).map((g: any, i: number) => (
 <div key={g._key || i} className="border border-border p-6 rounded-2xl bg-background">
 
 <h3 className="text-lg font-normal text-foreground mb-4">{g.label}</h3>
 <ul className="space-y-2">
 {(g.items || []).map((name: string, j: number) => (
 <li key={j} className="text-sm font-light text-muted-foreground">{name}</li>
 ))}
 </ul>
 </div>
 ))}
 </div>
 </div>
 </section>
);

const JourneyBlock = (s: Section) => (
 <section id={s.anchorId} className="py-14 md:py-20 bg-brand-mid/10">
 <div className="container mx-auto px-6 md:px-16">
 {s.heading && <h2 className="text-2xl md:text-3xl font-light mb-10 text-foreground">{s.heading}</h2>}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
 {(s.steps || []).map((step: any, i: number) => {
 const Icon = step.icon ? getIcon(step.icon) : null;
 return (
 <div key={step._key || i}>
 {Icon && <Icon className="w-5 h-5 text-foreground mb-3" strokeWidth={1.5} />}
 
 {step.title && <h3 className="text-lg font-normal text-foreground mb-2">{step.title}</h3>}
 {step.body && <p className="text-sm font-light text-muted-foreground leading-relaxed">{step.body}</p>}
 </div>
 );
 })}
 </div>
 </div>
 </section>
);

const RichTextBlock = (s: Section) => (
 <section id={s.anchorId} className="py-12 md:py-16 bg-brand-light">
 <div className="container mx-auto px-6 md:px-16 max-w-3xl">
 {s.heading && <h2 className="text-2xl md:text-3xl font-light mb-6">{s.heading}</h2>}
 {typeof s.body === "string" && (
 <div
 className="text-muted-foreground font-light whitespace-pre-line leading-relaxed"
 dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(s.body) }}
 />
 )}
 </div>
 </section>
);

const BenefitsBlock = (s: Section) => (
 <section id={s.anchorId} className="py-12 md:py-16 bg-brand-light">
 <div className="container mx-auto px-6 md:px-16 max-w-3xl">
 {s.heading && <h2 className="text-2xl md:text-3xl font-light mb-8 text-foreground">{s.heading}</h2>}
 <ul className="space-y-3">
 {(s.items || []).map((it: string, i: number) => (
 <li key={i} className="flex gap-3 text-foreground font-light">
 <span aria-hidden className="text-muted-foreground">✓</span>
 <span>{it}</span>
 </li>
 ))}
 </ul>
 </div>
 </section>
);

const ProcessBlock = (s: Section) => (
 <section id={s.anchorId} className="py-12 md:py-16 bg-brand-light">
 <div className="container mx-auto px-6 md:px-16">
 {s.heading && <h2 className="text-2xl md:text-3xl font-light mb-10 text-foreground">{s.heading}</h2>}
 <ol className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {(s.steps || []).map((st: any, i: number) => (
 <li key={i}>
 <div className="text-xs text-muted-foreground mb-2">Steg {String(i + 1).padStart(2, "0")}</div>
 <h3 className="text-lg font-normal text-foreground mb-2">{st.title}</h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed">{st.description}</p>
 </li>
 ))}
 </ol>
 </div>
 </section>
);

const AccordionContentBlock = (s: Section) => (
 <section id={s.anchorId} className="py-12 md:py-16 bg-brand-light">
 <div className="container mx-auto px-6 md:px-16 max-w-3xl">
 {s.heading && <h2 className="text-2xl md:text-3xl font-light mb-8 text-foreground">{s.heading}</h2>}
 <div className="divide-y divide-border border-y border-border">
 {(s.items || []).map((item: any, i: number) => (
 <details key={item._key || i} id={item.id} className="group py-5">
 <summary className="cursor-pointer flex items-center justify-between text-foreground font-normal">
 {item.heading}
 <span className="ml-4 group-open:rotate-45 transition-transform">+</span>
 </summary>
 <div
 className="mt-3 text-muted-foreground font-light text-sm leading-relaxed whitespace-pre-line"
 dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item.content || "") }}
 />
 </details>
 ))}
 </div>
 </div>
 </section>
);

const LinkedServicesBlock = (s: Section) => (
 <section id={s.anchorId} className="py-12 md:py-16 bg-brand-light">
 <div className="container mx-auto px-6 md:px-16">
 {s.heading && <h2 className="text-2xl md:text-3xl font-light mb-8 text-foreground">{s.heading}</h2>}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {(s.items || []).map((it: any, i: number) => (
 <Link
 key={i}
 to={it.path}
 className="block border border-border rounded-2xl p-6 bg-background hover:border-foreground transition"
 >
 <h3 className="text-lg font-normal text-foreground mb-2">{it.label}</h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed">{it.description}</p>
 </Link>
 ))}
 </div>
 </div>
 </section>
);

const QuoteBlock = (s: Section) => (
 <section id={s.anchorId} className="py-16 md:py-24 bg-brand-mid/10">
 <div className="container mx-auto px-6 md:px-16 max-w-3xl text-center">
 <p className="text-2xl md:text-3xl font-light italic text-foreground leading-relaxed">"{s.quote}"</p>
 {s.source && <p className="mt-6 text-sm text-muted-foreground font-light">— {s.source}</p>}
 </div>
 </section>
);

const VideoBlock = (s: Section) => (
 <section id={s.anchorId} className="py-12 md:py-16 bg-brand-light">
 <div className="container mx-auto px-6 md:px-16 max-w-4xl">
 {s.url && (s.url.includes("youtube") || s.url.includes("vimeo")) ? (
 <iframe src={s.url} className="w-full aspect-video rounded-2xl" allowFullScreen />
 ) : s.url ? (
 <video src={s.url} controls poster={getImageUrl(s.thumbnail)} className="w-full rounded-2xl" />
 ) : s.thumbnail ? (
 <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-brand-dark">
 <img src={getImageUrl(s.thumbnail)} alt={s.caption || ""} className="w-full h-full object-cover" />
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="w-16 h-16 rounded-full bg-brand-light/90 flex items-center justify-center">
 <span className="ml-1 text-foreground">▶</span>
 </div>
 </div>
 </div>
 ) : null}
 {s.caption && <p className="mt-4 text-sm text-muted-foreground font-light">{s.caption}</p>}
 </div>
 </section>
);

const ImageGalleryBlock = (s: Section) => (
 <section id={s.anchorId} className="py-12 md:py-16 bg-brand-light">
 <div className="container mx-auto px-6 md:px-16">
 {s.heading && <h2 className="text-2xl md:text-3xl font-light mb-8 text-foreground">{s.heading}</h2>}
 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
 {(s.images || []).map((it: any, i: number) => (
 <figure key={i} className="space-y-2">
 <div className="aspect-[4/3] overflow-hidden rounded-xl bg-brand-mid/10">
 <img src={getImageUrl(it.image)} alt={it.caption || ""} className="w-full h-full object-cover" loading="lazy" />
 </div>
 {it.caption && <figcaption className="text-xs text-muted-foreground font-light">{it.caption}</figcaption>}
 </figure>
 ))}
 </div>
 </div>
 </section>
);

const TrustBadgesBlock = (s: Section) => (
 <section id={s.anchorId} className="py-12 md:py-16 bg-brand-light border-y border-border">
 <div className="container mx-auto px-6 md:px-16">
 {s.heading && <h2 className="text-xl md:text-2xl font-light mb-8 text-foreground">{s.heading}</h2>}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
 {(s.items || []).map((it: any, i: number) => {
 const Icon = it.icon ? getIcon(it.icon) : null;
 return (
 <div key={i} className="flex items-center gap-3">
 {Icon && <Icon className="w-5 h-5 text-foreground shrink-0" strokeWidth={1.5} />}
 <span className="text-sm font-light text-foreground">{it.label}</span>
 </div>
 );
 })}
 </div>
 </div>
 </section>
);

const SpecialistsBlock = (s: Section) => (
 <section id={s.anchorId} className="py-14 md:py-20 bg-brand-light">
 <div className="container mx-auto px-6 md:px-16">
 {s.heading && <h2 className="text-2xl md:text-3xl font-light mb-3 text-foreground">{s.heading}</h2>}
 {s.intro && <p className="text-muted-foreground font-light max-w-2xl mb-10">{s.intro}</p>}
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
 {(s.items || []).map((sp: any, i: number) => (
 <div key={i} className="space-y-3">
 <div className="aspect-[3/4] overflow-hidden rounded-xl bg-brand-mid/10">
 {sp.image ? (
 <img src={getImageUrl(sp.image)} alt={sp.name} className="w-full h-full object-cover" loading="lazy" />
 ) : (
 <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">Portrett</div>
 )}
 </div>
 <div>
 <p className="text-foreground font-normal text-sm">{sp.name}</p>
 <p className="text-xs text-muted-foreground font-light">{sp.role}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>
);

const ReviewsBlock = (s: Section) => (
 <section id={s.anchorId} className="py-14 md:py-20 bg-brand-mid/10">
 <div className="container mx-auto px-6 md:px-16">
 {s.heading && <h2 className="text-2xl md:text-3xl font-light mb-3 text-foreground">{s.heading}</h2>}
 {s.intro && <p className="text-muted-foreground font-light max-w-2xl mb-10">{s.intro}</p>}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {(s.items || []).map((r: any, i: number) => (
 <article key={i} className="bg-background border border-border rounded-2xl p-6">
 <div className="text-foreground text-sm mb-3">{"★".repeat(r.rating || 5)}</div>
 <p className="text-sm font-light text-foreground leading-relaxed mb-4">"{r.body}"</p>
 <p className="text-xs text-muted-foreground font-light">— {r.author} · {r.source || "Google"}</p>
 </article>
 ))}
 </div>
 </div>
 </section>
);

const PriceTeaserBlock = (s: Section) => (
 <section id={s.anchorId} className="py-14 md:py-20 bg-brand-light">
 <div className="container mx-auto px-6 md:px-16 max-w-3xl">
 {s.heading && <h2 className="text-2xl md:text-3xl font-light mb-8 text-foreground">{s.heading}</h2>}
 <ul className="divide-y divide-border border-y border-border">
 {(s.items || []).map((it: any, i: number) => (
 <li key={i} className="flex items-baseline justify-between py-4">
 <span className="font-light text-foreground">{it.label}</span>
 <span className="text-sm text-muted-foreground font-light">{it.price}</span>
 </li>
 ))}
 </ul>
 {s.ctaHref && (
 <div className="mt-8">
 <Button asChild variant="outline">
 <Link to={s.ctaHref}>Se full prisliste</Link>
 </Button>
 </div>
 )}
 </div>
 </section>
);

const RelatedThemesBlock = (s: Section) => (
 <section id={s.anchorId} className="py-14 md:py-20 bg-brand-light">
 <div className="container mx-auto px-6 md:px-16">
 {s.heading && <h2 className="text-2xl md:text-3xl font-light mb-8 text-foreground">{s.heading}</h2>}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {(s.items || []).map((it: any, i: number) => (
 <Link
 key={i}
 to={it.path}
 className="block group rounded-2xl overflow-hidden border border-border bg-background hover:border-foreground transition"
 >
 {it.image && (
 <div className="aspect-[16/10] overflow-hidden">
 <img src={getImageUrl(it.image)} alt={it.label} className="w-full h-full object-cover group-hover:scale-[1.02] transition" loading="lazy" />
 </div>
 )}
 <div className="p-5">
 
 <h3 className="text-lg font-normal text-foreground">{it.label}</h3>
 {it.description && <p className="text-sm font-light text-muted-foreground mt-2 leading-relaxed">{it.description}</p>}
 </div>
 </Link>
 ))}
 </div>
 </div>
 </section>
);

/* ───────────────────────── Registry ───────────────────────── */

const REGISTRY: Record<string, (s: Section) => JSX.Element | null> = {
 sectionHero: HeroBlock,
 sectionIntro: IntroBlock,
 sectionStats: StatsBlock,
 sectionFaq: FaqBlock,
 sectionCta: CtaBlock,
 sectionRichText: RichTextBlock,
 sectionVideo: VideoBlock,
 sectionQuote: QuoteBlock,
 sectionServicesList: ServicesListBlock,
 sectionServiceGroups: ServiceGroupsBlock,
 sectionJourney: JourneyBlock,
 sectionBenefits: BenefitsBlock,
 sectionProcess: ProcessBlock,
 sectionAccordionContent: AccordionContentBlock,
 sectionLinkedServices: LinkedServicesBlock,
 sectionImageGallery: ImageGalleryBlock,
 sectionTrustBadges: TrustBadgesBlock,
 sectionSpecialists: SpecialistsBlock,
 sectionReviews: ReviewsBlock,
 sectionPriceTeaser: PriceTeaserBlock,
 sectionRelatedThemes: RelatedThemesBlock,
 // Sections without a renderer yet are silently skipped — frontend can extend.
};

interface Props {
 sections?: Section[] | null;
}

export function SectionRenderer({ sections }: Props) {
 if (!sections || !Array.isArray(sections) || sections.length === 0) return null;
 return (
 <>
 {sections
 .filter((s) => s && s.enabled !== false)
 .map((s, i) => {
 const Cmp = REGISTRY[s._type];
 if (!Cmp) {
 if (import.meta.env.DEV) {
 // eslint-disable-next-line no-console
 console.warn(`[SectionRenderer] No renderer for _type="${s._type}"`);
 }
 return null;
 }
 return <Cmp key={s._key || i} {...s} />;
 })}
 </>
 );
}

export default SectionRenderer;
