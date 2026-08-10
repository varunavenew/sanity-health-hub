import { Star } from "lucide-react";

export interface PricingTestimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
  treatment: string;
}

export const pricingTestimonials: PricingTestimonial[] = [
  {
    id: 1,
    name: "Maria S.",
    rating: 5,
    text: "Fantastisk opplevelse fra start til slutt. Spesialistene tok seg god tid og jeg følte meg trygg hele veien.",
    treatment: "Gynekologi",
  },
  {
    id: 2,
    name: "Anders L.",
    rating: 5,
    text: "Profesjonell og diskret behandling. Veldig fornøyd med prisene og servicen.",
    treatment: "Urologi",
  },
  {
    id: 3,
    name: "Sofie H.",
    rating: 5,
    text: "Utrolig takknemlig for den hjelpen vi fikk. Moderne utstyr og dyktige spesialister.",
    treatment: "Fertilitet",
  },
];

/**
 * PricingTestimonialGrid — én felles sitat-grid for /priser (mobil + desktop).
 * Erstatter to identiske kopier i PriserMobile.tsx og PriserDesktop.tsx.
 */
export const PricingTestimonialGrid = ({
  testimonials = pricingTestimonials,
}: {
  testimonials?: PricingTestimonial[];
}) => (
  <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
    {testimonials.map((t) => (
      <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex gap-1 mb-4">
          {[...Array(t.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-foreground text-foreground" aria-hidden="true" />
          ))}
        </div>
        <p className="text-foreground/80 mb-4 font-light leading-relaxed">"{t.text}"</p>
        <div className="flex items-center justify-between">
          <p className="font-normal text-foreground">{t.name}</p>
          <span className="text-xs text-muted-foreground">{t.treatment}</span>
        </div>
      </div>
    ))}
  </div>
);
