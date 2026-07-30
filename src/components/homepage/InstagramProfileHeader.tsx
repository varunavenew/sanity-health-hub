import { Instagram } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSanity";
import { defaultSocialUrls } from "@/components/shared/socialChannels";
import cmInitials from "@/assets/cm-initials.png.asset.json";

const stats = [
  { value: "199", label: "innlegg" },
  { value: "3 719", label: "følgere" },
  { value: "319", label: "følger" },
];

/**
 * Instagram-style profile header shown above the latest posts grid.
 * Purely presentational — numbers are static brand facts.
 */
export const InstagramProfileHeader = ({ children }: { children?: React.ReactNode }) => {
  const { data: settings } = useSiteSettings();
  const url = settings?.socialMedia?.instagram || defaultSocialUrls.instagram;

  return (
    <div className="rounded-sm bg-brand-dark text-brand-warm p-5 md:p-7">
      <div className="flex flex-col sm:flex-row sm:items-start gap-5 md:gap-8">
        <img
          src={cmInitials.url}
          alt="CMedical profilbilde på Instagram"
          loading="lazy"
          className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover shrink-0"
        />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg md:text-xl font-light hover:opacity-80 transition-opacity"
            >
              cmedical.no
            </a>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-light px-3 py-1.5 rounded-full bg-brand-warm/15 hover:bg-brand-warm/25 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" aria-hidden="true" />
              Følg
            </a>
          </div>

          <p className="text-sm font-light text-brand-warm/70 mb-3">CMedical Norge</p>

          <dl className="flex flex-wrap gap-x-6 gap-y-1 mb-4 text-sm font-light">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-medium">{s.value}</dd>
                <span className="text-brand-warm/60">{s.label}</span>
              </div>
            ))}
          </dl>

          <p className="text-sm font-light text-brand-warm/60">Medisin og helse</p>
          <p className="text-sm font-light max-w-[52ch]">
            Vi har samlet spesialister innen gynekologi, fertilitet, urologi og ortopedi.
          </p>
          <p className="text-sm font-light text-brand-warm/70">
            Majorstuen Oslo | Bekkestua | Moelv | Moss
          </p>
        </div>
      </div>

      {children ? <div className="mt-6 md:mt-8">{children}</div> : null}
    </div>
  );
};
