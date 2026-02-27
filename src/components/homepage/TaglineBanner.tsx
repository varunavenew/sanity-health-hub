import { useHomepage } from "@/hooks/useSanity";

export const TaglineBanner = () => {
  const { data: homepage } = useHomepage();
  const tagline = homepage?.tagline || "Faglig trygghet og personlig omsorg – for din helse";

  return (
    <div className="w-full bg-accent py-3 md:py-4">
      <div className="container mx-auto px-4 md:px-8">
        <p className="text-center text-sm md:text-base lg:text-lg tracking-wide text-accent-foreground font-light">
          {tagline}
        </p>
      </div>
    </div>
  );
};
