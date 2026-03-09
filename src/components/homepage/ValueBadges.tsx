export const ValueBadges = () => {
  return (
    <section className="py-6 md:py-10 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm text-foreground/80">
            <span className="w-2 h-2 rounded-full bg-brand-dark" />
            Trygg og moderne behandlingsteknologi
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm text-foreground/80">
            <span className="w-2 h-2 rounded-full bg-brand-dark" />
            Behagelige lokaler
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-sm text-foreground/80">
            <span className="w-2 h-2 rounded-full bg-brand-dark" />
            Tilgjengelig pris
          </span>
        </div>
      </div>
    </section>
  );
};
