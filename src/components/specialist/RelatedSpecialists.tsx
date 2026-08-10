import { Specialist } from "@/data/specialists";
import { SpecialistCarousel } from "@/components/specialists/SpecialistCarousel";

interface RelatedSpecialistsProps {
  specialists: Specialist[];
}

export const RelatedSpecialists = ({ specialists }: RelatedSpecialistsProps) => {
  if (specialists.length === 0) return null;

  return (
    <SpecialistCarousel
      specialists={specialists as any}
      title="Andre spesialister"
      description=""
      seeAllHref="/spesialister"
      seeAllLabel="Se alle spesialister"
      className="pt-10 md:pt-14 pb-14 md:pb-16 bg-background overflow-hidden"
    />
  );
};
