/**
 * SpecialistComment — felles design for alle "Kommentar fra spesialisten"-bokser
 * på tvers av artikler, nyheter og andre sider.
 *
 * Bruk denne komponenten ALLE steder hvor en spesialist/lege kommenterer
 * innholdet, slik at designet er konsekvent.
 */

interface SpecialistCommentProps {
  /** Tittel over kommentaren. Default: "Kommentar fra spesialisten" */
  title?: string;
  /** Initialer som vises i avatar-sirkelen (f.eks. "HR") */
  initials: string;
  /** Selve kommentarteksten (uten anførselstegn — de legges til automatisk) */
  quote: string;
  /** Navn på personen */
  name: string;
  /** Rolle / tittel, f.eks. "Fertilitetslege og gynekolog, CMedical" */
  role: string;
  /** Valgfri profilbilde-URL — overstyrer initialene hvis satt */
  imageUrl?: string;
  className?: string;
}

export const SpecialistComment = ({
  title = "Kommentar fra spesialisten",
  initials,
  quote,
  name,
  role,
  imageUrl,
  className = "",
}: SpecialistCommentProps) => {
  return (
    <aside
      className={`bg-secondary/40 p-6 md:p-8 my-10 border-l-2 border-brand-dark ${className}`}
    >
      <h3 className="text-sm font-medium text-foreground mb-4">{title}</h3>
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-background flex-shrink-0 flex items-center justify-center text-sm font-light text-foreground/70 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <div>
          <p className="text-base font-light leading-relaxed text-foreground/90 mb-3 italic">
            «{quote}»
          </p>
          <p className="text-xs font-normal text-foreground">{name}</p>
          <p className="text-xs font-light text-foreground/60">{role}</p>
        </div>
      </div>
    </aside>
  );
};

export default SpecialistComment;
