import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Maria S.",
    age: 32,
    rating: 5,
    text: "Fantastisk opplevelse fra start til slutt. Spesialistene tok seg god tid og jeg følte meg trygg hele veien.",
    location: "Oslo",
    treatment: "Gynekologi"
  },
  {
    id: 2,
    name: "Anders L.",
    age: 38,
    rating: 5,
    text: "Profesjonell og diskret behandling. Resultatet overgikk alle forventninger. Anbefales på det sterkeste!",
    location: "Bergen",
    treatment: "Urologi"
  },
  {
    id: 3,
    name: "Sofie H.",
    age: 29,
    rating: 5,
    text: "Utrolig takknemlig for den hjelpen vi fikk. Moderne utstyr og dyktige spesialister. Vi er nå en familie!",
    location: "Trondheim",
    treatment: "Fertilitet"
  },
  {
    id: 4,
    name: "Thomas K.",
    age: 45,
    rating: 5,
    text: "Kort ventetid og flott klinikk. Følte meg godt ivaretatt av kompetent personale. Veldig fornøyd!",
    location: "Oslo",
    treatment: "Urologi"
  },
  {
    id: 5,
    name: "Emma J.",
    age: 27,
    rating: 5,
    text: "Endelig fant jeg en klinikk som virkelig forstår kvinnehelse. Moderne tilnærming og varmt personale.",
    location: "Bergen",
    treatment: "Gynekologi"
  },
  {
    id: 6,
    name: "Lars M.",
    age: 35,
    rating: 5,
    text: "Har anbefalt CMedical til flere kolleger. De leverer virkelig på alle fronter - profesjonalitet og omsorg.",
    location: "Oslo",
    treatment: "Urologi"
  }
];

export const TestimonialSection = () => {
  return (
    <section id="tilbakemeldinger" className="py-20 bg-background">
      <div className="container mx-auto px-6 md:px-16">
        <div className="text-center mb-16">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-light mb-4">
            Basert på over 1000 pasienter
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-4">Trygghet, omsorg og helsehjelp i livets ulike faser</h2>
          <div className="flex items-center justify-center gap-3 text-2xl mb-2">
              <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
              <path d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
              <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
              <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
            </svg>
            <span className="text-accent font-normal">4,6</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-accent text-accent' : 'text-accent'}`} />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground font-light">Gjennomsnittsvurdering på Google fra over 1000 fornøyde pasienter</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-[hsl(30,20%,96%)] rounded-xl p-8 hover:shadow-lg transition-all hover:scale-105"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed font-light">
                "{testimonial.text}"
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-muted">
                <div>
                  <p className="font-light">{testimonial.name}, {testimonial.age}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
                <div className={`text-xs px-3 py-1 rounded-full ${
                  testimonial.treatment === 'Gynekologi' 
                    ? 'bg-pink-100 text-pink-700' 
                    : testimonial.treatment === 'Fertilitet'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {testimonial.treatment}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
