import { AssetImg } from "@/components/AssetImg";
import { Link } from "@/lib/router";
import { MapPin } from "lucide-react";
import type { Specialist } from "@/data/specialists";

// Mirrors the homepage SpecialistsSection card so all demo variants share
// the exact specialist presentation our customer already approves of.
export const DemoSpecialistCard = ({ specialist }: { specialist: Specialist }) => (
  <Link to={`/spesialister/${specialist.slug}`} className="group block">
    <div className="relative aspect-[3/4] overflow-hidden bg-secondary rounded-sm">
      <AssetImg
        src={specialist.image}
        alt={specialist.name}
        loading="lazy"
        className="w-full h-full object-cover saturate-[0.7] brightness-[0.95] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-brand-dark/15 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" />

      {specialist.clinics && specialist.clinics.length > 0 && (
        <div className="absolute top-3 left-3 flex items-center gap-1 text-white/70 text-xs font-light drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
          <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
          {specialist.clinics.join(" · ")}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-normal text-white mb-0.5">{specialist.name}</h3>
        <p className="text-sm text-white/70 font-light">
          {specialist.title}
          {specialist.subtitle && specialist.subtitle !== specialist.title && ` · ${specialist.subtitle}`}
        </p>
      </div>
    </div>
  </Link>
);
