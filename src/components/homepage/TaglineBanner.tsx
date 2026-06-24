import { useHomepage } from "@/hooks/useSanity";

export const TaglineBanner = () => {
  const { data: homepage } = useHomepage();
  const tagline = homepage?.tagline?.trim() || "";

  if (!tagline) return null;

  return (
    <div className="w-full py-3 md:py-4 bg-accent">
      <div className="container mx-auto px-4 md:px-8">
        <p className="text-center text-sm md:text-base lg:text-lg text-accent-foreground font-light leading-relaxed">
          {tagline}
        </p>
      </div>
    </div>
  );
};
