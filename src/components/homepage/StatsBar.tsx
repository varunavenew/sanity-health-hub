import { useHomepage } from "@/hooks/useSanity";

const staticStats = [
  { value: "15 000+", label: "pasienter behandlet" },
  { value: "8+", label: "års erfaring med robotkirurgi" },
  { value: "5", label: "klinikker i Norge" },
  { value: "50+", label: "spesialister" },
];

export const StatsBar = () => {
  const { data: homepage } = useHomepage();
  const stats = homepage?.stats && homepage.stats.length > 0
    ? homepage.stats
    : staticStats;

  return (
    <section className="bg-brand-dark text-white py-10 md:py-14">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 max-w-5xl mx-auto text-center">
          {stats.map((stat: any, i: number) => (
            <div key={i} className="space-y-1">
              <p className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm text-white/60 font-light">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
