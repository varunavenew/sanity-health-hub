import { Star } from "lucide-react";

interface PartialStarsProps {
  rating: number;
  size?: string;
  className?: string;
}

export const PartialStars = ({ rating, size = "w-4 h-4", className = "" }: PartialStarsProps) => {
  return (
    <div className={`flex ${className}`}>
      {[...Array(5)].map((_, i) => {
        const fill = Math.min(1, Math.max(0, rating - i));
        return (
          <div key={i} className="relative">
            <Star className={`${size} text-brand-dark/20`} />
            {fill > 0 && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={`${size} text-[#FBBC05] fill-[#FBBC05]`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
