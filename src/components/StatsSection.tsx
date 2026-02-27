import { Card } from "@/components/ui/card";
import { Users, Award, Heart, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "25 000+",
    label: "Fornøyde pasienter",
    color: "text-blue-500",
  },
  {
    icon: Award,
    value: "100+",
    label: "Medisinske spesialister",
    color: "text-purple-500",
  },
  {
    icon: Heart,
    value: "14",
    label: "Klinikker i Norden",
    color: "text-pink-500",
  },
  {
    icon: TrendingUp,
    value: "98%",
    label: "Anbefaler oss videre",
    color: "text-green-500",
  },
];

export const StatsSection = () => {
  return (
    <section className="py-16 bg-[hsl(30,25%,90%)]">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-8 text-center bg-card hover:shadow-lg transition-all duration-300 rounded-lg border border-border group hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`mb-4 flex justify-center ${stat.color}`}>
                <stat.icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
              </div>
              <div className="text-4xl font-light mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-light">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
