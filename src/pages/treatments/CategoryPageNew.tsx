import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { EditableAutoScope } from "@/components/editable/EditableAutoScope";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import {
 Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { LeadPopup } from "@/components/LeadPopup";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { getCategoryEntryPrice } from "@/data/priceList";
import {
 categoryNewContent,
} from "./categoryPageContent";

interface CategoryPageNewProps {
 categoryId: string;
 isChatOpen: boolean;
}

const CategoryPageNew = ({ categoryId, isChatOpen }: CategoryPageNewProps) => {
 const navigate = useNavigate();
 const { specialists } = useSpecialistsData();
 const content = categoryNewContent[categoryId];

 useEffect(() => {
 if (content) {
 document.title = `${content.title} | CMedical`;
 }
 }, [content]);

 const categorySpecialists = useMemo(
 () => specialists.filter((s) => s.category === categoryId).slice(0, 4),
 [specialists, categoryId]
 );

 if (!content) {
 return <div>Kategori ikke funnet</div>;
 }

 // Resolve groups → service objects with path (icons removed per design)
 const groupsWithServices = content.groups
 .map((g) => ({
 label: g.label,
 services: g.serviceNames
 .map((name) => ({
 name,
 path: content.serviceLinks[name],
 }))
 .filter((s) => !!s.path),
 }))
 .filter((g) => g.services.length > 0);

 const entryPrice = getCategoryEntryPrice(categoryId);

 return (
 <PageLayout isChatOpen={isChatOpen}><EditableAutoScope>
 <PageSEO
 title={`${content.title} – Spesialistbehandling hos CMedical`}
 description={content.description.slice(0, 155)}
 canonical={`/${categoryId}`}
 breadcrumbs={[
 { name: "Hjem", path: "/" },
 { name: "Tjenester", path: "/tjenester" },
 { name: content.title, path: `/${categoryId}` },
 ]}
 jsonLd={{
 "@context": "https://schema.org",
 "@type": "MedicalSpecialty",
 name: content.title,
 description: content.description,
 provider: { "@type": "MedicalClinic", name: "CMedical" },
 }}
 />

 {/* ── 1. Hero: Full-bleed split 50/50, edge-to-edge image (Fertilitet-mal) ── */}
 <header className="bg-brand-light pt-24 lg:pt-0">
   <div className="grid lg:grid-cols-2 min-h-[640px] lg:min-h-[720px]">
     <div className="flex items-center px-6 md:px-16 lg:px-20 py-16 lg:py-24">
       <div className="max-w-xl w-full">
         <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
           {content.title}
         </h2>
         <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground">
           {content.description.slice(0, 220)}
         </p>

          {entryPrice && (
            <div className="mb-4 text-sm font-light text-foreground/80">
              <span className="block text-base text-foreground">{entryPrice.label}</span>
              <span className="block">{entryPrice.price}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
            <Button
              variant="cta"
              size="lg"
              className="px-8 w-full sm:w-auto"
              onClick={() => navigate(content.bookingPath)}
            >
              Bestill time
            </Button>
            <CallUsClinicPicker variant="light" label="Ring oss" />
          </div>

         <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-light text-brand-dark">
           {["Ingen henvisning", "Korte ventetider"].map((u) => (
             <li key={u} className="flex items-center gap-2">
               <Check className="w-4 h-4" aria-hidden="true" />
               <span>{u}</span>
             </li>
           ))}
         </ul>
       </div>
     </div>

     <div className="relative min-h-[420px] lg:min-h-full">
       <img
         src={content.heroImage}
         alt={content.title}
         className="absolute inset-0 w-full h-full object-cover"
       />
     </div>
   </div>
   <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
 </header>

 {/* ── 2. Centered intro paragraph ── */}
 <section className="bg-background py-14 md:py-20">
 <div className="container mx-auto px-6 md:px-16">
 <p className="max-w-2xl mx-auto text-center text-base md:text-[17px] text-foreground/80 leading-relaxed font-light">
 {content.description}
 </p>
 </div>
 </section>

 {/* ── 3. Hva vi behandler – grouped service cards ── */}
 <section id="services" className="bg-brand-warm py-16 md:py-24">
 <div className="container mx-auto px-6 md:px-16 max-w-6xl">
 <div className="mb-10 md:mb-14 max-w-2xl">
 <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight mb-5">
 Hva vi behandler
 </h2>
 <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
 {content.servicesIntro}
 </p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
 {groupsWithServices.map((group) => (
 <div
 key={group.label}
 className="bg-card border border-border/60 rounded-2xl p-7 md:p-8"
 >
 <h3 className="text-xl md:text-2xl font-light text-foreground mb-6">
 {group.label}
 </h3>
 <ul className="space-y-3">
 {group.services.map((s) => (
 <li key={`${group.label}-${s.name}`}>
 <Link
 to={s.path!}
 className="flex items-center justify-between gap-3 text-sm font-light text-foreground/85 hover:text-foreground group py-1"
 >
 <span className="flex-1">{s.name}</span>
 <ArrowRight
 className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
 strokeWidth={1.5}
 />
 </Link>
 </li>
 ))}
 </ul>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* ── 4. Pasientreisen, fortalt enkelt ── */}
 <section className="bg-background py-16 md:py-24">
 <div className="container mx-auto px-6 md:px-16 max-w-6xl">
 <div className="mb-10 md:mb-14 max-w-2xl">
 <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight">
 Pasientreisen, fortalt enkelt
 </h2>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/60 border border-border/60 rounded-2xl overflow-hidden">
 {content.journey.map((step) => {
 const Icon = step.icon;
 return (
 <div
 key={step.label}
 className="bg-brand-warm p-7 md:p-9 flex flex-col"
 >
 <Icon className="w-6 h-6 text-foreground mb-7" strokeWidth={1.5} />
 <h3 className="text-lg md:text-xl font-light text-foreground leading-snug mb-3">
 {step.title}
 </h3>
 <p className="text-sm text-muted-foreground font-light leading-relaxed">
 {step.body}
 </p>
 </div>
 );
 })}
 </div>
 </div>
 </section>

 {/* ── 5. Spesialistene – full-bleed grid, no gaps ── */}
 {categorySpecialists.length > 0 && (
 <section className="bg-brand-warm pt-8 md:pt-10 pb-0">
 <div className="container mx-auto px-6 md:px-16 max-w-6xl">
 <div className="mb-10 md:mb-14 max-w-2xl">
 <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight">
 Spesialistene som følger deg
 </h2>
 </div>
 </div>

 <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
 {categorySpecialists.map((s) => (
 <Link
 key={s.slug}
 to={`/spesialister/${s.slug}`}
 className="group block relative aspect-[3/4] overflow-hidden bg-muted"
 >
 <img
 src={s.image}
 alt={s.name}
 loading="lazy"
 className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
 />
 <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
 <h3 className="text-base md:text-lg font-light text-foreground mb-0.5">
 {s.name}
 </h3>
 </div>
 </Link>
 ))}
 </div>
 </section>
 )}

 {/* ── 6. Reviews ── */}
 <CategoryReviews categoryId={categoryId} categoryTitle={content.title} />

 {/* ── 7. FAQ ── */}
 <section className="bg-background py-16 md:py-24">
 <div className="container mx-auto px-6 md:px-16 max-w-3xl">
 <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight mb-10 text-center">
 Det folk spør om
 </h2>
 <Accordion type="single" collapsible className="w-full">
 {content.faqs.map((faq, i) => (
 <AccordionItem key={i} value={`item-${i}`}>
 <AccordionTrigger className="text-left font-light text-base">
 {faq.question}
 </AccordionTrigger>
 <AccordionContent className="text-muted-foreground font-light leading-relaxed">
 {faq.answer}
 </AccordionContent>
 </AccordionItem>
 ))}
 </Accordion>
 </div>
 </section>

 {/* ── 8. Closing booking band ── */}
 <section className="bg-brand-light py-16 md:py-24 text-foreground">
 <div className="container mx-auto px-6 md:px-16 max-w-5xl">
 <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
 <div>
 <h2 className="text-3xl md:text-5xl font-light leading-[1.1] tracking-tight mb-5">
 {content.closingTitle}
 </h2>
 <p className="text-base text-muted-foreground font-light leading-relaxed">
 {content.closingBody}
 </p>
 </div>
 <div className="flex flex-col gap-3">
 <Button variant="cta" size="lg" onClick={() => navigate(content.bookingPath)}>
 {content.closingCta}
 <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
 </Button>
 <Link
 to="/priser"
 className="text-center text-sm font-light text-muted-foreground hover:text-foreground underline underline-offset-4 mt-2"
 >
 Se prisliste
 </Link>
 </div>
 </div>
 </div>
 </section>

 <LeadPopup />
 </EditableAutoScope></PageLayout>
 );
};

export default CategoryPageNew;
